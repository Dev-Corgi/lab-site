export interface NewsItem {
  date: string;
  text: string;
  link?: string;
}

export interface NewsYear {
  year: string;
  items: NewsItem[];
}

export const newsData: NewsYear[] = [
  {
    year: "2026",
    items: [
      { date: "Mar 30th 2026", text: "Our breakthrough research on quantum error correction has been published in Nature Physics, demonstrating a new approach to fault-tolerant quantum computing.", link: "#" },
      { date: "Mar 24th 2026", text: "New discovery in topological superconductors published in Physical Review Letters! We identified novel Majorana zero modes with potential applications in quantum computing.", link: "#" },
      { date: "Feb 25th 2026", text: "Congratulations to Dr. Sarah Chen and Dr. Michael Rodriguez on completing their Ph.D.! They will be joining MIT and Stanford as postdoctoral researchers." },
      { date: "Feb 5th 2026", text: "Congrats to Emma Thompson for the Best Poster Award and David Kim for the Outstanding Research Award at the APS March Meeting 2026! 🎉" },
      { date: "Jan 8th 2026", text: "Congratulations to Prof. James Mitchell for receiving the Stellar University Excellence in Research Award in Physics! 🎉" },
    ],
  },
  {
    year: "2025",
    items: [
      { date: "Dec 15th 2025", text: "Exciting news! Prof. Mitchell has been elected as a Fellow of the American Physical Society! 🎉" },
      { date: "Nov 20th 2025", text: "Our research on room-temperature quantum coherence in diamond NV centers published in Science.", link: "#" },
      { date: "Oct 10th 2025", text: "Congratulations to Lisa Anderson and Robert Zhang for receiving NSF Graduate Research Fellowships! 🎉" },
      { date: "Sep 15th 2025", text: "New paper on topological phase transitions in 2D quantum materials published in Nature Materials.", link: "#" },
      { date: "Aug 20th 2025", text: "Jennifer Park successfully defended her Master's thesis on quantum optics. Congratulations!" },
      { date: "Jun 12th 2025", text: "Our lab receives $2M DOE grant for quantum computing research over the next 5 years." },
      { date: "May 5th 2025", text: "Thomas Lee wins Best Student Presentation Award at the International Conference on Quantum Materials! 🎉" },
      { date: "Mar 18th 2025", text: "Breakthrough in high-temperature superconductivity research published in Nature.", link: "#" },
    ],
  },
  {
    year: "2024",
    items: [
      { date: "Nov 8th 2024", text: "Maria Garcia receives the Outstanding Graduate Student Award from the Department of Physics! 🎉" },
      { date: "Oct 22nd 2024", text: "New study on quantum entanglement in photonic cavities published in Physical Review X.", link: "#" },
      { date: "Sep 10th 2024", text: "Welcome to our new postdoc, Dr. Patricia Williams, joining from Caltech!" },
      { date: "Aug 15th 2024", text: "Daniel Wu and Rachel Brown complete their Master's degrees. Best wishes for their future endeavors!" },
      { date: "Jul 3rd 2024", text: "Our paper on spin-orbit coupling in topological insulators featured in Physical Review B.", link: "#" },
      { date: "May 20th 2024", text: "Lab awarded NSF equipment grant for new dilution refrigerator system." },
      { date: "Apr 12th 2024", text: "Kevin Johnson wins poster competition at Quantum Information Science Workshop! 🎉" },
      { date: "Feb 28th 2024", text: "Collaborative work on quantum simulation with ultracold atoms published in Reviews of Modern Physics.", link: "#" },
    ],
  },
  {
    year: "2023",
    items: [
      { date: "Dec 5th 2023", text: "Prof. Mitchell delivers invited talk at International Quantum Computing Conference." },
      { date: "Oct 18th 2023", text: "New research on topological superconductivity in nanowires published in Nature Physics.", link: "#" },
      { date: "Sep 1st 2023", text: "Welcome to our new graduate students: Alex Turner, Olivia Harris, and Nathan Clark!" },
      { date: "Jul 15th 2023", text: "Sarah Chen receives Best Oral Presentation Award at Gordon Research Conference! 🎉" },
      { date: "May 10th 2023", text: "Our quantum dots research for single-photon sources published in Applied Physics Letters.", link: "#" },
      { date: "Mar 22nd 2023", text: "Lab hosts successful workshop on Quantum Technologies with 80+ participants." },
    ],
  },
  {
    year: "2022",
    items: [
      { date: "Nov 30th 2022", text: "Fractional quantum Hall effect study in graphene published in Physical Review Letters.", link: "#" },
      { date: "Sep 12th 2022", text: "Emma Thompson awarded prestigious Hertz Fellowship for graduate studies! 🎉" },
      { date: "Jun 8th 2022", text: "New quantum algorithms paper published in Quantum journal.", link: "#" },
      { date: "Apr 5th 2022", text: "Lab receives $1.5M grant from DOE for superconducting qubit research." },
      { date: "Feb 14th 2022", text: "Michael Rodriguez wins Young Researcher Award at APS March Meeting! 🎉" },
    ],
  },
];
