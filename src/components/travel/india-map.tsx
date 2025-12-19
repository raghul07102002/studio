
'use client';
import { useApp } from '@/contexts/app-provider';
import { INDIA_STATES_PATHS } from '@/data/india-states-paths';
import { cn } from '@/lib/utils';

export function IndiaMap() {
    const { travelData } = useApp();
    const { selectedStates = [] } = travelData;

    return (
        <div className="w-full h-full bg-background flex items-center justify-center p-4">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 964.38 1033.42"
                aria-label="Map of India"
                className="w-full h-full max-w-full max-h-full"
            >
                <g>
                    {INDIA_STATES_PATHS.map((state) => {
                        const isSelected = selectedStates.includes(state.name);
                        return (
                            <path
                                key={state.id}
                                id={state.id}
                                d={state.d}
                                className={cn(
                                    "stroke-background stroke-[2] transition-all duration-300",
                                    isSelected ? "fill-primary/80" : "fill-muted hover:fill-primary/40"
                                )}
                            >
                                <title>{state.name}</title>
                            </path>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
