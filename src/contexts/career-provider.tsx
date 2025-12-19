"use client";

import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type CareerPath = 'CyberArk' | 'Sailpoint IDN' | 'Cloud computing' | 'Devops';

export interface RoadmapItem {
    id: string;
    title: string;
    hoursSpent: number;
    displayHours?: string;
}

const initialRoadmapItems: Omit<RoadmapItem, 'id'>[] = [
    { title: 'Introduction to PAM, IAM & Vault Basics', hoursSpent: 0 },
    { title: 'Core Components (PVWA, CPM, PSM, PSMP)', hoursSpent: 0 },
    { title: 'Safes, Platforms, and Account Management', hoursSpent: 0 },
    { title: 'Authentication & Session Monitoring', hoursSpent: 0 },
    { title: 'Advanced Topics: PTA, AAM, and Conjur', hoursSpent: 0 },
];

const initialRoadmaps: Record<CareerPath, RoadmapItem[]> = {
    'CyberArk': initialRoadmapItems.map((item, index) => ({ ...item, id: `cyberark-${index}` })),
    'Sailpoint IDN': [
        { id: 'sailpoint-0', title: 'IdentityNow Basics & Terminology', hoursSpent: 0 },
        { id: 'sailpoint-1', title: 'Sources, Accounts, and Entitlements', hoursSpent: 0 },
        { id: 'sailpoint-2', title: 'Access Profiles and Roles', hoursSpent: 0 },
        { id: 'sailpoint-3', title: 'Certification Campaigns & Policies', hoursSpent: 0 },
        { id: 'sailpoint-4', title: 'Transforms and Provisioning Logic', hoursSpent: 0 },
    ],
    'Cloud computing': [
        { id: 'cloud-0', title: 'Core Concepts: IaaS, PaaS, SaaS', hoursSpent: 0 },
        { id: 'cloud-1', title: 'Networking & Security in the Cloud', hoursSpent: 0 },
        { id: 'cloud-2', title: 'Compute Services (VMs, Containers, Serverless)', hoursSpent: 0 },
        { id: 'cloud-3', title: 'Storage & Database Solutions', hoursSpent: 0 },
        { id: 'cloud-4', title: 'Identity and Access Management (IAM)', hoursSpent: 0 },
    ],
    'Devops': [
        { id: 'devops-0', title: 'CI/CD Pipelines (e.g., Jenkins, GitLab CI)', hoursSpent: 0 },
        { id: 'devops-1', title: 'Infrastructure as Code (Terraform, Ansible)', hoursSpent: 0 },
        { id: 'devops-2', title: 'Containerization (Docker, Kubernetes)', hoursSpent: 0 },
        { id: 'devops-3', title: 'Monitoring & Observability (Prometheus, Grafana)', hoursSpent: 0 },
        { id: 'devops-4', title: 'Scripting & Automation (Bash, Python)', hoursSpent: 0 },
    ],
};


interface CareerContextType {
    roadmaps: Record<CareerPath, RoadmapItem[]>;
    setRoadmap: (path: CareerPath, items: RoadmapItem[]) => void;
    addRoadmapItem: (path: CareerPath, title: string) => void;
    updateRoadmapItem: (path: CareerPath, item: RoadmapItem) => void;
    removeRoadmapItem: (path: CareerPath, itemId: string) => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export function CareerProvider({ children }: { children: ReactNode }) {
    const [roadmaps, setRoadmaps] = useLocalStorage<Record<CareerPath, RoadmapItem[]>>('career-roadmaps', initialRoadmaps);

    const setRoadmap = (path: CareerPath, items: RoadmapItem[]) => {
        setRoadmaps(prev => ({ ...prev, [path]: items }));
    };

    const addRoadmapItem = (path: CareerPath, title: string) => {
        const newItem: RoadmapItem = {
            id: `item-${path}-${Date.now()}`,
            title,
            hoursSpent: 0,
        };
        setRoadmaps(prev => ({
            ...prev,
            [path]: [...(prev[path] || []), newItem],
        }));
    };

    const updateRoadmapItem = (path: CareerPath, updatedItem: RoadmapItem) => {
        setRoadmaps(prev => ({
            ...prev,
            [path]: (prev[path] || []).map(item => item.id === updatedItem.id ? updatedItem : item),
        }));
    };
    
    const removeRoadmapItem = (path: CareerPath, itemId: string) => {
        setRoadmaps(prev => ({
            ...prev,
            [path]: (prev[path] || []).filter(item => item.id !== itemId),
        }));
    };

    const value = {
        roadmaps,
        setRoadmap,
        addRoadmapItem,
        updateRoadmapItem,
        removeRoadmapItem,
    };

    return (
        <CareerContext.Provider value={value}>
            {children}
        </CareerContext.Provider>
    );
}

export function useCareer() {
    const context = useContext(CareerContext);
    if (!context) {
        throw new Error('useCareer must be used within a CareerProvider');
    }
    return context;
}
