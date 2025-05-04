
import React from 'react';
import { useElevator } from '@/context/ElevatorContext';
import { ElevatorShaft } from './ElevatorShaft';
import { FloorsList } from './FloorsList';

export function ElevatorsPanel() {
  const { elevators, floors } = useElevator();
  const floorCount = floors.length - 1; // -1 because we count from 0

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 neon-text-blue">Elevator Status</h2>
      
      <div className="flex-1 flex">
        {/* Floor numbers */}
        <FloorsList />
        
        {/* Elevator shafts */}
        <div className="flex-1 flex justify-center relative">
          {elevators.map(elevator => (
            <ElevatorShaft 
              key={elevator.id}
              elevator={elevator}
              floors={floorCount}
              currentFloor={elevator.currentFloor}
            />
          ))}
          
          {/* Current floor indicator line */}
          <div className="absolute left-0 right-0 border-b-2 border-dashed border-elevate-purple/30" 
            style={{ 
              top: `${100 - ((1 + 1) * (100 / (floorCount + 1)))}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}
