
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";

export const CacheMonitor = () => {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    totalQueries: 0,
    staleQueries: 0,
    loadingQueries: 0,
    errorQueries: 0,
    cacheSize: 0,
  });

  // Mostrar apenas em desenvolvimento
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.getAll();
      
      setCacheStats({
        totalQueries: queries.length,
        staleQueries: queries.filter(q => q.isStale()).length,
        loadingQueries: queries.filter(q => q.isFetching()).length,
        errorQueries: queries.filter(q => q.state.status === 'error').length,
        cacheSize: queries.reduce((size, query) => {
          const dataSize = query.state.data 
            ? JSON.stringify(query.state.data).length 
            : 0;
          return size + dataSize;
        }, 0),
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, [queryClient, isVisible]);

  const clearCache = () => {
    queryClient.clear();
  };

  const refetchAll = () => {
    queryClient.refetchQueries();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-background/95 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            Cache Monitor
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={refetchAll}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearCache}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Total Queries:</span>
            <Badge variant="secondary">{cacheStats.totalQueries}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Stale:</span>
            <Badge variant="outline" className="text-yellow-600">
              {cacheStats.staleQueries}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Loading:</span>
            <Badge variant="outline" className="text-blue-600">
              {cacheStats.loadingQueries}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Errors:</span>
            <Badge variant="destructive">
              {cacheStats.errorQueries}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Cache Size:</span>
            <Badge variant="secondary">
              {(cacheStats.cacheSize / 1024).toFixed(1)}KB
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
