import { ICONS, type IconName } from "@/lib/icons";

export function Icon({ name, className = "h-5 w-5", style }: { name: IconName; className?: string; style?: React.CSSProperties }) {
  const C = ICONS[name];
  return <C className={className} style={style} aria-hidden />;
}
