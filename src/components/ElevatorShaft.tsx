
import React from 'react';
import { Elevator as ElevatorType } from '@/types/elevator';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ElevatorShaftProps {
  elevator: ElevatorType;
  floors: number;
  currentFloor: number;
}

export function ElevatorShaft({ elevator, floors, currentFloor }: ElevatorShaftProps) {
  // Calculate elevator vertical position (floors are reversed in visualization, top = highest floor)
  const floorHeight = 100 / (floors + 1); // +1 to account for ground floor
  const elevatorPosition = 100 - ((elevator.currentFloor + 1) * floorHeight);
  
  // Determine occupancy color
  const getOccupancyColor = () => {
    switch (elevator.occupancyLevel) {
      case 'empty': return 'bg-elevate-green border-elevate-green';
      case 'half': return 'bg-elevate-yellow border-elevate-yellow';
      case 'full': return 'bg-elevate-red border-elevate-red';
      case 'maintenance': return 'bg-elevate-muted border-elevate-muted';
      default: return 'bg-elevate-blue border-elevate-blue';
    }
  };
  
  // Determine glow color
  const getGlowColor = () => {
    switch (elevator.occupancyLevel) {
      case 'empty': return 'var(--glow-color, #10B981)';
      case 'half': return 'var(--glow-color, #FBBF24)';
      case 'full': return 'var(--glow-color, #EF4444)';
      case 'maintenance': return 'var(--glow-color, #64748B)';
      default: return 'var(--glow-color, #0EA5E9)';
    }
  };

  return (
    <div className="relative h-full w-16 mx-1 border-x border-elevate-muted/30" style={{ 
      '--glow-color': getGlowColor()
    } as React.CSSProperties}>
      {/* Elevator shaft markings */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {Array.from({ length: floors + 1 }).map((_, i) => (
          <div key={i} className="w-full h-px bg-elevate-muted/20" />
        ))}
      </div>
      
      {/* The elevator car */}
      <div 
        className={cn(
          "absolute left-1 right-1 h-8 rounded transition-all duration-300",
          "border-2 shadow-lg flex items-center justify-center",
          elevator.isMoving ? "" : "status-pulse",
          getOccupancyColor()
        )}
        style={{ 
          top: `${elevatorPosition}%`,
          transform: 'translateY(-50%)',
        }}
      >
        <div className="text-xs font-bold text-elevate-darker">
          {elevator.underMaintenance ? (
            <span>🛠️</span>
          ) : (
            <>
              {elevator.direction === 'up' && <ArrowUp size={14} />}
              {elevator.direction === 'down' && <ArrowDown size={14} />}
            </>
          )}
        </div>
      </div>
      
      {/* Elevator ID */}
      <div className="absolute -bottom-6 left-0 right-0 text-center">
        <span className="text-xs font-medium text-elevate-muted">{elevator.name}</span>
      </div>
    </div>
  );
}
