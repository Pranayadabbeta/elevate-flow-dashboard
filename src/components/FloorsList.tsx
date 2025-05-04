
import React from 'react';
import { useElevator } from '@/context/ElevatorContext';
import { cn } from '@/lib/utils';

export function FloorsList() {
  const { floors, currentFloor } = useElevator();
  
  // Sort floors in descending order (highest floor at top)
  const sortedFloors = [...floors].sort((a, b) => b.number - a.number);

  return (
    <div className="h-full flex flex-col justify-between py-4">
      {sortedFloors.map(floor => (
        <div 
          key={floor.number}
          className={cn(
            "flex items-center h-8",
            floor.number === currentFloor ? "neon-text-purple font-bold" : "text-elevate-muted"
          )}
        >
          <div className={cn(
            "w-14 px-2 py-1 rounded-l-md flex justify-center items-center",
            floor.number === currentFloor ? "bg-elevate-purple/20" : ""
          )}>
            <span className={cn(
              "text-lg",
              floor.number === currentFloor ? "" : "opacity-70"
            )}>
              {floor.name}
            </span>
          </div>
          <div className="w-3 h-px bg-elevate-muted/30" />
        </div>
      ))}
    </div>
  );
}
