
export type OccupancyLevel = 'empty' | 'half' | 'full' | 'maintenance';

export interface Elevator {
  id: string;
  name: string;
  currentFloor: number;
  targetFloor: number | null;
  direction: 'up' | 'down' | 'idle';
  occupancyLevel: OccupancyLevel;
  isMoving: boolean;
  underMaintenance: boolean;
  speed: number; // floors per minute
}

export interface FloorInfo {
  number: number;
  name: string;
  isCurrent: boolean;
}

export interface ElevatorRecommendation {
  elevatorId: string;
  elevatorName: string;
  estimatedTimeSeconds: number;
  status: string;
}

export interface EmergencyAlert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
  timestamp: Date;
}
