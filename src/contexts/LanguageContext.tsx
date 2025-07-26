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
    'low': 'Low',
    
    // Aircraft Status
    'aircraft.selection': 'Aircraft Selection',
    'aircraft': 'Aircraft',
    'altitude': 'ALTITUDE',
    'speed': 'SPEED',
    'heading': 'HEADING',
    'autopilot': 'AUTOPILOT',
    'engaged': 'ENGAGED',
    'disengaged': 'DISENGAGED',
    'fuel.remaining': 'Fuel Remaining',
    'damage.assessment': 'Damage Assessment',
    'status': 'Status',
    'maintenance': 'Maintenance',
    'airframe': 'Airframe',
    'propulsion': 'Propulsion',
    'avionics': 'Avionics',
    'weapons': 'Weapons',
    'sensors': 'Sensors',
    'operational': 'OPERATIONAL',
    'damaged': 'DAMAGED',
    'critical': 'CRITICAL',
    'combat': 'COMBAT',
    'returning': 'RETURNING',
    'ready': 'READY',
    'locked': 'LOCKED',
    'expended': 'EXPENDED',
    
    // Missile Status
    'ordnance.status': 'Ordnance Status',
    'total': 'Total',
    
    // Tactical Radar
    'all': 'ALL',
    'air': 'AIR',
    'ground': 'GROUND',
    'cyber': 'CYBER',
    'short': 'SHORT',
    'medium': 'MED',
    'long': 'LONG',
    'search': 'Search...',
    'target.details': 'Target Details',
    'type': 'Type',
    'callsign': 'Callsign',
    'distance': 'Distance',
    'angle': 'Angle',
    'threat.level': 'Threat Level',
    'ecm.active': 'ECM Active',
    'formation': 'Formation',
    'range': 'Range',
    'threats.detected': 'Threats Detected',
    'critical.threats': 'Critical Threats',
    'jamming.detected': 'JAMMING DETECTED',
    
    // Signal Intelligence
    'signal.intelligence.ar': 'Signal Intelligence',
    'artemis.active.ar': 'ARTEMIS ACTIVE',
    'radar.ar': 'Radar',
    'radio.ar': 'Radio',
    'datalink.ar': 'Datalink',
    'connect.to.artemis.ar': 'Connect to Artemis',
    'connecting.ar': 'Connecting...',
    'disconnect.ar': 'Disconnect',
    'mode.ar': 'Mode',
    'band.ar': 'Band',
    'channels.ar': 'channels',
    'no.signals.detected.ar': 'No signals detected',
    'encrypted.ar': 'ENCRYPTED',
    'verified.ar': 'VERIFIED',
    'freq.ar': 'Freq',
    'signal.ar': 'Signal',
    'passive.ar': 'Passive',
    'active.ar': 'Active',
    'hybrid.ar': 'Hybrid',
    'unknown.ar': 'Unknown'
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
    'low': 'منخفض',
    
    // Aircraft Status
    'aircraft.selection': 'اختيار الطائرة',
    'aircraft': 'طائرة',
    'altitude': 'الارتفاع',
    'speed': 'السرعة',
    'heading': 'الاتجاه',
    'autopilot': 'الطيار الآلي',
    'engaged': 'مفعل',
    'disengaged': 'غير مفعل',
    'fuel.remaining': 'الوقود المتبقي',
    'damage.assessment': 'تقييم الأضرار',
    'status': 'الحالة',
    'maintenance': 'الصيانة',
    'airframe': 'هيكل الطائرة',
    'propulsion': 'نظام الدفع',
    'avionics': 'الطيران الإلكتروني',
    'weapons': 'الأسلحة',
    'sensors': 'أجهزة الاستشعار',
    'operational': 'تعمل بكفاءة',
    'damaged': 'متضررة',
    'critical': 'حرجة',
    'combat': 'في المعركة',
    'returning': 'عائدة',
    'ready': 'جاهز',
    'locked': 'مغلق',
    'expended': 'مستنفد',
    
    // Missile Status
    'ordnance.status': 'حالة الذخائر',
    'total': 'المجموع',
    
    // Tactical Radar
    'all': 'الكل',
    'air': 'جوي',
    'ground': 'أرضي',
    'cyber': 'سيبراني',
    'short': 'قصير',
    'medium': 'متوسط',
    'long': 'طويل',
    'search': 'بحث...',
    'target.details': 'تفاصيل الهدف',
    'type': 'النوع',
    'callsign': 'الرمز',
    'distance': 'المسافة',
    'angle': 'الزاوية',
    'threat.level': 'مستوى التهديد',
    'ecm.active': 'التشويش نشط',
    'formation': 'التشكيل',
    'range': 'المدى',
    'threats.detected': 'التهديدات المكتشفة',
    'critical.threats': 'التهديدات الحرجة',
    'jamming.detected': 'تم رصد التشويش',
    
    // Signal Intelligence
    'signal.intelligence.ar': 'الاستخبارات الإشارية',
    'artemis.active.ar': 'أرتميس نشط',
    'radar.ar': 'رادار',
    'radio.ar': 'راديو',
    'datalink.ar': 'رابط البيانات',
    'connect.to.artemis.ar': 'الاتصال بأرتميس',
    'connecting.ar': 'جاري الاتصال...',
    'disconnect.ar': 'قطع الاتصال',
    'mode.ar': 'الوضع',
    'band.ar': 'النطاق',
    'channels.ar': 'قنوات',
    'no.signals.detected.ar': 'لم يتم رصد إشارات',
    'encrypted.ar': 'مشفر',
    'verified.ar': 'محقق',
    'freq.ar': 'التردد',
    'signal.ar': 'الإشارة',
    'passive.ar': 'سلبي',
    'active.ar': 'نشط',
    'hybrid.ar': 'مختلط',
    'unknown.ar': 'غير معروف'
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