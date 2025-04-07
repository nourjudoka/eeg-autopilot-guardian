
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Shield, Zap, Target, Satellite, Download, ArrowUp, Bomb, Radio, AlertTriangle, CheckCircle, Rocket } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MissionType {
  id: string;
  type: string;
  category: 'offensive' | 'defensive' | 'intelligence' | 'support';
  name: string;
  status: 'planned' | 'active' | 'completed' | 'aborted';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  aircraft: string[];
  location: string;
  timeFrame: string;
  description: string;
}

interface MissionManagementProps {
  className?: string;
}

const MissionManagement: React.FC<MissionManagementProps> = ({ className }) => {
  const [activeMission, setActiveMission] = useState<MissionType | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Mission categories and their associated icons
  const missionCategories = [
    { id: 'offensive', name: 'Offensive', icon: <Target className="h-4 w-4" /> },
    { id: 'defensive', name: 'Defensive', icon: <Shield className="h-4 w-4" /> },
    { id: 'intelligence', name: 'Intelligence', icon: <Satellite className="h-4 w-4" /> },
    { id: 'support', name: 'Support', icon: <Radio className="h-4 w-4" /> },
  ];

  // Sample mission data
  const missions: MissionType[] = [
    {
      id: '1',
      type: 'Air-to-Ground Attack',
      category: 'offensive',
      name: 'SCORPION STRIKE',
      status: 'active',
      priority: 'high',
      progress: 65,
      aircraft: ['F-16C #AF-2103', 'F-16C #AF-2105'],
      location: 'Eastern Sector, Grid 42B',
      timeFrame: '08:30 - 09:45 UTC',
      description: 'Precision strike against enemy command infrastructure with laser-guided munitions.',
    },
    {
      id: '2',
      type: 'SEAD',
      category: 'offensive',
      name: 'SILENT THUNDER',
      status: 'planned',
      priority: 'critical',
      progress: 0,
      aircraft: ['EA-18G #NV-552', 'F-35A #AF-0051'],
      location: 'Northern Defense Zone',
      timeFrame: '10:15 - 11:30 UTC',
      description: 'Suppression of Enemy Air Defenses using anti-radiation missiles and electronic warfare.',
    },
    {
      id: '3',
      type: 'Air Defense',
      category: 'defensive',
      name: 'DESERT SHIELD',
      status: 'active',
      priority: 'high',
      progress: 42,
      aircraft: ['F-22A #AF-09', 'F-15C #AF-230', 'F-15C #AF-232'],
      location: 'Southern Border Airspace',
      timeFrame: '06:00 - 18:00 UTC',
      description: 'Combat Air Patrol to protect airspace and intercept unauthorized aircraft.',
    },
    {
      id: '4',
      type: 'Strategic Reconnaissance',
      category: 'intelligence',
      name: 'EAGLE EYE',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      aircraft: ['RQ-4 #AF-11', 'U-2S #AF-68'],
      location: 'Western Border Region',
      timeFrame: '02:30 - 05:45 UTC',
      description: 'High-altitude surveillance of strategic military installations and troop movements.',
    },
    {
      id: '5',
      type: 'Aerial Refueling',
      category: 'support',
      name: 'DESERT OASIS',
      status: 'active',
      priority: 'medium',
      progress: 78,
      aircraft: ['KC-135 #AF-31007'],
      location: 'Central Airspace Corridor',
      timeFrame: '07:00 - 11:00 UTC',
      description: 'Providing mid-air refueling for strike packages and long-range patrols.',
    },
    {
      id: '6',
      type: 'Close Air Support',
      category: 'offensive',
      name: 'SCORCHED EARTH',
      status: 'active',
      priority: 'high',
      progress: 25,
      aircraft: ['A-10C #AF-188', 'A-10C #AF-190'],
      location: 'Forward Operating Base Nexus',
      timeFrame: '09:15 - 11:30 UTC',
      description: 'Supporting ground troops with close air support against hostile forces.',
    },
    {
      id: '7',
      type: 'Cyber Warfare',
      category: 'intelligence',
      name: 'SILENT VECTOR',
      status: 'active',
      priority: 'high',
      progress: 55,
      aircraft: [],
      location: 'Network Operations Center',
      timeFrame: '00:00 - 23:59 UTC',
      description: 'Cyber operations targeting enemy command and control systems.',
    },
    {
      id: '8',
      type: 'Search and Rescue',
      category: 'support',
      name: 'DESERT ANGEL',
      status: 'planned',
      priority: 'critical',
      progress: 0,
      aircraft: ['HH-60 #AF-26045', 'HC-130 #AF-9731'],
      location: 'Eastern Combat Zone',
      timeFrame: '14:00 - 16:00 UTC',
      description: 'Combat search and rescue for downed pilot in hostile territory.',
    },
    {
      id: '9',
      type: 'Battle Damage Assessment',
      category: 'intelligence',
      name: 'AFTERMATH',
      status: 'planned',
      priority: 'medium',
      progress: 0,
      aircraft: ['MQ-9 #AF-011'],
      location: 'Previous Strike Locations',
      timeFrame: '12:00 - 14:00 UTC',
      description: 'Post-strike imagery and assessment of target destruction effectiveness.',
    },
    {
      id: '10',
      type: 'Strategic Bombing',
      category: 'offensive',
      name: 'MIDNIGHT HAMMER',
      status: 'aborted',
      priority: 'critical',
      progress: 30,
      aircraft: ['B-2A #AF-0082', 'B-2A #AF-0085'],
      location: 'Deep Strike Zone Alpha',
      timeFrame: '23:00 - 02:00 UTC',
      description: 'Strategic bombing of high-value military industrial targets.',
    },
  ];

  const filteredMissions = activeTab === 'all' 
    ? missions 
    : missions.filter(mission => mission.category === activeTab);

  const getMissionIcon = (type: string) => {
    switch(type) {
      case 'Air-to-Ground Attack':
      case 'Close Air Support':
        return <Bomb className="h-4 w-4" />;
      case 'SEAD':
      case 'Strategic Bombing':
        return <Target className="h-4 w-4" />;
      case 'Air Defense':
        return <Shield className="h-4 w-4" />;
      case 'Strategic Reconnaissance':
      case 'Battle Damage Assessment':
        return <Satellite className="h-4 w-4" />;
      case 'Aerial Refueling':
        return <ArrowUp className="h-4 w-4" />;
      case 'Cyber Warfare':
        return <Zap className="h-4 w-4" />;
      case 'Search and Rescue':
        return <Download className="h-4 w-4" />;
      default:
        return <Plane className="h-4 w-4" />;
    }
  };

  const getStatusIndicator = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="flex items-center text-eeg-green">
          <Zap className="h-3 w-3 mr-1 animate-pulse" /> ACTIVE
        </span>;
      case 'planned':
        return <span className="flex items-center text-egypt-blue">
          <Plane className="h-3 w-3 mr-1" /> PLANNED
        </span>;
      case 'completed':
        return <span className="flex items-center text-eeg-green">
          <CheckCircle className="h-3 w-3 mr-1" /> COMPLETED
        </span>;
      case 'aborted':
        return <span className="flex items-center text-eeg-red">
          <AlertTriangle className="h-3 w-3 mr-1" /> ABORTED
        </span>;
      default:
        return status.toUpperCase();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low':
        return 'bg-blue-400';
      case 'medium':
        return 'bg-yellow-400';
      case 'high':
        return 'bg-orange-400';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleMissionClick = (mission: MissionType) => {
    setActiveMission(mission);
  };

  return (
    <div className={cn("egypt-glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="egypt-header">Mission Management</h3>
        <div className="ml-auto text-xs">
          <span className="text-eeg-green mr-2">● {missions.filter(m => m.status === 'active').length} Active</span>
          <span className="text-egypt-blue mr-2">● {missions.filter(m => m.status === 'planned').length} Planned</span>
          <span className="text-eeg-red">● {missions.filter(m => m.status === 'aborted').length} Aborted</span>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="p-4">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-radar-bg">
            <TabsTrigger value="all">All Missions</TabsTrigger>
            {missionCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center"
              >
                {category.icon}
                <span className="ml-1">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs h-8">
              <Plane className="h-3 w-3 mr-1" /> New Mission
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 h-[280px] overflow-y-auto bg-radar-bg/50 rounded-md p-2">
            <div className="space-y-1">
              {filteredMissions.length > 0 ? (
                filteredMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`p-2 rounded border border-glass-border cursor-pointer transition-colors ${
                      activeMission?.id === mission.id
                        ? 'bg-radar-bg border-egypt-gold/40'
                        : 'hover:bg-radar-bg/80'
                    }`}
                    onClick={() => handleMissionClick(mission)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2">
                        <div className={`p-1 rounded ${mission.category === 'offensive' ? 'bg-egypt-red/20' : 
                                                       mission.category === 'defensive' ? 'bg-egypt-blue/20' :
                                                       mission.category === 'intelligence' ? 'bg-egypt-gold/20' :
                                                       'bg-egypt-sand/20'}`}>
                          {getMissionIcon(mission.type)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{mission.name}</div>
                          <div className="text-xs text-muted-foreground">{mission.type}</div>
                        </div>
                      </div>
                      <div className={`px-1 py-0.5 rounded text-[10px] ${getPriorityColor(mission.priority)}/20 uppercase`}>
                        {mission.priority}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs">
                        {getStatusIndicator(mission.status)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Progress value={mission.progress} className="h-1 w-20" />
                        <span className="text-[10px]">{mission.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No missions in this category
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 h-[280px] overflow-y-auto">
            {activeMission ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center">
                        {getMissionIcon(activeMission.type)}
                        <span className="ml-2">{activeMission.name}</span>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded ${getPriorityColor(activeMission.priority)}/20`}>
                          {activeMission.priority.toUpperCase()}
                        </span>
                      </CardTitle>
                      <CardDescription>{activeMission.type} - {activeMission.location}</CardDescription>
                    </div>
                    <div>
                      {getStatusIndicator(activeMission.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Mission Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">Time Frame:</span>
                          <span className="col-span-2">{activeMission.timeFrame}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">Progress:</span>
                          <div className="col-span-2 flex items-center gap-2">
                            <Progress value={activeMission.progress} className="h-2 w-full" />
                            <span>{activeMission.progress}%</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="col-span-2 capitalize">{activeMission.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Assigned Aircraft</h4>
                      <div className="space-y-1 text-xs">
                        {activeMission.aircraft.length > 0 ? (
                          activeMission.aircraft.map((aircraft, idx) => (
                            <div key={idx} className="flex items-center">
                              <Plane className="h-3 w-3 mr-1" />
                              <span>{aircraft}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">No aircraft assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Mission Objective</h4>
                    <p className="text-sm">{activeMission.description}</p>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {activeMission.status === 'planned' && (
                      <Button size="sm" className="text-xs bg-eeg-green hover:bg-eeg-green/90">
                        <Rocket className="h-3 w-3 mr-1" /> Launch Mission
                      </Button>
                    )}
                    {activeMission.status === 'active' && (
                      <Button size="sm" variant="outline" className="text-xs border-eeg-red text-eeg-red hover:bg-eeg-red/10">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Abort Mission
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" /> View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Plane className="h-10 w-10 mb-2 opacity-50" />
                <p>Select a mission to view details</p>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default MissionManagement;
