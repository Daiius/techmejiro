import type { ReactNode } from "react";
import Link from "next/link";

export interface TechListItemProps {
  techName: string;
  techUrl: string;
  children?: ReactNode;
}

export const TechListItem = ({
  techName,
  techUrl,
  children,
}: TechListItemProps) => (
  <li className="list-row items-center">
    <Link href={techUrl} target="_blank">
      <span className="text-2xl">{techName}</span>
    </Link>
    {children}
  </li>
);
