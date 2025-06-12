
import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  isValid?: boolean;
  isLoading?: boolean;
  showNavigation?: boolean;
}

export const FormStep = memo(({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isValid = true,
  isLoading = false,
  showNavigation = true,
}: FormStepProps) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Etapa {currentStep} de {totalSteps}
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="w-full bg-secondary rounded-full h-2 mt-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {children}

        {showNavigation && (
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstStep || isLoading}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={!isValid || isLoading}
              >
                {isLoading ? "Enviando..." : "Finalizar"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onNext}
                disabled={!isValid || isLoading}
                className="flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FormStep.displayName = "FormStep";
