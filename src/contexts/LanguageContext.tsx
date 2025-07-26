import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'eagle.eye': 'Eagle Eye',
    'tactical.command': 'Tactical Command Center',
    'neural.interface': 'Neural Interface',
    'aircraft.status': 'Aircraft Status',
    'tactical.radar': 'Tactical Radar',
    'gis.tracking': 'GIS Tracking',
    'signal.intelligence': 'Signal Intelligence',
    'walkie.talkie': 'Walkie Talkie',
    'ground.control': 'Ground Control',
    'airport.details': 'Airport Details',
    'airport.management': 'Airport Management',
    'drone.management': 'Drone Management',
    'missile.status': 'Missile Status',
    'mission.management': 'Mission Management',
    
    // System Status
    'system.status': 'System Status',
    'all.systems.operational': 'All Systems Operational',
    'security.level': 'Security Level',
    'classified': 'CLASSIFIED',
    'network.status': 'Network Status',
    'secure': 'SECURE',
    'version': 'Version',
    
    // Loading
    'system.initialization': 'System Initialization',
    'loading.tactical.systems': 'Loading tactical systems...',
    'verifying.security': 'Verifying security protocols...',
    'establishing.connection': 'Establishing secure connection...',
    'initializing.components': 'Initializing components...',
    'system.active': 'SYSTEM ACTIVE',
    
    // Footer
    'egypt.air.force': 'Egypt Air Force',
    'tactical.operations': 'Tactical Operations',
    
    // EEG Monitor
    'consciousness.level': 'Consciousness Level',
    'neural.aircraft.sync': 'Neural-Aircraft Sync',
    'mental.workload': 'Mental Workload',
    'advanced.neural.squadron': 'Advanced Neural Squadron',
    'pilots': 'Pilots',
    'autopilot.engaged': 'AUTOPILOT ENGAGED',
    'assist.ready': 'ASSIST READY',
    'disconnected': 'DISCONNECTED',
    'cortex.secure': 'Cortex Secure',
    'updated': 'Updated',
    'high': 'High',
    'moderate': 'Moderate',
    'low': 'Low'
  },
  ar: {
    // Header
    'eagle.eye': 'عين النسر',
    'tactical.command': 'مركز القيادة التكتيكية',
    'neural.interface': 'الواجهة العصبية',
    'aircraft.status': 'حالة الطائرات',
    'tactical.radar': 'الرادار التكتيكي',
    'gis.tracking': 'تتبع نظم المعلومات الجغرافية',
    'signal.intelligence': 'الاستخبارات الإشارية',
    'walkie.talkie': 'جهاز الاتصال',
    'ground.control': 'التحكم الأرضي',
    'airport.details': 'تفاصيل المطار',
    'airport.management': 'إدارة المطار',
    'drone.management': 'إدارة الطائرات المسيرة',
    'missile.status': 'حالة الصواريخ',
    'mission.management': 'إدارة المهام',
    
    // System Status
    'system.status': 'حالة النظام',
    'all.systems.operational': 'جميع الأنظمة تعمل بكفاءة',
    'security.level': 'مستوى الأمان',
    'classified': 'سري للغاية',
    'network.status': 'حالة الشبكة',
    'secure': 'آمنة',
    'version': 'الإصدار',
    
    // Loading
    'system.initialization': 'تهيئة النظام',
    'loading.tactical.systems': 'جاري تحميل الأنظمة التكتيكية...',
    'verifying.security': 'جاري التحقق من بروتوكولات الأمان...',
    'establishing.connection': 'جاري إنشاء اتصال آمن...',
    'initializing.components': 'جاري تهيئة المكونات...',
    'system.active': 'النظام نشط',
    
    // Footer
    'egypt.air.force': 'القوات الجوية المصرية',
    'tactical.operations': 'العمليات التكتيكية',
    
    // EEG Monitor
    'consciousness.level': 'مستوى الوعي',
    'neural.aircraft.sync': 'التزامن العصبي للطائرة',
    'mental.workload': 'الحمل الذهني',
    'advanced.neural.squadron': 'سرب الشبكة العصبية المتقدم',
    'pilots': 'الطيارين',
    'autopilot.engaged': 'تم تشغيل الطيار الآلي',
    'assist.ready': 'المساعدة جاهزة',
    'disconnected': 'منقطع',
    'cortex.secure': 'كورتكس آمن',
    'updated': 'محدث',
    'high': 'عالي',
    'moderate': 'متوسط',
    'low': 'منخفض'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};