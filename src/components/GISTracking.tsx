import React, { useEffect, useState, useRef } from 'react';
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MapPin, Mountain, Plane, Shield, Radio, Ship, Eye, Target, AlertTriangle } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface GISTrackingProps {
  className?: string;
}

interface MapLocation {
  id: string;
  name: string;
  type: 'base' | 'aircraft' | 'vessel' | 'unit' | 'radar' | 'target' | 'threat';
  lat: number;
  lng: number;
  status?: 'active' | 'inactive' | 'alert';
  details?: string;
}

// Define the North Africa and Middle East region bounds
const regionBounds = {
  north: 38, // Northern Turkey
  south: 5,  // Northern Kenya
  west: -10, // Western Morocco
  east: 60   // Eastern Iran
};

const GISTracking: React.FC<GISTrackingProps> = ({ className }) => {
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ lat: 26, lng: 30 }); // Egypt center
  const [viewMode, setViewMode] = useState<'satellite' | 'terrain' | 'tactical'>('terrain');
  const [showBases, setShowBases] = useState(true);
  const [showAircraft, setShowAircraft] = useState(true);
  const [showVessels, setShowVessels] = useState(true);
  const [showUnits, setShowUnits] = useState(true);
  const [showRadars, setShowRadars] = useState(true);
  const [showThreats, setShowThreats] = useState(true);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [localSensorData, setLocalSensorData] = useState<{ time: string; value: number }[]>([]);
  
  // Initialize map dimensions
  useEffect(() => {
    if (mapRef.current) {
      setMapDimensions({
        width: mapRef.current.clientWidth,
        height: mapRef.current.clientHeight
      });
    }
    
    const handleResize = () => {
      if (mapRef.current) {
        setMapDimensions({
          width: mapRef.current.clientWidth,
          height: mapRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initialize map locations - Focus on North Africa and Middle East region
  useEffect(() => {
    const initialLocations: MapLocation[] = [
      // Egyptian military bases
      { id: '1', name: 'Cairo East Airbase', type: 'base', lat: 30.1, lng: 31.4, status: 'active', details: 'Main command center for air operations' },
      { id: '2', name: 'Alexandria Naval Base', type: 'base', lat: 31.2, lng: 29.8, status: 'active', details: 'Mediterranean fleet headquarters' },
      { id: '3', name: 'Mersa Matruh Airfield', type: 'base', lat: 31.3, lng: 27.2, status: 'active', details: 'Western border surveillance' },
      { id: '4', name: 'Aswan Military Complex', type: 'base', lat: 24.1, lng: 32.9, status: 'active', details: 'Southern command operations' },
      
      // Regional bases
      { id: '5', name: 'Benghazi Outpost', type: 'base', lat: 32.1, lng: 20.1, status: 'active', details: 'Joint operations base' },
      { id: '6', name: 'Khartoum Liaison Base', type: 'base', lat: 15.6, lng: 32.5, status: 'inactive', details: 'Limited operations capacity' },
      { id: '7', name: 'Riyadh Coordination Center', type: 'base', lat: 24.7, lng: 46.7, status: 'active', details: 'Allied command operations' },
      { id: '8', name: 'Amman Joint Base', type: 'base', lat: 31.9, lng: 35.9, status: 'active', details: 'Regional security coordination' },
      
      // Aircraft positions
      { id: 'a1', name: 'Eagle Squadron', type: 'aircraft', lat: 29.8, lng: 34.2, status: 'active', details: 'F-16 patrol over Sinai' },
      { id: 'a2', name: 'Falcon-1', type: 'aircraft', lat: 31.5, lng: 28.3, status: 'active', details: 'Surveillance mission over Mediterranean' },
      { id: 'a3', name: 'Desert Hawk', type: 'aircraft', lat: 27.2, lng: 30.8, status: 'active', details: 'Training exercise in progress' },
      { id: 'a4', name: 'Recon-2', type: 'aircraft', lat: 23.9, lng: 35.5, status: 'alert', details: 'Monitoring unusual activity' },
      
      // Naval vessels
      { id: 'v1', name: 'Misr Frigate', type: 'vessel', lat: 31.7, lng: 30.8, status: 'active', details: 'Mediterranean patrol' },
      { id: 'v2', name: 'Suez Destroyer', type: 'vessel', lat: 27.8, lng: 33.8, status: 'active', details: 'Red Sea operations' },
      { id: 'v3', name: 'Alexandria Corvette', type: 'vessel', lat: 31.3, lng: 27.5, status: 'active', details: 'Coastal security' },
      
      // Ground units
      { id: 'u1', name: 'Rapid Response Team', type: 'unit', lat: 30.8, lng: 33.8, status: 'active', details: 'Border security operations' },
      { id: 'u2', name: 'Desert Battalion', type: 'unit', lat: 25.7, lng: 28.9, status: 'active', details: 'Southern region patrol' },
      { id: 'u3', name: 'Armored Division', type: 'unit', lat: 30.4, lng: 30.6, status: 'active', details: 'Training exercises in progress' },
      
      // Radar stations
      { id: 'r1', name: 'Northern Radar Array', type: 'radar', lat: 31.6, lng: 31.2, status: 'active', details: 'Scanning Mediterranean approaches' },
      { id: 'r2', name: 'Eastern Early Warning', type: 'radar', lat: 29.2, lng: 34.5, status: 'active', details: 'Monitoring eastern airspace' },
      { id: 'r3', name: 'Southern Coverage', type: 'radar', lat: 22.5, lng: 31.7, status: 'inactive', details: 'Maintenance in progress' },
      
      // Targets/threats
      { id: 't1', name: 'Unidentified vessel', type: 'target', lat: 32.1, lng: 31.5, status: 'alert', details: 'Tracking suspicious maritime activity' },
      { id: 't2', name: 'Signal source', type: 'target', lat: 29.7, lng: 36.2, status: 'alert', details: 'Unusual communications detected' },
      { id: 't3', name: 'Hostile radar', type: 'threat', lat: 33.8, lng: 35.5, status: 'alert', details: 'Electronic warfare signature detected' },
      { id: 't4', name: 'Unauthorized flight', type: 'threat', lat: 28.3, lng: 33.2, status: 'alert', details: 'Aircraft violating restricted airspace' },
    ];
    
    setMapLocations(initialLocations);
    
    // Update positions periodically
    const interval = setInterval(() => {
      setMapLocations(prevLocations => {
        return prevLocations.map(location => {
          // Only move aircraft, vessels, and some units
          if (location.type === 'aircraft' || location.type === 'vessel' || (location.type === 'unit' && Math.random() > 0.7)) {
            // Small random movement
            const latChange = (Math.random() * 0.2 - 0.1) * (location.type === 'aircraft' ? 3 : 1);
            const lngChange = (Math.random() * 0.2 - 0.1) * (location.type === 'aircraft' ? 3 : 1);
            
            // Keep within region bounds
            const newLat = Math.max(regionBounds.south, Math.min(regionBounds.north, location.lat + latChange));
            const newLng = Math.max(regionBounds.west, Math.min(regionBounds.east, location.lng + lngChange));
            
            return {
              ...location,
              lat: newLat,
              lng: newLng,
              // Occasionally change status
              status: Math.random() > 0.95 ? 
                (location.status === 'active' ? 'alert' : 'active') : 
                location.status
            };
          }
          return location;
        });
      });
      
      // Occasionally add or remove temporary targets
      if (Math.random() > 0.8) {
        if (Math.random() > 0.5 && mapLocations.filter(l => l.type === 'target' || l.type === 'threat').length < 10) {
          // Add new target
          const newTarget: MapLocation = {
            id: `t${Date.now()}`,
            name: Math.random() > 0.7 ? 'Hostile entity' : 'Unknown contact',
            type: Math.random() > 0.6 ? 'target' : 'threat',
            lat: regionBounds.south + Math.random() * (regionBounds.north - regionBounds.south),
            lng: regionBounds.west + Math.random() * (regionBounds.east - regionBounds.west),
            status: 'alert',
            details: Math.random() > 0.5 ? 'Investigating suspicious activity' : 'Potential security concern'
          };
          
          setMapLocations(prev => [...prev, newTarget]);
        } else {
          // Remove a target
          const targets = mapLocations.filter(l => l.type === 'target' || l.type === 'threat');
          if (targets.length > 2) {
            const targetToRemove = targets[Math.floor(Math.random() * targets.length)];
            setMapLocations(prev => prev.filter(l => l.id !== targetToRemove.id));
          }
        }
      }
    }, 5000);
    
    // Generate sensor data for chart
    const sensorInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setLocalSensorData(prev => {
        const newData = [...prev, { time: timeStr, value: 25 + Math.random() * 75 }];
        if (newData.length > 10) {
          return newData.slice(newData.length - 10);
        }
        return newData;
      });
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearInterval(sensorInterval);
    };
  }, [mapLocations.length]);
  
  const getTypeIcon = (type: string, status: string = 'active') => {
    switch (type) {
      case 'base':
        return <Shield className="h-full w-full" />;
      case 'aircraft':
        return <Plane className="h-full w-full" />;
      case 'vessel':
        return <Ship className="h-full w-full" />;
      case 'unit':
        return <MapPin className="h-full w-full" />;
      case 'radar':
        return <Radio className="h-full w-full" />;
      case 'target':
        return <Eye className="h-full w-full" />;
      case 'threat':
        return <Target className="h-full w-full" />;
      default:
        return <MapPin className="h-full w-full" />;
    }
  };
  
  const getTypeColor = (type: string, status: string = 'active') => {
    if (status === 'alert') return 'text-eeg-red bg-eeg-red/20 border-eeg-red';
    if (status === 'inactive') return 'text-muted-foreground bg-muted/20 border-muted-foreground';
    
    switch (type) {
      case 'base':
        return 'text-eeg-blue bg-eeg-blue/20 border-eeg-blue';
      case 'aircraft':
        return 'text-eeg-green bg-eeg-green/20 border-eeg-green';
      case 'vessel':
        return 'text-cyan-500 bg-cyan-500/20 border-cyan-500';
      case 'unit':
        return 'text-amber-500 bg-amber-500/20 border-amber-500';
      case 'radar':
        return 'text-purple-500 bg-purple-500/20 border-purple-500';
      case 'target':
        return 'text-egypt-gold bg-egypt-gold/20 border-egypt-gold';
      case 'threat':
        return 'text-eeg-red bg-eeg-red/20 border-eeg-red';
      default:
        return 'text-muted-foreground bg-muted/20 border-muted-foreground';
    }
  };
  
  const latLngToPixel = (lat: number, lng: number) => {
    // Map the coordinates to pixel position based on the map's bounds and dimensions
    const latRange = regionBounds.north - regionBounds.south;
    const lngRange = regionBounds.east - regionBounds.west;
    
    // Apply zoom and center offset
    const centerOffsetLat = center.lat - (regionBounds.north + regionBounds.south) / 2;
    const centerOffsetLng = center.lng - (regionBounds.east + regionBounds.west) / 2;
    
    const adjustedLat = lat - centerOffsetLat;
    const adjustedLng = lng - centerOffsetLng;
    
    const y = ((regionBounds.north - adjustedLat) / latRange) * mapDimensions.height / zoom;
    const x = ((adjustedLng - regionBounds.west) / lngRange) * mapDimensions.width / zoom;
    
    return { x, y };
  };
  
  const handleMapClick = (e: React.MouseEvent) => {
    const mapRect = mapRef.current?.getBoundingClientRect();
    if (!mapRect) return;
    
    const clickX = e.clientX - mapRect.left;
    const clickY = e.clientY - mapRect.top;
    
    // Find if a location was clicked
    let clickedLocation: MapLocation | null = null;
    let minDistance = 15; // Minimum pixel distance to consider a click on a location
    
    mapLocations.forEach(location => {
      const { x, y } = latLngToPixel(location.lat, location.lng);
      const distance = Math.sqrt(Math.pow(x - clickX, 2) + Math.pow(y - clickY, 2));
      
      if (distance < minDistance) {
        minDistance = distance;
        clickedLocation = location;
      }
    });
    
    setSelectedLocation(clickedLocation);
  };
  
  const handleMapMouseDown = (e: React.MouseEvent) => {
    setIsMoving(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!isMoving) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Update center based on drag
    const latRange = regionBounds.north - regionBounds.south;
    const lngRange = regionBounds.east - regionBounds.west;
    
    const latChange = (dy / mapDimensions.height) * latRange / zoom;
    const lngChange = (-dx / mapDimensions.width) * lngRange / zoom;
    
    setCenter({
      lat: center.lat + latChange,
      lng: center.lng + lngChange
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMapMouseUp = () => {
    setIsMoving(false);
  };
  
  const handleMapMouseLeave = () => {
    setIsMoving(false);
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };
  
  const handleResetView = () => {
    setZoom(1);
    setCenter({ lat: 26, lng: 30 }); // Reset to Egypt
  };
  
  const filterLocations = (locations: MapLocation[]) => {
    return locations.filter(location => {
      if (location.type === 'base' && !showBases) return false;
      if (location.type === 'aircraft' && !showAircraft) return false;
      if (location.type === 'vessel' && !showVessels) return false;
      if (location.type === 'unit' && !showUnits) return false;
      if (location.type === 'radar' && !showRadars) return false;
      if ((location.type === 'target' || location.type === 'threat') && !showThreats) return false;
      return true;
    });
  };
  
  return (
    <div className={cn("egypt-glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="egypt-header">GIS Tracking System</h3>
        <div className="text-sm text-muted-foreground ml-auto">
          <span className="text-egypt-gold">North Africa & Middle East Region</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4">
          <div className="flex justify-between mb-3">
            <div className="flex space-x-1">
              <button 
                className={cn("px-2 py-1 text-xs rounded", viewMode === 'satellite' ? "bg-egypt-gold/70" : "bg-radar-bg")}
                onClick={() => setViewMode('satellite')}
              >
                Satellite
              </button>
              <button 
                className={cn("px-2 py-1 text-xs rounded", viewMode === 'terrain' ? "bg-egypt-gold/70" : "bg-radar-bg")}
                onClick={() => setViewMode('terrain')}
              >
                Terrain
              </button>
              <button 
                className={cn("px-2 py-1 text-xs rounded", viewMode === 'tactical' ? "bg-egypt-gold/70" : "bg-radar-bg")}
                onClick={() => setViewMode('tactical')}
              >
                Tactical
              </button>
            </div>
            <div className="flex space-x-1">
              <button className="px-2 py-1 text-xs rounded bg-radar-bg" onClick={handleZoomIn}>
                +
              </button>
              <button className="px-2 py-1 text-xs rounded bg-radar-bg" onClick={handleZoomOut}>
                -
              </button>
              <button className="px-2 py-1 text-xs rounded bg-radar-bg" onClick={handleResetView}>
                Reset
              </button>
            </div>
          </div>
          
          <div 
            ref={mapRef}
            className={cn("relative w-full rounded-md overflow-hidden border border-border/50", 
              viewMode === 'satellite' ? "satellite-map" : 
              viewMode === 'terrain' ? "terrain-map" : "tactical-map"
            )}
            style={{ height: 'calc(100% - 60px)' }}
            onClick={handleMapClick}
            onMouseDown={handleMapMouseDown}
            onMouseMove={handleMapMouseMove}
            onMouseUp={handleMapMouseUp}
            onMouseLeave={handleMapMouseLeave}
          >
            {/* Map grid lines */}
            <div className="absolute inset-0 map-grid opacity-30"></div>
            
            {/* Region overlays */}
            <div className={cn("absolute region-egypt", viewMode === 'tactical' ? "opacity-40" : "opacity-20")}></div>
            <div className={cn("absolute region-libya", viewMode === 'tactical' ? "opacity-40" : "opacity-20")}></div>
            <div className={cn("absolute region-sudan", viewMode === 'tactical' ? "opacity-40" : "opacity-20")}></div>
            <div className={cn("absolute region-saudi", viewMode === 'tactical' ? "opacity-40" : "opacity-20")}></div>
            
            {/* Mediterranean Sea */}
            <div className={cn("absolute mediterranean-sea", viewMode === 'tactical' ? "opacity-30" : "opacity-10")}></div>
            
            {/* Red Sea */}
            <div className={cn("absolute red-sea", viewMode === 'tactical' ? "opacity-30" : "opacity-10")}></div>
            
            {/* Nile River */}
            <div className={cn("absolute nile-river", viewMode === 'tactical' ? "opacity-50" : "opacity-20")}></div>
            
            {/* Terrain features */}
            {viewMode === 'terrain' && (
              <>
                <div className="absolute sinai-mountains opacity-30">
                  <Mountain className="h-6 w-6 text-stone-600" />
                </div>
                <div className="absolute western-desert opacity-30">
                  <div className="text-sm text-stone-600">Western Desert</div>
                </div>
                <div className="absolute eastern-desert opacity-30">
                  <div className="text-sm text-stone-600">Eastern Desert</div>
                </div>
                <div className="absolute sahara-desert opacity-30">
                  <div className="text-sm text-stone-600">Sahara</div>
                </div>
              </>
            )}
            
            {/* Map locations */}
            {filterLocations(mapLocations).map(location => {
              const { x, y } = latLngToPixel(location.lat, location.lng);
              const isSelected = selectedLocation?.id === location.id;
              const colorClass = getTypeColor(location.type, location.status);
              
              return (
                <div 
                  key={location.id}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center",
                    colorClass,
                    "rounded-full border-2 transition-all",
                    { "w-8 h-8 z-10": isSelected },
                    { "animate-pulse": location.status === 'alert' }
                  )}
                  style={{ left: x, top: y }}
                >
                  {getTypeIcon(location.type, location.status)}
                  
                  {location.status === 'alert' && !isSelected && (
                    <div className="absolute -top-2 -right-2">
                      <AlertTriangle className="h-3 w-3 text-eeg-red" />
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-background/80 px-2 py-1 rounded text-xs whitespace-nowrap border border-border/50">
                      {location.name}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Map attribution */}
            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-background/50 px-1 rounded">
              Egyptian Armed Forces GIS System
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/4 bg-radar-bg rounded-md p-2 h-full flex flex-col">
          <div className="flex flex-wrap gap-1 mb-3">
            <button 
              className={cn("px-2 py-1 text-xs rounded flex items-center", 
                showBases ? "bg-eeg-blue/20 text-eeg-blue" : "bg-muted/20 text-muted-foreground"
              )}
              onClick={() => setShowBases(!showBases)}
            >
              <Shield className="h-3 w-3 mr-1" />
              Bases
            </button>
            <button 
              className={cn("px-2 py-1 text-xs rounded flex items-center", 
                showAircraft ? "bg-eeg-green/20 text-eeg-green" : "bg-muted/20 text-muted-foreground"
              )}
              onClick={() => setShowAircraft(!showAircraft)}
            >
              <Plane className="h-3 w-3 mr-1" />
              Aircraft
            </button>
            <button 
              className={cn("px-2 py-1 text-xs rounded flex items-center", 
                showVessels ? "bg-cyan-500/20 text-cyan-500" : "bg-muted/20 text-muted-foreground"
              )}
              onClick={() => setShowVessels(!showVessels)}
            >
              <Ship className="h-3 w-3 mr-1" />
              Naval
            </button>
            <button 
              className={cn("px-2 py-1 text-xs rounded flex items-center", 
                showUnits ? "bg-amber-500/20 text-amber-500" : "bg-muted/20 text-muted-foreground"
              )}
              onClick={() => setShowUnits(!showUnits)}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Units
            </button>
            <button 
              className={cn("px-2 py-1 text-xs rounded flex items-center", 
                showRadars ? "bg-purple-500/20 text-purple-500" : "bg-muted/20 text-muted-foreground"
              )}
              onClick={() => setShowRadars(!showRadars)}
            >
              <Radio className="h-3 w-3 mr-1" />
              Radar
            </button>
            <button 
              className={cn("px-2 py-1 text-xs rounded flex items-center", 
                showThreats ? "bg-eeg-red/20 text-eeg-red" : "bg-muted/20 text-muted-foreground"
              )}
              onClick={() => setShowThreats(!showThreats)}
            >
              <Target className="h-3 w-3 mr-1" />
              Threats
            </button>
          </div>
          
          {selectedLocation ? (
            <div className="flex-1 overflow-y-auto">
              <div className="text-sm font-medium flex items-center justify-between border-b border-border/30 pb-1 mb-2">
                <span className={cn(getTypeColor(selectedLocation.type, selectedLocation.status).split(' ')[0])}>
                  {selectedLocation.name}
                </span>
                <div className={cn(
                  "text-xs px-1 rounded",
                  selectedLocation.status === 'active' ? "bg-eeg-green/20 text-eeg-green" :
                  selectedLocation.status === 'alert' ? "bg-eeg-red/20 text-eeg-red" :
                  "bg-muted/20 text-muted-foreground"
                )}>
                  {selectedLocation.status?.toUpperCase()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-background/50 p-1 rounded">
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium capitalize">{selectedLocation.type}</div>
                </div>
                <div className="bg-background/50 p-1 rounded">
                  <div className="text-muted-foreground">ID</div>
                  <div className="font-medium">{selectedLocation.id}</div>
                </div>
                <div className="bg-background/50 p-1 rounded">
                  <div className="text-muted-foreground">Latitude</div>
                  <div className="font-medium">{selectedLocation.lat.toFixed(4)}°N</div>
                </div>
                <div className="bg-background/50 p-1 rounded">
                  <div className="text-muted-foreground">Longitude</div>
                  <div className="font-medium">{selectedLocation.lng.toFixed(4)}°E</div>
                </div>
              </div>
              
              {selectedLocation.details && (
                <div className="mb-3 bg-background/50 p-2 rounded text-xs">
                  <div className="text-muted-foreground mb-1">Details</div>
                  <div>{selectedLocation.details}</div>
                </div>
              )}
              
              <div className="mb-2 text-xs">
                <div className="text-muted-foreground mb-1">Local Sensor Data</div>
                <div className="h-32 bg-background/50 rounded overflow-hidden">
                  <ChartContainer config={{
                    value: { theme: { light: "#10b981", dark: "#10b981" } }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={localSensorData}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" tick={{ fontSize: 8 }} />
                        <YAxis hide />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent
                                  className="!bg-popover"
                                  payload={payload}
                                />
                              )
                            }
                            return null
                          }}
                        />
                        <Area
                          name="value"
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a location for details
            </div>
          )}
          
          <div className="mt-auto pt-2 border-t border-border/30 text-xs text-muted-foreground">
            <div>Total assets: {mapLocations.length}</div>
            <div>Alert status: {mapLocations.filter(l => l.status === 'alert').length} units</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISTracking;
