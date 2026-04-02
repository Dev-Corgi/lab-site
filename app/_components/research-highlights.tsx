import Link from "next/link";
import { Brain, Microscope, Dna, FlaskConical } from "lucide-react";

const highlights = [
  {
    icon: Brain,
    title: "Quantum Computing & Algorithms",
    description:
      "Developing novel quantum algorithms for optimization problems and exploring quantum machine learning applications.",
  },
  {
    icon: Microscope,
    title: "Topological Quantum Matter",
    description:
      "Investigating exotic quantum states in topological materials and their potential for quantum information processing.",
  },
  {
    icon: Dna,
    title: "Superconductivity Research",
    description:
      "Studying high-temperature superconductors and exploring mechanisms for room-temperature superconductivity.",
  },
  {
    icon: FlaskConical,
    title: "Quantum Optics & Photonics",
    description:
      "Exploring light-matter interactions at the quantum level and developing photonic quantum technologies.",
  },
];

export function ResearchHighlights() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            Research Highlights
          </h2>
          <p className="text-gray-400 mt-2">
            Four core research themes driving our lab
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <Link key={item.title} href="/research" className={i === 0 ? "lg:row-span-2" : ""}>
              <div className="h-full rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50 flex flex-col">
                <item.icon className="h-8 w-8 text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 flex-1">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
