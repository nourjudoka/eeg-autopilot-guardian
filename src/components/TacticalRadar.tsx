
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Search, Plane } from 'lucide-react';

interface RadarTarget {
  id: string;
  type: 'ally' | 'enemy' | 'neutral' | 'ground' | 'cyber' | 'awacs';
  distance: number; // 0-100, percentage of radar radius
  angle: number; // 0-360 degrees
  callsign: string;
  locked?: boolean;
  altitude?: number;
}

interface TacticalRadarProps {
  className?: string;
}

const TacticalRadar: React.FC<TacticalRadarProps> = ({ className }) => {
  const [targets, setTargets] = useState<RadarTarget[]>([]);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<RadarTarget | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'air' | 'ground'>('all');
  
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
      { id: '1', type: 'ally', distance: 25, angle: 45, callsign: 'EAGLE-1', altitude: 32000 },
      { id: '2', type: 'ally', distance: 30, angle: 90, callsign: 'EAGLE-2', altitude: 30000 },
      { id: '3', type: 'enemy', distance: 60, angle: 180, callsign: 'BANDIT-1', locked: true, altitude: 28000 },
      { id: '4', type: 'enemy', distance: 70, angle: 200, callsign: 'BANDIT-2', altitude: 35000 },
      { id: '5', type: 'neutral', distance: 50, angle: 270, callsign: 'CIVILIAN-1', altitude: 40000 },
      { id: '6', type: 'ground', distance: 45, angle: 120, callsign: 'SAM-SITE-1' },
      { id: '7', type: 'ground', distance: 55, angle: 150, callsign: 'ARTILLERY-1' },
      { id: '8', type: 'cyber', distance: 80, angle: 320, callsign: 'CYBER-1', altitude: 42000 },
      { id: '9', type: 'awacs', distance: 40, angle: 10, callsign: 'E2C-SENTINEL', altitude: 38000 },
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
      if (Math.random() > 0.9 && targets.length < 15) {
        const newTarget: RadarTarget = {
          id: Date.now().toString(),
          type: getRandomTargetType(),
          distance: 90 + Math.random() * 5,
          angle: Math.random() * 360,
          callsign: getRandomCallsign(),
          altitude: Math.floor(Math.random() * 45000 + 5000)
        };
        
        setTargets(prev => [...prev, newTarget]);
      }
      
      // Random chance to remove a target
      if (Math.random() > 0.95 && targets.length > 8) {
        setTargets(prev => prev.filter((_, i) => i !== Math.floor(Math.random() * prev.length)));
      }
    }, 2000);
    
    return () => clearInterval(updateInterval);
  }, [targets.length]);
  
  const getRandomTargetType = (): 'ally' | 'enemy' | 'neutral' | 'ground' | 'cyber' | 'awacs' => {
    const types: ('ally' | 'enemy' | 'neutral' | 'ground' | 'cyber' | 'awacs')[] = 
      ['ally', 'enemy', 'neutral', 'ground', 'cyber', 'awacs'];
    const weights = [0.3, 0.3, 0.2, 0.1, 0.05, 0.05];
    
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) return types[i];
    }
    
    return 'enemy';
  };
  
  const getRandomCallsign = () => {
    const prefixes = {
      'ally': 'EAGLE',
      'enemy': 'BANDIT',
      'neutral': 'CIVILIAN',
      'ground': 'SITE',
      'cyber': 'CYBER',
      'awacs': 'E2C'
    };
    
    const type = getRandomTargetType();
    return `${prefixes[type]}-${Math.floor(Math.random() * 10)}`;
  };
  
  const getTargetColor = (type: 'ally' | 'enemy' | 'neutral' | 'ground' | 'cyber' | 'awacs', locked?: boolean) => {
    if (type === 'ally') return 'bg-ally';
    if (type === 'enemy') return locked ? 'bg-eeg-red animate-pulse-subtle' : 'bg-enemy';
    if (type === 'neutral') return 'bg-neutral';
    if (type === 'ground') return 'bg-eeg-yellow';
    if (type === 'cyber') return 'bg-primary';
    if (type === 'awacs') return 'bg-eeg-green';
    return 'bg-neutral';
  };
  
  const getTargetPosition = (distance: number, angle: number) => {
    const radius = 50; // Percentage of the container
    const angleInRadians = (angle - 90) * (Math.PI / 180);
    const x = 50 + distance * Math.cos(angleInRadians);
    const y = 50 + distance * Math.sin(angleInRadians);
    return { x, y };
  };
  
  const handleTargetClick = (target: RadarTarget) => {
    setSelectedTarget(target);
  };
  
  const filteredTargets = targets.filter(target => {
    // Filter by search query
    if (searchQuery && !target.callsign.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by view mode
    if (viewMode === 'air' && target.type === 'ground') return false;
    if (viewMode === 'ground' && target.type !== 'ground') return false;
    
    return true;
  });
  
  return (
    <div className={cn("glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium">Tactical Radar</h3>
        <div className="text-sm text-muted-foreground ml-auto flex items-center space-x-2">
          <div className="flex bg-radar-bg rounded-md overflow-hidden">
            <button 
              className={cn("px-2 py-1 text-xs", viewMode === 'all' ? "bg-primary" : "")}
              onClick={() => setViewMode('all')}
            >
              ALL
            </button>
            <button 
              className={cn("px-2 py-1 text-xs", viewMode === 'air' ? "bg-primary" : "")}
              onClick={() => setViewMode('air')}
            >
              AIR
            </button>
            <button 
              className={cn("px-2 py-1 text-xs", viewMode === 'ground' ? "bg-primary" : "")}
              onClick={() => setViewMode('ground')}
            >
              GROUND
            </button>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1 bg-radar-bg border-none text-xs w-28 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative aspect-square w-full md:w-3/4">
          <div className="absolute inset-0 rounded-full border border-glass-border bg-radar-bg overflow-hidden">
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
            {filteredTargets.map((target) => {
              const { x, y } = getTargetPosition(target.distance, target.angle);
              return (
                <div 
                  key={target.id}
                  className={cn("absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10", 
                    getTargetColor(target.type, target.locked),
                    target.id === selectedTarget?.id ? "ring-2 ring-white" : ""
                  )}
                  style={{ 
                    left: `${x}%`, 
                    top: `${y}%` 
                  }}
                  onClick={() => handleTargetClick(target)}
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
        
        <div className="md:w-1/4 bg-radar-bg rounded-md p-2 text-xs h-full overflow-y-auto">
          {selectedTarget ? (
            <div>
              <h4 className="mb-2 font-medium border-b border-glass-border pb-1">{selectedTarget.callsign}</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="uppercase">{selectedTarget.type}</span>
                </div>
                {selectedTarget.altitude && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Altitude:</span>
                    <span>{selectedTarget.altitude.toLocaleString()} ft</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance:</span>
                  <span>{Math.round(selectedTarget.distance)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bearing:</span>
                  <span>{Math.round(selectedTarget.angle)}°</span>
                </div>
                {selectedTarget.locked && (
                  <div className="mt-2 bg-eeg-red/20 p-1 rounded text-eeg-red text-center">
                    TARGET LOCKED
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground h-full flex items-center justify-center">
              Select a target for details
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="block w-2 h-2 rounded-full bg-ally mr-1"></span>
              <span>Ally</span>
            </div>
            <div className="flex items-center">
              <span className="block w-2 h-2 rounded-full bg-enemy mr-1"></span>
              <span>Enemy</span>
            </div>
            <div className="flex items-center">
              <span className="block w-2 h-2 rounded-full bg-neutral mr-1"></span>
              <span>Neutral</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="block w-2 h-2 rounded-full bg-eeg-yellow mr-1"></span>
              <span>Ground</span>
            </div>
            <div className="flex items-center">
              <span className="block w-2 h-2 rounded-full bg-primary mr-1"></span>
              <span>Cyber</span>
            </div>
            <div className="flex items-center">
              <span className="block w-2 h-2 rounded-full bg-eeg-green mr-1"></span>
              <span>E2C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalRadar;
