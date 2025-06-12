
import React, { memo, useEffect, useRef } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface WithPerformanceTrackingProps {
  children: React.ReactNode;
  componentName: string;
  enabled?: boolean;
}

export const WithPerformanceTracking = memo(({ 
  children, 
  componentName, 
  enabled = process.env.NODE_ENV === 'development' 
}: WithPerformanceTrackingProps) => {
  const { measureRender } = usePerformanceMonitor(componentName);
  const renderEndRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Inicia medição de render
    renderEndRef.current = measureRender();

    return () => {
      // Finaliza medição de render
      renderEndRef.current?.();
    };
  });

  if (!enabled) {
    return <>{children}</>;
  }

  return <>{children}</>;
});

WithPerformanceTracking.displayName = 'WithPerformanceTracking';

// HOC para facilitar o uso
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithPerformanceTrackingHOC = (props: P) => {
    return (
      <WithPerformanceTracking componentName={displayName}>
        <WrappedComponent {...props} />
      </WithPerformanceTracking>
    );
  };

  WithPerformanceTrackingHOC.displayName = `withPerformanceTracking(${displayName})`;
  
  return WithPerformanceTrackingHOC;
}
