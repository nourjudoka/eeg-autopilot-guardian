
export interface Aircraft {
  id: string;
  name: string;
  category: AircraftCategory;
  type: string;
  inService: number;
  status: 'Active' | 'Maintenance' | 'Inactive';
  baseLocation?: string;
  source?: string[];
}

export type AircraftCategory = 
  'Combat Aircraft' | 
  'Attack Helicopters' | 
  'Transport Aircraft' | 
  'Training Aircraft' | 
  'Unmanned Aerial Vehicles' | 
  'Special Mission Aircraft' | 
  'Utility and Transport Helicopters';

export const aircraftData: Aircraft[] = [
  // Combat Aircraft
  { id: 'f16', name: 'F-16 Fighting Falcon', category: 'Combat Aircraft', type: 'Multi-role fighter', inService: 220, status: 'Active' },
  { id: 'mirage5', name: 'Mirage 5', category: 'Combat Aircraft', type: 'Attack aircraft', inService: 27, status: 'Active' },
  { id: 'mig29', name: 'MiG-29M/M2', category: 'Combat Aircraft', type: 'Air superiority fighter', inService: 46, status: 'Active', source: ['globalmilitary.net', 'War Power Egypt'] },
  { id: 'rafale', name: 'Dassault Rafale DM/EM', category: 'Combat Aircraft', type: 'Multi-role fighter', inService: 54, status: 'Active', source: ['wdmma.org', 'War Power Egypt', 'Aero Database'] },
  { id: 'mirage2000', name: 'Mirage 2000EM', category: 'Combat Aircraft', type: 'Multi-role fighter', inService: 16, status: 'Active', source: ['War Power Egypt', 'wdmma.org', 'Aero Database'] },
  { id: 'alphajet', name: 'Alpha Jet', category: 'Combat Aircraft', type: 'Light attack', inService: 30, status: 'Active', source: ['War Power Egypt', 'wdmma.org'] },
  
  // Attack Helicopters
  { id: 'apache', name: 'AH-64D Apache', category: 'Attack Helicopters', type: 'Attack helicopter', inService: 46, status: 'Active', source: ['Wikipedia'] },
  { id: 'ka52', name: 'Kamov Ka-52', category: 'Attack Helicopters', type: 'Attack helicopter', inService: 46, status: 'Active' },
  { id: 'mi24', name: 'Mi-24/Mi-35', category: 'Attack Helicopters', type: 'Attack helicopter', inService: 44, status: 'Active', source: ['Wikipedia', 'Aero Database'] },
  
  // Transport Aircraft
  { id: 'c130', name: 'C-130 Hercules', category: 'Transport Aircraft', type: 'Tactical airlifter', inService: 22, status: 'Active' },
  { id: 'an74', name: 'Antonov An-74', category: 'Transport Aircraft', type: 'Transport aircraft', inService: 3, status: 'Active' },
  { id: 'dhc5', name: 'DHC-5 Buffalo', category: 'Transport Aircraft', type: 'STOL utility transport', inService: 16, status: 'Active', source: ['War Power Egypt', 'wdmma.org', 'Planespotters.net'] },
  { id: 'beech1900', name: 'Beechcraft 1900', category: 'Transport Aircraft', type: 'Regional airliner', inService: 10, status: 'Active' },
  { id: 'c295', name: 'Airbus C-295', category: 'Transport Aircraft', type: 'Tactical airlifter', inService: 24, status: 'Active' },
  { id: 'il76', name: 'Ilyushin Il-76MF', category: 'Transport Aircraft', type: 'Strategic airlifter', inService: 2, status: 'Active', source: ['wdmma.org', 'War Power Egypt'] },
  
  // Training Aircraft
  { id: 'k8', name: 'K-8 Karakorum', category: 'Training Aircraft', type: 'Jet trainer', inService: 120, status: 'Active' },
  { id: 'tucano', name: 'EMB-312 Tucano', category: 'Training Aircraft', type: 'Basic trainer', inService: 54, status: 'Active' },
  { id: 'g115', name: 'Grob G115', category: 'Training Aircraft', type: 'Basic trainer', inService: 74, status: 'Active' },
  { id: 'l39', name: 'L-39 Albatros', category: 'Training Aircraft', type: 'Jet trainer', inService: 40, status: 'Active' },
  { id: 'f16bd', name: 'F-16B/D Fighting Falcon', category: 'Training Aircraft', type: 'Conversion trainer', inService: 36, status: 'Active', source: ['Wikipedia', 'wdmma.org', 'Aero Database'] },
  { id: 'mirage2000bm', name: 'Mirage 2000BM', category: 'Training Aircraft', type: 'Conversion trainer', inService: 4, status: 'Active', source: ['War Power Egypt', 'Aero Database', 'wdmma.org'] },
  { id: 'mig29ub', name: 'MiG-29UB', category: 'Training Aircraft', type: 'Conversion trainer', inService: 14, status: 'Active', source: ['Planespotters.net', 'War Power Egypt', 'Wikipedia'] },
  { id: 'alphajettrainer', name: 'Alpha Jet', category: 'Training Aircraft', type: 'Advanced trainer', inService: 10, status: 'Active', source: ['War Power Egypt', 'Wikipedia'] },
  
  // UAVs
  { id: 'ch4', name: 'CASC CH-4 Rainbow', category: 'Unmanned Aerial Vehicles', type: 'MALE UAV', inService: 18, status: 'Active' },
  { id: 'wingloong', name: 'Wing Loong I', category: 'Unmanned Aerial Vehicles', type: 'MALE UAV', inService: 20, status: 'Active', source: ['The African Crime & Conflict Journal'] },
  { id: 'asn209', name: 'ASN-209', category: 'Unmanned Aerial Vehicles', type: 'Tactical UAV', inService: 12, status: 'Active' },
  { id: 'alsaber', name: 'Al-Saber', category: 'Unmanned Aerial Vehicles', type: 'Tactical UAV', inService: 30, status: 'Active', source: ['Aero Database', 'The African Crime & Conflict Journal', 'globalmilitary.net'] },
  { id: 'yabhon', name: 'Adcom Yabhon Flash 20', category: 'Unmanned Aerial Vehicles', type: 'MALE UAV', inService: 8, status: 'Active', source: ['The African Crime & Conflict Journal', 'Wikipedia'] },
  { id: 'scarab', name: 'Teledyne Ryan Model 324 Scarab', category: 'Unmanned Aerial Vehicles', type: 'Reconnaissance drone', inService: 56, status: 'Active', source: ['Wikipedia', 'The African Crime & Conflict Journal'] },
  { id: 'puma', name: 'RQ-20B Puma AE II', category: 'Unmanned Aerial Vehicles', type: 'Small tactical UAV', inService: 48, status: 'Active', source: ['The African Crime & Conflict Journal'] },
  { id: 'skyeye', name: 'R4E-50 SkyEye', category: 'Unmanned Aerial Vehicles', type: 'Reconnaissance drone', inService: 15, status: 'Active', source: ['The African Crime & Conflict Journal'] },
  { id: 'nut', name: 'Nut', category: 'Unmanned Aerial Vehicles', type: 'Tactical UAV', inService: 20, status: 'Active', source: ['Aero Database', 'The African Crime & Conflict Journal'] },
  { id: 'thebes30', name: 'Thebes-30', category: 'Unmanned Aerial Vehicles', type: 'Tactical UAV', inService: 12, status: 'Active', source: ['The African Crime & Conflict Journal'] },
  { id: '6october', name: '6 October', category: 'Unmanned Aerial Vehicles', type: 'Target drone', inService: 36, status: 'Active' },
  { id: 'june30', name: 'June 30', category: 'Unmanned Aerial Vehicles', type: 'MALE UAV', inService: 30, status: 'Active', source: ['globalmilitary.net', 'The African Crime & Conflict Journal', 'Wikipedia'] },
  { id: 'ahmose', name: 'Ahmose', category: 'Unmanned Aerial Vehicles', type: 'Tactical UAV', inService: 24, status: 'Active', source: ['Wikipedia'] },
  { id: 'taba', name: 'Taba/Taba 2', category: 'Unmanned Aerial Vehicles', type: 'Tactical UAV', inService: 18, status: 'Active', source: ['Wikipedia'] },

  // Special Mission Aircraft
  { id: 'e2c', name: 'E-2C Hawkeye', category: 'Special Mission Aircraft', type: 'AEW&C', inService: 8, status: 'Active' },
  { id: 'beech1900ew', name: 'Beechcraft 1900 (Electronic Warfare)', category: 'Special Mission Aircraft', type: 'Electronic warfare', inService: 4, status: 'Active', source: ['Planespotters.net'] },
  
  // Utility and Transport Helicopters
  { id: 'sa342', name: 'SA 342 Gazelle', category: 'Utility and Transport Helicopters', type: 'Light utility helicopter', inService: 84, status: 'Active' },
  { id: 'mi8', name: 'Mi-8/Mi-17', category: 'Utility and Transport Helicopters', type: 'Transport helicopter', inService: 62, status: 'Active', source: ['Wikipedia', 'Aero Database'] },
  { id: 'ch47', name: 'CH-47 Chinook', category: 'Utility and Transport Helicopters', type: 'Heavy-lift helicopter', inService: 19, status: 'Active', source: ['globalmilitary.net'] },
  { id: 'aw149', name: 'AW149', category: 'Utility and Transport Helicopters', type: 'Medium utility helicopter', inService: 24, status: 'Active', source: ['wdmma.org'] },
  { id: 'aw139', name: 'AW139', category: 'Utility and Transport Helicopters', type: 'Medium utility helicopter', inService: 8, status: 'Active', source: ['Planespotters.net', 'wdmma.org', 'War Power Egypt'] },
  { id: 'aw109', name: 'AW109', category: 'Utility and Transport Helicopters', type: 'Light utility helicopter', inService: 6, status: 'Active', source: ['wdmma.org', 'War Power Egypt'] },
  { id: 'uh60', name: 'Sikorsky UH-60 Black Hawk', category: 'Utility and Transport Helicopters', type: 'Utility helicopter', inService: 24, status: 'Active' },
  { id: 'commando', name: 'Westland Commando Mk.1/2', category: 'Utility and Transport Helicopters', type: 'Medium-lift helicopter', inService: 5, status: 'Active', source: ['wdmma.org', 'Wikipedia', 'War Power Egypt'] },
  { id: 'sh2g', name: 'SH-2G Super Seasprite', category: 'Utility and Transport Helicopters', type: 'Naval helicopter', inService: 10, status: 'Active' }
];
