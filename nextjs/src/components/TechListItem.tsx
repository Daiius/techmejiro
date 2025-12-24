export interface TechListItemProps {
  techName: string;
  techTags: string[];
}

export const TechListItem = ({ techName, techTags }: TechListItemProps) => (
  <li className="list-row">
    <div className="flex gap-4">
      <span>{techName}</span>
      <div className="flex gap-2">
        {techTags.map((tag) => (
          <span key={tag} className="badge badge-outline badge-info text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </li>
);
