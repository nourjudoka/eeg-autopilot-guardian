
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Users, BrainCircuit, Shield, AlertTriangle, Check } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

interface PilotEEGData {
  id: string;
  name: string;
  eegStatus: 'normal' | 'warning' | 'critical';
  eegValue: number;
  connected: boolean;
  lastUpdate: Date;
  neuralSync: number; // Neural synchronization level with aircraft
  mentalWorkload: number; // Mental workload indicator
}

interface EEGMonitorProps {
  className?: string;
}

const EEGMonitor: React.FC<EEGMonitorProps> = ({ className }) => {
  const { t } = useLanguage();
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);
  const [pilotsData, setPilotsData] = useState<PilotEEGData[]>([
    { 
      id: "p1", 
      name: "Captain Ahmed", 
      eegStatus: 'normal', 
      eegValue: 98, 
      connected: true,
      lastUpdate: new Date(),
      neuralSync: 94,
      mentalWorkload: 42
    },
    { 
      id: "p2", 
      name: "Lieutenant Mahmoud", 
      eegStatus: 'normal', 
      eegValue: 92, 
      connected: true,
      lastUpdate: new Date(),
      neuralSync: 88,
      mentalWorkload: 56
    },
    { 
      id: "p3", 
      name: "Major Hassan", 
      eegStatus: 'normal', 
      eegValue: 85, 
      connected: true,
      lastUpdate: new Date(),
      neuralSync: 78,
      mentalWorkload: 67
    },
    { 
      id: "p4", 
      name: "Colonel Karim", 
      eegStatus: 'warning', 
      eegValue: 76, 
      connected: true,
      lastUpdate: new Date(),
      neuralSync: 64,
      mentalWorkload: 81
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
          
          // Neural sync and mental workload fluctuations
          const syncChange = Math.random() * 4 - 1.5;
          const workloadChange = Math.random() * 6 - 2;
          
          // Random connection status change (rare)
          const connected = Math.random() > 0.98 ? !pilot.connected : pilot.connected;
          
          return {
            ...pilot,
            eegValue: Math.round(newValue),
            eegStatus: newStatus,
            connected,
            lastUpdate: new Date(),
            neuralSync: Math.min(100, Math.max(0, Math.round(pilot.neuralSync + syncChange))),
            mentalWorkload: Math.min(100, Math.max(0, Math.round(pilot.mentalWorkload + workloadChange)))
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
  
  const getWorkloadLevel = (value: number): string => {
    if (value > 80) return 'High';
    if (value > 50) return 'Moderate';
    return 'Low';
  };
  
  const getWorkloadColor = (value: number): string => {
    if (value > 80) return 'text-eeg-red';
    if (value > 50) return 'text-eeg-yellow';
    return 'text-eeg-green';
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
            <BrainCircuit className="w-4 h-4 ltr:mr-1 rtl:ml-1" /> {t('neural.interface')}
          </h3>
        </div>
        <div className="text-xs flex items-center">
          {currentPilot?.connected ? 
            <span className="text-eeg-green flex items-center"><Check className="w-3 h-3 ltr:mr-1 rtl:ml-1" /> EMOTIV INSIGHT 2.0</span> : 
            <span className="text-eeg-red animate-blink flex items-center"><AlertTriangle className="w-3 h-3 ltr:mr-1 rtl:ml-1" /> {t('disconnected')}</span>}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">{t('advanced.neural.squadron')}</span>
          <div className="flex items-center">
            <Users className="w-3 h-3 ltr:mr-1 rtl:ml-1 text-muted-foreground" />
            <span className="text-xs">{pilotsData.length} {t('pilots')}</span>
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
              <span className="text-sm">{t('consciousness.level')}</span>
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
          
          {/* New Neural-Aircraft Synchronization Meter */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm">{t('neural.aircraft.sync')}</span>
              <span className="text-sm font-medium text-egypt-gold">{currentPilot.neuralSync}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-egypt-gold transition-all duration-500 ease-out"
                style={{ width: `${currentPilot.neuralSync}%` }}
              ></div>
            </div>
          </div>
          
          {/* New Mental Workload Indicator */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm">{t('mental.workload')}</span>
              <span className={cn("text-sm font-medium", getWorkloadColor(currentPilot.mentalWorkload))}>
                {t(getWorkloadLevel(currentPilot.mentalWorkload).toLowerCase())} ({currentPilot.mentalWorkload}%)
              </span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500 ease-out", {
                  "bg-eeg-green": currentPilot.mentalWorkload <= 50,
                  "bg-eeg-yellow": currentPilot.mentalWorkload > 50 && currentPilot.mentalWorkload <= 80,
                  "bg-eeg-red": currentPilot.mentalWorkload > 80
                })}
                style={{ width: `${currentPilot.mentalWorkload}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className="eeg-wave h-8 w-1"
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    backgroundColor: i % 2 === 0 ? '#4CAF50' : '#D4AF37'
                  }}
                ></div>
              ))}
            </div>
            
            <div className="text-sm">
              {currentPilot.eegStatus === 'critical' && (
                <div className="text-eeg-red font-medium animate-blink flex items-center">
                  <Shield className="w-4 h-4 ltr:mr-1 rtl:ml-1" /> {t('autopilot.engaged')}
                </div>
              )}
              {currentPilot.eegStatus === 'warning' && currentPilot.mentalWorkload > 75 && (
                <div className="text-eeg-yellow font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 ltr:mr-1 rtl:ml-1" /> {t('assist.ready')}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      <div className="mt-3 pt-2 border-t border-border/10 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <div>{t('updated')}: {currentPilot?.lastUpdate.toLocaleTimeString()}</div>
          <div className="flex items-center">
            <Shield className="w-3 h-3 ltr:mr-1 rtl:ml-1 text-egypt-gold" />
            <span>{t('cortex.secure')} v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EEGMonitor;
