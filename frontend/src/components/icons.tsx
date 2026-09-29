import {
  Upload,
  FileText,
  Sparkles,
  Layers,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  X,
  PenSquare,
  Download,
  Play,
  BookOpen,
  Zap,
  AlertTriangle,
  Inbox,
  RotateCw,
  Pin,
  Hash,
  Clock,
  Brain,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

function make(Cmp: LucideIcon, defaultStroke = 1.8) {
  return function WrappedIcon(props: ComponentProps<LucideIcon>) {
    return <Cmp strokeWidth={defaultStroke} {...props} />;
  };
}

export const Icon = {
  upload: make(Upload),
  file: make(FileText),
  spark: make(Sparkles, 1.6),
  layers: make(Layers),
  flip: make(RefreshCw),
  arrowLeft: make(ArrowLeft),
  arrowRight: make(ArrowRight),
  check: make(Check, 2.4),
  checkCircle: make(CheckCircle2),
  x: make(X, 2),
  close: make(X, 2),
  edit: make(PenSquare),
  download: make(Download),
  play: make(Play, 2),
  book: make(BookOpen),
  bolt: make(Zap),
  alert: make(AlertTriangle),
  inbox: make(Inbox),
  refresh: make(RefreshCw),
  rotate: make(RotateCw),
  pin: make(Pin),
  hash: make(Hash),
  clock: make(Clock),
  brain: make(Brain, 1.6),
};
