import type { ReactNode } from "react";

export interface TechListItemProps {
  techName: string;
  children?: ReactNode;
}

export const TechListItem = ({ techName, children }: TechListItemProps) => (
  <li className="list-row">
    <span className="text-2xl">{techName}</span>
    {children}
  </li>
);
