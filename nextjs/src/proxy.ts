import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { headers } from "next/headers";

export default function proxy(req: NextRequest) {}

export const config = {
  matcher: "/user",
};
