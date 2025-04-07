
import { useState } from "react";
import { Airport } from "@/data/airportData";
import { aircraftData, Aircraft } from "@/data/aircraftData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertTriangle, 
  Check, 
  MapPin, 
  Shield, 
  Lock, 
  Plane, 
  FileText, 
  Unlock,
  Calendar,
  Users,
  HardDrive,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AirportDetailsProps {
  airport: Airport;
  onClose: () => void;
}

const AirportDetails = ({ airport, onClose }: AirportDetailsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const [isApproved, setIsApproved] = useState(airport.militaryUse);
  const { toast } = useToast();

  // Simulate aircraft stationed at this airport
  const stationedAircraft = aircraftData
    .filter((_, index) => index % 5 === 0) // Just a way to select some random aircraft
    .slice(0, 5)
    .map(aircraft => ({
      ...aircraft,
      baseLocation: airport.name
    }));
  
  const handleApprove = () => {
    setIsApproved(true);
    toast({
      title: "Airport Approved",
      description: `${airport.name} has been approved for military operations.`,
      variant: "default",
    });
  };

  const handleDeny = () => {
    setIsApproved(false);
    toast({
      title: "Approval Denied",
      description: `Military use request for ${airport.name} has been denied.`,
      variant: "destructive",
    });
  };

  const getSecurityBadge = (level?: number) => {
    if (!level) return null;
    
    const colors: Record<number, string> = {
      1: "bg-green-500/20 text-green-500",
      2: "bg-emerald-500/20 text-emerald-500",
      3: "bg-yellow-500/20 text-yellow-500",
      4: "bg-orange-500/20 text-orange-500",
      5: "bg-red-500/20 text-red-500",
    };
    
    return (
      <Badge className={colors[level] || ""} variant="outline">
        <Shield className="w-3 h-3 mr-1" />
        Level {level}
      </Badge>
    );
  };
  
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "Operational": "bg-green-500/20 text-green-500",
      "Limited": "bg-yellow-500/20 text-yellow-500",
      "Under Maintenance": "bg-blue-500/20 text-blue-500",
      "Suspended": "bg-red-500/20 text-red-500",
    };
    
    return (
      <Badge className={colors[status] || ""} variant="outline">
        {status === "Operational" ? <Check className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={!!airport} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            {airport.name}
            {airport.code && <span className="text-sm text-muted-foreground ml-2">({airport.code})</span>}
          </DialogTitle>
          <DialogDescription className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {airport.location} — {getStatusBadge(airport.status)} {getSecurityBadge(airport.securityLevel)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="aircraft">Stationed Aircraft</TabsTrigger>
            <TabsTrigger value="approvals">
              Approval Status
              {airport.approvalNeeded && (
                <Badge variant="destructive" className="ml-2 h-5">
                  Required
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Type:</span> 
                  <span>{airport.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Runways:</span> 
                  <span>{airport.runways || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Military Use:</span> 
                  <span>{airport.militaryUse ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Last Inspection:</span> 
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ATC System:</span> 
                  <span>{airport.securityLevel && airport.securityLevel > 3 ? "Advanced" : "Standard"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Approval Required:</span> 
                  <span>{airport.approvalNeeded ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
            
            {airport.description && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground text-sm">{airport.description}</p>
              </div>
            )}
            
            {airport.type === 'Military' && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md mt-4">
                <h4 className="flex items-center text-yellow-500 font-medium mb-2">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Security Notice
                </h4>
                <p className="text-muted-foreground text-sm">
                  This is a restricted military facility. All operations and information are classified. 
                  Personnel must have appropriate clearance for access.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="aircraft">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aircraft</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stationedAircraft.map((aircraft) => (
                    <TableRow key={aircraft.id}>
                      <TableCell className="font-medium">{aircraft.name}</TableCell>
                      <TableCell>{aircraft.type}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            aircraft.status === "Active" ? "bg-green-500/20 text-green-500" : 
                            aircraft.status === "Maintenance" ? "bg-yellow-500/20 text-yellow-500" : 
                            "bg-red-500/20 text-red-500"
                          }
                        >
                          {aircraft.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{airport.name}</TableCell>
                    </TableRow>
                  ))}
                  {stationedAircraft.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No aircraft currently stationed at this airport.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="approvals">
            <div className="space-y-4">
              <div className={`p-4 rounded-md ${isApproved ? 'bg-green-500/10 border border-green-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
                <h3 className="font-medium flex items-center">
                  {isApproved ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-green-500">Approved for Military Use</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2 text-orange-500" />
                      <span className="text-orange-500">Requires Military Approval</span>
                    </>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {isApproved 
                    ? "This airport is cleared for military operations. Personnel and equipment can be deployed as needed."
                    : "This civilian airport requires special authorization for military operations. Submit a request for approval."}
                </p>
              </div>
              
              {!airport.militaryUse && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Request Type</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="aircraftDeployment" className="mr-2" />
                          <label htmlFor="aircraftDeployment" className="text-sm">Aircraft Deployment</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="personnelTransport" className="mr-2" />
                          <label htmlFor="personnelTransport" className="text-sm">Personnel Transport</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="cargoOperations" className="mr-2" />
                          <label htmlFor="cargoOperations" className="text-sm">Cargo Operations</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="emergencyUse" className="mr-2" />
                          <label htmlFor="emergencyUse" className="text-sm">Emergency Use</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Duration</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="radio" id="temporary" name="duration" className="mr-2" />
                          <label htmlFor="temporary" className="text-sm">Temporary (24-48 hours)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="extended" name="duration" className="mr-2" />
                          <label htmlFor="extended" className="text-sm">Extended (1-2 weeks)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="permanent" name="duration" className="mr-2" />
                          <label htmlFor="permanent" className="text-sm">Permanent Assignment</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Authorization Levels Required</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Regional Air Command</li>
                      <li>Air Force Operations Office</li>
                      <li>Civil Aviation Authority Liaison</li>
                      {airport.securityLevel && airport.securityLevel > 3 && (
                        <li>Ministry of Defense</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          {activeTab === "approvals" && !airport.militaryUse ? (
            <div className="flex space-x-2">
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="outline" onClick={handleDeny} className="text-red-500 border-red-500 hover:bg-red-50">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Deny
              </Button>
            </div>
          ) : (
            <div></div> // Empty div to maintain spacing
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AirportDetails;
