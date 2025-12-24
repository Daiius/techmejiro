"use client";

import { clsx } from "clsx";
import { useState, useEffect, useRef } from "react";

import { TechmejiroIcon } from "@/components/icons/TechmejiroIcon";

export interface AutoWidthMejiroOshiProps {
  className?: string;
  widthStyle?: string;
}

export const AutoWidthMejiroOshi = ({
  className,
  widthStyle = "100%",
}: AutoWidthMejiroOshiProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [scaleYs, setScaleYs] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateCount = (width: number) => {
      // size-64 = 256px, -ml-40 = -160px
      // First icon: 256px, additional icons: 96px each (256 - 160)
      const firstIconWidth = 128;
      const additionalIconWidth = 48;

      if (width < firstIconWidth) return 0;

      const additionalIcons = Math.floor(
        (width - firstIconWidth) / additionalIconWidth,
      );
      return 1 + additionalIcons;
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const newCount = calculateCount(width);
        setCount(newCount);
        setScaleYs(
          Array.from({ length: newCount }).map(
            () => 1.0 + (Math.random() * 0.2 - 0.1),
          ),
        );
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (count > 0 && !mounted) {
      setMounted(true);
    }
  }, [count, mounted]);

  return (
    <div
      ref={containerRef}
      className={clsx("flex items-end h-32", className)}
      style={{ width: widthStyle }}
    >
      {mounted &&
        scaleYs.map((scaleY, i) => (
          <TechmejiroIcon
            key={i}
            className="size-32 not-first:-ml-20 transition-transform duration-1000 animate-pop-in opacity-0"
            style={{
              scale: `-1.0 ${scaleY}`,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
    </div>
  );
};
