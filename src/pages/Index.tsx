
import { useEffect, useState } from "react";
import EEGMonitor from "@/components/EEGMonitor";
import AircraftStatus from "@/components/AircraftStatus";
import TacticalRadar from "@/components/TacticalRadar";
import MissileStatus from "@/components/MissileStatus";
import GroundControl from "@/components/GroundControl";
import SignalIntelligence from "@/components/SignalIntelligence";
import GISTracking from "@/components/GISTracking";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Simulate system initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Sequential component initialization
      setTimeout(() => {
        setInitialized(true);
      }, 1000);
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
            Egyptian Armed Forces - Advanced Systems Initialization...
          </div>
        </div>
      ) : (
        <div className="container py-6 relative z-10">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-light text-egypt-gold">
                <span className="text-sm text-primary mr-2">تكنولوجيا المصرية</span>
                EEG Autopilot Guardian
              </h1>
              <p className="text-sm text-muted-foreground">Egyptian Armed Forces - Tactical Command Dashboard</p>
            </div>
            <div className="text-sm">
              <div className="bg-radar-bg px-3 py-1 rounded-md border border-egypt-gold/20">
                <span className="text-egypt-gold">SYSTEM ACTIVE</span> | {new Date().toLocaleString()}
              </div>
            </div>
          </header>
          
          <main className={`grid grid-cols-12 gap-6 transition-opacity duration-500 ${initialized ? 'opacity-100' : 'opacity-0'}`}>
            {/* First row */}
            <div className="col-span-12 md:col-span-3">
              <EEGMonitor className="h-full" />
            </div>
            <div className="col-span-12 md:col-span-5">
              <AircraftStatus className="h-full" />
            </div>
            <div className="col-span-12 md:col-span-4">
              <MissileStatus className="h-full" />
            </div>
            
            {/* Second row */}
            <div className="col-span-12 md:col-span-8">
              <TacticalRadar className="h-full" />
            </div>
            <div className="col-span-12 md:col-span-4">
              <SignalIntelligence className="h-full" />
            </div>
            
            {/* Third row */}
            <div className="col-span-12">
              <GISTracking className="h-full" />
            </div>
            
            {/* Fourth row */}
            <div className="col-span-12">
              <GroundControl className="h-full" />
            </div>
          </main>
          
          <footer className="mt-6 text-center text-xs text-muted-foreground">
            <div className="text-egypt-gold">CLASSIFIED: EGYPTIAN ARMED FORCES - EMOTIV INSIGHT EEG MONITORING SYSTEM</div>
            <div>Autopilot Guardian Protocol v3.0.1 - North African Region Command</div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
