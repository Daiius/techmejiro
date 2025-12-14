import { Suspense } from "react";
import { AuthStatus } from "@/components/AuthStatus";

export const Header = () => {
  return (
    <header className="h-12 flex items-center bg-base-300">
      <h1>てくめじろ</h1>
      <div className="ml-auto">
        <Suspense>
          <AuthStatus />
        </Suspense>
      </div>
    </header>
  );
};
