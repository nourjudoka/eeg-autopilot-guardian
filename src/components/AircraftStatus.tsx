
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Plane } from 'lucide-react';

interface DamageArea {
  name: string;
  status: 'operational' | 'damaged' | 'critical';
  percentage: number;
  description?: string;
}

interface AircraftStatusProps {
  className?: string;
}

const AircraftStatus: React.FC<AircraftStatusProps> = ({ className }) => {
  const [aircraft, setAircraft] = useState({
    id: 'F-35B',
    callsign: 'REAPER-1',
    autopilot: false,
    altitude: 32500,
    speed: 540,
    heading: 278,
    fuelRemaining: 72
  });
  
  const [damageAreas, setDamageAreas] = useState<DamageArea[]>([
    { name: 'Airframe', status: 'operational', percentage: 98, description: 'Minor stress damage on left wing' },
    { name: 'Propulsion', status: 'operational', percentage: 100, description: 'Systems nominal' },
    { name: 'Avionics', status: 'operational', percentage: 95, description: 'Navigation system showing intermittent errors' },
    { name: 'Weapons', status: 'operational', percentage: 100, description: 'All missile systems functional' },
    { name: 'Sensors', status: 'operational', percentage: 92, description: 'Forward LIDAR system degraded' }
  ]);
  
  const [showDamageDetails, setShowDamageDetails] = useState<string | null>(null);
  
  // Simulate autopilot status change
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to toggle autopilot
      if (Math.random() > 0.8) {
        setAircraft(prev => ({
          ...prev,
          autopilot: !prev.autopilot
        }));
      }
      
      // Random altitude and speed changes
      setAircraft(prev => ({
        ...prev,
        altitude: prev.altitude + Math.floor(Math.random() * 200 - 100),
        speed: prev.speed + Math.floor(Math.random() * 10 - 5),
        heading: (prev.heading + Math.floor(Math.random() * 3 - 1)) % 360,
        fuelRemaining: Math.max(0, prev.fuelRemaining - 0.1)
      }));
      
      // Random chance to change damage statuses
      if (Math.random() > 0.9) {
        setDamageAreas(prev => {
          return prev.map(area => {
            if (Math.random() > 0.8) {
              const newPercentage = Math.max(0, Math.min(100, area.percentage + (Math.random() > 0.7 ? -10 : 5)));
              let newStatus: 'operational' | 'damaged' | 'critical' = 'operational';
              let newDescription = area.description;
              
              if (newPercentage < 40) {
                newStatus = 'critical';
                newDescription = `CRITICAL: ${area.name} systems failing`;
              } else if (newPercentage < 70) {
                newStatus = 'damaged';
                newDescription = `WARNING: ${area.name} systems compromised`;
              }
              
              return {
                ...area,
                percentage: newPercentage,
                status: newStatus,
                description: newDescription
              };
            }
            return area;
          });
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = (status: 'operational' | 'damaged' | 'critical') => {
    switch (status) {
      case 'operational':
        return 'bg-eeg-green';
      case 'damaged':
        return 'bg-eeg-yellow';
      case 'critical':
        return 'bg-eeg-red';
    }
  };
  
  const handleToggleDamageDetails = (name: string) => {
    if (showDamageDetails === name) {
      setShowDamageDetails(null);
    } else {
      setShowDamageDetails(name);
    }
  };
  
  return (
    <div className={cn("glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium flex-1">Aircraft Status</h3>
        <div className="text-sm text-muted-foreground">{aircraft.id} | {aircraft.callsign}</div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-radar-bg rounded-md p-2">
            <div className="text-xs text-muted-foreground mb-1">ALTITUDE</div>
            <div className="text-lg font-medium">{aircraft.altitude.toLocaleString()} ft</div>
          </div>
          <div className="bg-radar-bg rounded-md p-2">
            <div className="text-xs text-muted-foreground mb-1">SPEED</div>
            <div className="text-lg font-medium">{aircraft.speed} kts</div>
          </div>
          <div className="bg-radar-bg rounded-md p-2">
            <div className="text-xs text-muted-foreground mb-1">HEADING</div>
            <div className="text-lg font-medium">{aircraft.heading}°</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">AUTOPILOT</div>
          <div className={cn("text-sm font-medium px-2 py-1 rounded", {
            "bg-eeg-green text-white": aircraft.autopilot,
            "bg-muted text-muted-foreground": !aircraft.autopilot
          })}>
            {aircraft.autopilot ? "ENGAGED" : "DISENGAGED"}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Fuel Remaining</span>
            <span className={cn("text-sm font-medium", {
              "text-eeg-red": aircraft.fuelRemaining < 20,
              "text-eeg-yellow": aircraft.fuelRemaining >= 20 && aircraft.fuelRemaining < 40,
              "text-eeg-green": aircraft.fuelRemaining >= 40
            })}>{aircraft.fuelRemaining}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500 ease-out", {
                "bg-eeg-red": aircraft.fuelRemaining < 20,
                "bg-eeg-yellow": aircraft.fuelRemaining >= 20 && aircraft.fuelRemaining < 40,
                "bg-eeg-green": aircraft.fuelRemaining >= 40
              })}
              style={{ width: `${aircraft.fuelRemaining}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <h4 className="text-md font-medium mb-2">Damage Report</h4>
            <div className="space-y-2">
              {damageAreas.map((area) => (
                <div 
                  key={area.name} 
                  className="flex items-center cursor-pointer hover:bg-radar-bg/50 p-1 rounded"
                  onClick={() => handleToggleDamageDetails(area.name)}
                >
                  <div className={cn("w-2 h-2 rounded-full mr-2", getStatusColor(area.status))}></div>
                  <div className="text-sm flex-1">{area.name}</div>
                  <div className="text-sm font-medium">{area.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative bg-radar-bg rounded-md p-2 flex items-center justify-center aspect-square overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-4/5 relative">
                {/* Aircraft silhouette */}
                <Plane size={150} className="text-muted-foreground/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                
                {/* Damage indicators */}
                {damageAreas.map((area) => {
                  let position = {};
                  let size = "w-4 h-4";
                  
                  switch (area.name) {
                    case 'Airframe':
                      position = { top: '45%', left: '50%', transform: 'translate(-50%, -50%)' };
                      size = "w-20 h-8";
                      break;
                    case 'Propulsion':
                      position = { bottom: '10%', left: '50%', transform: 'translate(-50%, 0)' };
                      size = "w-8 h-6";
                      break;
                    case 'Avionics':
                      position = { top: '30%', left: '50%', transform: 'translate(-50%, 0)' };
                      size = "w-6 h-6";
                      break;
                    case 'Weapons':
                      position = { top: '45%', left: '30%', transform: 'translate(0, -50%)' };
                      size = "w-3 h-8";
                      break;
                    case 'Sensors':
                      position = { top: '25%', left: '50%', transform: 'translate(-50%, 0)' };
                      size = "w-4 h-4";
                      break;
                  }
                  
                  return (
                    <div 
                      key={area.name}
                      className={cn(
                        "absolute rounded opacity-70", 
                        size,
                        area.status === 'operational' ? "bg-eeg-green/20 border border-eeg-green/40" : 
                        area.status === 'damaged' ? "bg-eeg-yellow/30 border border-eeg-yellow/70 animate-pulse-subtle" : 
                        "bg-eeg-red/30 border border-eeg-red/70 animate-pulse-subtle"
                      )}
                      style={position as React.CSSProperties}
                    />
                  );
                })}
              </div>
            </div>
            
            {showDamageDetails && (
              <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-xs">
                <div className="font-medium mb-1">
                  {showDamageDetails} Status
                </div>
                <div>
                  {damageAreas.find(area => area.name === showDamageDetails)?.description || 'No details available'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftStatus;
