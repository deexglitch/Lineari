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
        color={dark ? "#0b6e6a" : "#0e857f"}
        sheenColor={dark ? "#131615" : "#e7f2ef"}
        speed={0.7}
        scale={0.6}
        depth={0.5}
        sheen={0.4}
        glow={dark ? 0.6 : 0.3}
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