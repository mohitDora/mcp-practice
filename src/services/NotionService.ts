import { BlockObjectResponse, Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

interface TodoItem {
  id: string;
  text: string;
  checked: boolean;
}

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function addTodoToPage(pageId: string, todoText: string) {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: "block",
          type: "to_do",
          to_do: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: todoText,
                },
              },
            ],
            checked: false,
          },
        },
      ],
    });

    console.log("✅ To-do added:", response);
    return "✅ To-do added";
  } catch (error) {
    console.error("❌ Failed to add to-do:", error);
    return "❌ Failed to add to-do";
  }
}

export async function readTodosFromPage(pageId: string): Promise<TodoItem[]> {
  const response = await notion.blocks.children.list({ block_id: pageId });

  const todos: TodoItem[] = (response.results as BlockObjectResponse[])
    .filter((block) => block.type === "to_do" && "to_do" in block)
    .map((block) => ({
      id: block.id,
      text: block.to_do.rich_text
        .map((t) => {
          if (t.type === "text") {
            return t.text.content;
          }
          return "";
        })
        .join(""),
      checked: block.to_do.checked,
    }));

  console.log("📝 To-dos:", todos);
  return todos;
}

export async function updateTodo(pageId:string, keyword:string, { newText, checked = false }: { newText?: string; checked?: boolean }) {
  const todos = await searchTodosByKeyword(pageId, keyword);
  if (todos.length > 0) {
    todos.map(async (todo) => {
      await notion.blocks.update({
        block_id: todo.id,
        to_do: {
          rich_text: [
            { type: "text", text: { content: newText || todo.text } },
          ],
          checked,
        },
      });
    });
    console.log("✅ To-do updated.");
    return "✅ To-do updated.";
  } else {
    console.log("No Todos found for the given keyword");
    return "No Todos found for the given keyword";
  }
}

export async function deleteTodo(pageId:string, keyword:string) {
  const todos = await searchTodosByKeyword(pageId, keyword);
  if (todos.length > 0) {
    todos.map(async (todo) => {
      await notion.blocks.delete({ block_id: todo.id });
    });
    console.log("✅ To-do deleted.");
    return "✅ To-do deleted.";
  } else {
    console.log("No Todos found for the given keyword");
    return "No Todos found for the given keyword";
  }
}

export async function searchTodosByKeyword(pageId:string, keyword:string) {
  try {
    const todos = await readTodosFromPage(pageId);

    const matched = todos.filter((todo) => {
      return todo.text.toLowerCase().includes(keyword.toLowerCase());
    });

    return matched;
  } catch (error) {
    console.error("❌ Error searching todos:", error);
    return [];
  }
}
