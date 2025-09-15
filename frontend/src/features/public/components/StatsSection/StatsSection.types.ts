import { IconType } from "react-icons";
export interface StatsSectionProps { }

export interface Stat {
    id: string;
    number: string;
    label: string;
    icon: IconType;
}

export interface StatCardProps {
    stat: Stat;
}
