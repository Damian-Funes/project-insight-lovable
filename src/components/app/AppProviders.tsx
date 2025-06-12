
import React from "react";

// Componente simplificado - funcionalidade movida para App.tsx
interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return <>{children}</>;
};
