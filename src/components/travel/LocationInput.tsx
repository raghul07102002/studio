'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, MapPin, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TravelLocation } from "@/lib/types";

interface LocationInputProps {
  value: TravelLocation | null;
  onValueChange: (value: TravelLocation | null) => void;
  placeholder?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const CACHE_EXPIRATION = 1000 * 60 * 60 * 24; // 24 hours

const getCache = <T,>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        const parsed = JSON.parse(item);
        if (Date.now() > parsed.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.value;
    } catch (error) {
        return null;
    }
};

const setCache = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    const item = {
        value,
        expiry: Date.now() + CACHE_EXPIRATION,
    };
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.warn('Cache is full, clearing it');
        localStorage.clear();
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.error('Failed to cache after clearing', e);
        }
    }
};

export function LocationInput({ value, onValueChange, placeholder }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocations = useCallback(async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    const cacheKey = `nominatim-search-${query.toLowerCase()}`;
    const cached = getCache<NominatimResult[]>(cacheKey);

    if (cached) {
      setResults(cached);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=in&limit=5`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data: NominatimResult[] = await response.json();
      setResults(data);
      setCache(cacheKey, data);
    } catch (error) {
      console.error("Failed to fetch from Nominatim:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchLocations(searchQuery);
    }, 500); // Debounce API calls

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, fetchLocations]);

  // Sync searchQuery with external value when popover opens and value exists
  useEffect(() => {
    if (open && value) {
      setSearchQuery(value.name);
    }
  }, [open, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-9"
        >
          <span className="truncate">
            {value ? value.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[310px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search city, state, or place..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading && <div className="p-2 text-xs text-center text-muted-foreground">Searching...</div>}
            {!isLoading && results.length === 0 && searchQuery.length > 2 && (
              <div className="p-2 text-xs text-center text-muted-foreground">No results found.</div>
            )}
            <CommandGroup>
              {results.map((result) => (
                <CommandItem
                  key={result.place_id}
                  value={result.display_name}
                  onSelect={() => {
                    onValueChange({
                        name: result.display_name,
                        coords: { lat: parseFloat(result.lat), lng: parseFloat(result.lon) }
                    });
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <span className="truncate">{result.display_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {searchQuery.length > 2 && !isLoading && (
               <CommandGroup heading="Not in the list?">
                  <CommandItem 
                    onSelect={() => {
                        onValueChange({
                            name: searchQuery,
                            // Providing 0,0 as a placeholder for manual entry
                            coords: { lat: 0, lng: 0 } 
                        });
                        setOpen(false);
                    }} 
                    className="text-xs"
                  >
                     <Target className="mr-2 h-4 w-4" />
                     Use "{searchQuery}"
                  </CommandItem>
               </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
