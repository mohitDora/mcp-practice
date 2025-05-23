import { getWeather } from "./services/WeatherService.js";
import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  addTodoToPage,
  deleteTodo,
  readTodosFromPage,
  searchTodosByKeyword,
  updateTodo,
} from "./services/NotionService.js";

dotenv.config();

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
  "add-todo-to-page",
  { pageId: z.string(), todoText: z.string() },
  async ({ pageId, todoText }) => {
    const res = await addTodoToPage(pageId, todoText);
    return {
      content: [{ type: "text", text: res }],
    };
  }
);

server.tool("read-todos", { pageId: z.string() }, async ({ pageId }) => {
  const res = await readTodosFromPage(pageId);
  return {
    content: [{ type: "text", text: JSON.stringify(res) }],
  };
});

server.tool(
  "delete-todos",
  { pageId: z.string(), keyword: z.string() },
  async ({ pageId, keyword }) => {
    const res = await deleteTodo(pageId, keyword);
    return {
      content: [{ type: "text", text: res }],
    };
  }
);

server.tool(
  "update-todos",
  {
    pageId: z.string(),
    keyword: z.string(),
    newText: z.string(),
    checked: z.boolean(),
  },
  async ({ pageId, keyword, newText, checked }) => {
    const res = await updateTodo(pageId, keyword, { newText, checked });
    return {
      content: [{ type: "text", text: res }],
    };
  }
);

server.tool(
  "search-todos",
  { pageId: z.string(), keyword: z.string() },
  async ({ pageId, keyword }) => {
    const res = await searchTodosByKeyword(pageId, keyword);
    return {
      content: [{ type: "text", text: JSON.stringify(res) || "Nothing found" }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
