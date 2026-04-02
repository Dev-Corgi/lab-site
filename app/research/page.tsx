import { PageHeader } from "@/components/page-header";
import { ResearchAreaCard } from "./_components/research-area-card";

const researchAreas = [
  {
    title: "Quantum Error Correction & Fault Tolerance",
    category: "QUANTUM COMPUTING",
    categoryColor: "text-red-400",
    description:
      "Developing novel quantum error correction codes and fault-tolerant quantum computing architectures for scalable quantum systems.",
  },
  {
    title: "Topological Quantum Materials",
    category: "CONDENSED MATTER",
    categoryColor: "text-blue-400",
    description:
      "Investigating exotic quantum phases in topological insulators and superconductors with applications in quantum information.",
  },
  {
    title: "High-Temperature Superconductivity",
    category: "SUPERCONDUCTIVITY",
    categoryColor: "text-red-400",
    description:
      "Exploring mechanisms of high-temperature superconductivity and developing new materials for room-temperature applications.",
  },
  {
    title: "Quantum Optics & Photonic Systems",
    category: "QUANTUM OPTICS",
    categoryColor: "text-purple-400",
    description:
      "Studying light-matter interactions at quantum scales and developing photonic quantum technologies for communication and computing.",
  },
];

export default function ResearchPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Research" breadcrumb="Research" />
      <div className="grid gap-6 md:grid-cols-2">
        {researchAreas.map((area) => (
          <ResearchAreaCard key={area.title} {...area} />
        ))}
      </div>
    </div>
  );
}
