
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadTripView } from "@/components/travel/plan/road-trip-view";
import { Map, Mountain } from "lucide-react";

export default function TravelPlanPage() {

    return (
        <Card>
            <CardContent className="p-4">
                 <Tabs defaultValue="road-trips">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="road-trips">
                            <Map className="mr-2 h-4 w-4" />
                            Road Trips
                        </TabsTrigger>
                        <TabsTrigger value="treks">
                            <Mountain className="mr-2 h-4 w-4" />
                            Treks
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="road-trips" className="mt-4">
                        <RoadTripView />
                    </TabsContent>
                    <TabsContent value="treks" className="mt-4">
                        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
                            <Mountain className="h-16 w-16 text-muted-foreground/50" />
                            <h2 className="mt-4 text-xl font-semibold text-muted-foreground">Trekking Plans</h2>
                            <p className="mt-1 text-sm text-muted-foreground">This feature is coming soon!</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
