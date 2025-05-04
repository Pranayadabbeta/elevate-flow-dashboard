
import React from 'react';
import { ElevatorsPanel } from './ElevatorsPanel';
import { TravelCards } from './TravelCards';
import { AlertTicker } from './AlertTicker';
import { ElevatorProvider } from '@/context/ElevatorContext';

export function Dashboard() {
  return (
    <ElevatorProvider initialFloor={1}>
      <div className="flex flex-col h-screen w-full bg-elevate-dark text-white overflow-hidden">
        {/* Alert ticker */}
        <AlertTicker />
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden p-4 md:p-6 gap-6">
          {/* Left panel - Elevator status (40%) */}
          <div className="w-full md:w-2/5 elevate-card h-[40vh] md:h-auto overflow-hidden">
            <ElevatorsPanel />
          </div>
          
          {/* Right panel - Travel cards (60%) */}
          <div className="flex-1 elevate-card overflow-hidden">
            <TravelCards />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="p-2 text-center text-xs text-elevate-muted">
          <span>ElevateX Dashboard v1.0</span>
        </footer>
      </div>
    </ElevatorProvider>
  );
}
