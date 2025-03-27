
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface EEGMonitorProps {
  className?: string;
}

const EEGMonitor: React.FC<EEGMonitorProps> = ({ className }) => {
  const [eegStatus, setEegStatus] = useState<'normal' | 'warning' | 'critical'>('normal');
  const [eegValue, setEegValue] = useState(98);
  const [connected, setConnected] = useState(true);
  
  // Simulate EEG readings
  useEffect(() => {
    const interval = setInterval(() => {
      // Random fluctuation
      const randomChange = Math.random() * 5 - 2.5;
      const newValue = Math.max(10, Math.min(100, eegValue + randomChange));
      setEegValue(Math.round(newValue));
      
      // Set status based on value
      if (newValue < 60) {
        setEegStatus('critical');
      } else if (newValue < 80) {
        setEegStatus('warning');
      } else {
        setEegStatus('normal');
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [eegValue]);
  
  const getStatusColor = () => {
    switch (eegStatus) {
      case 'critical':
        return 'bg-eeg-red';
      case 'warning':
        return 'bg-eeg-yellow';
      default:
        return 'bg-eeg-green';
    }
  };
  
  return (
    <div className={cn("glassmorphism p-5", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className={cn("w-3 h-3 rounded-full animate-pulse-subtle", getStatusColor())}></div>
          <h3 className="text-lg font-medium">EEG Status</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          EMOTIV INSIGHT {connected ? 
            <span className="text-eeg-green">● CONNECTED</span> : 
            <span className="text-eeg-red animate-blink">● DISCONNECTED</span>}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm">Consciousness Level</span>
          <span className={cn("text-sm font-medium", {
            "text-eeg-green": eegStatus === 'normal',
            "text-eeg-yellow": eegStatus === 'warning',
            "text-eeg-red": eegStatus === 'critical'
          })}>{eegValue}%</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500 ease-out", {
              "bg-eeg-green": eegStatus === 'normal',
              "bg-eeg-yellow": eegStatus === 'warning',
              "bg-eeg-red": eegStatus === 'critical'
            })}
            style={{ width: `${eegValue}%` }}
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
          {eegStatus === 'critical' && (
            <div className="text-eeg-red font-medium animate-blink">
              AUTOPILOT ENGAGED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EEGMonitor;
