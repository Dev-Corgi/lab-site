import { PageHeader } from "@/components/page-header";
import { ToolCard } from "./_components/tool-card";
import { getTools } from "@/lib/supabase/queries";

const defaultTools = [
  { title: "QuantumSim Toolkit", description: "An open-source Python library for simulating quantum circuits and algorithms.", links: [{ label: "GitHub", url: "#" }, { label: "Documentation", url: "#" }] },
  { title: "Topological Materials Database", description: "Comprehensive database of topological materials with calculated band structures.", links: [{ label: "Database", url: "#" }, { label: "API Docs", url: "#" }] },
];

function toTool(t: any) { return { title: t.name || t.title, description: t.description, links: t.links || [] }; }

export default async function ToolsPage() {
  const dbTools = await getTools();
  const tools = dbTools.length > 0 ? dbTools.map(toTool) : defaultTools;
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Code & Datasets" breadcrumb="Tools" />
      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
}
