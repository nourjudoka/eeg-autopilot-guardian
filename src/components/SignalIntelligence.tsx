
import React, { useState, useEffect } from 'react';
import { Signal, Radar, Satellite, Radio, Waypoints, Waves, AlertTriangle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SignalData {
  id: string;
  source: string;
  type: 'radio' | 'radar' | 'satellite' | 'datalink';
  frequency: string;
  strength: number;
  encrypted: boolean;
  intercepted: boolean;
  timestamp: Date;
  artemisVerified?: boolean;
  threatLevel?: 'low' | 'medium' | 'high' | 'unknown';
  signalOrigin?: string;
  metadata?: string;
}

interface ArtemisSystem {
  status: 'connected' | 'disconnected' | 'initializing';
  lastSync: Date | null;
  activeChannels: number;
  detectionMode: 'passive' | 'active' | 'hybrid';
  availableBandwidths: string[];
  currentBandwidth: string;
}

interface SignalIntelligenceProps {
  className?: string;
}

const SignalIntelligence: React.FC<SignalIntelligenceProps> = ({ className }) => {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [artemisSystem, setArtemisSystem] = useState<ArtemisSystem>({
    status: 'disconnected',
    lastSync: null,
    activeChannels: 0,
    detectionMode: 'passive',
    availableBandwidths: ['UHF', 'VHF', 'SHF', 'EHF', 'Full Spectrum'],
    currentBandwidth: 'Full Spectrum'
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  
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
        timestamp: new Date(Date.now() - 1000 * 60),
        artemisVerified: false,
        threatLevel: 'high',
        signalOrigin: 'North Eastern Sector'
      },
      { 
        id: '2', 
        source: 'Ground SAM', 
        type: 'radio', 
        frequency: '350 MHz', 
        strength: 45, 
        encrypted: true, 
        intercepted: false,
        timestamp: new Date(Date.now() - 1000 * 120),
        artemisVerified: false,
        threatLevel: 'medium',
        signalOrigin: 'Sinai Region'
      },
      { 
        id: '3', 
        source: 'E2C AWACS', 
        type: 'datalink', 
        frequency: '1.2 GHz', 
        strength: 90, 
        encrypted: true, 
        intercepted: true,
        timestamp: new Date(Date.now() - 1000 * 30),
        artemisVerified: false,
        threatLevel: 'low',
        signalOrigin: 'Mediterranean Zone'
      },
      { 
        id: '4', 
        source: 'CyberOps Unit', 
        type: 'satellite', 
        frequency: '3.7 GHz', 
        strength: 60, 
        encrypted: true, 
        intercepted: true,
        timestamp: new Date(),
        artemisVerified: false,
        threatLevel: 'unknown',
        signalOrigin: 'Cairo Command'
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
          timestamp: new Date(),
          artemisVerified: artemisSystem.status === 'connected' ? Math.random() > 0.5 : false,
          threatLevel: getRandomThreatLevel(),
          signalOrigin: getRandomOrigin(),
          metadata: artemisSystem.status === 'connected' ? getMetadata() : undefined
        };
        
        setSignals(prev => [newSignal, ...prev].slice(0, 8));
        
        // When Artemis is connected and a high threat is detected, show toast alert
        if (artemisSystem.status === 'connected' && newSignal.threatLevel === 'high' && newSignal.artemisVerified) {
          toast({
            title: "High Threat Signal Detected",
            description: `Artemis has verified a high-threat signal from ${newSignal.source}`,
            variant: "destructive",
          });
        }
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [artemisSystem.status, toast]);
  
  const connectToArtemis = () => {
    setIsConnecting(true);
    
    // Simulate connection process
    toast({
      title: "Connecting to Artemis",
      description: "Initializing connection to Artemis Signal Intelligence System...",
    });
    
    setTimeout(() => {
      setArtemisSystem(prev => ({
        ...prev,
        status: 'initializing',
        lastSync: new Date(),
        activeChannels: 2
      }));
      
      // Simulate initialization process
      setTimeout(() => {
        setArtemisSystem(prev => ({
          ...prev,
          status: 'connected',
          activeChannels: 8
        }));
        
        // Update existing signals with Artemis verification
        setSignals(prev => prev.map(signal => ({
          ...signal,
          artemisVerified: Math.random() > 0.3,
          metadata: getMetadata()
        })));
        
        setIsConnecting(false);
        
        toast({
          title: "Artemis Connected",
          description: "Successfully connected to Artemis Signal Intelligence System.",
          variant: "default",
        });
      }, 2000);
    }, 2000);
  };
  
  const disconnectFromArtemis = () => {
    setArtemisSystem(prev => ({
      ...prev,
      status: 'disconnected',
      lastSync: new Date(),
      activeChannels: 0
    }));
    
    // Remove Artemis data from signals
    setSignals(prev => prev.map(signal => ({
      ...signal,
      artemisVerified: false,
      metadata: undefined
    })));
    
    toast({
      title: "Artemis Disconnected",
      description: "Connection to Artemis Signal Intelligence System terminated.",
    });
  };
  
  const changeDetectionMode = (mode: 'passive' | 'active' | 'hybrid') => {
    setArtemisSystem(prev => ({
      ...prev,
      detectionMode: mode
    }));
    
    toast({
      title: "Detection Mode Changed",
      description: `Artemis now operating in ${mode} mode.`,
    });
  };
  
  const changeBandwidth = (bandwidth: string) => {
    setArtemisSystem(prev => ({
      ...prev,
      currentBandwidth: bandwidth
    }));
    
    toast({
      title: "Bandwidth Changed",
      description: `Artemis now monitoring ${bandwidth} bandwidth.`,
    });
  };
  
  const getRandomSource = () => {
    const sources = ['Enemy Fighter', 'Ground SAM', 'E2C AWACS', 'CyberOps Unit', 'Transport', 'Unknown', 'Allied Comms', 'Civilian Vessel', 'UAV'];
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
  
  const getRandomThreatLevel = () => {
    const threatLevels: ('low' | 'medium' | 'high' | 'unknown')[] = ['low', 'medium', 'high', 'unknown'];
    return threatLevels[Math.floor(Math.random() * threatLevels.length)];
  };
  
  const getRandomOrigin = () => {
    const origins = ['North Eastern Sector', 'Sinai Region', 'Mediterranean Zone', 'Cairo Command', 'Western Desert', 'Libyan Border', 'Red Sea', 'Southern Sector'];
    return origins[Math.floor(Math.random() * origins.length)];
  };
  
  const getMetadata = () => {
    const metadata = [
      'Signal pattern matches known enemy communications',
      'Frequency hopping detected',
      'Signal strength suggests proximity',
      'Modulation pattern analysis indicates military origin',
      'Signal characteristics match database entry',
      'Unknown encryption algorithm detected',
      'Signal exhibits jamming characteristics'
    ];
    return metadata[Math.floor(Math.random() * metadata.length)];
  };
  
  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'radar':
        return <Radar className="w-4 h-4" />;
      case 'satellite':
        return <Satellite className="w-4 h-4" />;
      case 'datalink':
        return <Waypoints className="w-4 h-4" />;
      case 'radio':
        return <Radio className="w-4 h-4" />;
      default:
        return <Signal className="w-4 h-4" />;
    }
  };
  
  const getSignalStrengthColor = (strength: number) => {
    if (strength > 70) return 'bg-eeg-green';
    if (strength > 40) return 'bg-eeg-yellow';
    return 'bg-eeg-red';
  };
  
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-eeg-red';
      case 'medium':
        return 'text-eeg-yellow';
      case 'low':
        return 'text-eeg-green';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const filteredSignals = activeFilter === 'all' 
    ? signals 
    : signals.filter(signal => signal.type === activeFilter);
  
  return (
    <div className={cn("glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium flex items-center">
          <Signal className="mr-2 h-5 w-5" />
          Signal Intelligence
          {artemisSystem.status === 'connected' && (
            <span className="ml-2 text-xs bg-eeg-green px-1 py-0.5 rounded flex items-center">
              <Waves className="h-3 w-3 mr-1" />
              ARTEMIS ACTIVE
            </span>
          )}
        </h3>
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
      
      <div className="p-4 h-[240px] overflow-y-auto scrollbar-hide">
        {/* Artemis Control Panel */}
        <div className="mb-3 flex flex-wrap gap-2 items-center">
          {artemisSystem.status === 'disconnected' ? (
            <button 
              className="px-2 py-1 text-xs rounded bg-egypt-gold/70 text-black font-medium flex items-center"
              onClick={connectToArtemis}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect to Artemis'}
            </button>
          ) : (
            <>
              <button 
                className="px-2 py-1 text-xs rounded bg-radar-bg border border-border flex items-center"
                onClick={disconnectFromArtemis}
              >
                Disconnect
              </button>
              
              <div className="px-2 py-1 text-xs rounded bg-radar-bg flex items-center">
                <span className="mr-1">Mode:</span>
                <select 
                  className="bg-transparent border-none text-xs"
                  value={artemisSystem.detectionMode}
                  onChange={(e) => changeDetectionMode(e.target.value as 'passive' | 'active' | 'hybrid')}
                >
                  <option value="passive">Passive</option>
                  <option value="active">Active</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              
              <div className="px-2 py-1 text-xs rounded bg-radar-bg flex items-center">
                <span className="mr-1">Band:</span>
                <select 
                  className="bg-transparent border-none text-xs"
                  value={artemisSystem.currentBandwidth}
                  onChange={(e) => changeBandwidth(e.target.value)}
                >
                  {artemisSystem.availableBandwidths.map(band => (
                    <option key={band} value={band}>{band}</option>
                  ))}
                </select>
              </div>
              
              <div className="px-2 py-1 text-xs rounded bg-radar-bg flex items-center">
                <span className="text-eeg-green">{artemisSystem.activeChannels} channels</span>
              </div>
            </>
          )}
        </div>
      
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
                    {signal.artemisVerified && (
                      <span className="ml-2 text-xs bg-eeg-green/20 text-eeg-green px-1 py-0.5 rounded flex items-center">
                        <Waves className="h-3 w-3 mr-1" />
                        VERIFIED
                      </span>
                    )}
                    {signal.threatLevel && signal.artemisVerified && (
                      <span className={cn("ml-2 text-xs px-1 py-0.5 rounded flex items-center", 
                        signal.threatLevel === 'high' ? "bg-eeg-red/20" : 
                        signal.threatLevel === 'medium' ? "bg-eeg-yellow/20" : 
                        signal.threatLevel === 'low' ? "bg-eeg-green/20" : "bg-muted/20"
                      )}>
                        {signal.threatLevel === 'high' && <AlertTriangle className="h-3 w-3 mr-1 text-eeg-red" />}
                        <span className={getThreatLevelColor(signal.threatLevel)}>
                          {signal.threatLevel.toUpperCase()}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {signal.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Freq:</span> {signal.frequency}
                    {signal.signalOrigin && signal.artemisVerified && (
                      <span className="ml-2 text-xs text-egypt-gold">
                        {signal.signalOrigin}
                      </span>
                    )}
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
                
                {signal.metadata && signal.artemisVerified && (
                  <div className="mt-1 text-xs text-muted-foreground italic">
                    {signal.metadata}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalIntelligence;
