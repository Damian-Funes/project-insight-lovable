
import React from "react";
import { TvSection } from "@/types/tv";

interface TvSectionIndicatorProps {
  sections: TvSection[];
  currentSection: number;
}

export const TvSectionIndicator = ({ sections, currentSection }: TvSectionIndicatorProps) => {
  const currentSectionData = sections[currentSection];

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className="flex items-center space-x-3">
        {currentSectionData.icon && React.createElement(currentSectionData.icon, {
          className: "w-10 h-10 text-chart-primary"
        })}
        <h2 className="text-3xl font-bold text-foreground">
          {currentSectionData.title}
        </h2>
      </div>
      
      <div className="flex space-x-2 ml-8">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSection 
                ? 'bg-chart-primary' 
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
