
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Search, Plane, Shield, Flag, Radar, Radio, Cpu, AlertTriangle } from 'lucide-react';

interface RadarTarget {
  id: string;
  type: 'ally' | 'enemy' | 'neutral' | 'ground' | 'cyber' | 'awacs' | 'air-defense' | 'e2c';
  distance: number; // 0-100, percentage of radar radius
  angle: number; // 0-360 degrees
  callsign: string;
  locked?: boolean;
  altitude?: number;
  speed?: number;
  threatLevel?: 'low' | 'medium' | 'high' | 'critical';
  ecm?: boolean; // Electronic Counter Measures
  formation?: string;
  status?: 'active' | 'damaged' | 'returning';
}

interface TacticalRadarProps {
  className?: string;
}

const TacticalRadar: React.FC<TacticalRadarProps> = ({ className }) => {
  const [targets, setTargets] = useState<RadarTarget[]>([]);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<RadarTarget | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'air' | 'ground' | 'naval' | 'cyber'>('all');
  const [range, setRange] = useState<'short' | 'medium' | 'long'>('medium');
  const [threats, setThreats] = useState<{total: number, critical: number}>({total: 0, critical: 0});
  const [jammingDetected, setJammingDetected] = useState(false);
  
  // Simulate radar sweep
  useEffect(() => {
    const sweepInterval = setInterval(() => {
      setSweepAngle(prev => (prev + 5) % 360);
      
      // Random jamming detection
      if (Math.random() > 0.97) {
        setJammingDetected(true);
        setTimeout(() => setJammingDetected(false), 3000);
      }
    }, 50);
    
    return () => clearInterval(sweepInterval);
  }, []);
  
  // Initialize and update radar targets
  useEffect(() => {
    // Initial targets - expanded with more Egyptian-themed callsigns
    const initialTargets: RadarTarget[] = [
      // Allied aircraft
      { id: '1', type: 'ally', distance: 25, angle: 45, callsign: 'EAGLE-1', altitude: 32000, speed: 550, status: 'active' },
      { id: '2', type: 'ally', distance: 30, angle: 90, callsign: 'EAGLE-2', altitude: 30000, speed: 520, status: 'active' },
      { id: '3', type: 'ally', distance: 35, angle: 75, callsign: 'HORUS-1', altitude: 28000, speed: 480, formation: 'Delta', status: 'active' },
      { id: '4', type: 'ally', distance: 38, angle: 78, callsign: 'HORUS-2', altitude: 28500, speed: 485, formation: 'Delta', status: 'active' },
      { id: '5', type: 'ally', distance: 37, angle: 72, callsign: 'HORUS-3', altitude: 29000, speed: 490, formation: 'Delta', status: 'active' },
      { id: '6', type: 'ally', distance: 40, angle: 120, callsign: 'ANUBIS-1', altitude: 25000, speed: 600, ecm: true, status: 'active' },
      
      // Enemy aircraft
      { id: '7', type: 'enemy', distance: 60, angle: 180, callsign: 'BANDIT-1', locked: true, altitude: 28000, speed: 620, threatLevel: 'high', status: 'active' },
      { id: '8', type: 'enemy', distance: 70, angle: 200, callsign: 'BANDIT-2', altitude: 35000, speed: 590, threatLevel: 'medium', status: 'active' },
      { id: '9', type: 'enemy', distance: 65, angle: 190, callsign: 'BANDIT-3', altitude: 30000, speed: 600, threatLevel: 'medium', status: 'active' },
      { id: '10', type: 'enemy', distance: 78, angle: 220, callsign: 'COBRA-1', altitude: 40000, speed: 700, threatLevel: 'critical', ecm: true, status: 'active' },
      { id: '11', type: 'enemy', distance: 75, angle: 210, callsign: 'JACKAL-1', altitude: 28000, speed: 550, threatLevel: 'high', status: 'active' },
      
      // Neutral aircraft
      { id: '12', type: 'neutral', distance: 50, angle: 270, callsign: 'CIVILIAN-1', altitude: 40000, speed: 450, status: 'active' },
      { id: '13', type: 'neutral', distance: 55, angle: 280, callsign: 'CIVILIAN-2', altitude: 38000, speed: 470, status: 'active' },
      
      // Ground units
      { id: '14', type: 'ground', distance: 45, angle: 120, callsign: 'SAM-SITE-1', threatLevel: 'high' },
      { id: '15', type: 'ground', distance: 55, angle: 150, callsign: 'ARTILLERY-1', threatLevel: 'medium' },
      { id: '16', type: 'ground', distance: 48, angle: 135, callsign: 'INFANTRY-1' },
      { id: '17', type: 'ground', distance: 42, angle: 110, callsign: 'TANK-DIV-1', threatLevel: 'medium' },
      { id: '18', type: 'ground', distance: 44, angle: 115, callsign: 'ARMORED-1', threatLevel: 'medium' },
      
      // Air defense
      { id: '19', type: 'air-defense', distance: 35, angle: 100, callsign: 'DEFENDER-1', threatLevel: 'high' },
      { id: '20', type: 'air-defense', distance: 40, angle: 130, callsign: 'SHIELD-1', threatLevel: 'high' },
      
      // Special units
      { id: '21', type: 'cyber', distance: 80, angle: 320, callsign: 'CYBER-1', altitude: 42000, speed: 480, ecm: true, status: 'active' },
      { id: '22', type: 'awacs', distance: 40, angle: 10, callsign: 'SENTINEL', altitude: 38000, speed: 450, status: 'active' },
      { id: '23', type: 'e2c', distance: 35, angle: 15, callsign: 'PHARAOH-EYE', altitude: 35000, speed: 420, status: 'active' },
    ];
    
    setTargets(initialTargets);
    
    // Update target positions periodically
    const updateInterval = setInterval(() => {
      setTargets(prevTargets => 
        prevTargets.map(target => {
          // Movement logic based on type
          let distanceChange = 0;
          let angleChange = 0;
          
          if (target.type === 'ally' || target.type === 'enemy' || target.type === 'neutral' || 
              target.type === 'cyber' || target.type === 'awacs' || target.type === 'e2c') {
            // Aircraft move faster and more erratically
            distanceChange = (Math.random() * 4 - 2) * (range === 'short' ? 2 : range === 'long' ? 0.5 : 1);
            angleChange = (Math.random() * 10 - 5) * (range === 'short' ? 2 : range === 'long' ? 0.5 : 1);
          } else {
            // Ground units move slower
            distanceChange = (Math.random() * 2 - 1) * (range === 'short' ? 2 : range === 'long' ? 0.5 : 1);
            angleChange = (Math.random() * 4 - 2) * (range === 'short' ? 2 : range === 'long' ? 0.5 : 1);
          }
          
          // Units in formation move together
          if (target.formation && target.formation === 'Delta') {
            const leader = prevTargets.find(t => t.callsign === 'HORUS-1');
            if (leader && target.callsign !== 'HORUS-1') {
              const formationOffset = target.callsign === 'HORUS-2' ? 3 : 6;
              return {
                ...target,
                distance: leader.distance + formationOffset,
                angle: (leader.angle + (target.callsign === 'HORUS-2' ? 3 : -3)) % 360,
                locked: target.type === 'enemy' ? Math.random() > 0.7 : undefined,
                altitude: leader.altitude ? leader.altitude + (Math.random() * 1000 - 500) : undefined,
                speed: leader.speed ? leader.speed + (Math.random() * 20 - 10) : undefined
              };
            }
          }
          
          return {
            ...target,
            distance: Math.max(5, Math.min(95, target.distance + distanceChange)),
            angle: (target.angle + angleChange) % 360,
            locked: target.type === 'enemy' ? Math.random() > 0.7 : undefined,
            // Update other dynamic properties
            altitude: target.altitude ? target.altitude + (Math.random() * 500 - 250) : undefined,
            speed: target.speed ? target.speed + (Math.random() * 20 - 10) : undefined,
            // Randomly change threat level
            threatLevel: target.threatLevel ? (Math.random() > 0.9 ? 
              ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical' 
              : target.threatLevel) : undefined,
            // ECM can toggle
            ecm: target.ecm ? Math.random() > 0.1 : Math.random() > 0.95
          };
        })
      );
      
      // Random chance to add new target
      if (Math.random() > 0.85 && targets.length < 40) {
        const newTarget: RadarTarget = {
          id: Date.now().toString(),
          type: getRandomTargetType(),
          distance: 90 + Math.random() * 5,
          angle: Math.random() * 360,
          callsign: getRandomCallsign(),
          altitude: Math.random() > 0.4 ? Math.floor(Math.random() * 45000 + 5000) : undefined,
          speed: Math.random() > 0.4 ? Math.floor(Math.random() * 700 + 300) : undefined,
          threatLevel: Math.random() > 0.7 ? 
            ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical' 
            : undefined,
          ecm: Math.random() > 0.9,
          status: 'active'
        };
        
        setTargets(prev => [...prev, newTarget]);
      }
      
      // Random chance to remove a target
      if (Math.random() > 0.9 && targets.length > 20) {
        setTargets(prev => prev.filter((_, i) => i !== Math.floor(Math.random() * prev.length)));
      }
      
      // Count threats
      const threatTargets = targets.filter(t => t.threatLevel === 'high' || t.threatLevel === 'critical').length;
      const criticalThreats = targets.filter(t => t.threatLevel === 'critical').length;
      setThreats({total: threatTargets, critical: criticalThreats});
      
    }, 2000);
    
    return () => clearInterval(updateInterval);
  }, [targets.length, range]);
  
  const getRandomTargetType = (): 'ally' | 'enemy' | 'neutral' | 'ground' | 'cyber' | 'awacs' | 'air-defense' | 'e2c' => {
    const types: ('ally' | 'enemy' | 'neutral' | 'ground' | 'cyber' | 'awacs' | 'air-defense' | 'e2c')[] = 
      ['ally', 'enemy', 'neutral', 'ground', 'cyber', 'awacs', 'air-defense', 'e2c'];
    const weights = [0.25, 0.25, 0.15, 0.15, 0.05, 0.05, 0.05, 0.05];
    
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
      'ally': ['EAGLE', 'HORUS', 'ANUBIS', 'SPHINX', 'PHARAOH', 'NILE'],
      'enemy': ['BANDIT', 'COBRA', 'JACKAL', 'SCORPION', 'VIPER'],
      'neutral': ['CIVILIAN', 'TRANSPORT', 'CARGO'],
      'ground': ['INFANTRY', 'TANK', 'ARTILLERY', 'ARMORED'],
      'cyber': ['CYBER', 'GHOST', 'SHADOW'],
      'awacs': ['SENTINEL', 'WATCHER', 'OVERSEER'],
      'air-defense': ['DEFENDER', 'SHIELD', 'WALL', 'BASTION'],
      'e2c': ['PHARAOH-EYE', 'PYRAMID', 'FALCON-EYE']
    };
    
    const type = getRandomTargetType();
    const prefix = prefixes[type][Math.floor(Math.random() * prefixes[type].length)];
    return `${prefix}-${Math.floor(Math.random() * 100)}`;
  };
  
  const getTargetColor = (type: string, locked?: boolean, ecm?: boolean) => {
    if (ecm) return "bg-egypt-blue animate-pulse-subtle";
    if (type === 'ally') return 'bg-ally';
    if (type === 'enemy') return locked ? 'bg-eeg-red animate-pulse-subtle' : 'bg-enemy';
    if (type === 'neutral') return 'bg-neutral';
    if (type === 'ground') return 'bg-eeg-yellow';
    if (type === 'cyber') return 'bg-primary';
    if (type === 'awacs' || type === 'e2c') return 'bg-eeg-green';
    if (type === 'air-defense') return 'bg-egypt-red';
    return 'bg-neutral';
  };
  
  const getTargetIcon = (type: string) => {
    switch(type) {
      case 'ally':
      case 'enemy':
      case 'neutral':
      case 'awacs':
      case 'e2c':
        return <Plane className="h-3 w-3" />;
      case 'ground':
        return <Flag className="h-3 w-3" />;
      case 'air-defense':
        return <Shield className="h-3 w-3" />;
      case 'cyber':
        return <Cpu className="h-3 w-3" />;
      default:
        return <Radar className="h-3 w-3" />;
    }
  };
  
  const getTargetPosition = (distance: number, angle: number) => {
    const radius = 50; // Percentage of the container
    const angleInRadians = (angle - 90) * (Math.PI / 180);
    const x = 50 + distance * Math.cos(angleInRadians);
    const y = 50 + distance * Math.sin(angleInRadians);
    return { x, y };
  };
  
  const getThreatIndicator = (threatLevel?: 'low' | 'medium' | 'high' | 'critical') => {
    if (!threatLevel) return null;
    
    const color = threatLevel === 'low' ? 'bg-eeg-green' :
                 threatLevel === 'medium' ? 'bg-eeg-yellow' :
                 threatLevel === 'high' ? 'bg-enemy' : 'bg-eeg-red';
                 
    const animation = threatLevel === 'critical' ? 'animate-pulse-subtle' : '';
    
    return (
      <div className={`ml-1 w-2 h-2 rounded-full ${color} ${animation}`}></div>
    );
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
    if (viewMode === 'air' && !['ally', 'enemy', 'neutral', 'awacs', 'e2c'].includes(target.type)) return false;
    if (viewMode === 'ground' && !['ground', 'air-defense'].includes(target.type)) return false;
    if (viewMode === 'naval' && target.type !== 'naval') return false;
    if (viewMode === 'cyber' && target.type !== 'cyber') return false;
    
    return true;
  });
  
  return (
    <div className={cn("egypt-glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="egypt-header">Tactical Radar</h3>
        <div className="text-sm text-muted-foreground ml-auto flex items-center space-x-2">
          <div className="flex bg-radar-bg rounded-md overflow-hidden">
            <button 
              className={cn("px-2 py-1 text-xs", viewMode === 'all' ? "bg-egypt-gold/70" : "")}
              onClick={() => setViewMode('all')}
            >
              ALL
            </button>
            <button 
              className={cn("px-2 py-1 text-xs", viewMode === 'air' ? "bg-egypt-gold/70" : "")}
              onClick={() => setViewMode('air')}
            >
              AIR
            </button>
            <button 
              className={cn("px-2 py-1 text-xs", viewMode === 'ground' ? "bg-egypt-gold/70" : "")}
              onClick={() => setViewMode('ground')}
            >
              GROUND
            </button>
            <button 
              className={cn("px-2 py-1 text-xs", viewMode === 'cyber' ? "bg-egypt-gold/70" : "")}
              onClick={() => setViewMode('cyber')}
            >
              CYBER
            </button>
          </div>
          <div className="flex bg-radar-bg rounded-md overflow-hidden">
            <button 
              className={cn("px-2 py-1 text-xs", range === 'short' ? "bg-egypt-gold/70" : "")}
              onClick={() => setRange('short')}
            >
              SHORT
            </button>
            <button 
              className={cn("px-2 py-1 text-xs", range === 'medium' ? "bg-egypt-gold/70" : "")}
              onClick={() => setRange('medium')}
            >
              MED
            </button>
            <button 
              className={cn("px-2 py-1 text-xs", range === 'long' ? "bg-egypt-gold/70" : "")}
              onClick={() => setRange('long')}
            >
              LONG
            </button>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1 bg-radar-bg border-none text-xs w-28 rounded-md focus:outline-none focus:ring-1 focus:ring-egypt-gold"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative aspect-square w-full md:w-3/4">
          <div className="absolute inset-0 rounded-full border border-egypt-gold/20 bg-radar-bg overflow-hidden">
            {/* Radar rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/5 h-1/5 rounded-full border border-egypt-gold/20 opacity-50"></div>
              <div className="w-2/5 h-2/5 rounded-full border border-egypt-gold/20 opacity-50"></div>
              <div className="w-3/5 h-3/5 rounded-full border border-egypt-gold/20 opacity-50"></div>
              <div className="w-4/5 h-4/5 rounded-full border border-egypt-gold/20 opacity-50"></div>
            </div>
            
            {/* Radar crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-egypt-gold/20 opacity-30"></div>
              <div className="w-px h-full bg-egypt-gold/20 opacity-30"></div>
              <div className="w-full h-full">
                <div className="absolute top-1/2 left-1/2 w-full h-px bg-egypt-gold/20 opacity-30 origin-center rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-px bg-egypt-gold/20 opacity-30 origin-center -rotate-45"></div>
              </div>
            </div>
            
            {/* Radar sweep */}
            <div 
              className="radar-sweep"
              style={{ transform: `rotate(${sweepAngle}deg)` }}
            ></div>
            
            {/* Radar center */}
            <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-egypt-gold transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Targets */}
            {filteredTargets.map((target) => {
              const { x, y } = getTargetPosition(target.distance, target.angle);
              return (
                <div 
                  key={target.id}
                  className={cn(
                    "absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10", 
                    getTargetColor(target.type, target.locked, target.ecm),
                    target.id === selectedTarget?.id ? "ring-2 ring-egypt-gold" : ""
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
                  {target.ecm && (
                    <div className="absolute -inset-2 border border-egypt-blue/50 rounded-full animate-ping-slow"></div>
                  )}
                  <div className="absolute top-3 left-3 text-xs whitespace-nowrap flex items-center">
                    {target.callsign}
                    {target.locked && <span className="ml-1 text-eeg-red animate-blink">[LOCKED]</span>}
                    {target.ecm && <span className="ml-1 text-egypt-blue">[ECM]</span>}
                  </div>
                </div>
              );
            })}
            
            {/* Jamming effect overlay */}
            {jammingDetected && (
              <div className="absolute inset-0 bg-enemy/5 flex items-center justify-center">
                <div className="bg-background/80 px-2 py-1 rounded flex items-center text-enemy animate-pulse-subtle">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs font-semibold">JAMMING DETECTED</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-1/4 bg-radar-bg rounded-md p-2 text-xs h-full overflow-y-auto">
          {selectedTarget ? (
            <div>
              <h4 className="mb-2 font-medium border-b border-egypt-gold/20 pb-1 text-egypt-gold flex items-center justify-between">
                <span>{selectedTarget.callsign}</span>
                <div className="flex items-center">
                  {getThreatIndicator(selectedTarget.threatLevel)}
                  {selectedTarget.ecm && (
                    <span className="ml-1 px-1 text-[8px] bg-egypt-blue/30 rounded">ECM</span>
                  )}
                </div>
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <div className="flex items-center">
                    {getTargetIcon(selectedTarget.type)}
                    <span className="ml-1 uppercase">{selectedTarget.type}</span>
                  </div>
                </div>
                {selectedTarget.altitude && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Altitude:</span>
                    <span>{selectedTarget.altitude.toLocaleString()} ft</span>
                  </div>
                )}
                {selectedTarget.speed && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Speed:</span>
                    <span>{selectedTarget.speed} kts</span>
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
                {selectedTarget.threatLevel && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Threat:</span>
                    <span className={
                      selectedTarget.threatLevel === 'low' ? 'text-eeg-green' :
                      selectedTarget.threatLevel === 'medium' ? 'text-eeg-yellow' :
                      selectedTarget.threatLevel === 'high' ? 'text-enemy' : 'text-eeg-red'
                    }>
                      {selectedTarget.threatLevel.toUpperCase()}
                    </span>
                  </div>
                )}
                {selectedTarget.formation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Formation:</span>
                    <span>{selectedTarget.formation}</span>
                  </div>
                )}
                {selectedTarget.status && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={
                      selectedTarget.status === 'active' ? 'text-eeg-green' :
                      selectedTarget.status === 'damaged' ? 'text-eeg-yellow' : 'text-enemy'
                    }>
                      {selectedTarget.status.toUpperCase()}
                    </span>
                  </div>
                )}
                {selectedTarget.locked && (
                  <div className="mt-2 bg-eeg-red/20 p-1 rounded text-eeg-red text-center animate-pulse-subtle">
                    TARGET LOCKED
                  </div>
                )}
                {selectedTarget.ecm && (
                  <div className="mt-2 bg-egypt-blue/20 p-1 rounded text-egypt-blue text-center">
                    ECM ACTIVE
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
              <div>Select a target for details</div>
              {threats.total > 0 && (
                <div className="mt-2 text-egypt-red font-medium">
                  {threats.total} threat{threats.total !== 1 ? 's' : ''} detected
                  {threats.critical > 0 && (
                    <span className="block animate-pulse-subtle">
                      {threats.critical} critical
                    </span>
                  )}
                </div>
              )}
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
              <span className="block w-2 h-2 rounded-full bg-egypt-red mr-1"></span>
              <span>Defense</span>
            </div>
            <div className="flex items-center">
              <span className="block w-2 h-2 rounded-full bg-eeg-green mr-1"></span>
              <span>AWACS</span>
            </div>
            <div className="flex items-center">
              <span className="block w-2 h-2 rounded-full bg-primary mr-1"></span>
              <span>Cyber</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalRadar;
