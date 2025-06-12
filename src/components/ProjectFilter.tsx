
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";

interface ProjectFilterProps {
  selectedProject: string;
  onProjectChange: (value: string) => void;
}

export const ProjectFilter = ({ selectedProject, onProjectChange }: ProjectFilterProps) => {
  const { data: projects } = useProjects();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Filtrar por Projeto</label>
      <Select value={selectedProject} onValueChange={onProjectChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Todos os projetos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os projetos</SelectItem>
          {projects?.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.nome_projeto}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
