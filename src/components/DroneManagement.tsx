
import { useState } from "react";
import { Aircraft } from "@/data/aircraftData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Drone, Activity, Battery, Signal, MapPin, Radio } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DroneManagementProps {
  className?: string;
}

// Get UAVs from the aircraftData imported at the component level
const getUAVs = (): Aircraft[] => {
  // This is just a mock implementation since we're not importing the real data here
  // The actual component will import aircraftData and filter for UAVs
  return [
    { id: 'ch4', name: 'CASC CH-4 Rainbow', category: 'Unmanned Aerial Vehicles', type: 'MALE UAV', inService: 18, status: 'Active' },
    { id: 'wingloong', name: 'Wing Loong I', category: 'Unmanned Aerial Vehicles', type: 'MALE UAV', inService: 20, status: 'Active' },
    { id: 'asn209', name: 'ASN-209', category: 'Unmanned Aerial Vehicles', type: 'Tactical UAV', inService: 12, status: 'Active' },
    { id: 'alsaber', name: 'Al-Saber', category: 'Unmanned Aerial Vehicles', type: 'Tactical UAV', inService: 30, status: 'Active' },
    { id: 'yabhon', name: 'Adcom Yabhon Flash 20', category: 'Unmanned Aerial Vehicles', type: 'MALE UAV', inService: 8, status: 'Active' },
    { id: 'scarab', name: 'Teledyne Ryan Model 324 Scarab', category: 'Unmanned Aerial Vehicles', type: 'Reconnaissance drone', inService: 56, status: 'Active' }
  ] as Aircraft[];
};

interface DroneStatus {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'In Mission' | 'Maintenance' | 'Offline';
  batteryLevel: number;
  signalStrength: number;
  currentLocation: string;
  altitude: number;
  speed: number;
  lastCommunication: Date;
}

const getDroneStatuses = (): DroneStatus[] => {
  const uavs = getUAVs();
  // Generate mock status data for each UAV
  return uavs.map(uav => ({
    id: uav.id,
    name: uav.name,
    type: uav.type,
    status: Math.random() > 0.3 ? 'Active' : Math.random() > 0.5 ? 'In Mission' : 'Maintenance',
    batteryLevel: Math.floor(Math.random() * 100),
    signalStrength: Math.floor(Math.random() * 100),
    currentLocation: ['Sinai Peninsula', 'Cairo West Airbase', 'Mediterranean Coast', 'Western Desert', 'Red Sea Coastline'][Math.floor(Math.random() * 5)],
    altitude: Math.floor(Math.random() * 10000),
    speed: Math.floor(Math.random() * 500),
    lastCommunication: new Date()
  }));
};

const DroneManagement = ({ className }: DroneManagementProps) => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrone, setSelectedDrone] = useState<DroneStatus | null>(null);
  const [controlDialogOpen, setControlDialogOpen] = useState(false);
  
  const droneStatuses = getDroneStatuses();
  
  const filteredDrones = droneStatuses.filter(drone => 
    (activeTab === "all" || 
     (activeTab === "active" && drone.status === "Active") ||
     (activeTab === "mission" && drone.status === "In Mission") ||
     (activeTab === "maintenance" && drone.status === "Maintenance")) &&
    (drone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     drone.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getBatteryStatusColor = (level: number) => {
    if (level > 70) return "text-green-500";
    if (level > 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getSignalStatusColor = (level: number) => {
    if (level > 70) return "text-green-500";
    if (level > 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "Active": "bg-green-500/20 text-green-500",
      "In Mission": "bg-blue-500/20 text-blue-500",
      "Maintenance": "bg-yellow-500/20 text-yellow-500",
      "Offline": "bg-red-500/20 text-red-500",
    };
    
    return (
      <Badge className={colors[status] || ""} variant="outline">
        {status}
      </Badge>
    );
  };

  const handleLaunchMission = () => {
    if (!selectedDrone) return;
    
    toast({
      title: "Mission Launched",
      description: `${selectedDrone.name} has been deployed for reconnaissance mission.`,
    });
    setControlDialogOpen(false);
  };

  const handleReturnToBase = () => {
    if (!selectedDrone) return;
    
    toast({
      title: "Return Command Sent",
      description: `${selectedDrone.name} is returning to base.`,
    });
    setControlDialogOpen(false);
  };

  return (
    <Card className={`egypt-glassmorphism ${className}`}>
      <CardHeader className="glass-panel-header">
        <div className="flex justify-between items-center w-full">
          <div className="egypt-header">
            <Drone className="w-5 h-5 mr-2 text-egypt-gold" />
            UAV Drone Management System
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drones..."
              className="pl-8 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Drones</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="mission">In Mission</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            <div className="h-[450px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Drone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Signal</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrones.map((drone) => (
                    <TableRow key={drone.id}>
                      <TableCell className="font-medium">
                        {drone.name}
                        <div className="text-xs text-muted-foreground">{drone.type}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(drone.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Battery className={`h-4 w-4 mr-1 ${getBatteryStatusColor(drone.batteryLevel)}`} />
                          <span className={getBatteryStatusColor(drone.batteryLevel)}>{drone.batteryLevel}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Signal className={`h-4 w-4 mr-1 ${getSignalStatusColor(drone.signalStrength)}`} />
                          <span className={getSignalStatusColor(drone.signalStrength)}>{drone.signalStrength}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {drone.currentLocation}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedDrone(drone);
                            setControlDialogOpen(true);
                          }}
                        >
                          Control
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div>
          <span className="text-sm text-muted-foreground">
            Total UAVs: {filteredDrones.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">In Mission</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">Maintenance</span>
          </div>
        </div>
      </CardFooter>

      {/* Drone Control Dialog */}
      {selectedDrone && (
        <Dialog open={controlDialogOpen} onOpenChange={setControlDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                {selectedDrone.name} Control
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-blue-500" />
                    Status Information
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusBadge(selectedDrone.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Battery Level:</span>
                      <span className={getBatteryStatusColor(selectedDrone.batteryLevel)}>
                        {selectedDrone.batteryLevel}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signal Strength:</span>
                      <span className={getSignalStatusColor(selectedDrone.signalStrength)}>
                        {selectedDrone.signalStrength}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Altitude:</span>
                      <span>{selectedDrone.altitude} ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Speed:</span>
                      <span>{selectedDrone.speed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Communication:</span>
                      <span>{selectedDrone.lastCommunication.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Radio className="h-4 w-4 mr-2 text-blue-500" />
                    Command Center
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="bg-blue-900/20 hover:bg-blue-900/30 text-blue-500">
                      Camera Feed
                    </Button>
                    <Button variant="outline" size="sm" className="bg-blue-900/20 hover:bg-blue-900/30 text-blue-500">
                      Sensor Data
                    </Button>
                    <Button variant="outline" size="sm" className="bg-blue-900/20 hover:bg-blue-900/30 text-blue-500">
                      Flight Log
                    </Button>
                    <Button variant="outline" size="sm" className="bg-blue-900/20 hover:bg-blue-900/30 text-blue-500">
                      Maintenance
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-black/60 p-4 rounded-lg text-center h-[200px] flex items-center justify-center">
                  <div className="text-muted-foreground">
                    <Drone className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    Live Feed Available
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium">Mission Controls</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleLaunchMission}
                    >
                      Launch Mission
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                      onClick={handleReturnToBase}
                    >
                      Return to Base
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setControlDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default DroneManagement;
