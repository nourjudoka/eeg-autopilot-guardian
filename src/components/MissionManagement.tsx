
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plane, Shield, Zap, Target, Satellite, Download, ArrowUp, Bomb, 
  Radio, AlertTriangle, CheckCircle, Rocket, Clipboard, CheckSquare, Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

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
  objectives?: string[];
  checklist?: ChecklistItem[];
}

interface MissionManagementProps {
  className?: string;
}

const MissionManagement: React.FC<MissionManagementProps> = ({ className }) => {
  const [activeMission, setActiveMission] = useState<MissionType | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [missionDetailsOpen, setMissionDetailsOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [missionObjectivesOpen, setMissionObjectivesOpen] = useState(false);

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
      objectives: [
        'Neutralize enemy command and control center',
        'Destroy communication infrastructure',
        'Minimize collateral damage to surrounding civilian structures',
        'Confirm target destruction with BDA'
      ],
      checklist: [
        { id: 'cs1-1', label: 'Pre-mission briefing completed', checked: true },
        { id: 'cs1-2', label: 'Weather conditions verified', checked: true },
        { id: 'cs1-3', label: 'Rules of engagement confirmed', checked: true },
        { id: 'cs1-4', label: 'Strike packages armed and verified', checked: true },
        { id: 'cs1-5', label: 'Target coordinates confirmed', checked: true },
        { id: 'cs1-6', label: 'Air defense suppression in progress', checked: false },
        { id: 'cs1-7', label: 'BDA assets in position', checked: false },
        { id: 'cs1-8', label: 'Exfiltration route planned', checked: true }
      ]
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
      objectives: [
        'Neutralize SAM sites in northern sector',
        'Jam enemy radar systems',
        'Create safe corridor for strike package',
        'Collect electronic intelligence on enemy defensive systems',
        'Monitor for mobile SAM deployments'
      ],
      checklist: [
        { id: 'cs2-1', label: 'Target radar frequencies identified', checked: true },
        { id: 'cs2-2', label: 'HARM missiles loaded and verified', checked: true },
        { id: 'cs2-3', label: 'EW pods programmed', checked: true },
        { id: 'cs2-4', label: 'Comm jamming plan approved', checked: false },
        { id: 'cs2-5', label: 'Mission timing synchronized with strike package', checked: false },
        { id: 'cs2-6', label: 'ELINT collection plan established', checked: true }
      ]
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
      objectives: [
        'Maintain aerial superiority over designated airspace',
        'Intercept and identify all unauthorized aircraft',
        'Protect ground assets from aerial threats',
        'Coordinate with ground-based air defense systems',
        'Provide early warning of incoming threats'
      ],
      checklist: [
        { id: 'cs3-1', label: 'CAP rotation schedule established', checked: true },
        { id: 'cs3-2', label: 'IFF systems verified', checked: true },
        { id: 'cs3-3', label: 'Engagement rules briefed', checked: true },
        { id: 'cs3-4', label: 'AWACS coordination established', checked: true },
        { id: 'cs3-5', label: 'Tanker support in position', checked: false },
        { id: 'cs3-6', label: 'QRA procedures reviewed', checked: true }
      ]
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
      objectives: [
        'Collect imagery of designated high-value targets',
        'Monitor troop movements and military buildup',
        'Assess defensive posture changes',
        'Identify new military installations',
        'Map changes to transportation infrastructure'
      ],
      checklist: [
        { id: 'cs4-1', label: 'Imaging systems calibrated', checked: true },
        { id: 'cs4-2', label: 'Flight path approved', checked: true },
        { id: 'cs4-3', label: 'Weather conditions optimal', checked: true },
        { id: 'cs4-4', label: 'Data link tested', checked: true },
        { id: 'cs4-5', label: 'Priority targets identified', checked: true },
        { id: 'cs4-6', label: 'Intelligence brief prepared', checked: true },
        { id: 'cs4-7', label: 'Data analysis team on standby', checked: true }
      ]
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
      objectives: [
        'Provide scheduled refueling for CAP aircraft',
        'Support strike package refueling needs',
        'Maintain fuel reserves for emergency refueling',
        'Coordinate with other tanker assets',
        'Maintain radio discipline in refueling zone'
      ],
      checklist: [
        { id: 'cs5-1', label: 'Refueling boom inspected', checked: true },
        { id: 'cs5-2', label: 'Fuel load verified', checked: true },
        { id: 'cs5-3', label: 'Refueling track established', checked: true },
        { id: 'cs5-4', label: 'Refueling schedule confirmed', checked: true },
        { id: 'cs5-5', label: 'Emergency procedures reviewed', checked: true },
        { id: 'cs5-6', label: 'Weather conditions monitored', checked: false }
      ]
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
      objectives: [
        'Neutralize enemy forces threatening friendly ground units',
        'Destroy enemy armor and artillery',
        'Provide show of force when required',
        'Maintain close coordination with JTAC',
        'Prevent friendly fire incidents'
      ],
      checklist: [
        { id: 'cs6-1', label: 'JTAC communication established', checked: true },
        { id: 'cs6-2', label: 'ROZ boundaries confirmed', checked: true },
        { id: 'cs6-3', label: 'IFF codes verified', checked: true },
        { id: 'cs6-4', label: 'Friendly positions marked', checked: true },
        { id: 'cs6-5', label: 'CAS 9-line brief received', checked: false },
        { id: 'cs6-6', label: 'Weapons armed and ready', checked: true }
      ]
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
      objectives: [
        'Infiltrate enemy command network',
        'Extract intelligence from secured databases',
        'Disrupt enemy communications',
        'Plant misleading information',
        'Monitor enemy cyber activities',
        'Secure our networks from counter-attacks'
      ],
      checklist: [
        { id: 'cs7-1', label: 'Target networks identified', checked: true },
        { id: 'cs7-2', label: 'Penetration tools prepared', checked: true },
        { id: 'cs7-3', label: 'Exfiltration channels secured', checked: true },
        { id: 'cs7-4', label: 'Attack vectors confirmed', checked: true },
        { id: 'cs7-5', label: 'Attribution masking in place', checked: true },
        { id: 'cs7-6', label: 'Counter-cyber defenses active', checked: false }
      ]
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
      objectives: [
        'Locate downed pilot using emergency beacon',
        'Establish secure perimeter for extraction',
        'Extract personnel safely',
        'Provide immediate medical care',
        'Return to friendly territory via secure corridor'
      ],
      checklist: [
        { id: 'cs8-1', label: 'Beacon frequency verified', checked: true },
        { id: 'cs8-2', label: 'Extraction team briefed', checked: true },
        { id: 'cs8-3', label: 'Medical team ready', checked: true },
        { id: 'cs8-4', label: 'Escort fighters assigned', checked: false },
        { id: 'cs8-5', label: 'SERE specialist on team', checked: true },
        { id: 'cs8-6', label: 'Secure comms established', checked: false }
      ]
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
      objectives: [
        'Capture high-resolution imagery of strike locations',
        'Assess level of target destruction',
        'Identify remaining threats or infrastructure',
        'Determine need for follow-up strikes',
        'Document collateral damage'
      ],
      checklist: [
        { id: 'cs9-1', label: 'Strike coordinates confirmed', checked: true },
        { id: 'cs9-2', label: 'Imaging sensors calibrated', checked: true },
        { id: 'cs9-3', label: 'Flight path planned', checked: true },
        { id: 'cs9-4', label: 'Data link tested', checked: false },
        { id: 'cs9-5', label: 'Analysis team briefed', checked: false },
        { id: 'cs9-6', label: 'Comparison imagery prepared', checked: true }
      ]
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
      objectives: [
        'Destroy enemy weapons manufacturing facility',
        'Eliminate critical military research lab',
        'Disrupt military supply chains',
        'Degrade enemy warfighting capability',
        'Destroy hardened bunker systems'
      ],
      checklist: [
        { id: 'cs10-1', label: 'Ordnance loaded and verified', checked: true },
        { id: 'cs10-2', label: 'Stealth systems checked', checked: true },
        { id: 'cs10-3', label: 'Target packages finalized', checked: true },
        { id: 'cs10-4', label: 'Mission approval received', checked: true },
        { id: 'cs10-5', label: 'Weather conditions assessed', checked: true },
        { id: 'cs10-6', label: 'Tanker support confirmed', checked: false },
        { id: 'cs10-7', label: 'Abort criteria established', checked: true }
      ]
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

  const toggleChecklistItem = (itemId: string) => {
    if (!activeMission || !activeMission.checklist) return;
    
    const updatedMission = {
      ...activeMission,
      checklist: activeMission.checklist.map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    };
    
    setActiveMission(updatedMission);
    toast({
      title: "Checklist updated",
      description: `Item ${itemId} status changed`,
    });
  };

  const launchMission = () => {
    if (!activeMission) return;
    
    const updatedMission = {
      ...activeMission,
      status: 'active' as const,
      progress: 5
    };
    
    setActiveMission(updatedMission);
    toast({
      title: "Mission Launched",
      description: `${activeMission.name} is now active`,
      variant: "default",
    });
  };

  const abortMission = () => {
    if (!activeMission) return;
    
    setMissionDetailsOpen(false);
    
    setTimeout(() => {
      const updatedMission = {
        ...activeMission,
        status: 'aborted' as const,
        progress: activeMission.progress
      };
      
      setActiveMission(updatedMission);
      toast({
        title: "Mission Aborted",
        description: `${activeMission.name} has been aborted`,
        variant: "destructive",
      });
    }, 500);
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
                      <Button size="sm" className="text-xs bg-eeg-green hover:bg-eeg-green/90" onClick={launchMission}>
                        <Rocket className="h-3 w-3 mr-1" /> Launch Mission
                      </Button>
                    )}
                    {activeMission.status === 'active' && (
                      <Button size="sm" variant="outline" className="text-xs border-eeg-red text-eeg-red hover:bg-eeg-red/10" onClick={abortMission}>
                        <AlertTriangle className="h-3 w-3 mr-1" /> Abort Mission
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => setMissionDetailsOpen(true)}
                    >
                      <Shield className="h-3 w-3 mr-1" /> View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => setMissionObjectivesOpen(true)}
                    >
                      <Info className="h-3 w-3 mr-1" /> Objectives
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => setChecklistOpen(true)}
                    >
                      <Clipboard className="h-3 w-3 mr-1" /> Checklist
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

      {/* Mission Details Dialog */}
      <Dialog open={missionDetailsOpen} onOpenChange={setMissionDetailsOpen}>
        <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              {activeMission && getMissionIcon(activeMission.type)}
              <span className="ml-2">
                {activeMission?.name} - Detailed Mission Brief
              </span>
            </DialogTitle>
            <DialogDescription>
              {activeMission?.type} - {activeMission?.location}
            </DialogDescription>
          </DialogHeader>

          {activeMission && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-egypt-gold">Mission Overview</h3>
                  <p className="text-sm">{activeMission.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-egypt-gold">Mission Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Status:</span>
                      <span>{getStatusIndicator(activeMission.status)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Priority:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(activeMission.priority)}/20 uppercase`}>
                        {activeMission.priority}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Mission Progress:</span>
                        <span>{activeMission.progress}%</span>
                      </div>
                      <Progress value={activeMission.progress} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-egypt-gold">Mission Objectives</h3>
                  <ul className="list-disc space-y-1 pl-5">
                    {activeMission.objectives?.map((objective, idx) => (
                      <li key={idx} className="text-sm">{objective}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-egypt-gold">Mission Parameters</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="grid grid-cols-2">
                      <dt className="text-muted-foreground">Time Frame:</dt>
                      <dd>{activeMission.timeFrame}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="text-muted-foreground">Location:</dt>
                      <dd>{activeMission.location}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="text-muted-foreground">Mission Type:</dt>
                      <dd>{activeMission.type}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="text-muted-foreground">Category:</dt>
                      <dd className="capitalize">{activeMission.category}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-egypt-gold">Assets</h3>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Assigned Aircraft</h4>
                    <ul className="pl-5 space-y-1">
                      {activeMission.aircraft.length > 0 ? (
                        activeMission.aircraft.map((aircraft, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <Plane className="h-3 w-3 mr-1" />
                            <span>{aircraft}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground text-sm">No aircraft assigned</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-egypt-gold">Mission Readiness</h3>
                  <div className="bg-radar-bg/50 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2">Checklist Status</h4>
                    <div className="space-y-1">
                      {activeMission.checklist && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completed items:</span>
                          <span className="text-sm">
                            {activeMission.checklist.filter(item => item.checked).length} / {activeMission.checklist.length}
                          </span>
                        </div>
                      )}
                      <Progress 
                        value={
                          activeMission.checklist
                            ? (activeMission.checklist.filter(item => item.checked).length / activeMission.checklist.length) * 100
                            : 0
                        } 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            {activeMission?.status === 'planned' && (
              <Button onClick={launchMission} className="bg-eeg-green hover:bg-eeg-green/90">
                <Rocket className="h-4 w-4 mr-2" /> Launch Mission
              </Button>
            )}
            {activeMission?.status === 'active' && (
              <Button onClick={abortMission} variant="destructive">
                <AlertTriangle className="h-4 w-4 mr-2" /> Abort Mission
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mission Objectives Sheet */}
      <Sheet open={missionObjectivesOpen} onOpenChange={setMissionObjectivesOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-background/95 backdrop-blur-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Target className="h-4 w-4 mr-2 text-egypt-gold" /> 
              Mission Objectives
            </SheetTitle>
            <SheetDescription>
              {activeMission?.name} - {activeMission?.type}
            </SheetDescription>
          </SheetHeader>
          
          {activeMission && (
            <div className="py-6">
              <p className="mb-4 text-sm">{activeMission.description}</p>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-egypt-gold" />
                  Primary Objectives
                </h3>
                
                <ul className="space-y-3">
                  {activeMission.objectives?.map((objective, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-radar-bg flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-medium text-egypt-gold">{idx + 1}</span>
                      </div>
                      <div className="text-sm">{objective}</div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-2">Mission Parameters</h3>
                <div className="bg-radar-bg/30 rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-3 text-xs">
                    <span className="text-muted-foreground">Time Frame:</span>
                    <span className="col-span-2">{activeMission.timeFrame}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="col-span-2">{activeMission.location}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="col-span-2">{getStatusIndicator(activeMission.status)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Mission Checklist Sheet */}
      <Sheet open={checklistOpen} onOpenChange={setChecklistOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-background/95 backdrop-blur-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Clipboard className="h-4 w-4 mr-2 text-egypt-gold" /> 
              Mission Checklist
            </SheetTitle>
            <SheetDescription>
              {activeMission?.name} - Pre-mission verification
            </SheetDescription>
          </SheetHeader>
          
          {activeMission?.checklist && activeMission.checklist.length > 0 ? (
            <div className="py-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">
                  Completed: {activeMission.checklist.filter(item => item.checked).length} / {activeMission.checklist.length}
                </span>
                <Progress 
                  value={(activeMission.checklist.filter(item => item.checked).length / activeMission.checklist.length) * 100} 
                  className="h-2 w-1/2" 
                />
              </div>
              
              <div className="space-y-2">
                {activeMission.checklist.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center p-2 rounded-md hover:bg-radar-bg/30 cursor-pointer ${
                      item.checked ? 'bg-radar-bg/20' : ''
                    }`}
                    onClick={() => toggleChecklistItem(item.id)}
                  >
                    <div className={`h-5 w-5 rounded border flex items-center justify-center mr-3
                      ${item.checked 
                        ? 'bg-eeg-green border-eeg-green text-background' 
                        : 'border-muted-foreground'}`
                    }>
                      {item.checked && <CheckSquare className="h-4 w-4" />}
                    </div>
                    <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>{item.label}</span>
                  </div>
                ))}
              </div>
              
              {activeMission.status === 'planned' && (
                <div className="mt-6">
                  <Button 
                    onClick={launchMission}
                    disabled={activeMission.checklist.some(item => !item.checked && item.id.includes('-1'))}
                    className="w-full bg-eeg-green hover:bg-eeg-green/90"
                  >
                    <Rocket className="h-4 w-4 mr-2" /> 
                    {activeMission.checklist.some(item => !item.checked && item.id.includes('-1'))
                      ? 'Complete Critical Items First'
                      : 'Launch Mission'
                    }
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    All critical checklist items must be completed before launch
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              No checklist available for this mission
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MissionManagement;
