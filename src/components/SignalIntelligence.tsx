
import React, { useState, useEffect } from 'react';
import { Signal, Radar, Satellite } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SignalData {
  id: string;
  source: string;
  type: 'radio' | 'radar' | 'satellite' | 'datalink';
  frequency: string;
  strength: number;
  encrypted: boolean;
  intercepted: boolean;
  timestamp: Date;
}

interface SignalIntelligenceProps {
  className?: string;
}

const SignalIntelligence: React.FC<SignalIntelligenceProps> = ({ className }) => {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  useEffect(() => {
    // Initial signals
    const initialSignals: SignalData[] = [
      { 
        id: '1', 
        source: 'Enemy Fighter', 
        type: 'radar', 
        frequency: '10.5 GHz', 
        strength: 85, 
        encrypted: true, 
        intercepted: true,
        timestamp: new Date(Date.now() - 1000 * 60)
      },
      { 
        id: '2', 
        source: 'Ground SAM', 
        type: 'radio', 
        frequency: '350 MHz', 
        strength: 45, 
        encrypted: true, 
        intercepted: false,
        timestamp: new Date(Date.now() - 1000 * 120)
      },
      { 
        id: '3', 
        source: 'E2C AWACS', 
        type: 'datalink', 
        frequency: '1.2 GHz', 
        strength: 90, 
        encrypted: true, 
        intercepted: true,
        timestamp: new Date(Date.now() - 1000 * 30)
      },
      { 
        id: '4', 
        source: 'CyberOps Unit', 
        type: 'satellite', 
        frequency: '3.7 GHz', 
        strength: 60, 
        encrypted: true, 
        intercepted: true,
        timestamp: new Date()
      },
    ];
    
    setSignals(initialSignals);
    
    // Simulate new signal detections
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newSignal: SignalData = {
          id: Date.now().toString(),
          source: getRandomSource(),
          type: getRandomType(),
          frequency: getRandomFrequency(),
          strength: Math.floor(Math.random() * 100),
          encrypted: Math.random() > 0.3,
          intercepted: Math.random() > 0.5,
          timestamp: new Date()
        };
        
        setSignals(prev => [newSignal, ...prev].slice(0, 8));
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getRandomSource = () => {
    const sources = ['Enemy Fighter', 'Ground SAM', 'E2C AWACS', 'CyberOps Unit', 'Transport', 'Unknown', 'Allied Comms'];
    return sources[Math.floor(Math.random() * sources.length)];
  };
  
  const getRandomType = () => {
    const types: ('radio' | 'radar' | 'satellite' | 'datalink')[] = ['radio', 'radar', 'satellite', 'datalink'];
    return types[Math.floor(Math.random() * types.length)];
  };
  
  const getRandomFrequency = () => {
    const bands = ['MHz', 'GHz'];
    const value = (Math.random() * 10).toFixed(1);
    const band = bands[Math.floor(Math.random() * bands.length)];
    return `${value} ${band}`;
  };
  
  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'radar':
        return <Radar className="w-4 h-4" />;
      case 'satellite':
        return <Satellite className="w-4 h-4" />;
      default:
        return <Signal className="w-4 h-4" />;
    }
  };
  
  const getSignalStrengthColor = (strength: number) => {
    if (strength > 70) return 'bg-eeg-green';
    if (strength > 40) return 'bg-eeg-yellow';
    return 'bg-eeg-red';
  };
  
  const filteredSignals = activeFilter === 'all' 
    ? signals 
    : signals.filter(signal => signal.type === activeFilter);
  
  return (
    <div className={cn("glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium">Signal Intelligence</h3>
        <div className="ml-auto flex space-x-2">
          <button 
            className={cn("text-xs px-2 py-1 rounded", 
              activeFilter === 'all' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={cn("text-xs px-2 py-1 rounded", 
              activeFilter === 'radar' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}
            onClick={() => setActiveFilter('radar')}
          >
            Radar
          </button>
          <button 
            className={cn("text-xs px-2 py-1 rounded", 
              activeFilter === 'radio' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}
            onClick={() => setActiveFilter('radio')}
          >
            Radio
          </button>
          <button 
            className={cn("text-xs px-2 py-1 rounded", 
              activeFilter === 'datalink' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}
            onClick={() => setActiveFilter('datalink')}
          >
            Datalink
          </button>
        </div>
      </div>
      
      <div className="p-4 h-[240px] overflow-y-auto">
        {filteredSignals.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No signals detected
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSignals.map((signal) => (
              <div 
                key={signal.id} 
                className={cn(
                  "p-3 bg-radar-bg rounded-md border-l-2 animate-fade-in",
                  signal.intercepted ? "border-l-eeg-green" : "border-l-muted-foreground"
                )}
              >
                <div className="flex justify-between mb-1">
                  <div className="flex items-center text-sm font-medium">
                    {getSignalIcon(signal.type)}
                    <span className="ml-2">{signal.source}</span>
                    {signal.encrypted && (
                      <span className="ml-2 text-xs bg-muted px-1 py-0.5 rounded">ENCRYPTED</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {signal.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Freq:</span> {signal.frequency}
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">Signal:</span>
                    <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full", getSignalStrengthColor(signal.strength))}
                        style={{ width: `${signal.strength}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalIntelligence;
