"use client";

import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";

interface Step {
    id: string;
    title: string;
    description: string;
}

interface StepNavigationProps {
    steps: Step[];
    currentStep: string;
    completedSteps: string[];
    onStepClick?: (stepId: string) => void;
    className?: string;
}

export function StepNavigation({
    steps,
    currentStep,
    completedSteps,
    onStepClick,
    className = "",
}: StepNavigationProps) {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
        <div className={`w-full ${className}`}>
            {/* Mobile Step Indicator */}
            <div className="block sm:hidden mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Step {currentStepIndex + 1} of {steps.length}</span>
                    <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>
                <div className="mt-3">
                    <h3 className="font-semibold">{steps[currentStepIndex]?.title}</h3>
                    <p className="text-sm text-muted-foreground">{steps[currentStepIndex]?.description}</p>
                </div>
            </div>

            {/* Desktop Step Indicator */}
            <div className="hidden sm:block">
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center max-w-2xl w-full">
                        {steps.map((step, index) => {
                            const isCompleted = completedSteps.includes(step.id);
                            const isCurrent = step.id === currentStep;
                            const isClickable = isCompleted || isCurrent;

                            return (
                                <div key={step.id} className="flex items-center">
                                    {/* Step Circle */}
                                    <div className="flex flex-col items-center">
                                        <Button
                                            variant={isCurrent ? "default" : isCompleted ? "default" : "outline"}
                                            size="sm"
                                            className={`w-12 h-12 rounded-full p-0 ${
                                                isCurrent 
                                                    ? "bg-primary text-primary-foreground" 
                                                    : isCompleted 
                                                        ? "bg-green-600 text-white hover:bg-green-700" 
                                                        : "bg-muted text-muted-foreground"
                                            } ${isClickable && onStepClick ? "cursor-pointer" : "cursor-default"}`}
                                            onClick={() => isClickable && onStepClick?.(step.id)}
                                            disabled={!isClickable}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <span className="text-base font-semibold">{index + 1}</span>
                                            )}
                                        </Button>
                                        
                                        {/* Step Label */}
                                        <div className="text-center mt-4 min-w-[160px]">
                                            <p className={`text-base font-semibold ${
                                                isCurrent ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground"
                                            }`}>
                                                {step.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1 leading-tight">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className="w-32 h-px bg-border relative top-[-25px] mx-6">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    completedSteps.includes(steps[index + 1].id) || currentStep === steps[index + 1].id 
                                                        ? "bg-primary" 
                                                        : "bg-border"
                                                }`}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Predefined steps for product creation
export const PRODUCT_CREATION_STEPS: Step[] = [
    {
        id: "category",
        title: "Choose Category",
        description: "Select or create a category for your product",
    },
    {
        id: "product",
        title: "Product Details",
        description: "Add product information and images",
    },
];