
import React from 'react';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Missile {
  id: string;
  type: string;
  status: 'ready' | 'locked' | 'expended';
}

interface MissileStatusProps {
  className?: string;
}

const MissileStatus: React.FC<MissileStatusProps> = ({ className }) => {
  const { t } = useLanguage();
  const [missiles, setMissiles] = React.useState<Missile[]>([
    { id: 'M1', type: 'AIM-120 AMRAAM', status: 'ready' },
    { id: 'M2', type: 'AIM-120 AMRAAM', status: 'ready' },
    { id: 'M3', type: 'AIM-9X Sidewinder', status: 'locked' },
    { id: 'M4', type: 'AIM-9X Sidewinder', status: 'ready' },
    { id: 'M5', type: 'AGM-158 JASSM', status: 'expended' },
    { id: 'M6', type: 'AGM-158 JASSM', status: 'ready' }
  ]);
  
  // Simulate missile status changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setMissiles(prev => {
          const newMissiles = [...prev];
          const randomIndex = Math.floor(Math.random() * newMissiles.length);
          
          // Random status change
          if (newMissiles[randomIndex].status === 'ready') {
            newMissiles[randomIndex].status = Math.random() > 0.5 ? 'locked' : 'ready';
          } else if (newMissiles[randomIndex].status === 'locked') {
            newMissiles[randomIndex].status = Math.random() > 0.7 ? 'expended' : 'locked';
          }
          
          return newMissiles;
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusIndicator = (status: 'ready' | 'locked' | 'expended') => {
    switch (status) {
      case 'ready':
        return <span className="w-2 h-2 bg-eeg-green rounded-full"></span>;
      case 'locked':
        return <span className="w-2 h-2 bg-eeg-yellow rounded-full animate-pulse-subtle"></span>;
      case 'expended':
        return <span className="w-2 h-2 bg-muted rounded-full"></span>;
    }
  };
  
  const getStatusText = (status: 'ready' | 'locked' | 'expended') => {
    switch (status) {
      case 'ready':
        return <span className="text-eeg-green">{t('ready')}</span>;
      case 'locked':
        return <span className="text-eeg-yellow">{t('locked')}</span>;
      case 'expended':
        return <span className="text-muted-foreground">{t('expended')}</span>;
    }
  };
  
  return (
    <div className={cn("glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium">{t('ordnance.status')}</h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {missiles.map((missile) => (
            <div key={missile.id} className="flex items-center p-2 bg-radar-bg rounded-md">
              <div className="mr-3">
                {getStatusIndicator(missile.status)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{missile.type}</div>
                <div className="text-xs text-muted-foreground">{missile.id}</div>
              </div>
              <div className="text-sm">
                {getStatusText(missile.status)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>{t('total')}: {missiles.length}</div>
          <div>
            {t('ready')}: {missiles.filter(m => m.status === 'ready').length} | 
            {t('locked')}: {missiles.filter(m => m.status === 'locked').length} | 
            {t('expended')}: {missiles.filter(m => m.status === 'expended').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissileStatus;
