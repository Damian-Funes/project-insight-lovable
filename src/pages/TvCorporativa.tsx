
import React, { useState } from "react";
import { TvHeader } from "@/components/tv/TvHeader";
import { TvWelcomeCard } from "@/components/tv/TvWelcomeCard";

const TvCorporativa = () => {
  const [selectedArea, setSelectedArea] = useState<string>("all");

  console.log('TvCorporativa carregando, área selecionada:', selectedArea);

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
            <div className="text-center">
              <h2 className="text-4xl font-bold text-foreground mb-2">
                Área Selecionada: {selectedArea}
              </h2>
              <p className="text-xl text-muted-foreground">
                Funcionalidade em desenvolvimento
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TvCorporativa;
