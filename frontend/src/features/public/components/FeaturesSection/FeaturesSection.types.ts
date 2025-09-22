import { IconType } from "react-icons";
export interface FeaturesSectionProps { }

export interface Feature {
    id: string;
    icon: IconType;
    title: string;
    description: string;
    color: 'blue' | 'green' | 'purple';
}

export interface FeatureCardProps {
    feature: Feature;
}
