import { PageHeader } from "@/components/page-header";
import { ToolCard } from "./_components/tool-card";

const tools = [
  {
    title: "QuantumSim Toolkit",
    description:
      "An open-source Python library for simulating quantum circuits and algorithms. Includes implementations of major quantum algorithms and error correction codes.",
    links: [
      { label: "GitHub", url: "#" },
      { label: "Documentation", url: "#" },
    ],
  },
  {
    title: "Topological Materials Database",
    description:
      "Comprehensive database of topological materials with calculated band structures, surface states, and experimental characterization data.",
    links: [
      { label: "Database", url: "#" },
      { label: "API Docs", url: "#" },
      { label: "Paper", url: "#" },
    ],
  },
  {
    title: "QubitControl Software",
    description:
      "Control software for superconducting qubit experiments with real-time feedback and automated calibration routines.",
    links: [
      { label: "GitHub", url: "#" },
      { label: "User Guide", url: "#" },
    ],
  },
];

export default function ToolsPage() {
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
