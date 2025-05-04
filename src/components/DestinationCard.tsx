
import React from 'react';
import { useElevator } from '@/context/ElevatorContext';
import { ArrowUp, ArrowDown, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DestinationCardProps {
  floorNumber: number;
  floorName: string;
}

export function DestinationCard({ floorNumber, floorName }: DestinationCardProps) {
  const { getRecommendedElevator, selectElevator, currentFloor, elevators } = useElevator();
  
  // Get recommended elevator for this floor
  const recommendation = getRecommendedElevator(floorNumber);
  
  // Format time display
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleSelectElevator = () => {
    if (recommendation) {
      selectElevator(recommendation.elevatorId, floorNumber);
    }
  };
  
  // Don't show card for current floor
  if (floorNumber === currentFloor) return null;

  // Check if any elevator is available
  const isAvailable = recommendation !== null;
  
  const getRecommendationColor = () => {
    if (!isAvailable) return "text-elevate-muted";
    if (recommendation!.status === "Full") return "text-elevate-yellow";
    return "neon-text-blue";
  };
  
  const getEtaColor = () => {
    if (!isAvailable) return "text-elevate-muted";
    const eta = recommendation!.estimatedTimeSeconds;
    if (eta < 30) return "text-elevate-green";
    if (eta < 60) return "text-elevate-blue"; 
    return "text-elevate-yellow";
  };

  return (
    <Card 
      className={cn(
        "p-4 bg-elevate-darker border border-elevate-muted/30 hover:border-elevate-blue/50",
        "transition-all duration-200 cursor-pointer h-full flex flex-col justify-between",
        "hover:shadow-md hover:shadow-elevate-blue/10"
      )}
      onClick={handleSelectElevator}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-3xl font-bold neon-text-purple">{floorName}</div>
        <div className="flex items-center">
          {floorNumber > currentFloor ? (
            <ArrowUp className="text-elevate-blue" size={18} />
          ) : (
            <ArrowDown className="text-elevate-yellow" size={18} />
          )}
          <span className="ml-1 text-sm text-elevate-muted">
            {Math.abs(floorNumber - currentFloor)} {Math.abs(floorNumber - currentFloor) === 1 ? 'floor' : 'floors'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <Clock size={16} className={getEtaColor()} />
          <span className="ml-2 text-sm">
            {isAvailable ? (
              <span className={getEtaColor()}>
                ETA: {formatTime(recommendation!.estimatedTimeSeconds)}
              </span>
            ) : (
              <span className="text-elevate-red">No elevators available</span>
            )}
          </span>
        </div>

        <div className="flex items-center">
          {isAvailable && recommendation!.status === "Full" ? (
            <AlertTriangle size={16} className="text-elevate-yellow" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-elevate-blue/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-elevate-blue" />
            </div>
          )}
          <span className={cn("ml-2 text-sm font-medium", getRecommendationColor())}>
            {isAvailable ? (
              <>
                {recommendation!.elevatorName} {recommendation!.status === "Full" ? "(Full)" : ""}
              </>
            ) : (
              <>No recommendation</>
            )}
          </span>
        </div>

        {/* Show maintenance warning if applicable */}
        {elevators.some(e => e.underMaintenance) && (
          <div className="text-xs text-elevate-muted mt-2">
            Note: Lift C is under maintenance
          </div>
        )}
      </div>
    </Card>
  );
}
