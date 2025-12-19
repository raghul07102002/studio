'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, MapPin, Search, Target } from "lucide-react";
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
    const item = {
        value,
        expiry: Date.now() + CACHE_EXPIRATION,
    };
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        // Cache is full, clear it
        localStorage.clear();
        localStorage.setItem(key, JSON.stringify(item));
    }
};

export function LocationInput({ value, onValueChange, placeholder }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value?.name || "");
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
                    const newLocation = {
                        name: result.display_name,
                        coords: { lat: parseFloat(result.lat), lng: parseFloat(result.lon) }
                    };
                    onValueChange(newLocation);
                    setSearchQuery(newLocation.name);
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
                        const newLocation = {
                            name: searchQuery,
                            coords: { lat: 0, lng: 0 } // User will need to fill this in
                        };
                        onValueChange(newLocation);
                        setOpen(false);
                    }} 
                    className="text-xs"
                  >
                     <Target className="mr-2 h-4 w-4" />
                     Use "{searchQuery}" and set coordinates manually
                  </CommandItem>
               </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
