'use client'

import Silk from '@/components/vendor/Silk';

export function AppBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    >
      <Silk
        color="#0b6e6a"
        sheenColor="#131615"
        speed={0.7}
        scale={0.6}
        depth={0.5}
        sheen={0.4}
        glow={0.6}
        noiseIntensity={1}
        rotation={0}
        wave={1}
        ripple={1}
        mouseInteraction={false}
        clickRipple={false}
        intro={false}
      />
    </div>
  );
}