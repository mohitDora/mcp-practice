import { CreatePageParameters } from "@notionhq/client";
import notion from "../../config/Notion.js";

export async function addPageToDatabase(databaseId: string, name: string) {
  const properties: CreatePageParameters["properties"] = {
    Name: {
      title: [
        {
          text: {
            content: name,
          },
        },
      ],
    },
  };
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties,
    });

    return `Page added successfully: ${response.id}`;
  } catch (error) {
    return `Failed to add page to database: ${error}`;
  }
}

export async function getPageMetadataById(pageId: string) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });

    return JSON.stringify(page, null, 2);
  } catch (error) {
    return `Failed to retrieve page: ${error}`;
  }
}

export async function updatePageNameById(pageId: string, name: string) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
      },
    });

    return `Page updated successfully: ${response.id}`;
  } catch (error) {
    return `Failed to update page: ${error}`;
  }
}

export async function deletePage(pageId: string) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      archived: true,
    });

    return `Page ${pageId} archived (deleted) successfully.`;
  } catch (error) {
    return `Failed to archive (delete) page: ${error}`;
  }
}

export async function getPageContentsById(pageId: string) {
  try {
    const blocks = [];
    let cursor: string | undefined = undefined;

    do {
      const res = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
      });

      blocks.push(...res.results);
      cursor = res.next_cursor ?? undefined;
    } while (cursor);
    return `${JSON.stringify(blocks, null, 2)}`;
  } catch (error) {
    return `Failed to read full page: ${error}`;
  }
}

function extractTextFromBlock(block: any): string {
  const richText = block[block.type]?.rich_text;
  if (!richText || !Array.isArray(richText)) return "";
  return richText.map((rt: any) => rt.text?.content || "").join("");
}

export async function searchKeywordInPage(pageId: string, keyword: string) {
  try {
    const matchingBlocks = [];
    let cursor: string | undefined = undefined;

    do {
      const res = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
      });

      for (const block of res.results) {
        if (!("type" in block)) continue;

        const text = extractTextFromBlock(block);
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
          matchingBlocks.push({ id: block.id, type: block.type, text });
        }
      }

      cursor = res.has_more ? res.next_cursor ?? undefined : undefined;
    } while (cursor);

    return JSON.stringify(matchingBlocks, null, 2);
  } catch (err) {
    return `Failed to search in page: ${err}`;
  }
}
