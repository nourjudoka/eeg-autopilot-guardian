
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface RadarTarget {
  id: string;
  type: 'ally' | 'enemy' | 'neutral';
  distance: number; // 0-100, percentage of radar radius
  angle: number; // 0-360 degrees
  callsign: string;
  locked?: boolean;
}

interface TacticalRadarProps {
  className?: string;
}

const TacticalRadar: React.FC<TacticalRadarProps> = ({ className }) => {
  const [targets, setTargets] = useState<RadarTarget[]>([]);
  const [sweepAngle, setSweepAngle] = useState(0);
  
  // Simulate radar sweep
  useEffect(() => {
    const sweepInterval = setInterval(() => {
      setSweepAngle(prev => (prev + 5) % 360);
    }, 50);
    
    return () => clearInterval(sweepInterval);
  }, []);
  
  // Initialize and update radar targets
  useEffect(() => {
    // Initial targets
    const initialTargets: RadarTarget[] = [
      { id: '1', type: 'ally', distance: 25, angle: 45, callsign: 'EAGLE-1' },
      { id: '2', type: 'ally', distance: 30, angle: 90, callsign: 'EAGLE-2' },
      { id: '3', type: 'enemy', distance: 60, angle: 180, callsign: 'BANDIT-1', locked: true },
      { id: '4', type: 'enemy', distance: 70, angle: 200, callsign: 'BANDIT-2' },
      { id: '5', type: 'neutral', distance: 50, angle: 270, callsign: 'CIVILIAN-1' }
    ];
    
    setTargets(initialTargets);
    
    // Update target positions periodically
    const updateInterval = setInterval(() => {
      setTargets(prevTargets => 
        prevTargets.map(target => ({
          ...target,
          distance: Math.max(5, Math.min(95, target.distance + (Math.random() * 4 - 2))),
          angle: (target.angle + (Math.random() * 10 - 5)) % 360,
          locked: target.type === 'enemy' ? Math.random() > 0.7 : undefined
        }))
      );
      
      // Random chance to add new target
      if (Math.random() > 0.9 && targets.length < 8) {
        const newTarget: RadarTarget = {
          id: Date.now().toString(),
          type: Math.random() > 0.7 ? 'enemy' : Math.random() > 0.5 ? 'ally' : 'neutral',
          distance: 90 + Math.random() * 5,
          angle: Math.random() * 360,
          callsign: Math.random() > 0.7 ? `BANDIT-${Math.floor(Math.random() * 10)}` : 
                  Math.random() > 0.5 ? `EAGLE-${Math.floor(Math.random() * 10)}` :
                  `CIVILIAN-${Math.floor(Math.random() * 10)}`
        };
        
        setTargets(prev => [...prev, newTarget]);
      }
      
      // Random chance to remove a target
      if (Math.random() > 0.95 && targets.length > 3) {
        setTargets(prev => prev.filter((_, i) => i !== Math.floor(Math.random() * prev.length)));
      }
    }, 2000);
    
    return () => clearInterval(updateInterval);
  }, [targets.length]);
  
  const getTargetColor = (type: 'ally' | 'enemy' | 'neutral', locked?: boolean) => {
    if (type === 'ally') return 'bg-ally';
    if (type === 'enemy') return locked ? 'bg-eeg-red animate-pulse-subtle' : 'bg-enemy';
    return 'bg-neutral';
  };
  
  const getTargetPosition = (distance: number, angle: number) => {
    const radius = 50; // Percentage of the container
    const angleInRadians = (angle - 90) * (Math.PI / 180);
    const x = 50 + distance * Math.cos(angleInRadians);
    const y = 50 + distance * Math.sin(angleInRadians);
    return { x, y };
  };
  
  return (
    <div className={cn("glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium">Tactical Radar</h3>
        <div className="text-sm text-muted-foreground ml-auto">
          <span className="text-eeg-green mr-2">●</span> Ally
          <span className="text-eeg-red mx-2">●</span> Enemy
          <span className="text-neutral mx-2">●</span> Neutral
        </div>
      </div>
      
      <div className="relative aspect-square p-4">
        <div className="absolute inset-0 m-4 rounded-full border border-glass-border bg-radar-bg overflow-hidden">
          {/* Radar rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/4 h-1/4 rounded-full border border-glass-border opacity-50"></div>
            <div className="w-1/2 h-1/2 rounded-full border border-glass-border opacity-50"></div>
            <div className="w-3/4 h-3/4 rounded-full border border-glass-border opacity-50"></div>
          </div>
          
          {/* Radar crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-glass-border opacity-30"></div>
            <div className="w-px h-full bg-glass-border opacity-30"></div>
          </div>
          
          {/* Radar sweep */}
          <div 
            className="radar-sweep"
            style={{ transform: `rotate(${sweepAngle}deg)` }}
          ></div>
          
          {/* Radar center */}
          <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Targets */}
          {targets.map((target) => {
            const { x, y } = getTargetPosition(target.distance, target.angle);
            return (
              <div 
                key={target.id}
                className={cn("absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10", 
                  getTargetColor(target.type, target.locked)
                )}
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%` 
                }}
              >
                {target.locked && (
                  <div className="absolute -inset-1 border border-eeg-red rounded-full animate-pulse-subtle"></div>
                )}
                <div className="absolute top-3 left-3 text-xs whitespace-nowrap">
                  {target.callsign}
                  {target.locked && <span className="ml-1 text-eeg-red">[LOCKED]</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TacticalRadar;
