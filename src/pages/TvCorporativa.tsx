
import React, { useState, useEffect } from "react";
import { useReworkMetrics } from "@/hooks/useReworkMetrics";
import { useAreaProjects } from "@/hooks/useAreaProjects";
import { useTimeMetrics } from "@/hooks/useTimeMetrics";
import { useActiveProjectsCount } from "@/hooks/useActiveProjectsCount";
import { TvHeader } from "@/components/tv/TvHeader";
import { TvWelcomeCard } from "@/components/tv/TvWelcomeCard";
import { TvSectionIndicator } from "@/components/tv/TvSectionIndicator";
import { OperationalAlertsSection } from "@/components/tv/sections/OperationalAlertsSection";
import { ReworkSection } from "@/components/tv/sections/ReworkSection";
import { ProjectsSection } from "@/components/tv/sections/ProjectsSection";
import { TimeMetricsSection } from "@/components/tv/sections/TimeMetricsSection";
import { ActiveProjectsCountSection } from "@/components/tv/sections/ActiveProjectsCountSection";
import { PerformanceSection } from "@/components/tv/sections/PerformanceSection";
import { TV_SECTIONS, ROTATION_INTERVAL, TRANSITION_DURATION } from "@/constants/tvSections";

const TvCorporativa = () => {
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  const { data: reworkMetrics, isLoading: isLoadingRework } = useReworkMetrics(selectedArea);
  const { data: areaProjects, isLoading: isLoadingProjects } = useAreaProjects(selectedArea);
  const { data: timeMetrics, isLoading: isLoadingTime } = useTimeMetrics(selectedArea);
  const { data: activeProjectsCount, isLoading: isLoadingActiveProjects } = useActiveProjectsCount(selectedArea);

  // Effect para rotação automática
  useEffect(() => {
    if (selectedArea === "all") return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentSection((prev) => (prev + 1) % TV_SECTIONS.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedArea]);

  // Reset da seção atual quando área muda
  useEffect(() => {
    setCurrentSection(0);
    setIsTransitioning(false);
  }, [selectedArea]);

  const renderCurrentSection = () => {
    const currentSectionData = TV_SECTIONS[currentSection];
    
    switch (currentSectionData.id) {
      case 'alerts':
        return (
          <OperationalAlertsSection 
            areaId={selectedArea}
          />
        );

      case 'rework':
        return (
          <ReworkSection 
            reworkMetrics={reworkMetrics}
            isLoading={isLoadingRework}
          />
        );
        
      case 'projects':
        return (
          <ProjectsSection 
            areaProjects={areaProjects}
            isLoading={isLoadingProjects}
          />
        );

      case 'time-metrics':
        return (
          <TimeMetricsSection 
            timeMetrics={timeMetrics}
            isLoading={isLoadingTime}
          />
        );

      case 'active-projects-count':
        return (
          <ActiveProjectsCountSection 
            activeProjectsCount={activeProjectsCount}
            isLoading={isLoadingActiveProjects}
          />
        );
        
      case 'performance':
        return (
          <PerformanceSection 
            reworkMetrics={reworkMetrics}
            areaProjects={areaProjects}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <TvHeader 
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
      />

      <div className="flex-1">
        {selectedArea === "all" ? (
          <TvWelcomeCard />
        ) : (
          <div className="space-y-8">
            <TvSectionIndicator 
              sections={TV_SECTIONS}
              currentSection={currentSection}
            />

            <div 
              className={`transition-all duration-500 ${
                isTransitioning 
                  ? 'opacity-0 transform scale-95' 
                  : 'opacity-100 transform scale-100'
              }`}
            >
              {renderCurrentSection()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TvCorporativa;
