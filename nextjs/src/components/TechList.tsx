import { clsx } from "clsx";

import { getTechs } from "@/lib/techs";
import { TechListItem } from "./TechListItem";
import { TechLabel } from "./TechLabel";

export interface TechListProps {
  className?: string;
}

export const TechList = async ({ className }: TechListProps) => {
  "use cache";
  const techsResult = await getTechs();

  if (!techsResult.success) {
    return (
      <div className="alert alert-error">
        <span>技術データの取得に失敗しました: {techsResult.error.message}</span>
      </div>
    );
  }

  const techs = techsResult.data;

  return techs.length > 0 ? (
    <ul className={clsx("list", className)}>
      {techs.map((tech) => (
        <TechListItem key={tech.key} techName={tech.name} techUrl={tech.url}>
          <div className="flex gap-2">
            {tech.tags.map((t) => (
              <TechLabel key={t.key} label={t.name} />
            ))}
          </div>
        </TechListItem>
      ))}
    </ul>
  ) : (
    <span>no techs...</span>
  );
};
