
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Users, BrainCircuit } from 'lucide-react';

interface PilotEEGData {
  id: string;
  name: string;
  eegStatus: 'normal' | 'warning' | 'critical';
  eegValue: number;
  connected: boolean;
  lastUpdate: Date;
}

interface EEGMonitorProps {
  className?: string;
}

const EEGMonitor: React.FC<EEGMonitorProps> = ({ className }) => {
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);
  const [pilotsData, setPilotsData] = useState<PilotEEGData[]>([
    { 
      id: "p1", 
      name: "Captain Ahmed", 
      eegStatus: 'normal', 
      eegValue: 98, 
      connected: true,
      lastUpdate: new Date() 
    },
    { 
      id: "p2", 
      name: "Lieutenant Mahmoud", 
      eegStatus: 'normal', 
      eegValue: 92, 
      connected: true,
      lastUpdate: new Date() 
    },
    { 
      id: "p3", 
      name: "Major Hassan", 
      eegStatus: 'normal', 
      eegValue: 85, 
      connected: true,
      lastUpdate: new Date() 
    },
    { 
      id: "p4", 
      name: "Colonel Karim", 
      eegStatus: 'warning', 
      eegValue: 76, 
      connected: true,
      lastUpdate: new Date() 
    }
  ]);
  
  // Initialize with first pilot
  useEffect(() => {
    if (pilotsData.length > 0 && !selectedPilot) {
      setSelectedPilot(pilotsData[0].id);
    }
  }, [pilotsData, selectedPilot]);
  
  // Simulate EEG readings
  useEffect(() => {
    const interval = setInterval(() => {
      setPilotsData(prevData => {
        return prevData.map(pilot => {
          // Random fluctuation
          const randomChange = Math.random() * 5 - 2.5;
          const newValue = Math.max(10, Math.min(100, pilot.eegValue + randomChange));
          const newStatus = getEEGStatus(newValue);
          
          // Random connection status change (rare)
          const connected = Math.random() > 0.98 ? !pilot.connected : pilot.connected;
          
          return {
            ...pilot,
            eegValue: Math.round(newValue),
            eegStatus: newStatus,
            connected,
            lastUpdate: new Date()
          };
        });
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getEEGStatus = (value: number): 'normal' | 'warning' | 'critical' => {
    if (value < 60) return 'critical';
    if (value < 80) return 'warning';
    return 'normal';
  };
  
  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'bg-eeg-red';
      case 'warning':
        return 'bg-eeg-yellow';
      default:
        return 'bg-eeg-green';
    }
  };
  
  const getCurrentPilot = () => {
    return pilotsData.find(p => p.id === selectedPilot) || pilotsData[0];
  };
  
  const currentPilot = getCurrentPilot();
  
  return (
    <div className={cn("glassmorphism p-5", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className={cn("w-3 h-3 rounded-full animate-pulse-subtle", 
            currentPilot ? getStatusColor(currentPilot.eegStatus) : "bg-muted")}></div>
          <h3 className="text-lg font-medium flex items-center">
            <BrainCircuit className="w-4 h-4 mr-1" /> EEG Status
          </h3>
        </div>
        <div className="text-xs text-muted-foreground">
          EMOTIV INSIGHT {currentPilot?.connected ? 
            <span className="text-eeg-green">● CONNECTED</span> : 
            <span className="text-eeg-red animate-blink">● DISCONNECTED</span>}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Pilot Selection</span>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1 text-muted-foreground" />
            <span className="text-xs">{pilotsData.length} Pilots</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 mb-3">
          {pilotsData.map(pilot => (
            <div 
              key={pilot.id}
              onClick={() => setSelectedPilot(pilot.id)}
              className={cn(
                "px-2 py-1 text-xs rounded cursor-pointer transition-colors",
                selectedPilot === pilot.id ? "bg-egypt-gold/20 text-egypt-gold" : "hover:bg-radar-bg"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{pilot.name}</span>
                <div className={cn("w-2 h-2 rounded-full", getStatusColor(pilot.eegStatus))}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {currentPilot && (
        <>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Consciousness Level</span>
              <span className={cn("text-sm font-medium", {
                "text-eeg-green": currentPilot.eegStatus === 'normal',
                "text-eeg-yellow": currentPilot.eegStatus === 'warning',
                "text-eeg-red": currentPilot.eegStatus === 'critical'
              })}>{currentPilot.eegValue}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500 ease-out", {
                  "bg-eeg-green": currentPilot.eegStatus === 'normal',
                  "bg-eeg-yellow": currentPilot.eegStatus === 'warning',
                  "bg-eeg-red": currentPilot.eegStatus === 'critical'
                })}
                style={{ width: `${currentPilot.eegValue}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="eeg-wave">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="eeg-wave-bar"></div>
              ))}
            </div>
            
            <div className="text-sm">
              {currentPilot.eegStatus === 'critical' && (
                <div className="text-eeg-red font-medium animate-blink">
                  AUTOPILOT ENGAGED
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      <div className="mt-3 pt-2 border-t border-border/10 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <div>Last updated: {currentPilot?.lastUpdate.toLocaleTimeString()}</div>
          <div>ID: {currentPilot?.id}</div>
        </div>
      </div>
    </div>
  );
};

export default EEGMonitor;
