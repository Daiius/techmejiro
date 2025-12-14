import { getTechs } from "@/lib/techs";

export const TechList = async () => {
  "use cache";
  const techs = await getTechs();

  return techs != null ? (
    <ul className="list">
      {techs.map((tech) => (
        <li key={tech.key} className="list-row">
          <div className="flex gap-4">
            <span>{tech.name}</span>
            <div className="flex gap-2">
              {tech.tags.map((tag) => (
                <span
                  key={tag.key}
                  className="badge badge-outline badge-info text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <span>no techs...</span>
  );
};
