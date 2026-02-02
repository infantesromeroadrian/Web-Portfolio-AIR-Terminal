/**
 * Script para descargar los últimos IoPC (Indicators of Prompt Compromise)
 * desde la API de PromptIntel.
 *
 * Se ejecuta en GitHub Actions con la API key en secrets.
 * Genera un JSON estático que el frontend consume sin exponer la key.
 *
 * Usage: npx tsx scripts/fetch-threats.ts
 */

const API_BASE = "https://api.promptintel.novahunting.ai/api/v1";
const API_KEY = process.env.PROMPTINTEL_API_KEY;

interface Threat {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  reference_urls: string[];
  author: string;
  created_at: string;
  severity: "low" | "medium" | "high" | "critical";
  categories: string[];
  threats: string[];
  impact_description: string;
  view_count: number;
  average_score: number;
}

interface TaxonomyCategory {
  id: string;
  name: string;
  description: string;
  threats: Array<{
    name: string;
    description: string;
    example: string;
  }>;
}

interface Taxonomy {
  title: string;
  author: string;
  website: string;
  categories: TaxonomyCategory[];
}

interface OutputData {
  lastUpdated: string;
  threats: Threat[];
  taxonomy: Taxonomy;
  stats: {
    total: number;
    bySeverity: Record<string, number>;
    byCategory: Record<string, number>;
  };
}

async function fetchWithAuth(endpoint: string): Promise<unknown> {
  if (!API_KEY) {
    throw new Error("PROMPTINTEL_API_KEY environment variable is required");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main(): Promise<void> {
  console.log("Fetching threats from PromptIntel API...");

  // Fetch latest threats (limit 20)
  const threatsResponse = (await fetchWithAuth("/prompts?limit=20")) as {
    data: Threat[];
    pagination: { total: number };
  };

  // Fetch taxonomy
  const taxonomyResponse = (await fetchWithAuth("/taxonomy")) as {
    data: Taxonomy;
  };

  // Calculate stats
  const threats = threatsResponse.data;
  const stats = {
    total: threatsResponse.pagination.total,
    bySeverity: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
  };

  for (const threat of threats) {
    // Count by severity
    stats.bySeverity[threat.severity] = (stats.bySeverity[threat.severity] || 0) + 1;

    // Count by category
    for (const cat of threat.categories) {
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    }
  }

  const output: OutputData = {
    lastUpdated: new Date().toISOString(),
    threats: threats.map((t) => ({
      ...t,
      // Truncate long prompts for the JSON (full version available via API)
      prompt: t.prompt.length > 500 ? t.prompt.slice(0, 500) + "..." : t.prompt,
    })),
    taxonomy: taxonomyResponse.data,
    stats,
  };

  // Write to public folder
  const fs = await import("fs/promises");
  const path = await import("path");

  const outputPath = path.join(process.cwd(), "public", "data", "threats.json");

  // Ensure directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2));

  console.log(`Written ${threats.length} threats to ${outputPath}`);
  console.log(`Stats: ${JSON.stringify(stats)}`);
}

main().catch((err) => {
  console.error("Error fetching threats:", err);
  process.exit(1);
});
