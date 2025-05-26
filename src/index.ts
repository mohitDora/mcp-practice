import { getWeather } from "./services/weather/WeatherService.js";
import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  addPageToDatabase,
  deletePage,
  getPageContentsById,
  getPageMetadataById,
  searchKeywordInPage,
  updatePageNameById,
} from "./services/notion/NotionPageService.js";
import {
  appendBlockByType,
  deleteBlock,
  readBlock,
  updateBlock,
} from "./services/notion/NotionBlockService.js";

dotenv.config();

const blockOptionsSchema = z.object({
  type: z.enum([
    "paragraph",
    "heading_1",
    "heading_2",
    "heading_3",
    "to_do",
    "bulleted_list_item",
    "numbered_list_item",
    "quote",
    "code",
    "divider",
  ]),
  content: z.string().optional(),
  checked: z.boolean().optional(),
  language: z.string().optional(),
});

const server = new McpServer({
  name: "server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool("get-weather", { cityName: z.string() }, async ({ cityName }) => {
  const data = await getWeather(cityName);
  return {
    content: [
      { type: "text", text: `Forecast for ${data.name} is ${data.temp_in_c}` },
    ],
  };
});

server.tool(
  "add-page-to-database",
  { databaseId: z.string(), name: z.string() },
  async ({ databaseId, name }) => {
    const res = await addPageToDatabase(databaseId, name);
    return {
      content: [{ type: "text", text: res }],
    };
  }
);

server.tool("get-page-metadata", { pageId: z.string() }, async ({ pageId }) => {
  const res = await getPageMetadataById(pageId);
  return {
    content: [{ type: "text", text: res }],
  };
});

server.tool(
  "update-page-name",
  { pageId: z.string(), name: z.string() },
  async ({ pageId, name }) => {
    const res = await updatePageNameById(pageId, name);
    return {
      content: [{ type: "text", text: res }],
    };
  }
);

server.tool("get-page-contents", { pageId: z.string() }, async ({ pageId }) => {
  const res = await getPageContentsById(pageId);
  return {
    content: [{ type: "text", text: res }],
  };
});

server.tool("delete-page", { pageId: z.string() }, async ({ pageId }) => {
  const res = await deletePage(pageId);
  return {
    content: [{ type: "text", text: res }],
  };
});

server.tool(
  "search-keyword-in-page",
  { pageId: z.string(), keyword: z.string() },
  async ({ pageId, keyword }) => {
    const res = await searchKeywordInPage(pageId, keyword);
    return {
      content: [{ type: "text", text: res }],
    };
  }
);

server.tool(
  "append-block-by-type",
  { pageId: z.string(), blockOptions: blockOptionsSchema },
  async ({ pageId, blockOptions }) => {
    const res = await appendBlockByType(pageId, blockOptions);
    return {
      content: [{ type: "text", text: res }],
    };
  }
);

server.tool(
  "update-block",
  { blockId: z.string(), blockOptions: blockOptionsSchema },
  async ({ blockId, blockOptions }) => {
    const res = await updateBlock(blockId, blockOptions);
    return {
      content: [{ type: "text", text: res }],
    };
  }
);

server.tool("delete-block", { blockId: z.string() }, async ({ blockId }) => {
  const res = await deleteBlock(blockId);
  return {
    content: [{ type: "text", text: res }],
  };
});

server.tool("read-block", { blockId: z.string() }, async ({ blockId }) => {
  const res = await readBlock(blockId);
  return {
    content: [{ type: "text", text: res }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
