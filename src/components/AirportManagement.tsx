
import { useState } from "react";
import { Aircraft } from "@/data/aircraftData";
import { Airport, allAirports, militaryAirports, civilianAirports } from "@/data/airportData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, Shield, Plane, Building, AlertTriangle, Check } from "lucide-react";
import AirportDetails from "./AirportDetails";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface AirportManagementProps {
  className?: string;
}

const AirportManagement = ({ className }: AirportManagementProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("military");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const { toast } = useToast();

  const filteredAirports = (activeTab === "military" ? militaryAirports : 
                            activeTab === "civilian" ? civilianAirports : 
                            allAirports).filter(airport => 
    airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    airport.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (airport.code && airport.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const requestApproval = (airport: Airport) => {
    toast({
      title: "Approval Request Sent",
      description: `Request for military use of ${airport.name} has been submitted for authorization.`,
      variant: "default",
    });
  };

  return (
    <Card className={`egypt-glassmorphism ${className}`}>
      <CardHeader className="glass-panel-header">
        <div className="flex justify-between items-center w-full">
          <div className="egypt-header">
            <Building className="w-5 h-5 mr-2 text-egypt-gold" />
            {t('airport.management.system')}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search.airports')}
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
            <TabsTrigger value="all">{t('all.airports')}</TabsTrigger>
            <TabsTrigger value="military">{t('military')}</TabsTrigger>
            <TabsTrigger value="civilian">{t('civilian')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            <div className="h-[450px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t('name')}</TableHead>
                    <TableHead>{t('location')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('security')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAirports.map((airport) => (
                    <TableRow key={airport.id}>
                      <TableCell className="font-medium">
                        {airport.name}
                        {airport.code && <span className="text-xs text-muted-foreground ml-2">({airport.code})</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          {airport.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50">
                          {airport.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(airport.status)}
                      </TableCell>
                      <TableCell>
                        {getSecurityBadge(airport.securityLevel)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedAirport(airport)}
                        >
                          {t('view.details')}
                        </Button>
                        {airport.approvalNeeded && !airport.militaryUse && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-2 bg-blue-900/20 hover:bg-blue-900/30 text-blue-500"
                            onClick={() => requestApproval(airport)}
                          >
                            {t('request.use')}
                          </Button>
                        )}
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
            {t('total.airports')}: {filteredAirports.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">{t('operational')}</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">{t('limited')}</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">{t('suspended')}</span>
          </div>
        </div>
      </CardFooter>

      {selectedAirport && (
        <AirportDetails 
          airport={selectedAirport} 
          onClose={() => setSelectedAirport(null)} 
        />
      )}
    </Card>
  );
};

export default AirportManagement;
