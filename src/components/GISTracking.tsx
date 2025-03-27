
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Map, Radar, Flag, Plane, Shield, Mountains, Radio, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

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
  const [mapCenter, setMapCenter] = useState<Coordinate>({ lat: 29.9773, lng: 31.1325 }); // Cairo coordinates
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

  // Generate dummy terrain data for Egyptian landscape
  useEffect(() => {
    const generateTerrainFeatures = () => {
      const features: TerrainFeature[] = [
        // Sinai Mountains
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
        // Western Desert
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
        // Nile Delta
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
        // Mediterranean Coast
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
        // Red Sea Coast
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
      ];
      
      setTerrainFeatures(features);
    };
    
    generateTerrainFeatures();
  }, []);

  // Generate dummy data for Egyptian Army units
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
      
      // Define general area around Egypt
      const egyptBounds = {
        minLat: 22.0, maxLat: 32.0, // Latitude bounds
        minLng: 24.0, maxLng: 36.0  // Longitude bounds
      };
      
      const dummyUnits: Unit[] = [];
      
      // Generate 70 units (more than before)
      for (let i = 0; i < 70; i++) {
        const type = unitTypes[Math.floor(Math.random() * unitTypes.length)];
        const alliance = allianceTypes[Math.floor(Math.random() * allianceTypes.length)];
        
        // Select callsign based on type
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
        
        // Generate random position within Egypt bounds
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
    
    // Update some units' positions periodically
    const interval = setInterval(() => {
      setUnits(prevUnits => {
        return prevUnits.map(unit => {
          // Only move some units randomly
          if (Math.random() > 0.7) {
            const speedFactor = unit.type === 'aircraft' ? 0.05 : 0.01;
            const headingRad = unit.heading * (Math.PI / 180);
            
            // Calculate new position based on heading and speed
            const newLat = unit.position.lat + Math.sin(headingRad) * speedFactor;
            const newLng = unit.position.lng + Math.cos(headingRad) * speedFactor;
            
            // Small chance to change heading
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
              // Slight changes in speed and altitude for aircraft
              speed: unit.speed ? Math.max(unit.type === 'aircraft' ? 200 : 0, Math.min(unit.type === 'aircraft' ? 800 : 80, unit.speed + (Math.random() * 20 - 10))) : undefined,
              altitude: unit.altitude ? Math.max(5000, Math.min(45000, unit.altitude + (Math.random() * 1000 - 500))) : undefined,
              // Random chance to change status
              status: Math.random() > 0.9 ? 
                ['active', 'damaged', 'returning', 'engaging'][Math.floor(Math.random() * 4)] as 'active' | 'damaged' | 'returning' | 'engaging' 
                : unit.status,
              // Random chance to change communication status
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

  // Simulate communication messages
  useEffect(() => {
    if (!communicationActive) return;
    
    const communicationInterval = setInterval(() => {
      // Only add new message sometimes
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

  // Auto-scroll communication log
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
      case 'mountain': return 'rgba(120, 120, 120, 0.3)';
      case 'desert': return 'rgba(230, 210, 150, 0.3)';
      case 'urban': return 'rgba(150, 150, 150, 0.3)';
      case 'water': return 'rgba(100, 150, 220, 0.3)';
      case 'forest': return 'rgba(80, 160, 80, 0.3)';
      default: return 'rgba(200, 200, 200, 0.2)';
    }
  };

  const filteredUnits = units.filter(unit => {
    // Filter by type
    if (filterType !== 'all' && unit.type !== filterType) return false;
    
    // Filter by alliance
    if (filterAlliance !== 'all' && unit.alliance !== filterAlliance) return false;
    
    // Filter by search term
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
    
    // Simulate response after delay
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

  // Convert lat/lng to pixel positions for our simple map view
  const getMapPosition = (coord: Coordinate) => {
    // This is a very simplified projection for demonstration
    // In a real app, you would use a proper map library like Mapbox or Leaflet
    const mapWidth = 100; // percentage
    const mapHeight = 100; // percentage
    
    // Center the map on Egypt
    const centerLat = mapCenter.lat;
    const centerLng = mapCenter.lng;
    
    // Calculate view range based on zoom
    const latRange = 20 / mapZoom;
    const lngRange = 30 / mapZoom;
    
    // Calculate position percentage
    const x = ((coord.lng - (centerLng - lngRange/2)) / lngRange) * mapWidth;
    const y = (1 - ((coord.lat - (centerLat - latRange/2)) / latRange)) * mapHeight;
    
    return { x, y };
  };

  // Convert coordinates to SVG polygon points
  const coordsToPolygon = (coords: Coordinate[]) => {
    return coords.map(coord => {
      const { x, y } = getMapPosition(coord);
      return `${x}%,${y}%`;
    }).join(' ');
  };

  return (
    <div className={cn("egypt-glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="egypt-header flex items-center">
          <Mountains className="h-5 w-5 mr-2" />
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
        <div className="md:col-span-3 rounded-lg overflow-hidden border border-egypt-gold/20 relative aspect-[4/3] desert-gradient">
          {/* Map visualization */}
          <div className="absolute inset-0">
            {/* Simple map grid lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
              {Array.from({length: 6}).map((_, i) => (
                <div key={`col-${i}`} className="border-r border-egypt-gold/10 h-full"></div>
              ))}
              {Array.from({length: 6}).map((_, i) => (
                <div key={`row-${i}`} className="border-b border-egypt-gold/10 w-full"></div>
              ))}
            </div>
            
            {/* Map Features - simplified for this example */}
            <div className="absolute inset-0 p-4">
              {/* Terrain features */}
              {showTerrain && terrainFeatures.map(feature => (
                <svg key={feature.id} className="absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon 
                    points={coordsToPolygon(feature.coordinates)} 
                    fill={getTerrainColor(feature.type)}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                  />
                  {/* Feature name */}
                  {feature.type !== 'water' && (
                    <text
                      x={getMapPosition(feature.coordinates[0]).x + "%"}
                      y={getMapPosition(feature.coordinates[0]).y + "%"}
                      fontSize="2"
                      fill="rgba(255,255,255,0.6)"
                      className="pointer-events-none"
                    >
                      {feature.name}
                    </text>
                  )}
                </svg>
              ))}
              
              {/* Egyptian borders - simplified */}
              <div className="absolute w-1/3 h-1/2 border border-egypt-nile/30 rounded-lg" 
                style={{top: '20%', left: '40%'}}></div>
              
              {/* Nile river - simplified */}
              <div className="absolute w-1 h-1/2 bg-egypt-nile/30"
                style={{top: '25%', left: '55%'}}></div>
                
              {/* Mediterranean Sea */}
              <div className="absolute top-0 left-0 right-0 h-1/6 bg-egypt-nile/20 rounded-b-lg"></div>
              
              {/* Red Sea */}
              <div className="absolute top-1/4 right-0 w-1/6 bottom-0 bg-egypt-nile/20 rounded-l-lg"></div>
            </div>
            
            {/* Units on the map */}
            {filteredUnits.map(unit => {
              const { x, y } = getMapPosition(unit.position);
              const isSelected = selectedUnit?.id === unit.id;
              
              return (
                <div 
                  key={unit.id}
                  className={cn(
                    "absolute w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all",
                    getAllianceColor(unit.alliance),
                    isSelected ? "ring-2 ring-egypt-gold animate-ping-slow" : "",
                    unit.type === 'aircraft' ? "bg-opacity-70" : "bg-opacity-90"
                  )}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${unit.heading}deg)`
                  }}
                  onClick={() => handleSelectUnit(unit)}
                >
                  {/* Unit direction indicator */}
                  <div 
                    className={cn(
                      "absolute h-4 w-0.5 top-0 left-1/2 -translate-x-1/2 -translate-y-full",
                      unit.alliance === 'ally' ? "bg-ally" : 
                      unit.alliance === 'enemy' ? "bg-enemy" : "bg-neutral"
                    )}
                  ></div>
                  
                  {/* Status indicator */}
                  <div 
                    className={cn(
                      "absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full",
                      getStatusColor(unit.status)
                    )}
                  ></div>
                  
                  {/* Unit callsign */}
                  {isSelected && (
                    <div className="absolute top-4 left-0 text-xs whitespace-nowrap bg-background/80 px-1 rounded z-10">
                      {unit.callsign}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Map controls */}
          <div className="absolute bottom-2 right-2 flex flex-col space-y-1">
            <button 
              className="w-6 h-6 bg-background/80 rounded flex items-center justify-center text-lg"
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 12))}
            >
              +
            </button>
            <button 
              className="w-6 h-6 bg-background/80 rounded flex items-center justify-center text-lg"
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
            >
              -
            </button>
            <button 
              className="w-6 h-6 bg-background/80 rounded flex items-center justify-center text-xs"
              onClick={() => {
                setMapCenter({ lat: 29.9773, lng: 31.1325 });
                setMapZoom(6);
              }}
            >
              R
            </button>
          </div>
          
          {/* Coordinates display */}
          <div className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">
            LAT: {mapCenter.lat.toFixed(4)} | LNG: {mapCenter.lng.toFixed(4)} | ZOOM: {mapZoom}
          </div>
        </div>
        
        <div className="md:col-span-2 grid grid-rows-2 gap-3">
          {/* Unit list */}
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
          
          {/* Communication panel */}
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
            
            {/* Communication log */}
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
            
            {/* Message input */}
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
                className="ml-2 px-2 py-1 bg-egypt-gold/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedUnit || !communicationActive || !currentMessage.trim()}
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Selected unit details */}
      {selectedUnit && (
        <div className="p-4 pt-0">
          <div className="bg-radar-bg rounded-lg p-3">
            <h4 className="text-egypt-gold border-b border-egypt-gold/20 pb-1 mb-2 flex justify-between items-center">
              <span>Unit Details</span>
              <div className="flex items-center text-xs">
                <span className={cn(
                  "px-1.5 py-0.5 rounded mr-2",
                  getStatusColor(selectedUnit.status)
                )}>
                  {selectedUnit.status?.toUpperCase() || "UNKNOWN"}
                </span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded",
                  selectedUnit.communicationStatus === 'available' ? "bg-eeg-green/20 text-eeg-green" :
                  selectedUnit.communicationStatus === 'busy' ? "bg-eeg-yellow/20 text-eeg-yellow" :
                  "bg-enemy/20 text-enemy"
                )}>
                  COMM: {selectedUnit.communicationStatus?.toUpperCase() || "UNKNOWN"}
                </span>
              </div>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">CALLSIGN</div>
                <div>{selectedUnit.callsign}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">TYPE</div>
                <div className="flex items-center">
                  {getUnitIcon(selectedUnit.type)}
                  <span className="ml-1 capitalize">{selectedUnit.type}</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">ALLIANCE</div>
                <div className="capitalize">{selectedUnit.alliance}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">HEADING</div>
                <div>{selectedUnit.heading}°</div>
              </div>
              {selectedUnit.speed && (
                <div>
                  <div className="text-muted-foreground text-xs">SPEED</div>
                  <div>{selectedUnit.speed} {selectedUnit.type === 'aircraft' ? 'KTS' : 'KM/H'}</div>
                </div>
              )}
              {selectedUnit.altitude && (
                <div>
                  <div className="text-muted-foreground text-xs">ALTITUDE</div>
                  <div>{selectedUnit.altitude.toLocaleString()} FT</div>
                </div>
              )}
              <div>
                <div className="text-muted-foreground text-xs">POSITION</div>
                <div className="text-xs">
                  {selectedUnit.position.lat.toFixed(4)}, {selectedUnit.position.lng.toFixed(4)}
                </div>
              </div>
              {selectedUnit.terrain && (
                <div>
                  <div className="text-muted-foreground text-xs">TERRAIN</div>
                  <div className="capitalize">{selectedUnit.terrain}</div>
                </div>
              )}
              {selectedUnit.mission && (
                <div>
                  <div className="text-muted-foreground text-xs">MISSION</div>
                  <div className="capitalize">{selectedUnit.mission}</div>
                </div>
              )}
              {selectedUnit.commander && (
                <div>
                  <div className="text-muted-foreground text-xs">COMMANDER</div>
                  <div>{selectedUnit.commander}</div>
                </div>
              )}
              {selectedUnit.position.elevation && (
                <div>
                  <div className="text-muted-foreground text-xs">ELEVATION</div>
                  <div>{selectedUnit.position.elevation} M</div>
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
