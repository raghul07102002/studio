import {
  BookOpen,
  Dumbbell,
  Leaf,
  DollarSign,
  BedDouble,
  Droplets,
  BrainCircuit,
  CalendarCheck,
  Check,
  ClipboardList,
  Flame,
  HeartPulse,
  Pen,
  Smile,
  Zap,
  type LucideProps,
} from "lucide-react";

export const Icons = {
  book: BookOpen,
  dumbbell: Dumbbell,
  leaf: Leaf,
  dollar: DollarSign,
  bed: BedDouble,
  water: Droplets,
  brain: BrainCircuit,
  calendar: CalendarCheck,
  check: Check,
  clipboard: ClipboardList,
  flame: Flame,
  heart: HeartPulse,
  pen: Pen,
  smile: Smile,
  zap: Zap,
};

export type IconName = keyof typeof Icons;

interface IconProps extends LucideProps {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = Icons[name];
  return <LucideIcon {...props} />;
}
