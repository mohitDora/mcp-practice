export type BlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "to_do"
  | "bulleted_list_item"
  | "numbered_list_item"
  | "quote"
  | "code"
  | "divider";

export interface BlockOptions {
  type: BlockType;
  content?: string;
  checked?: boolean;
  language?: string;
}