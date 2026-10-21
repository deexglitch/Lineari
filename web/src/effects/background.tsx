'use client'

import { useEffect, useState } from "react";
import Silk from '@/components/vendor/Silk';

export function AppBackground() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark")),
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Silk
        color={dark ? "#0b6e6a" : "#3f9a93"}
        sheenColor={dark ? "#131615" : "#bcd9d3"}
        speed={0.7}
        scale={1.2}
        depth={1.2}
        sheen={0.4}
        glow={dark ? 0.6 : 0.2}
        noiseIntensity={1}
        rotation={0}
        wave={1}
        ripple={1}
        mouseInteraction={true}
        clickRipple={false}
        intro={true}
      />
    </div>
  );
}