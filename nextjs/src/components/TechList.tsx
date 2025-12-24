import { getTechs } from "@/lib/techs";
import { TechListItem } from "./TechListItem";

export const TechList = async () => {
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
    <ul className="list">
      {techs.map((tech) => (
        <TechListItem
          key={tech.key}
          techName={tech.name}
          techTags={tech.tags.map((t) => t.name)}
        />
      ))}
    </ul>
  ) : (
    <span>no techs...</span>
  );
};
