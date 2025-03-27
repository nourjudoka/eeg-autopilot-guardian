
import { useEffect, useState } from "react";
import EEGMonitor from "@/components/EEGMonitor";
import AircraftStatus from "@/components/AircraftStatus";
import TacticalRadar from "@/components/TacticalRadar";
import MissileStatus from "@/components/MissileStatus";
import GroundControl from "@/components/GroundControl";

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
          <div className="text-2xl font-light mb-4">
            EEG Autopilot Guardian
          </div>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress"></div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Initializing Systems...
          </div>
        </div>
      ) : (
        <div className="container py-6 relative z-10">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-light">EEG Autopilot Guardian</h1>
              <p className="text-sm text-muted-foreground">Tactical Command Dashboard</p>
            </div>
            <div className="text-sm">
              <div className="bg-radar-bg px-3 py-1 rounded-md">
                SYSTEM ACTIVE | {new Date().toLocaleString()}
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
            <div className="col-span-12 md:col-span-6">
              <TacticalRadar className="h-full" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <GroundControl className="h-full" />
            </div>
          </main>
          
          <footer className="mt-6 text-center text-xs text-muted-foreground">
            <div>CLASSIFIED: EMOTIV INSIGHT EEG MONITORING SYSTEM</div>
            <div>Autopilot Guardian Protocol v2.1.3</div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
