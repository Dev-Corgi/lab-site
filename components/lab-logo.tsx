import { cn } from "@/lib/utils";

/** `public/logo.svg` — 광섬유 번들 마크 (하단 개방 프레임 + 5섬유 + 말단 속 빈 원) */
export function LabLogo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 로컬 정적 SVG 마크
    <img
      src="/logo.svg"
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      decoding="async"
    />
  );
}
