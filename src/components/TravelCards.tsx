
import React from 'react';
import { useElevator } from '@/context/ElevatorContext';
import { DestinationCard } from './DestinationCard';

export function TravelCards() {
  const { floors, currentFloor } = useElevator();

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <h2 className="text-xl font-semibold mb-6 neon-text-blue">Where do you want to go?</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pb-4">
        {floors
          .filter(floor => floor.number !== currentFloor)
          .map(floor => (
            <DestinationCard 
              key={floor.number} 
              floorNumber={floor.number} 
              floorName={floor.name}
            />
          ))
        }
      </div>
    </div>
  );
}
