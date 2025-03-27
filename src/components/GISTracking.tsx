import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Map, Radar, Flag, Plane, Shield, Mountain, Radio, Volume2, VolumeX, Mic, MicOff, Compass, Navigation } from 'lucide-react';

interface Coordinate {
  lat: number;
  lng: number;
  elevation?: number;
}

interface Unit {
  id: string;
  type: 'aircraft' | 'ground' | 'defense' | 'naval';
  callsign: string;
  alliance: 'ally' | 'enemy' | 'neutral';
  position: Coordinate;
  heading: number;
  speed?: number;
  altitude?: number;
  terrain?: string;
  status?: 'active' | 'damaged' | 'returning' | 'engaging';
  mission?: string;
  commander?: string;
  communicationStatus?: 'available' | 'busy' | 'offline';
}

interface TerrainFeature {
  id: string;
  name: string;
  type: 'mountain' | 'desert' | 'urban' | 'water' | 'forest';
  coordinates: Coordinate[];
}

interface GISTrackingProps {
  className?: string;
}

const GISTracking: React.FC<GISTrackingProps> = ({ className }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinate>({ lat: 29.9773, lng: 31.1325 });
  const [mapZoom, setMapZoom] = useState(6);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAlliance, setFilterAlliance] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [terrainFeatures, setTerrainFeatures] = useState<TerrainFeature[]>([]);
  const [showTerrain, setShowTerrain] = useState(true);
  const [communicationActive, setCommunicationActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [communicationLog, setCommunicationLog] = useState<{time: string, sender: string, message: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const commLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateTerrainFeatures = () => {
      const features: TerrainFeature[] = [
        {
          id: 'mountains-1',
          name: 'Sinai Mountains',
          type: 'mountain',
          coordinates: [
            { lat: 28.5, lng: 33.9, elevation: 2000 },
            { lat: 29.2, lng: 34.1, elevation: 2200 },
            { lat: 28.9, lng: 34.5, elevation: 1800 },
            { lat: 28.3, lng: 34.2, elevation: 1600 },
          ]
        },
        {
          id: 'desert-1',
          name: 'Western Desert',
          type: 'desert',
          coordinates: [
            { lat: 28.0, lng: 26.0, elevation: 200 },
            { lat: 29.5, lng: 26.5, elevation: 220 },
            { lat: 29.0, lng: 28.0, elevation: 180 },
            { lat: 27.5, lng: 27.5, elevation: 190 },
          ]
        },
        {
          id: 'urban-1',
          name: 'Nile Delta',
          type: 'urban',
          coordinates: [
            { lat: 30.5, lng: 30.5, elevation: 20 },
            { lat: 31.2, lng: 31.2, elevation: 15 },
            { lat: 31.0, lng: 32.0, elevation: 10 },
            { lat: 30.3, lng: 31.5, elevation: 12 },
          ]
        },
        {
          id: 'water-1',
          name: 'Mediterranean Coast',
          type: 'water',
          coordinates: [
            { lat: 31.5, lng: 29.0, elevation: 0 },
            { lat: 31.8, lng: 31.0, elevation: 0 },
            { lat: 31.3, lng: 33.0, elevation: 0 },
            { lat: 31.0, lng: 29.5, elevation: 0 },
          ]
        },
        {
          id: 'water-2',
          name: 'Red Sea Coast',
          type: 'water',
          coordinates: [
            { lat: 27.0, lng: 33.8, elevation: 0 },
            { lat: 28.5, lng: 34.5, elevation: 0 },
            { lat: 25.0, lng: 35.0, elevation: 0 },
            { lat: 24.0, lng: 34.0, elevation: 0 },
          ]
        },
        {
          id: 'forest-1',
          name: 'Nile Valley',
          type: 'forest',
          coordinates: [
            { lat: 30.0, lng: 31.1, elevation: 10 },
            { lat: 29.0, lng: 31.2, elevation: 12 },
            { lat: 27.0, lng: 31.0, elevation: 15 },
            { lat: 28.0, lng: 30.8, elevation: 14 },
          ]
        },
        {
          id: 'urban-2',
          name: 'Alexandria',
          type: 'urban',
          coordinates: [
            { lat: 31.2, lng: 29.8, elevation: 5 },
            { lat: 31.3, lng: 30.0, elevation: 4 },
            { lat: 31.1, lng: 30.1, elevation: 3 },
            { lat: 31.0, lng: 29.9, elevation: 4 },
          ]
        },
        {
          id: 'urban-3',
          name: 'Cairo',
          type: 'urban',
          coordinates: [
            { lat: 30.0, lng: 31.2, elevation: 23 },
            { lat: 30.1, lng: 31.3, elevation: 21 },
            { lat: 29.9, lng: 31.4, elevation: 22 },
            { lat: 29.8, lng: 31.3, elevation: 20 },
          ]
        },
      ];
      
      setTerrainFeatures(features);
    };
    
    generateTerrainFeatures();
  }, []);

  useEffect(() => {
    const generateDummyData = () => {
      const unitTypes: ('aircraft' | 'ground' | 'defense' | 'naval')[] = ['aircraft', 'ground', 'defense', 'naval'];
      const allianceTypes: ('ally' | 'enemy' | 'neutral')[] = ['ally', 'enemy', 'neutral'];
      const aircraftCallsigns = ['EAGLE', 'FALCON', 'HORUS', 'ANUBIS', 'SPHINX', 'PHARAOH', 'NILE', 'PYRAMID', 'RAMSES', 'MUBARAK', 'SISI'];
      const groundCallsigns = ['DESERT', 'SCORPION', 'CHARIOT', 'OASIS', 'OSIRIS', 'SANDS', 'DUNE', 'NEFERTITI', 'GIZA', 'LUXOR'];
      const defenseCallsigns = ['SHIELD', 'GUARDIAN', 'FORTRESS', 'BASTION', 'RAMSES', 'WALL', 'CITADEL', 'BUNKER', 'BARRICADE'];
      const navalCallsigns = ['WAVE', 'DELTA', 'CURRENT', 'TIDE', 'SUEZ', 'ALEXANDRIA', 'PORT-SAID', 'DAMIETTA'];
      const terrainTypes = ['desert', 'urban', 'mountain', 'coastal', 'valley'];
      const missionTypes = ['patrol', 'reconnaissance', 'escort', 'interception', 'defense', 'strike'];
      const commanderNames = ['Col. Hassan', 'Gen. Mahmoud', 'Capt. Farid', 'Maj. Ibrahim', 'Lt. Col. Ahmed', 'Brig. Mostafa'];
      
      const egyptBounds = {
        minLat: 22.0, maxLat: 32.0,
        minLng: 24.0, maxLng: 36.0
      };
      
      const dummyUnits: Unit[] = [];
      
      for (let i = 0; i < 70; i++) {
        const type = unitTypes[Math.floor(Math.random() * unitTypes.length)];
        const alliance = allianceTypes[Math.floor(Math.random() * allianceTypes.length)];
        
        let callsignBase;
        if (type === 'aircraft') {
          callsignBase = aircraftCallsigns[Math.floor(Math.random() * aircraftCallsigns.length)];
        } else if (type === 'ground') {
          callsignBase = groundCallsigns[Math.floor(Math.random() * groundCallsigns.length)];
        } else if (type === 'defense') {
          callsignBase = defenseCallsigns[Math.floor(Math.random() * defenseCallsigns.length)];
        } else {
          callsignBase = navalCallsigns[Math.floor(Math.random() * navalCallsigns.length)];
        }
        
        const lat = egyptBounds.minLat + Math.random() * (egyptBounds.maxLat - egyptBounds.minLat);
        const lng = egyptBounds.minLng + Math.random() * (egyptBounds.maxLng - egyptBounds.minLng);
        
        const unit: Unit = {
          id: `${type}-${i}`,
          type,
          callsign: `${callsignBase}-${Math.floor(Math.random() * 100)}`,
          alliance,
          position: { 
            lat, 
            lng,
            elevation: type === 'aircraft' ? undefined : Math.floor(Math.random() * 500)
          },
          heading: Math.floor(Math.random() * 360),
          speed: type === 'aircraft' ? Math.floor(Math.random() * 600) + 200 : Math.floor(Math.random() * 80),
          altitude: type === 'aircraft' ? Math.floor(Math.random() * 40000) + 5000 : undefined,
          terrain: terrainTypes[Math.floor(Math.random() * terrainTypes.length)],
          status: ['active', 'damaged', 'returning', 'engaging'][Math.floor(Math.random() * 4)] as 'active' | 'damaged' | 'returning' | 'engaging',
          mission: missionTypes[Math.floor(Math.random() * missionTypes.length)],
          commander: Math.random() > 0.3 ? commanderNames[Math.floor(Math.random() * commanderNames.length)] : undefined,
          communicationStatus: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'offline'
        };
        
        dummyUnits.push(unit);
      }
      
      setUnits(dummyUnits);
    };
    
    generateDummyData();
    
    const interval = setInterval(() => {
      setUnits(prevUnits => {
        return prevUnits.map(unit => {
          if (Math.random() > 0.7) {
            const speedFactor = unit.type === 'aircraft' ? 0.05 : 0.01;
            const headingRad = unit.heading * (Math.PI / 180);
            
            const newLat = unit.position.lat + Math.sin(headingRad) * speedFactor;
            const newLng = unit.position.lng + Math.cos(headingRad) * speedFactor;
            
            const newHeading = Math.random() > 0.8 
              ? (unit.heading + (Math.random() * 20 - 10)) % 360 
              : unit.heading;
            
            return {
              ...unit,
              position: { 
                lat: newLat, 
                lng: newLng,
                elevation: unit.position.elevation 
              },
              heading: newHeading,
              speed: unit.speed ? Math.max(unit.type === 'aircraft' ? 200 : 0, Math.min(unit.type === 'aircraft' ? 800 : 80, unit.speed + (Math.random() * 20 - 10))) : undefined,
              altitude: unit.altitude ? Math.max(5000, Math.min(45000, unit.altitude + (Math.random() * 1000 - 500))) : undefined,
              status: Math.random() > 0.9 ? 
                ['active', 'damaged', 'returning', 'engaging'][Math.floor(Math.random() * 4)] as 'active' | 'damaged' | 'returning' | 'engaging' 
                : unit.status,
              communicationStatus: Math.random() > 0.9 ?
                ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'offline'
                : unit.communicationStatus
            };
          }
          return unit;
        });
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!communicationActive) return;
    
    const communicationInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const availableUnits = units.filter(u => u.communicationStatus === 'available' && u.alliance === 'ally');
        if (availableUnits.length > 0) {
          const unit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
          const messages = [
            "Maintaining patrol pattern over sector 7.",
            "Requesting permission to change altitude.",
            "Visual confirmation of target at coordinates.",
            "Fuel status at 70%, continuing mission.",
            "Enemy aircraft spotted at 2 o'clock.",
            "Completing reconnaissance of eastern sector.",
            "Returning to base, mission accomplished.",
            "ETA to target zone: 5 minutes.",
            "Engaging defensive maneuvers.",
            "Position secured, awaiting further orders.",
            "Weather conditions deteriorating in sector.",
            "Maintaining radio silence for next operation.",
            "Confirming successful missile lock.",
            "Ground team reports all clear.",
            "Radar contact lost with target vessel.",
          ];
          
          const newMessage = {
            time: new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}),
            sender: unit.callsign,
            message: messages[Math.floor(Math.random() * messages.length)]
          };
          
          setCommunicationLog(prev => [...prev.slice(-14), newMessage]);
        }
      }
    }, 4000);
    
    return () => clearInterval(communicationInterval);
  }, [communicationActive, units]);

  useEffect(() => {
    if (commLogRef.current && communicationLog.length > 0) {
      commLogRef.current.scrollTop = commLogRef.current.scrollHeight;
    }
  }, [communicationLog]);

  const getAllianceColor = (alliance: 'ally' | 'enemy' | 'neutral') => {
    if (alliance === 'ally') return 'bg-ally text-ally';
    if (alliance === 'enemy') return 'bg-enemy text-enemy';
    return 'bg-neutral text-neutral';
  };

  const getUnitIcon = (type: 'aircraft' | 'ground' | 'defense' | 'naval') => {
    switch(type) {
      case 'aircraft': return <Plane className="h-4 w-4" />;
      case 'ground': return <Flag className="h-4 w-4" />;
      case 'defense': return <Shield className="h-4 w-4" />;
      case 'naval': return <Map className="h-4 w-4" />;
      default: return <Radar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-neutral';
    switch(status) {
      case 'active': return 'text-eeg-green';
      case 'damaged': return 'text-eeg-yellow';
      case 'returning': return 'text-egypt-blue';
      case 'engaging': return 'text-enemy';
      default: return 'text-neutral';
    }
  };

  const getTerrainColor = (type: string) => {
    switch(type) {
      case 'mountain': return 'rgba(120, 120, 120, 0.6)';
      case 'desert': return 'rgba(230, 210, 150, 0.5)';
      case 'urban': return 'rgba(150, 150, 150, 0.5)';
      case 'water': return 'rgba(100, 150, 220, 0.5)';
      case 'forest': return 'rgba(80, 160, 80, 0.5)';
      default: return 'rgba(200, 200, 200, 0.3)';
    }
  };

  const getTerrainPattern = (type: string) => {
    switch(type) {
      case 'mountain': return "url('#mountain-pattern')";
      case 'desert': return "url('#desert-pattern')";
      case 'urban': return "url('#urban-pattern')";
      case 'water': return "url('#water-pattern')";
      case 'forest': return "url('#forest-pattern')";
      default: return 'none';
    }
  };

  const filteredUnits = units.filter(unit => {
    if (filterType !== 'all' && unit.type !== filterType) return false;
    if (filterAlliance !== 'all' && unit.alliance !== filterAlliance) return false;
    if (searchTerm && !unit.callsign.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setMapCenter(unit.position);
    setMapZoom(8);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedUnit) return;
    
    const newMessage = {
      time: new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}),
      sender: 'COMMAND',
      message: currentMessage
    };
    
    setCommunicationLog(prev => [...prev, newMessage]);
    setCurrentMessage('');
    
    setTimeout(() => {
      if (!selectedUnit) return;
      
      const responses = [
        "Roger that, Command.",
        "Affirmative, proceeding as ordered.",
        "Copy, executing now.",
        "Understood, will comply.",
        "Message received, over.",
        "Acknowledged, standing by for further instructions.",
        "Wilco, over and out."
      ];
      
      const responseMessage = {
        time: new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}),
        sender: selectedUnit.callsign,
        message: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setCommunicationLog(prev => [...prev, responseMessage]);
    }, 1500 + Math.random() * 1000);
  };

  const getMapPosition = (coord: Coordinate) => {
    const mapWidth = 100;
    const mapHeight = 100;
    
    const centerLat = mapCenter.lat;
    const centerLng = mapCenter.lng;
    
    const latRange = 20 / mapZoom;
    const lngRange = 30 / mapZoom;
    
    const x = ((coord.lng - (centerLng - lngRange/2)) / lngRange) * mapWidth;
    const y = (1 - ((coord.lat - (centerLat - latRange/2)) / latRange)) * mapHeight;
    
    return { x, y };
  };

  const coordsToPolygon = (coords: Coordinate[]) => {
    return coords.map(coord => {
      const { x, y } = getMapPosition(coord);
      return `${x}%,${y}%`;
    }).join(' ');
  };

  const getElevationOpacity = (elevation: number = 0) => {
    const maxElevation = 2500;
    return Math.min(0.9, Math.max(0.2, elevation / maxElevation + 0.2));
  };

  const getUnitTrailPath = (unit: Unit) => {
    const { x, y } = getMapPosition(unit.position);
    const headingRad = (unit.heading * Math.PI) / 180;
    const length = unit.speed ? Math.min(10, unit.speed / (unit.type === 'aircraft' ? 80 : 8)) : 2;
    
    const x2 = x - Math.cos(headingRad) * length;
    const y2 = y - Math.sin(headingRad) * length;
    
    return `M ${x}% ${y}% L ${x2}% ${y2}%`;
  };

  return (
    <div className={cn("egypt-glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="egypt-header flex items-center">
          <Mountain className="h-5 w-5 mr-2" />
          GIS Terrain Tracking System
        </h3>
        <div className="ml-auto flex items-center space-x-2">
          <div className="bg-radar-bg rounded-md p-1 flex text-xs">
            <button 
              className={cn("px-2 py-1 rounded", filterType === 'all' ? "bg-egypt-gold/50" : "")}
              onClick={() => setFilterType('all')}
            >
              ALL
            </button>
            <button 
              className={cn("px-2 py-1 rounded", filterType === 'aircraft' ? "bg-egypt-gold/50" : "")}
              onClick={() => setFilterType('aircraft')}
            >
              AIR
            </button>
            <button 
              className={cn("px-2 py-1 rounded", filterType === 'ground' ? "bg-egypt-gold/50" : "")}
              onClick={() => setFilterType('ground')}
            >
              GROUND
            </button>
            <button 
              className={cn("px-2 py-1 rounded", filterType === 'defense' ? "bg-egypt-gold/50" : "")}
              onClick={() => setFilterType('defense')}
            >
              DEFENSE
            </button>
            <button 
              className={cn("px-2 py-1 rounded", filterType === 'naval' ? "bg-egypt-gold/50" : "")}
              onClick={() => setFilterType('naval')}
            >
              NAVAL
            </button>
          </div>
          <div className="bg-radar-bg rounded-md p-1 flex text-xs">
            <button 
              className={cn("px-2 py-1 rounded", filterAlliance === 'all' ? "bg-egypt-gold/50" : "")}
              onClick={() => setFilterAlliance('all')}
            >
              ALL
            </button>
            <button 
              className={cn("px-2 py-1 rounded", filterAlliance === 'ally' ? "bg-egypt-gold/50" : "")}
              onClick={() => setFilterAlliance('ally')}
            >
              ALLIES
            </button>
            <button 
              className={cn("px-2 py-1 rounded", filterAlliance === 'enemy' ? "bg-egypt-gold/50" : "")}
              onClick={() => setFilterAlliance('enemy')}
            >
              ENEMIES
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-radar-bg text-xs rounded-md py-1 px-2 w-28 focus:outline-none focus:ring-1 focus:ring-egypt-gold"
            />
          </div>
          <button 
            className={cn("px-2 py-1 rounded text-xs", showTerrain ? "bg-egypt-gold/50" : "bg-radar-bg")}
            onClick={() => setShowTerrain(!showTerrain)}
          >
            TERRAIN
          </button>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3 rounded-lg overflow-hidden border border-egypt-gold/20 relative aspect-[4/3] bg-[#0a192f]">
          <div className="absolute inset-0">
            <svg width="0" height="0">
              <defs>
                <pattern id="mountain-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M0,10 L5,0 L10,10 Z" fill="#555" fillOpacity="0.4" />
                </pattern>
                <pattern id="desert-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#e6d296" fillOpacity="0.2" />
                  <circle cx="5" cy="5" r="1" fill="#d4c283" fillOpacity="0.4" />
                </pattern>
                <pattern id="urban-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
                  <rect width="4" height="4" fill="#999" fillOpacity="0.3" />
                  <rect x="4" y="4" width="4" height="4" fill="#999" fillOpacity="0.3" />
                </pattern>
                <pattern id="water-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0,10 Q5,5 10,10 T20,10" stroke="#64a8dc" strokeWidth="1" fill="none" strokeOpacity="0.4" />
                  <path d="M0,15 Q5,10 10,15 T20,15" stroke="#64a8dc" strokeWidth="1" fill="none" strokeOpacity="0.3" />
                </pattern>
                <pattern id="forest-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="3" fill="#2d8644" fillOpacity="0.4" />
                </pattern>
              </defs>
            </svg>

            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
              {Array.from({length: 12}).map((_, i) => (
                <div key={`col-${i}`} className="border-r border-egypt-gold/10 h-full"></div>
              ))}
              {Array.from({length: 12}).map((_, i) => (
                <div key={`row-${i}`} className="border-b border-egypt-gold/10 w-full"></div>
              ))}
            </div>
            
            <div className="absolute top-2 left-0 w-full flex justify-between px-4 text-[10px] text-egypt-gold/60">
              {Array.from({length: 5}).map((_, i) => {
                const lng = mapCenter.lng - (30 / mapZoom / 2) + (30 / mapZoom / 4) * i;
                return (
                  <div key={`lng-${i}`} className="text-center">
                    {lng.toFixed(1)}°E
                  </div>
                );
              })}
            </div>
            
            <div className="absolute top-0 left-2 h-full flex flex-col justify-between py-4 text-[10px] text-egypt-gold/60">
              {Array.from({length: 5}).map((_, i) => {
                const lat = mapCenter.lat + (20 / mapZoom / 2) - (20 / mapZoom / 4) * i;
                return (
                  <div key={`lat-${i}`} className="text-right">
                    {lat.toFixed(1)}°N
                  </div>
                );
              })}
            </div>
            
            <div className="absolute inset-0 p-4">
              {showTerrain && terrainFeatures.map(feature => (
                <svg key={feature.id} className="absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon 
                    points={coordsToPolygon(feature.coordinates)} 
                    fill={getTerrainColor(feature.type)}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                    style={{
                      fillOpacity: feature.type === 'mountain' ? 
                        getElevationOpacity(Math.max(...feature.coordinates.map(c => c.elevation || 0))) : 
                        undefined
                    }}
                  />
                  {feature.type === 'mountain' && (
                    <polygon 
                      points={coordsToPolygon(feature.coordinates)} 
                      fill={getTerrainPattern(feature.type)}
                      style={{ mixBlendMode: 'overlay' }}
                    />
                  )}
                  {feature.type === 'water' && (
                    <polygon 
                      points={coordsToPolygon(feature.coordinates)} 
                      fill={getTerrainPattern(feature.type)}
                      style={{ mixBlendMode: 'overlay' }}
                    >
                      <animate 
                        attributeName="opacity" 
                        values="0.3;0.6;0.3" 
                        dur="5s" 
                        repeatCount="indefinite" 
                      />
                    </polygon>
                  )}
                  {feature.type !== 'water' && (
                    <text
                      x={getMapPosition(feature.coordinates[0]).x + "%"}
                      y={getMapPosition(feature.coordinates[0]).y + "%"}
                      fontSize="1.8"
                      fill="rgba(255,255,255,0.7)"
                      className="pointer-events-none"
                      textAnchor="start"
                    >
                      {feature.name}
                    </text>
                  )}
                </svg>
              ))}
              
              <svg className="absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path 
                  d="M 55,20 Q 54,40 55,55 Q 56,65 55,80"
                  stroke="rgba(100, 170, 230, 0.6)"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-pulse-slow"
                />
                <path 
                  d="M 55,20 Q 54,40 55,55 Q 56,65 55,80"
                  stroke="rgba(100, 170, 230, 0.3)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              
              <svg className="absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                {filteredUnits.map(unit => (
                  <path
                    key={`trail-${unit.id}`}
                    d={getUnitTrailPath(unit)}
                    stroke={unit.alliance === 'ally' ? 'rgba(100, 200, 100, 0.6)' : 
                            unit.alliance === 'enemy' ? 'rgba(200, 100, 100, 0.6)' : 
                            'rgba(200, 200, 200, 0.6)'}
                    strokeWidth="0.5"
                    strokeDasharray={unit.type === 'aircraft' ? "1,1" : ""}
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}
              </svg>
            </div>
            
            {filteredUnits.map(unit => {
              const { x, y } = getMapPosition(unit.position);
              const isSelected = selectedUnit?.id === unit.id;
              
              return (
                <div 
                  key={unit.id}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all",
                    isSelected ? "z-20" : "z-10"
                  )}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  onClick={() => handleSelectUnit(unit)}
                >
                  <div 
                    className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full",
                      getAllianceColor(unit.alliance),
                      isSelected ? "ring-2 ring-egypt-gold" : "",
                      unit.type === 'aircraft' ? "bg-opacity-90" : "bg-opacity-90"
                    )}
                    style={{
                      transform: `rotate(${unit.heading}deg)`,
                      boxShadow: isSelected ? '0 0 5px rgba(255, 215, 0, 0.7)' : 'none'
                    }}
                  >
                    {unit.type === 'aircraft' && <Plane className="h-3 w-3" />}
                    {unit.type === 'ground' && <Flag className="h-3 w-3" />}
                    {unit.type === 'defense' && <Shield className="h-3 w-3" />}
                    {unit.type === 'naval' && <Navigation className="h-3 w-3" />}
                  </div>
                  
                  {unit.type === 'aircraft' && (
                    <div 
                      className={cn(
                        "absolute h-4 w-0.5 -top-2 left-1/2 -translate-x-1/2 transform-gpu",
                        unit.alliance === 'ally' ? "bg-ally" : 
                        unit.alliance === 'enemy' ? "bg-enemy" : "bg-neutral"
                      )}
                      style={{
                        transform: `translateY(-50%) rotate(${unit.heading}deg)`,
                        transformOrigin: 'bottom center'
                      }}
                    ></div>
                  )}
                  
                  <div 
                    className={cn(
                      "absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white/30",
                      getStatusColor(unit.status)
                    )}
                  >
                    {unit.status === 'engaging' && (
                      <div className="absolute inset-0 rounded-full animate-ping-slow bg-enemy opacity-70"></div>
                    )}
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-4 left-0 text-xs whitespace-nowrap bg-background/80 px-1 rounded z-30 border border-egypt-gold/30">
                      {unit.callsign}
                      {unit.type === 'aircraft' && unit.altitude && (
                        <span className="ml-1 text-[9px]">{Math.round(unit.altitude/1000)}K'</span>
                      )}
                    </div>
                  )}
                  
                  {(unit.altitude || unit.position.elevation) && !isSelected && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] text-egypt-gold/70">
                      {unit.altitude ? `${Math.round(unit.altitude/1000)}K'` : `${unit.position.elevation}m`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="absolute top-2 right-2 w-10 h-10 bg-background/50 rounded-full flex items-center justify-center border border-egypt-gold/30">
            <Compass className="h-6 w-6 text-egypt-gold/80" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold">N</div>
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-xs font-bold">E</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs font-bold">S</div>
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold">W</div>
          </div>
          
          <div className="absolute bottom-2 right-2 flex flex-col space-y-1">
            <button 
              className="w-6 h-6 bg-background/80 rounded flex items-center justify-center text-lg border border-egypt-gold/30"
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 12))}
            >
              +
            </button>
            <button 
              className="w-6 h-6 bg-background/80 rounded flex items-center justify-center text-lg border border-egypt-gold/30"
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
            >
              -
            </button>
            <button 
              className="w-6 h-6 bg-background/80 rounded flex items-center justify-center text-xs border border-egypt-gold/30"
              onClick={() => {
                setMapCenter({ lat: 29.9773, lng: 31.1325 });
                setMapZoom(6);
              }}
              title="Reset View"
            >
              R
            </button>
          </div>
          
          <div className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded border border-egypt-gold/30">
            <div className="flex items-center space-x-2">
              <span>LAT: {mapCenter.lat.toFixed(4)}</span>
              <span>LNG: {mapCenter.lng.toFixed(4)}</span>
              <span>ZOOM: {mapZoom}x</span>
            </div>
            <div className="text-[10px] text-egypt-gold/70">
              {selectedUnit ? `TRACKING: ${selectedUnit.callsign}` : 'NO UNIT SELECTED'}
            </div>
          </div>
          
          <div className="absolute bottom-12 left-2 bg-background/60 px-1 rounded text-[9px]">
            <div className="flex items-center">
              <div className="w-16 h-0.5 bg-egypt-gold/70"></div>
              <span className="ml-1">{Math.round(50 / mapZoom)} km</span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 grid grid-rows-2 gap-3">
          <div className="bg-radar-bg rounded-lg p-2 text-sm">
            <h4 className="text-egypt-gold border-b border-egypt-gold/20 pb-1 mb-2">Units ({filteredUnits.length})</h4>
            <div className="h-[calc(100%-2rem)] overflow-y-auto pr-1 space-y-1 max-h-36">
              {filteredUnits.map(unit => (
                <div 
                  key={unit.id}
                  className={cn(
                    "flex items-center p-1 rounded cursor-pointer",
                    selectedUnit?.id === unit.id ? "bg-egypt-gold/20" : "hover:bg-glass"
                  )}
                  onClick={() => handleSelectUnit(unit)}
                >
                  <div className="mr-2">{getUnitIcon(unit.type)}</div>
                  <div className="flex-1 truncate">{unit.callsign}</div>
                  <div className={cn(
                    "mr-1 text-[10px] px-1 rounded",
                    getStatusColor(unit.status)
                  )}>
                    {unit.status?.toUpperCase()}
                  </div>
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full",
                      unit.alliance === 'ally' ? "bg-ally" : 
                      unit.alliance === 'enemy' ? "bg-enemy" : "bg-neutral"
                    )}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-radar-bg rounded-lg p-2 text-sm">
            <div className="flex items-center justify-between border-b border-egypt-gold/20 pb-1 mb-2">
              <h4 className="text-egypt-gold flex items-center">
                <Radio className="h-4 w-4 mr-1" />
                Comm Channel
              </h4>
              <div className="flex items-center">
                <button
                  className={cn(
                    "p-1 rounded mr-1",
                    communicationActive ? "bg-eeg-green/20 text-eeg-green" : "bg-enemy/20 text-enemy"
                  )}
                  onClick={() => setCommunicationActive(!communicationActive)}
                  title={communicationActive ? "Channel Active" : "Channel Inactive"}
                >
                  {communicationActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button
                  className={cn(
                    "p-1 rounded",
                    micActive ? "bg-eeg-green/20 text-eeg-green" : "bg-radar-bg"
                  )}
                  onClick={() => setMicActive(!micActive)}
                  title={micActive ? "Microphone Active" : "Microphone Inactive"}
                >
                  {micActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div ref={commLogRef} className="h-24 overflow-y-auto text-xs mb-2 bg-background/20 rounded p-1">
              {communicationLog.length === 0 ? (
                <div className="text-center text-muted-foreground pt-8">
                  No communication activity
                </div>
              ) : (
                communicationLog.map((entry, index) => (
                  <div key={index} className="mb-1 last:mb-0">
                    <span className="text-egypt-gold/70">[{entry.time}]</span>{' '}
                    <span className={cn(
                      entry.sender === 'COMMAND' ? 'text-egypt-blue' : 'text-eeg-green'
                    )}>
                      {entry.sender}:
                    </span>{' '}
                    <span className="text-foreground">{entry.message}</span>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="text"
                placeholder={selectedUnit ? `Message to ${selectedUnit.callsign}...` : "Select a unit to communicate..."}
                disabled={!selectedUnit || !communicationActive}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-background/20 text-xs rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-egypt-gold"
              />
              <button
                className="ml-2 px-2 py-1 bg-egypt-gold/20 rounded disabled:opacity-50 disabled:cursor-not-allowed border border-egypt-gold/30"
                disabled={!selectedUnit || !communicationActive || !currentMessage.trim()}
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {selectedUnit && (
        <div className="p-4 pt-0">
          <div className="bg-radar-bg rounded-lg p-3">
            <h4 className="text-egypt-gold border-b border-egypt-gold/20 pb-1 mb-2 flex justify-between items-center">
              <span className="flex items-center">
                {getUnitIcon(selectedUnit.type)}
                <span className="ml-2">{selectedUnit.callsign} Details</span>
              </span>
              <div className="flex items-center text-xs">
                <span className={cn(
                  "px-1.5 py-0.5 rounded mr-2 border",
                  getStatusColor(selectedUnit.status),
                  selectedUnit.status === 'active' ? "border-eeg-green/30" : 
                  selectedUnit.status === 'damaged' ? "border-eeg-yellow/30" :
                  selectedUnit.status === 'returning' ? "border-egypt-blue/30" :
                  "border-enemy/30"
                )}>
                  {selectedUnit.status?.toUpperCase() || "UNKNOWN"}
                </span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded border",
                  selectedUnit.communicationStatus === 'available' ? "bg-eeg-green/20 text-eeg-green border-eeg-green/30" :
                  selectedUnit.communicationStatus === 'busy' ? "bg-eeg-yellow/20 text-eeg-yellow border-eeg-yellow/30" :
                  "bg-enemy/20 text-enemy border-enemy/30"
                )}>
                  COMM: {selectedUnit.communicationStatus?.toUpperCase() || "UNKNOWN"}
                </span>
              </div>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-background/30 rounded p-2">
                <div className="text-muted-foreground text-xs">CALLSIGN</div>
                <div className="font-medium">{selectedUnit.callsign}</div>
              </div>
              <div className="bg-background/30 rounded p-2">
                <div className="text-muted-foreground text-xs">TYPE</div>
                <div className="flex items-center font-medium">
                  {getUnitIcon(selectedUnit.type)}
                  <span className="ml-1 capitalize">{selectedUnit.type}</span>
                </div>
              </div>
              <div className="bg-background/30 rounded p-2">
                <div className="text-muted-foreground text-xs">ALLIANCE</div>
                <div className="capitalize font-medium">{selectedUnit.alliance}</div>
              </div>
              <div className="bg-background/30 rounded p-2">
                <div className="text-muted-foreground text-xs">HEADING</div>
                <div className="font-medium flex items-center">
                  <span>{selectedUnit.heading}°</span>
                  <div 
                    className="ml-2 w-4 h-4 border border-white/50 rounded-full flex items-center justify-center"
                    style={{ transform: `rotate(${selectedUnit.heading}deg)` }}
                  >
                    <div className="w-2 h-0.5 bg-white"></div>
                  </div>
                </div>
              </div>
              {selectedUnit.speed && (
                <div className="bg-background/30 rounded p-2">
                  <div className="text-muted-foreground text-xs">SPEED</div>
                  <div className="font-medium">{selectedUnit.speed} {selectedUnit.type === 'aircraft' ? 'KTS' : 'KM/H'}</div>
                </div>
              )}
              {selectedUnit.altitude && (
                <div className="bg-background/30 rounded p-2">
                  <div className="text-muted-foreground text-xs">ALTITUDE</div>
                  <div className="font-medium">{selectedUnit.altitude.toLocaleString()} FT</div>
                </div>
              )}
              <div className="bg-background/30 rounded p-2">
                <div className="text-muted-foreground text-xs">POSITION</div>
                <div className="text-xs font-medium">
                  {selectedUnit.position.lat.toFixed(4)}, {selectedUnit.position.lng.toFixed(4)}
                </div>
              </div>
              {selectedUnit.terrain && (
                <div className="bg-background/30 rounded p-2">
                  <div className="text-muted-foreground text-xs">TERRAIN</div>
                  <div className="capitalize font-medium">{selectedUnit.terrain}</div>
                </div>
              )}
              {selectedUnit.mission && (
                <div className="bg-background/30 rounded p-2">
                  <div className="text-muted-foreground text-xs">MISSION</div>
                  <div className="capitalize font-medium">{selectedUnit.mission}</div>
                </div>
              )}
              {selectedUnit.commander && (
                <div className="bg-background/30 rounded p-2">
                  <div className="text-muted-foreground text-xs">COMMANDER</div>
                  <div className="font-medium">{selectedUnit.commander}</div>
                </div>
              )}
              {selectedUnit.position.elevation && (
                <div className="bg-background/30 rounded p-2">
                  <div className="text-muted-foreground text-xs">ELEVATION</div>
                  <div className="font-medium">{selectedUnit.position.elevation} M</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GISTracking;
