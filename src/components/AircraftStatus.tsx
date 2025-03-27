
import React from 'react';
import { cn } from "@/lib/utils";

interface DamageArea {
  name: string;
  status: 'operational' | 'damaged' | 'critical';
  percentage: number;
}

interface AircraftStatusProps {
  className?: string;
}

const AircraftStatus: React.FC<AircraftStatusProps> = ({ className }) => {
  const [aircraft, setAircraft] = React.useState({
    id: 'F-35B',
    callsign: 'REAPER-1',
    autopilot: false,
    altitude: 32500,
    speed: 540,
    heading: 278,
    fuelRemaining: 72
  });
  
  const [damageAreas, setDamageAreas] = React.useState<DamageArea[]>([
    { name: 'Airframe', status: 'operational', percentage: 98 },
    { name: 'Propulsion', status: 'operational', percentage: 100 },
    { name: 'Avionics', status: 'operational', percentage: 95 },
    { name: 'Weapons', status: 'operational', percentage: 100 },
    { name: 'Sensors', status: 'operational', percentage: 92 }
  ]);
  
  // Simulate autopilot status change
  React.useEffect(() => {
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
        
        <div className="mb-2">
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
        
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Damage Report</h4>
          <div className="space-y-2">
            {damageAreas.map((area) => (
              <div key={area.name} className="flex items-center">
                <div className={cn("w-2 h-2 rounded-full mr-2", getStatusColor(area.status))}></div>
                <div className="text-sm flex-1">{area.name}</div>
                <div className="text-sm font-medium">{area.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftStatus;
