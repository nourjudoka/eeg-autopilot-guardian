
export interface Airport {
  id: string;
  name: string;
  code?: string;
  location: string;
  type: AirportType;
  status: 'Operational' | 'Limited' | 'Under Maintenance' | 'Suspended';
  runways?: number;
  securityLevel?: 1 | 2 | 3 | 4 | 5; // 1-low, 5-high
  description?: string;
  militaryUse?: boolean;
  approvalNeeded?: boolean;
}

export type AirportType = 'Military' | 'International' | 'Regional' | 'Domestic' | 'Proposed';

export const militaryAirports: Airport[] = [
  { id: 'abs', name: 'Abu Sultan Air Base', location: 'Ismailia', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'asw', name: 'Abu Suweir Air Base', location: 'Ismailia', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true },
  { id: 'akh', name: 'Al Khatatbah Air Base', location: 'Cairo', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'man', name: 'Al Mansurah Air Base', location: 'Mansoura', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true },
  { id: 'alm', name: 'Almaza Air Base', location: 'Cairo', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true },
  { id: 'azz', name: 'Az Zaqaziq Air Base', location: 'Sharqia', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'bsf', name: 'Beni Suef Air Base', location: 'Beni Suef', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true },
  { id: 'blb', name: 'Bilbeis Air Base', location: 'Sharqia', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'bgf', name: 'Bir Gifgafa Airfield', location: 'Sinai', type: 'Military', status: 'Limited', securityLevel: 3, militaryUse: true },
  { id: 'cai-m', name: 'Cairo International Airport (Military Section)', location: 'Cairo', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true, approvalNeeded: true },
  { id: 'cwb', name: 'Cairo West Air Base', location: 'Cairo', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true },
  { id: 'dev', name: 'Deversoir Air Base', location: 'Ismailia', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'emn', name: 'El Minya Air Base', location: 'Minya', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'fyd', name: 'Fayid Air Base', location: 'Ismailia', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'geb', name: 'Gebel El Basur Air Base', location: 'Cairo', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'gnc', name: 'Gianaclis New Air Base', location: 'Alexandria', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true },
  { id: 'hrg-m', name: 'Hurghada Air Base', location: 'Hurghada', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true },
  { id: 'ins', name: 'Inshas Air Base', location: 'Sharqia', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'kaw', name: 'Kom Awshim Air Base', location: 'Fayoum', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'mmx', name: 'Mersa Matruh Air Base', location: 'Mersa Matruh', type: 'Military', status: 'Operational', securityLevel: 5, militaryUse: true },
  { id: 'rbn', name: 'Ras Banas Air Base', location: 'Red Sea', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
  { id: 'weg', name: 'Wadi El Gandali (Khatamia) Air Base', location: 'Cairo', type: 'Military', status: 'Operational', securityLevel: 4, militaryUse: true },
];

export const civilianAirports: Airport[] = [
  // Major International Airports
  { id: 'cai', name: 'Cairo International Airport', code: 'CAI', location: 'Cairo', type: 'International', status: 'Operational', runways: 3, securityLevel: 5, description: "Egypt's largest and busiest airport, serving as the primary gateway for international flights", militaryUse: false, approvalNeeded: true },
  { id: 'hrg', name: 'Hurghada International Airport', code: 'HRG', location: 'Hurghada', type: 'International', status: 'Operational', runways: 2, securityLevel: 4, description: "Situated in Hurghada, this airport caters to numerous tourists visiting the Red Sea resorts", militaryUse: false, approvalNeeded: true },
  { id: 'ssh', name: 'Sharm El Sheikh International Airport', code: 'SSH', location: 'Sharm El Sheikh', type: 'International', status: 'Operational', runways: 2, securityLevel: 4, description: "Located in Sharm El Sheikh, it serves as a key entry point for visitors to the Sinai Peninsula", militaryUse: false, approvalNeeded: true },
  { id: 'lxr', name: 'Luxor International Airport', code: 'LXR', location: 'Luxor', type: 'International', status: 'Operational', runways: 1, securityLevel: 4, description: "Serving the city of Luxor, this airport is essential for tourists exploring ancient Egyptian sites", militaryUse: false, approvalNeeded: true },
  { id: 'rmf', name: 'Marsa Alam International Airport', code: 'RMF', location: 'Marsa Alam', type: 'International', status: 'Operational', runways: 1, securityLevel: 3, description: "Located in Marsa Alam, it facilitates access to southern Red Sea destinations", militaryUse: false, approvalNeeded: true },
  { id: 'hbe', name: 'Borg El Arab Airport', code: 'HBE', location: 'Alexandria', type: 'International', status: 'Operational', runways: 1, securityLevel: 4, description: "Serving Alexandria, this airport handles both international and domestic flights", militaryUse: false, approvalNeeded: true },
  
  // Regional and Domestic Airports
  { id: 'asw-c', name: 'Aswan International Airport', code: 'ASW', location: 'Aswan', type: 'Regional', status: 'Operational', runways: 1, securityLevel: 3, description: "Located in Aswan, it supports travel to southern Egypt", militaryUse: false, approvalNeeded: true },
  { id: 'abs-c', name: 'Abu Simbel Airport', code: 'ABS', location: 'Abu Simbel', type: 'Domestic', status: 'Operational', runways: 1, securityLevel: 2, description: "Serving Abu Simbel, this airport is primarily used by tourists visiting the Abu Simbel temples", militaryUse: false, approvalNeeded: true },
  { id: 'atz', name: 'Assiut Airport', code: 'ATZ', location: 'Assiut', type: 'Regional', status: 'Operational', runways: 1, securityLevel: 3, description: "Situated in Assiut, it facilitates travel to central Egypt", militaryUse: false, approvalNeeded: true },
  { id: 'hmb', name: 'Sohag International Airport', code: 'HMB', location: 'Sohag', type: 'Regional', status: 'Operational', runways: 1, securityLevel: 3, description: "Located in Sohag, serving the surrounding region", militaryUse: false, approvalNeeded: true },
  { id: 'muh', name: 'Mersa Matruh Airport', code: 'MUH', location: 'Mersa Matruh', type: 'Regional', status: 'Operational', runways: 1, securityLevel: 3, description: "Serving Mersa Matruh, it provides access to Mediterranean coastal areas", militaryUse: false, approvalNeeded: true },
  { id: 'tcp', name: 'Taba International Airport', code: 'TCP', location: 'Taba', type: 'Regional', status: 'Operational', runways: 1, securityLevel: 3, description: "Located near Taba, it serves tourists visiting the Sinai's eastern region", militaryUse: false, approvalNeeded: true },
  { id: 'aac', name: 'El Arish International Airport', code: 'AAC', location: 'El Arish', type: 'Regional', status: 'Limited', runways: 1, securityLevel: 4, description: "Situated in El Arish, it caters to the northern Sinai region", militaryUse: false, approvalNeeded: true },
  { id: 'dbb', name: 'El Alamein International Airport', code: 'DBB', location: 'El Alamein', type: 'Regional', status: 'Operational', runways: 1, securityLevel: 3, description: "Serving El Alamein, known for its historical significance", militaryUse: false, approvalNeeded: true },
  { id: 'skv', name: 'St. Catherine International Airport', code: 'SKV', location: 'St. Catherine', type: 'Domestic', status: 'Operational', runways: 1, securityLevel: 2, description: "Located near St. Catherine, providing access to religious and historical sites", militaryUse: false, approvalNeeded: true },
  { id: 'psd', name: 'Port Said Airport', code: 'PSD', location: 'Port Said', type: 'Domestic', status: 'Operational', runways: 1, securityLevel: 3, description: "Serving Port Said, facilitating travel to the northeastern region", militaryUse: false, approvalNeeded: true },
  { id: 'aly', name: 'El Nouzha Airport', code: 'ALY', location: 'Alexandria', type: 'Domestic', status: 'Suspended', runways: 1, securityLevel: 2, description: "Situated in Alexandria; however, its operations have been suspended since 2010", militaryUse: false, approvalNeeded: true },
  
  // Emerging and Proposed Airports
  { id: 'spx', name: 'Sphinx International Airport', code: 'SPX', location: 'Giza', type: 'Proposed', status: 'Operational', runways: 1, securityLevel: 4, description: "Located near Giza, this airport aims to alleviate congestion from Cairo International Airport and provide closer access to the Giza Plateau", militaryUse: false, approvalNeeded: true },
  { id: 'cce', name: 'Capital International Airport', code: 'CCE', location: 'New Administrative Capital', type: 'Proposed', status: 'Under Maintenance', runways: 2, securityLevel: 5, description: "A proposed airport intended to serve the New Administrative Capital", militaryUse: false, approvalNeeded: true },
];

export const allAirports = [...militaryAirports, ...civilianAirports];
