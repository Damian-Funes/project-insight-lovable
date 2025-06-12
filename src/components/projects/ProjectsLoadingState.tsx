
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectsLoadingState = React.memo(() => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-6" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-24" />
          ))}
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectsLoadingState.displayName = "ProjectsLoadingState";
