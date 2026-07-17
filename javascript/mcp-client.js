// feriados.dev MCP — JavaScript client example
//
// Install:
//   npm install @modelcontextprotocol/sdk
//
// Run:
//   FERIADOS_API_KEY=frd_YOUR_KEY_HERE node javascript/mcp-client.js
//
// This example starts the official feriados.dev MCP server with npx and calls
// its tools through the Model Context Protocol. It uses the local stdio server:
//   npx -y @feriados-dev/mcp-server

const API_KEY = process.env.FERIADOS_API_KEY;

if (!API_KEY) {
  throw new Error("Set FERIADOS_API_KEY before running this example.");
}

function printToolResult(label, result) {
  console.log(`\n${label}`);

  for (const item of result.content ?? []) {
    if (item.type === "text") {
      console.log(item.text);
    }
  }
}

async function main() {
  const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
  const { StdioClientTransport } = await import("@modelcontextprotocol/sdk/client/stdio.js");

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@feriados-dev/mcp-server"],
    env: {
      ...process.env,
      FERIADOS_API_KEY: API_KEY,
    },
  });

  const client = new Client({
    name: "feriados-dev-examples",
    version: "1.0.0",
  });

  await client.connect(transport);

  try {
    const tools = await client.listTools();
    console.log("Available MCP tools:");
    for (const tool of tools.tools) {
      console.log(`- ${tool.name}: ${tool.description}`);
    }

    const holidays = await client.callTool({
      name: "buscar_feriados",
      arguments: {
        location: "SP-sao-paulo",
        year: 2026,
        limit: 10,
      },
    });
    printToolResult("Holidays in Sao Paulo city, 2026:", holidays);

    const holidayCheck = await client.callTool({
      name: "verificar_feriado",
      arguments: {
        date: "2026-11-20",
        location: "SP-sao-paulo",
      },
    });
    printToolResult("Is 2026-11-20 a holiday in Sao Paulo?", holidayCheck);

    const nextBusinessDay = await client.callTool({
      name: "proximo_dia_util",
      arguments: {
        date: "2026-12-25",
        location: "BR",
        includeCurrent: false,
      },
    });
    printToolResult("Next business day after Christmas 2026:", nextBusinessDay);
  } finally {
    await client.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
