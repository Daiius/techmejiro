import { clsx } from "clsx";
import { Suspense } from "react";
import { AuthStatus } from "@/components/AuthStatus";

import { WDXL_Lubrifont_JP_N } from "next/font/google";
import { TechmejiroIcon } from "./icons/TechmejiroIcon";

const wdxlLubrifontJpN = WDXL_Lubrifont_JP_N({ weight: "400" });

export const Header = () => {
  return (
    <header className="h-12 flex items-center bg-base-300 p-2">
      <TechmejiroIcon className="size-10" />
      <h1 className={clsx("text-3xl", wdxlLubrifontJpN.className)}>
        てくめじろ
      </h1>
      <div className="ml-auto">
        <Suspense>
          <AuthStatus />
        </Suspense>
      </div>
    </header>
  );
};
