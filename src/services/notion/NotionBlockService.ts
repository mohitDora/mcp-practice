import { BlockOptions } from "../../utils/type.js";
import notion from "../../config/Notion.js";

function createBlock({
  type,
  content = "",
  checked = false,
  language = "javascript",
}: BlockOptions): any {
  const richText = [
    {
      type: "text",
      text: { content },
    },
  ];

  switch (type) {
    case "paragraph":
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "quote":
    case "bulleted_list_item":
    case "numbered_list_item":
      return {
        object: "block",
        type,
        [type]: {
          rich_text: richText,
        },
      };

    case "to_do":
      return {
        object: "block",
        type,
        to_do: {
          rich_text: richText,
          checked,
        },
      };

    case "code":
      return {
        object: "block",
        type,
        code: {
          rich_text: richText,
          language,
        },
      };

    case "divider":
      return {
        object: "block",
        type,
        divider: {},
      };

    default:
      throw new Error(`Unsupported block type: ${type}`);
  }
}

export async function appendBlockByType(
  parentBlockId: string,
  blockOptions: BlockOptions
) {
  try {
    const block = createBlock(blockOptions);

    const response = await notion.blocks.children.append({
      block_id: parentBlockId,
      children: [block],
    });

    return `Block appended successfully: ${response}`;
  } catch (err) {
    return `Failed to append block: ${err}`;
  }
}

export async function updateBlock(blockId: string, blockOptions: BlockOptions) {
  try {
    const {
      type,
      content = "",
      checked = false,
      language = "javascript",
    } = blockOptions;

    const richText = [
      {
        type: "text",
        text: { content },
      },
    ];

    let updatePayload: any = {};

    switch (type) {
      case "paragraph":
      case "heading_1":
      case "heading_2":
      case "heading_3":
      case "quote":
      case "bulleted_list_item":
      case "numbered_list_item":
        updatePayload[type] = { rich_text: richText };
        break;

      case "to_do":
        updatePayload.to_do = { rich_text: richText, checked };
        break;

      case "code":
        updatePayload.code = { rich_text: richText, language };
        break;

      case "divider":
        return "Divider blocks cannot be updated.";

      default:
        throw new Error(`Unsupported block type: ${type}`);
    }

    const response = await notion.blocks.update({
      block_id: blockId,
      ...updatePayload,
    });

    return `Block updated successfully: ${response}`;
  } catch (err) {
    return `Failed to update block: ${err}`;
  }
}

export async function deleteBlock(blockId: string) {
  try {
    const response = await notion.blocks.update({
      block_id: blockId,
      archived: true,
    });

    return `Block archived (deleted) successfully: ${response}`;
  } catch (err) {
    return `Failed to delete block: ${err}`;
  }
}

export async function readBlock(blockId: string) {
  try {
    const response = await notion.blocks.retrieve({
      block_id: blockId,
    });
    return JSON.stringify(response, null, 2);
  } catch (error) {
    return `Failed to read block: ${error}`;
  }
}
