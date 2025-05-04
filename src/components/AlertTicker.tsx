
import React, { useRef, useEffect } from 'react';
import { useElevator } from '@/context/ElevatorContext';

export function AlertTicker() {
  const { alerts } = useElevator();
  const tickerRef = useRef<HTMLDivElement>(null);

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'warning': return 'text-elevate-yellow';
      case 'critical': return 'text-elevate-red';
      default: return 'text-elevate-blue';
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="w-full bg-elevate-darker/80 border-b border-elevate-blue/20 overflow-hidden py-2">
      <div className="flex animate-scroll-text whitespace-nowrap">
        {alerts.map((alert, index) => (
          <div key={alert.id} className={`inline-flex items-center ${getAlertClass(alert.type)} px-4`}>
            <span className="text-sm font-medium">
              {alert.message}
            </span>
            {index < alerts.length - 1 && (
              <span className="mx-6 text-elevate-muted">•</span>
            )}
          </div>
        ))}
        {/* Duplicate alerts for continuous scrolling */}
        {alerts.map((alert, index) => (
          <div key={`${alert.id}-copy`} className={`inline-flex items-center ${getAlertClass(alert.type)} px-4`}>
            <span className="text-sm font-medium">
              {alert.message}
            </span>
            {index < alerts.length - 1 && (
              <span className="mx-6 text-elevate-muted">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
