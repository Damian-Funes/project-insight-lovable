
import { RotateCcw, FolderOpen, Clock, Activity, TrendingUp } from "lucide-react";
import { TvSection } from "@/types/tv";

export const TV_SECTIONS: TvSection[] = [
  {
    id: 'rework',
    title: 'Indicadores de Retrabalho',
    icon: RotateCcw,
  },
  {
    id: 'projects',
    title: 'Projetos Ativos',
    icon: FolderOpen,
  },
  {
    id: 'time-metrics',
    title: 'Horas Registradas',
    icon: Clock,
  },
  {
    id: 'active-projects-count',
    title: 'Projetos em Andamento',
    icon: Activity,
  },
  {
    id: 'performance',
    title: 'Indicadores de Performance',
    icon: TrendingUp,
  },
];

export const ROTATION_INTERVAL = 12000; // 12 segundos
export const TRANSITION_DURATION = 500; // 0.5 segundos
