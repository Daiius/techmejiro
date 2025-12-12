"use client";

import { clsx } from "clsx";
import { useState, useEffect } from "react";

import { TechmejiroIcon } from "@/components/icons/TechmejiroIcon";

export interface MejiroOshiProps {
  count: number;
  className?: string;
}

export const MejiroOshi = ({ count, className }: MejiroOshiProps) => {
  const [scaleYs, setScaleYs] = useState<number[]>(
    Array.from({ length: count }).map((_) => 1.0),
  );
  useEffect(() => {
    setScaleYs(
      Array.from({ length: count }).map(
        (_) => 1.0 + (Math.random() * 0.2 - 0.1),
      ),
    );
  }, [count]);

  console.log("scaleYs: ", scaleYs);

  return (
    <div className={clsx("flex items-end", className)}>
      {scaleYs.map((scaleY, i) => (
        <TechmejiroIcon
          key={i}
          className="size-64 not-first:-ml-40 transition-transform duration-1000"
          style={{ scale: `-1.0 ${scaleY}` }}
        />
      ))}
    </div>
  );
};
