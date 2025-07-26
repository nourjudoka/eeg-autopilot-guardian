
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Plane, AlertTriangle, Info, Lock, Shield, Clock } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

interface Aircraft {
  id: string;
  model: string;
  callsign: string;
  autopilot: boolean;
  altitude: number;
  speed: number;
  heading: number;
  fuelRemaining: number;
  damageAreas: DamageArea[];
  status: 'operational' | 'combat' | 'returning' | 'damaged';
  missionTime: number; // in minutes
  flyingHours: number; // total flying hours
  lastMaintenance: string; // date of last maintenance
  maintenanceStatus: 'good' | 'due' | 'overdue';
  maintenanceHistory: MaintenanceRecord[];
}

interface MaintenanceRecord {
  date: string;
  type: 'routine' | 'major' | 'repair';
  description: string;
  technician: string;
  hoursAdded: number;
}

interface DamageArea {
  name: string;
  status: 'operational' | 'damaged' | 'critical';
  percentage: number;
  description?: string;
}

interface AircraftStatusProps {
  className?: string;
}

const AircraftStatus: React.FC<AircraftStatusProps> = ({ className }) => {
  const { t } = useLanguage();
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  const [aircraftList, setAircraftList] = useState<Aircraft[]>([
    {
      id: 'fighter1',
      model: 'F-16C',
      callsign: 'EAGLE-1',
      autopilot: false,
      altitude: 32500,
      speed: 540,
      heading: 278,
      fuelRemaining: 72,
      status: 'combat',
      missionTime: 43,
      flyingHours: 1245.8,
      lastMaintenance: '2025-03-12',
      maintenanceStatus: 'good',
      maintenanceHistory: [
        { date: '2025-03-12', type: 'routine', description: 'Routine inspection and oil change', technician: 'Eng. M. Hassan', hoursAdded: 120 },
        { date: '2025-01-05', type: 'major', description: 'Engine overhaul and avionics update', technician: 'Eng. K. Mahmoud', hoursAdded: 500 }
      ],
      damageAreas: [
        { name: 'Airframe', status: 'operational', percentage: 98, description: 'Minor stress damage on left wing' },
        { name: 'Propulsion', status: 'operational', percentage: 100, description: 'Systems nominal' },
        { name: 'Avionics', status: 'operational', percentage: 95, description: 'Navigation system showing intermittent errors' },
        { name: 'Weapons', status: 'operational', percentage: 100, description: 'All missile systems functional' },
        { name: 'Sensors', status: 'operational', percentage: 92, description: 'Forward LIDAR system degraded' }
      ]
    },
    {
      id: 'fighter2',
      model: 'F-35B',
      callsign: 'REAPER-1',
      autopilot: true,
      altitude: 38700,
      speed: 620,
      heading: 145,
      fuelRemaining: 83,
      status: 'operational',
      missionTime: 21,
      flyingHours: 478.3,
      lastMaintenance: '2025-03-22',
      maintenanceStatus: 'good',
      maintenanceHistory: [
        { date: '2025-03-22', type: 'routine', description: 'Pre-flight check and system diagnostics', technician: 'Eng. A. Saleh', hoursAdded: 150 },
        { date: '2025-02-11', type: 'routine', description: 'Software update and sensor calibration', technician: 'Eng. L. Farid', hoursAdded: 100 }
      ],
      damageAreas: [
        { name: 'Airframe', status: 'operational', percentage: 100, description: 'No damage detected' },
        { name: 'Propulsion', status: 'operational', percentage: 100, description: 'Systems nominal' },
        { name: 'Avionics', status: 'operational', percentage: 100, description: 'All systems functional' },
        { name: 'Weapons', status: 'operational', percentage: 100, description: 'All missile systems functional' },
        { name: 'Sensors', status: 'operational', percentage: 100, description: 'All sensor systems functional' }
      ]
    },
    {
      id: 'fighter3',
      model: 'Su-35',
      callsign: 'SPHINX-1',
      autopilot: false,
      altitude: 29800,
      speed: 580,
      heading: 92,
      fuelRemaining: 45,
      status: 'damaged',
      missionTime: 78,
      flyingHours: 2156.7,
      lastMaintenance: '2025-02-18',
      maintenanceStatus: 'overdue',
      maintenanceHistory: [
        { date: '2025-02-18', type: 'repair', description: 'Combat damage repair to wing structure', technician: 'Eng. T. Youssef', hoursAdded: 200 },
        { date: '2025-01-25', type: 'routine', description: 'Routine inspection and hydraulics check', technician: 'Eng. R. Amr', hoursAdded: 120 },
        { date: '2024-11-03', type: 'major', description: 'Complete avionics overhaul', technician: 'Eng. S. Khalid', hoursAdded: 600 }
      ],
      damageAreas: [
        { name: 'Airframe', status: 'damaged', percentage: 68, description: 'Structural damage to right wing' },
        { name: 'Propulsion', status: 'operational', percentage: 87, description: 'Minor thrust reduction' },
        { name: 'Avionics', status: 'damaged', percentage: 62, description: 'Navigation system compromised' },
        { name: 'Weapons', status: 'operational', percentage: 90, description: '2 missile systems offline' },
        { name: 'Sensors', status: 'damaged', percentage: 55, description: 'Radar system operating at reduced capacity' }
      ]
    },
    {
      id: 'fighter4',
      model: 'Mirage 2000',
      callsign: 'PHARAOH-2',
      autopilot: true,
      altitude: 33200,
      speed: 510,
      heading: 225,
      fuelRemaining: 28,
      status: 'returning',
      missionTime: 112,
      flyingHours: 3645.1,
      lastMaintenance: '2025-03-05',
      maintenanceStatus: 'due',
      maintenanceHistory: [
        { date: '2025-03-05', type: 'routine', description: 'Routine inspection and hydraulics maintenance', technician: 'Eng. N. Mostafa', hoursAdded: 150 },
        { date: '2025-01-12', type: 'repair', description: 'Weapons bay repair and recalibration', technician: 'Eng. H. Gamal', hoursAdded: 80 },
        { date: '2024-10-22', type: 'major', description: 'Engine replacement and testing', technician: 'Eng. M. Adel', hoursAdded: 800 }
      ],
      damageAreas: [
        { name: 'Airframe', status: 'operational', percentage: 92, description: 'Minor stress damage detected' },
        { name: 'Propulsion', status: 'operational', percentage: 89, description: 'Fuel efficiency reduced' },
        { name: 'Avionics', status: 'operational', percentage: 95, description: 'Systems functional' },
        { name: 'Weapons', status: 'damaged', percentage: 65, description: 'Missile bay door jammed' },
        { name: 'Sensors', status: 'operational', percentage: 97, description: 'All sensor systems functional' }
      ]
    }
  ]);
  
  const [showDamageDetails, setShowDamageDetails] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'maintenance'>('status');
  
  // Initialize with first aircraft
  useEffect(() => {
    if (aircraftList.length > 0 && !selectedAircraft) {
      setSelectedAircraft(aircraftList[0].id);
    }
  }, [aircraftList, selectedAircraft]);
  
  // Simulate aircraft status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAircraftList(prevAircraft => {
        return prevAircraft.map(aircraft => {
          // Random changes to aircraft data
          const altitudeChange = Math.floor(Math.random() * 200 - 100);
          const speedChange = Math.floor(Math.random() * 10 - 5);
          const headingChange = Math.floor(Math.random() * 3 - 1);
          const fuelDecrease = aircraft.status === 'combat' ? 0.2 : 0.1;
          const missionTimeIncrease = 1/60; // 1 second in minutes
          const flyingHoursIncrease = 1/3600; // 1 second in hours
          
          // Random autopilot change (rare)
          const autopilot = Math.random() > 0.95 ? !aircraft.autopilot : aircraft.autopilot;
          
          // Update damage areas occasionally
          const updatedDamageAreas = aircraft.damageAreas.map(area => {
            if (Math.random() > 0.9) {
              // More likely to worsen for damaged aircraft
              const changeDirection = aircraft.status === 'damaged' ? 
                (Math.random() > 0.7 ? -1 : 1) : (Math.random() > 0.3 ? 1 : -1);
              const change = changeDirection * Math.floor(Math.random() * 5);
              const newPercentage = Math.max(0, Math.min(100, area.percentage + change));
              
              let newStatus: 'operational' | 'damaged' | 'critical' = 'operational';
              let newDescription = area.description;
              
              if (newPercentage < 40) {
                newStatus = 'critical';
                newDescription = `CRITICAL: ${area.name} systems failing`;
              } else if (newPercentage < 70) {
                newStatus = 'damaged';
                newDescription = `WARNING: ${area.name} systems compromised`;
              } else {
                newDescription = area.name === 'Airframe' ? `Minor stress detected` : 
                                 area.name === 'Propulsion' ? `Systems nominal` :
                                 area.name === 'Avionics' ? `All systems functional` :
                                 area.name === 'Weapons' ? `All weapon systems functional` :
                                 `All sensor systems functional`;
              }
              
              return {
                ...area,
                percentage: newPercentage,
                status: newStatus,
                description: newDescription
              };
            }
            return area;
          });
          
          // Update aircraft status based on damage and fuel
          let aircraftStatus = aircraft.status;
          const hasZeroDamage = updatedDamageAreas.some(area => area.percentage === 0);
          const hasCriticalDamage = updatedDamageAreas.some(area => area.status === 'critical');
          const lowFuel = aircraft.fuelRemaining - fuelDecrease < 20;
          
          if (hasZeroDamage) {
            aircraftStatus = 'damaged';
          } else if (hasCriticalDamage || lowFuel) {
            aircraftStatus = 'returning';
          }
          
          return {
            ...aircraft,
            altitude: aircraft.altitude + altitudeChange,
            speed: aircraft.speed + speedChange,
            heading: (aircraft.heading + headingChange) % 360,
            fuelRemaining: Math.max(0, aircraft.fuelRemaining - fuelDecrease),
            autopilot,
            damageAreas: updatedDamageAreas,
            status: aircraftStatus,
            missionTime: aircraft.missionTime + missionTimeIncrease,
            flyingHours: aircraft.flyingHours + flyingHoursIncrease
          };
        });
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = (status: 'operational' | 'damaged' | 'critical') => {
    switch (status) {
      case 'operational':
        return 'bg-eeg-green';
      case 'damaged':
        return 'bg-eeg-yellow';
      case 'critical':
        return 'bg-eeg-red';
    }
  };
  
  const getAircraftStatusColor = (status: 'operational' | 'combat' | 'returning' | 'damaged') => {
    switch (status) {
      case 'operational':
        return 'text-eeg-green';
      case 'combat':
        return 'text-egypt-gold';
      case 'returning':
        return 'text-eeg-yellow';
      case 'damaged':
        return 'text-eeg-red';
    }
  };

  const getMaintenanceStatusColor = (status: 'good' | 'due' | 'overdue') => {
    switch (status) {
      case 'good':
        return 'text-eeg-green';
      case 'due':
        return 'text-egypt-gold';
      case 'overdue':
        return 'text-eeg-red';
    }
  };
  
  const handleToggleDamageDetails = (name: string) => {
    if (showDamageDetails === name) {
      setShowDamageDetails(null);
    } else {
      setShowDamageDetails(name);
    }
  };
  
  const getCurrentAircraft = () => {
    return aircraftList.find(a => a.id === selectedAircraft) || aircraftList[0];
  };
  
  const currentAircraft = getCurrentAircraft();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className={cn("glassmorphism relative", className)}>
      {/* ISO 27001 Compliance Indicator */}
      <div className="absolute top-1 right-1 flex items-center gap-1 text-[10px] text-egypt-gold px-1 py-0.5 bg-background/50 rounded">
        <Lock className="w-3 h-3" />
        <span>ISO 27001</span>
        <Shield className="w-3 h-3" />
        <span>AES/RSA</span>
      </div>
      
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium flex-1">{t('aircraft.status')}</h3>
        {currentAircraft && (
          <div className="text-sm text-muted-foreground">
            {currentAircraft.model} | {currentAircraft.callsign}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">{t('aircraft.selection')}</span>
            <div className="flex items-center">
              <Plane className="w-3 h-3 ltr:mr-1 rtl:ml-1 text-muted-foreground" />
              <span className="text-xs">{aircraftList.length} {t('aircraft')}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 mb-3">
            {aircraftList.map(aircraft => (
              <div 
                key={aircraft.id}
                onClick={() => setSelectedAircraft(aircraft.id)}
                className={cn(
                  "px-2 py-1 text-xs rounded cursor-pointer transition-colors",
                  selectedAircraft === aircraft.id ? "bg-egypt-gold/20 text-egypt-gold" : "hover:bg-radar-bg"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span>{aircraft.callsign}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">({aircraft.model})</span>
                  </div>
                  <div className={cn("flex items-center", getAircraftStatusColor(aircraft.status))}>
                    {aircraft.status === 'damaged' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {aircraft.status === 'returning' && <Info className="w-3 h-3 mr-1" />}
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/20 mb-4">
          <div 
            className={cn("py-2 px-4 text-sm cursor-pointer border-b-2", 
              activeTab === 'status' ? "border-egypt-gold text-egypt-gold" : "border-transparent"
            )}
            onClick={() => setActiveTab('status')}
          >
            {t('status')}
          </div>
          <div 
            className={cn("py-2 px-4 text-sm cursor-pointer border-b-2", 
              activeTab === 'maintenance' ? "border-egypt-gold text-egypt-gold" : "border-transparent"
            )}
            onClick={() => setActiveTab('maintenance')}
          >
            {t('maintenance')}
          </div>
        </div>
        
        {currentAircraft && activeTab === 'status' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-radar-bg rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">{t('altitude')}</div>
                <div className="text-lg font-medium">{currentAircraft.altitude.toLocaleString()} ft</div>
              </div>
              <div className="bg-radar-bg rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">{t('speed')}</div>
                <div className="text-lg font-medium">{currentAircraft.speed} kts</div>
              </div>
              <div className="bg-radar-bg rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">{t('heading')}</div>
                <div className="text-lg font-medium">{currentAircraft.heading}°</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm">{t('autopilot')}</div>
              <div className={cn("text-sm font-medium px-2 py-1 rounded", {
                "bg-eeg-green text-white": currentAircraft.autopilot,
                "bg-muted text-muted-foreground": !currentAircraft.autopilot
              })}>
                {currentAircraft.autopilot ? t('engaged') : t('disengaged')}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{t('fuel.remaining')}</span>
                <span className={cn("text-sm font-medium", {
                  "text-eeg-red": currentAircraft.fuelRemaining < 20,
                  "text-eeg-yellow": currentAircraft.fuelRemaining >= 20 && currentAircraft.fuelRemaining < 40,
                  "text-eeg-green": currentAircraft.fuelRemaining >= 40
                })}>{currentAircraft.fuelRemaining}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500 ease-out", {
                    "bg-eeg-red": currentAircraft.fuelRemaining < 20,
                    "bg-eeg-yellow": currentAircraft.fuelRemaining >= 20 && currentAircraft.fuelRemaining < 40,
                    "bg-eeg-green": currentAircraft.fuelRemaining >= 40
                  })}
                  style={{ width: `${currentAircraft.fuelRemaining}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <h4 className="text-md font-medium mb-2">Damage Report</h4>
                <div className="space-y-2">
                  {currentAircraft.damageAreas.map((area) => (
                    <div 
                      key={area.name} 
                      className="flex items-center cursor-pointer hover:bg-radar-bg/50 p-1 rounded"
                      onClick={() => handleToggleDamageDetails(area.name)}
                    >
                      <div className={cn("w-2 h-2 rounded-full mr-2", getStatusColor(area.status))}></div>
                      <div className="text-sm flex-1">{area.name}</div>
                      <div className="text-sm font-medium">{area.percentage}%</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-2 border-t border-border/10 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="text-muted-foreground">Mission Time:</div>
                    <div>{Math.floor(currentAircraft.missionTime)}:{(currentAircraft.missionTime % 1 * 60).toFixed(0).padStart(2, '0')}</div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-muted-foreground">Status:</div>
                    <div className={getAircraftStatusColor(currentAircraft.status)}>
                      {currentAircraft.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-radar-bg rounded-md p-2 flex items-center justify-center aspect-square overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 h-4/5 relative">
                    {/* Aircraft silhouette */}
                    <Plane size={150} className="text-muted-foreground/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    
                    {/* Damage indicators */}
                    {currentAircraft.damageAreas.map((area) => {
                      let position = {};
                      let size = "w-4 h-4";
                      
                      switch (area.name) {
                        case 'Airframe':
                          position = { top: '45%', left: '50%', transform: 'translate(-50%, -50%)' };
                          size = "w-20 h-8";
                          break;
                        case 'Propulsion':
                          position = { bottom: '10%', left: '50%', transform: 'translate(-50%, 0)' };
                          size = "w-8 h-6";
                          break;
                        case 'Avionics':
                          position = { top: '30%', left: '50%', transform: 'translate(-50%, 0)' };
                          size = "w-6 h-6";
                          break;
                        case 'Weapons':
                          position = { top: '45%', left: '30%', transform: 'translate(0, -50%)' };
                          size = "w-3 h-8";
                          break;
                        case 'Sensors':
                          position = { top: '25%', left: '50%', transform: 'translate(-50%, 0)' };
                          size = "w-4 h-4";
                          break;
                      }
                      
                      return (
                        <div 
                          key={area.name}
                          className={cn(
                            "absolute rounded opacity-70", 
                            size,
                            area.status === 'operational' ? "bg-eeg-green/20 border border-eeg-green/40" : 
                            area.status === 'damaged' ? "bg-eeg-yellow/30 border border-eeg-yellow/70 animate-pulse-subtle" : 
                            "bg-eeg-red/30 border border-eeg-red/70 animate-pulse-subtle"
                          )}
                          style={position as React.CSSProperties}
                        />
                      );
                    })}
                  </div>
                </div>
                
                {showDamageDetails && (
                  <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-xs">
                    <div className="font-medium mb-1">
                      {showDamageDetails} Status
                    </div>
                    <div>
                      {currentAircraft.damageAreas.find(area => area.name === showDamageDetails)?.description || 'No details available'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {currentAircraft && activeTab === 'maintenance' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-radar-bg rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">TOTAL FLYING HOURS</div>
                <div className="text-lg font-medium">{currentAircraft.flyingHours.toFixed(1)}</div>
              </div>
              <div className="bg-radar-bg rounded-md p-2">
                <div className="text-xs text-muted-foreground mb-1">NEXT MAINTENANCE</div>
                <div className={cn("text-sm font-medium", getMaintenanceStatusColor(currentAircraft.maintenanceStatus))}>
                  {currentAircraft.maintenanceStatus === 'good' ? 'SCHEDULED' : 
                   currentAircraft.maintenanceStatus === 'due' ? 'DUE SOON' : 'OVERDUE'}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Last Maintenance</span>
                <span className="text-sm">{formatDate(currentAircraft.lastMaintenance)}</span>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-md font-medium mb-2">Maintenance History</h4>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 scrollbar-thin">
                {currentAircraft.maintenanceHistory.map((record, index) => (
                  <div key={index} className="bg-radar-bg/50 p-2 rounded text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <div className={cn("font-medium", 
                        record.type === 'routine' ? "text-eeg-green" : 
                        record.type === 'repair' ? "text-eeg-yellow" : 
                        "text-egypt-gold"
                      )}>
                        {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                      </div>
                      <div className="text-muted-foreground">{formatDate(record.date)}</div>
                    </div>
                    <div>{record.description}</div>
                    <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                      <div>Technician: {record.technician}</div>
                      <div>Hours Added: {record.hoursAdded}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-border/10 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Maintenance Records</span>
                <span className="text-egypt-gold flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  AES-256 Encrypted
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AircraftStatus;
