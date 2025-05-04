import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Elevator, FloorInfo, EmergencyAlert, ElevatorRecommendation } from '@/types/elevator';

interface ElevatorContextProps {
  elevators: Elevator[];
  floors: FloorInfo[];
  currentFloor: number;
  alerts: EmergencyAlert[];
  selectElevator: (elevatorId: string, targetFloor: number) => void;
  getRecommendedElevator: (targetFloor: number) => ElevatorRecommendation | null;
  getEstimatedTime: (elevatorId: string, targetFloor: number) => number;
}

const ElevatorContext = createContext<ElevatorContextProps>({} as ElevatorContextProps);

export function useElevator() {
  return useContext(ElevatorContext);
}

interface ElevatorProviderProps {
  children: ReactNode;
  initialFloor?: number;
}

export function ElevatorProvider({ children, initialFloor = 1 }: ElevatorProviderProps) {
  // Define floors (G and 1-10)
  const [floors] = useState<FloorInfo[]>([
    { number: 0, name: 'G', isCurrent: initialFloor === 0 },
    { number: 1, name: '1', isCurrent: initialFloor === 1 },
    { number: 2, name: '2', isCurrent: initialFloor === 2 },
    { number: 3, name: '3', isCurrent: initialFloor === 3 },
    { number: 4, name: '4', isCurrent: initialFloor === 4 },
    { number: 5, name: '5', isCurrent: initialFloor === 5 },
    { number: 6, name: '6', isCurrent: initialFloor === 6 },
    { number: 7, name: '7', isCurrent: initialFloor === 7 },
    { number: 8, name: '8', isCurrent: initialFloor === 8 },
    { number: 9, name: '9', isCurrent: initialFloor === 9 },
    { number: 10, name: '10', isCurrent: initialFloor === 10 },
  ]);

  const [currentFloor, setCurrentFloor] = useState<number>(initialFloor);

  // Initialize elevators
  const [elevators, setElevators] = useState<Elevator[]>([
    {
      id: 'elevator-a',
      name: 'Lift A',
      currentFloor: 0,
      targetFloor: null,
      direction: 'idle',
      occupancyLevel: 'empty',
      isMoving: false,
      underMaintenance: false,
      speed: 12, // 12 floors per minute (5 seconds per floor)
    },
    {
      id: 'elevator-b',
      name: 'Lift B',
      currentFloor: 5,
      targetFloor: 2,
      direction: 'down',
      occupancyLevel: 'half',
      isMoving: true,
      underMaintenance: false,
      speed: 12,
    },
    {
      id: 'elevator-c',
      name: 'Lift C',
      currentFloor: 8,
      targetFloor: null,
      direction: 'idle',
      occupancyLevel: 'maintenance',
      isMoving: false,
      underMaintenance: true,
      speed: 10,
    },
  ]);

  // Initialize alerts
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([
    {
      id: 'alert-1',
      message: 'Lift C is currently under maintenance and will resume operation at 2:30 PM',
      type: 'info',
      timestamp: new Date(),
    }
  ]);

  // Simulate elevator movement
  useEffect(() => {
    const interval = setInterval(() => {
      setElevators(prevElevators => {
        return prevElevators.map(elevator => {
          if (!elevator.isMoving || elevator.underMaintenance || elevator.targetFloor === null) {
            return elevator;
          }

          // Calculate new floor based on direction
          let newFloor = elevator.currentFloor;
          if (elevator.direction === 'up' && elevator.currentFloor < elevator.targetFloor) {
            newFloor += 0.1;
          } else if (elevator.direction === 'down' && elevator.currentFloor > elevator.targetFloor) {
            newFloor -= 0.1;
          }

          // Round to handle precision issues
          newFloor = Math.round(newFloor * 10) / 10;

          // Check if reached target floor
          if (Math.abs(newFloor - elevator.targetFloor) < 0.1) {
            return {
              ...elevator,
              currentFloor: elevator.targetFloor,
              direction: 'idle',
              isMoving: false,
              targetFloor: null,
            };
          }

          return {
            ...elevator,
            currentFloor: newFloor,
          };
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Simulate changing occupancy levels and add random movements periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update elevator statuses to simulate real building activity
      setElevators(prevElevators => {
        return prevElevators.map(elevator => {
          if (elevator.underMaintenance) return elevator;
          
          // Only change state for idle elevators
          if (elevator.direction === 'idle' && Math.random() > 0.7) {
            const occupancyLevels: ('empty' | 'half' | 'full')[] = ['empty', 'half', 'full'];
            const targetFloor = Math.floor(Math.random() * floors.length);
            
            // Don't set same floor as target
            if (Math.floor(elevator.currentFloor) === targetFloor) {
              return elevator;
            }
            
            return {
              ...elevator,
              targetFloor,
              direction: targetFloor > elevator.currentFloor ? 'up' : 'down',
              occupancyLevel: occupancyLevels[Math.floor(Math.random() * occupancyLevels.length)],
              isMoving: true,
            };
          }
          
          return elevator;
        });
      });
      
      // Randomly add/remove alerts
      if (Math.random() > 0.95) {
        const alertMessages = [
          'Please maintain social distancing in elevators',
          'Scheduled maintenance for Lift A tomorrow from 10 AM-12 PM',
          'Building inspection in progress. Thank you for your patience.',
          'Please report any issues to Building Management at ext. 500',
        ];
        
        const randomMessage = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        
        setAlerts(prev => [
          ...prev, 
          {
            id: `alert-${Date.now()}`,
            message: randomMessage,
            type: 'info',
            timestamp: new Date(),
          }
        ]);
        
        // Keep only the last 3 alerts
        setTimeout(() => {
          setAlerts(prev => {
            if (prev.length > 3) {
              return prev.slice(1);
            }
            return prev;
          });
        }, 15000);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [floors.length]);

  const selectElevator = (elevatorId: string, targetFloor: number) => {
    setElevators(prevElevators =>
      prevElevators.map(elevator => {
        if (elevator.id !== elevatorId) return elevator;
        
        // Don't update elevators under maintenance
        if (elevator.underMaintenance) return elevator;
        
        // Don't set if already at target floor
        if (Math.floor(elevator.currentFloor) === targetFloor) return elevator;
        
        return {
          ...elevator,
          targetFloor,
          direction: targetFloor > elevator.currentFloor ? 'up' : 'down',
          isMoving: true,
        };
      })
    );
  };

  const getEstimatedTime = (elevatorId: string, targetFloor: number): number => {
    const elevator = elevators.find(e => e.id === elevatorId);
    
    if (!elevator) return Infinity;
    if (elevator.underMaintenance) return Infinity;
    
    // If already at the target floor
    if (Math.floor(elevator.currentFloor) === targetFloor) return 0;
    
    // Calculate estimate based on current position, target, and speed
    const distance = Math.abs(targetFloor - elevator.currentFloor);
    const timeInMinutes = distance / elevator.speed;
    
    // Convert to seconds and add 5 seconds buffer
    return Math.round(timeInMinutes * 60) + 5;
  };

  const getRecommendedElevator = (targetFloor: number): ElevatorRecommendation | null => {
    // Don't recommend if we're already on the target floor
    if (targetFloor === currentFloor) return null;
    
    let bestElevator: Elevator | null = null;
    let bestTime = Infinity;
    
    elevators.forEach(elevator => {
      if (elevator.underMaintenance) return;
      
      // Calculate estimated time
      const time = getEstimatedTime(elevator.id, targetFloor);
      
      // If this elevator is faster than our current best
      if (time < bestTime) {
        bestTime = time;
        bestElevator = elevator;
      }
    });
    
    // If no suitable elevator found
    if (!bestElevator) return null;
    
    // Generate status message
    let status = '';
    if (bestElevator.isMoving) {
      status = bestElevator.direction === 'up' ? 'Moving Up' : 'Moving Down';
    } else {
      status = 'Available';
    }

    if (bestElevator.occupancyLevel === 'full') {
      status = 'Full';
    }
    
    return {
      elevatorId: bestElevator.id,
      elevatorName: bestElevator.name,
      estimatedTimeSeconds: bestTime,
      status,
    };
  };

  const value = {
    elevators,
    floors,
    currentFloor,
    alerts,
    selectElevator,
    getRecommendedElevator,
    getEstimatedTime,
  };

  return (
    <ElevatorContext.Provider value={value}>
      {children}
    </ElevatorContext.Provider>
  );
}
