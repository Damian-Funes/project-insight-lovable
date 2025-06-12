
import React, { useState, useCallback, memo } from "react";
import { FormStep } from "./FormStep";

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<any>;
  validation?: () => boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: (data: any) => void;
  initialData?: any;
  className?: string;
}

export const MultiStepForm = memo(({
  steps,
  onComplete,
  initialData = {},
  className,
}: MultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const currentStepData = steps[currentStep - 1];

  const handleNext = useCallback(() => {
    if (currentStepData.validation && !currentStepData.validation()) {
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length, currentStepData]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (currentStepData.validation && !currentStepData.validation()) {
      return;
    }

    setIsLoading(true);
    try {
      await onComplete(formData);
    } finally {
      setIsLoading(false);
    }
  }, [onComplete, formData, currentStepData]);

  const updateFormData = useCallback((stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);

  const isValid = !currentStepData.validation || currentStepData.validation();

  const CurrentStepComponent = currentStepData.component;

  return (
    <div className={className}>
      <FormStep
        title={currentStepData.title}
        description={currentStepData.description}
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        isValid={isValid}
        isLoading={isLoading}
      >
        <CurrentStepComponent
          data={formData}
          updateData={updateFormData}
          isActive={true}
        />
      </FormStep>
    </div>
  );
});

MultiStepForm.displayName = "MultiStepForm";
