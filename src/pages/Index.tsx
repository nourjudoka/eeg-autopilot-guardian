import { useEffect, useState } from "react";
import EEGMonitor from "@/components/EEGMonitor";
import AircraftStatus from "@/components/AircraftStatus";
import TacticalRadar from "@/components/TacticalRadar";
import MissileStatus from "@/components/MissileStatus";
import GroundControl from "@/components/GroundControl";
import SignalIntelligence from "@/components/SignalIntelligence";
import GISTracking from "@/components/GISTracking";
import WalkieTalkie from "@/components/WalkieTalkie";
import MissionManagement from "@/components/MissionManagement";
import AirportManagement from "@/components/AirportManagement";
import DroneManagement from "@/components/DroneManagement";
import { MapPin, Shield, Lock } from "lucide-react";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<'verifying' | 'secure'>('verifying');

  // Simulate system initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Simulate security verification
      setTimeout(() => {
        setSecurityStatus('secure');
        
        // Sequential component initialization
        setTimeout(() => {
          setInitialized(true);
        }, 1000);
      }, 500);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 dot-pattern opacity-10 z-0"></div>
      
      {loading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-light mb-4 text-egypt-gold">
            EEG Autopilot Guardian
          </div>
          <div className="relative w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-egypt-gold animate-progress"></div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Arab Academy For Science, Technology & Maritime Transport - Advanced Systems Initialization...
          </div>
        </div>
      ) : (
        <div className="container py-4 relative z-10">
          <header className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-light text-egypt-gold">
                EEG Autopilot Guardian
              </h1>
              <p className="text-sm text-muted-foreground">
                Arab Academy For Science, Technology & Maritime Transport - North African Region Command
                <span className="inline-flex items-center ml-2 text-egypt-gold text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  North Africa & Middle East Operations
                </span>
              </p>
            </div>
            <div className="text-sm">
              <div className="bg-radar-bg px-3 py-1 rounded-md border border-egypt-gold/20 flex items-center">
                <span className="text-egypt-gold mr-2">SYSTEM ACTIVE</span> 
                <span className="mr-2">|</span>
                <span>{new Date().toLocaleString()}</span>
                <span className="ml-2 mr-1">|</span>
                <div className="flex items-center">
                  <Shield className="h-3 w-3 text-eeg-green" />
                  <span className="ml-1 text-xs text-eeg-green">
                    {securityStatus === 'verifying' ? 'VERIFYING SECURITY' : 'ISO 27001'}
                  </span>
                </div>
              </div>
            </div>
          </header>
          
          <main className={`grid grid-cols-12 gap-4 transition-opacity duration-500 ${initialized ? 'opacity-100' : 'opacity-0'}`}>
            <div className="col-span-12 md:col-span-3">
              <EEGMonitor className="h-[280px] mb-4" />
              <WalkieTalkie className="h-[380px]" />
            </div>
            
            <div className="col-span-12 md:col-span-5">
              <div className="grid grid-cols-1 gap-4">
                <AircraftStatus className="h-[380px]" />
                <MissileStatus className="h-[280px]" />
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-4">
              <TacticalRadar className="h-[380px] mb-4" />
              <SignalIntelligence className="h-[280px]" />
            </div>
            
            <div className="col-span-12">
              <MissionManagement className="h-[350px] mb-4" />
            </div>

            <div className="col-span-12 md:col-span-6">
              <AirportManagement className="h-[500px] mb-4" />
            </div>
            
            <div className="col-span-12 md:col-span-6">
              <DroneManagement className="h-[500px] mb-4" />
            </div>
            
            <div className="col-span-12">
              <GISTracking className="h-[350px] mb-4" />
            </div>
            
            <div className="col-span-12">
              <GroundControl className="h-[280px]" />
            </div>
          </main>
          
          <footer className="mt-4 text-center text-xs text-muted-foreground">
            <div className="text-egypt-gold">CLASSIFIED: ARAB ACADEMY FOR SCIENCE, TECHNOLOGY & MARITIME TRANSPORT - EMOTIV INSIGHT EEG MONITORING SYSTEM</div>
            <div className="flex items-center justify-center gap-2">
              <span>Autopilot Guardian Protocol v3.0.1 - North African Region Command</span>
              <span className="flex items-center">
                <Lock className="h-3 w-3 text-egypt-gold mx-1" />
                <span className="text-egypt-gold">AES-256/RSA-4096 Encryption</span>
                <Shield className="h-3 w-3 text-egypt-gold mx-1" />
                <span className="text-egypt-gold">ISO 27001 Compliant</span>
              </span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
