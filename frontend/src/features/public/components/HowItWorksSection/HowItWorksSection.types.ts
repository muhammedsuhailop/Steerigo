import { IconType } from "react-icons";
export interface HowItWorksSectionProps { }

export interface Step {
    number: number;
    title: string;
    description: string;
    icon: IconType;
}

export interface StepCardProps {
    step: Step;
}
