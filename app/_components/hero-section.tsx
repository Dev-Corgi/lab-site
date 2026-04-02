import { LinkButton } from "@/components/link-button";

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background with overlay text effect */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden opacity-[0.06]">
        <div className="text-[8rem] md:text-[14rem] font-black text-white whitespace-nowrap tracking-wider leading-none">
          QUANTUM COMPUTING
        </div>
      </div>
      <div className="absolute inset-0 flex items-end justify-center select-none pointer-events-none overflow-hidden opacity-[0.06]">
        <div className="text-[6rem] md:text-[10rem] font-black text-white whitespace-nowrap tracking-wider leading-none translate-y-8">
          CONDENSED MATTER PHYSICS
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/60 to-[#0a0a0f]" />

      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
          Welcome to Quantum Dynamics Lab
        </h1>
        <p className="text-lg md:text-xl text-red-400 mb-2">
          Exploring the Quantum Realm, Shaping Tomorrow
        </p>
        <p className="text-gray-400 mb-10">Department of Physics, Stellar University</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LinkButton href="/team" size="lg" className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-full px-8">
            Meet Our Team
          </LinkButton>
          <LinkButton href="/publications" variant="outline" size="lg" className="border-gray-500 text-gray-200 hover:bg-white/10 rounded-full px-8">
            View Publications
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
