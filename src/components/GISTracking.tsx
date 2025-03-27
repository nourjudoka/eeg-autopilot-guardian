
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Map, Radar, Flag, Plane, Shield } from 'lucide-react';

interface Coordinate {
  lat: number;
  lng: number;
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

  // Generate dummy data for Egyptian Army units
  useEffect(() => {
    const generateDummyData = () => {
      const unitTypes: ('aircraft' | 'ground' | 'defense' | 'naval')[] = ['aircraft', 'ground', 'defense', 'naval'];
      const allianceTypes: ('ally' | 'enemy' | 'neutral')[] = ['ally', 'enemy', 'neutral'];
      const aircraftCallsigns = ['EAGLE', 'FALCON', 'HORUS', 'ANUBIS', 'SPHINX', 'PHARAOH', 'NILE', 'PYRAMID'];
      const groundCallsigns = ['DESERT', 'SCORPION', 'CHARIOT', 'OASIS', 'OSIRIS', 'SANDS', 'DUNE'];
      const defenseCallsigns = ['SHIELD', 'GUARDIAN', 'FORTRESS', 'BASTION', 'RAMSES', 'WALL'];
      const navalCallsigns = ['WAVE', 'DELTA', 'CURRENT', 'TIDE', 'SUEZ'];
      
      // Define general area around Egypt
      const egyptBounds = {
        minLat: 22.0, maxLat: 32.0, // Latitude bounds
        minLng: 24.0, maxLng: 36.0  // Longitude bounds
      };
      
      const dummyUnits: Unit[] = [];
      
      // Generate 50 units (more than the original)
      for (let i = 0; i < 50; i++) {
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
          position: { lat, lng },
          heading: Math.floor(Math.random() * 360),
          speed: type === 'aircraft' ? Math.floor(Math.random() * 600) + 200 : Math.floor(Math.random() * 80),
          altitude: type === 'aircraft' ? Math.floor(Math.random() * 40000) + 5000 : undefined
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
              position: { lat: newLat, lng: newLng },
              heading: newHeading,
              // Slight changes in speed and altitude for aircraft
              speed: unit.speed ? Math.max(unit.type === 'aircraft' ? 200 : 0, Math.min(unit.type === 'aircraft' ? 800 : 80, unit.speed + (Math.random() * 20 - 10))) : undefined,
              altitude: unit.altitude ? Math.max(5000, Math.min(45000, unit.altitude + (Math.random() * 1000 - 500))) : undefined
            };
          }
          return unit;
        });
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className={cn("egypt-glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="egypt-header">GIS Tracking System</h3>
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
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  
                  {/* Unit callsign */}
                  {isSelected && (
                    <div className="absolute top-4 left-0 text-xs whitespace-nowrap bg-background/80 px-1 rounded">
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
        
        <div className="md:col-span-1 bg-radar-bg rounded-lg p-2 text-sm">
          <h4 className="text-egypt-gold border-b border-egypt-gold/20 pb-1 mb-2">Units ({filteredUnits.length})</h4>
          <div className="h-[calc(100%-2rem)] overflow-y-auto pr-1 space-y-1">
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
      </div>
      
      {/* Selected unit details */}
      {selectedUnit && (
        <div className="p-4 pt-0">
          <div className="bg-radar-bg rounded-lg p-3">
            <h4 className="text-egypt-gold border-b border-egypt-gold/20 pb-1 mb-2">Unit Details</h4>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GISTracking;
