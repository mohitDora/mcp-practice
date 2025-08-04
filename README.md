# MCP Server

A Model Context Protocol (MCP) server implementation that provides tools for interacting with Notion databases and weather services. This project demonstrates how to build an MCP server using TypeScript with various external API integrations.

## 🚀 Features

### Weather Service
- **Get Weather Information**: Retrieve current weather data for any city using the WeatherAPI service
- Real-time temperature data in Celsius
- Location-based weather forecasting

### Notion Integration
- **Page Management**:
  - Add new pages to Notion databases
  - Retrieve page metadata and contents
  - Update page names
  - Delete/archive pages
  - Search for keywords within pages

- **Block Management**:
  - Append various block types (paragraphs, headings, lists, code blocks, etc.)
  - Update existing blocks
  - Delete blocks
  - Read block contents

### Supported Block Types
- Paragraph
- Headings (H1, H2, H3)
- To-do lists
- Bulleted and numbered lists
- Quotes
- Code blocks (with language specification)
- Dividers

## 📁 Project Structure

```
mcp-practice/
├── src/
│   ├── config/
│   │   └── Notion.ts          # Notion API client configuration
│   ├── services/
│   │   ├── notion/
│   │   │   ├── NotionPageService.ts    # Page-level operations
│   │   │   └── NotionBlockService.ts   # Block-level operations
│   │   └── weather/
│   │       └── WeatherService.ts       # Weather API integration
│   ├── utils/
│   │   └── type.ts            # TypeScript type definitions
│   └── index.ts               # Main MCP server implementation
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp-practice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   NOTION_API_KEY=your_notion_api_key_here
   WEATHER_API_KEY=your_weather_api_key_here
   ```

## 🔧 Setup

### Prerequisites

- Node.js (v18 or higher)
- TypeScript
- Notion API key
- WeatherAPI key

### API Keys Setup

1. **Notion API Key**:
   - Go to [Notion Developers](https://developers.notion.com/)
   - Create a new integration
   - Copy the internal integration token

2. **WeatherAPI Key**:
   - Sign up at [WeatherAPI](https://www.weatherapi.com/)
   - Get your API key from the dashboard

## 🚀 Usage

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🛠️ Available Tools

### Weather Tools
- `get-weather`: Get current weather for a city
  - Parameters: `cityName` (string)

### Notion Page Tools
- `add-page-to-database`: Create a new page in a Notion database
  - Parameters: `databaseId` (string), `name` (string)

- `get-page-metadata`: Retrieve page metadata
  - Parameters: `pageId` (string)

- `update-page-name`: Update a page's name
  - Parameters: `pageId` (string), `name` (string)

- `get-page-contents`: Get all blocks in a page
  - Parameters: `pageId` (string)

- `delete-page`: Archive/delete a page
  - Parameters: `pageId` (string)

- `search-keyword-in-page`: Search for keywords within a page
  - Parameters: `pageId` (string), `keyword` (string)

### Notion Block Tools
- `append-block-by-type`: Add a new block to a page
  - Parameters: `pageId` (string), `blockOptions` (object)
  - Block options include: `type`, `content`, `checked`, `language`

- `update-block`: Update an existing block
  - Parameters: `blockId` (string), `blockOptions` (object)

- `delete-block`: Archive/delete a block
  - Parameters: `blockId` (string)

- `read-block`: Read block contents
  - Parameters: `blockId` (string)

## 📝 Example Usage

### Weather Query
```typescript
// Get weather for London
const weather = await getWeather("London");
console.log(`Temperature in ${weather.name}: ${weather.temp_in_c}°C`);
```

### Notion Page Operations
```typescript
// Add a new page to a database
const result = await addPageToDatabase("database-id", "New Page Title");

// Get page contents
const contents = await getPageContentsById("page-id");

// Search for keywords
const matches = await searchKeywordInPage("page-id", "important");
```

### Block Operations
```typescript
// Add a paragraph block
await appendBlockByType("page-id", {
  type: "paragraph",
  content: "This is a new paragraph"
});

// Add a code block
await appendBlockByType("page-id", {
  type: "code",
  content: "console.log('Hello World');",
  language: "javascript"
});
```

## 🔧 Configuration

### TypeScript Configuration
The project uses TypeScript with the following key configurations:
- Target: ES2022
- Module: Node16
- Strict type checking enabled
- Output directory: `./dist`

### MCP Client Configuration
``` javascript
{
  "mcpServers": {
    "server": {
      "command": "node",
      "args": ["path_to_your_project/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "...",
        "WEATHER_API_KEY":"..."
      }
    }
  }
}
```


### Dependencies
- **@modelcontextprotocol/sdk**: MCP server implementation
- **@notionhq/client**: Notion API client
- **axios**: HTTP client for weather API
- **dotenv**: Environment variable management
- **zod**: Schema validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure your `.env` file is in the root directory
   - Check that variable names match exactly

2. **Notion API Errors**
   - Verify your Notion API key is correct
   - Ensure your integration has access to the target database/page

3. **Weather API Errors**
   - Check your WeatherAPI key is valid
   - Verify the city name is spelled correctly

4. **TypeScript Compilation Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that your TypeScript version is compatible

## 🔗 Related Links

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Notion API Documentation](https://developers.notion.com/)
- [WeatherAPI Documentation](https://www.weatherapi.com/docs/) 
