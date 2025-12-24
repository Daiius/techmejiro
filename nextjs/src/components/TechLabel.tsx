export interface TechLabelProps {
  label: string;
}

export const TechLabel = ({ label }: TechLabelProps) => (
  <span className="badge badge-outline badge-info text-xs">{label}</span>
);
