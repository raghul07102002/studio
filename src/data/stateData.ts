
// State centers (lat, lng) for route drawing
export interface StateInfo {
  name: string;
  code: string;
  center: [number, number]; // [lat, lng]
}

export const indianStates: StateInfo[] = [
  { name: "Andhra Pradesh", code: "AP", center: [15.9129, 79.7400] },
  { name: "Arunachal Pradesh", code: "AR", center: [28.2180, 94.7278] },
  { name: "Assam", code: "AS", center: [26.2006, 92.9376] },
  { name: "Bihar", code: "BR", center: [25.0961, 85.3131] },
  { name: "Chhattisgarh", code: "CT", center: [21.2787, 81.8661] },
  { name: "Delhi", code: "DL", center: [28.7041, 77.1025] },
  { name: "Goa", code: "GA", center: [15.2993, 74.1240] },
  { name: "Gujarat", code: "GJ", center: [22.2587, 71.1924] },
  { name: "Haryana", code: "HR", center: [29.0588, 76.0856] },
  { name: "Himachal Pradesh", code: "HP", center: [31.1048, 77.1734] },
  { name: "Jharkhand", code: "JH", center: [23.6102, 85.2799] },
  { name: "Karnataka", code: "KA", center: [15.3173, 75.7139] },
  { name: "Kerala", code: "KL", center: [10.8505, 76.2711] },
  { name: "Madhya Pradesh", code: "MP", center: [22.9734, 78.6569] },
  { name: "Maharashtra", code: "MH", center: [19.7515, 75.7139] },
  { name: "Manipur", code: "MN", center: [24.6637, 93.9063] },
  { name: "Meghalaya", code: "ML", center: [25.4670, 91.3662] },
  { name: "Mizoram", code: "MZ", center: [23.1645, 92.9376] },
  { name: "Nagaland", code: "NL", center: [26.1584, 94.5624] },
  { name: "Odisha", code: "OR", center: [20.9517, 85.0985] },
  { name: "Punjab", code: "PB", center: [31.1471, 75.3412] },
  { name: "Rajasthan", code: "RJ", center: [27.0238, 74.2179] },
  { name: "Sikkim", code: "SK", center: [27.5330, 88.5122] },
  { name: "Tamil Nadu", code: "TN", center: [11.1271, 78.6569] },
  { name: "Telangana", code: "TG", center: [18.1124, 79.0193] },
  { name: "Tripura", code: "TR", center: [23.9408, 91.9882] },
  { name: "Uttar Pradesh", code: "UP", center: [26.8467, 80.9462] },
  { name: "Uttarakhand", code: "UT", center: [30.0668, 79.0193] },
  { name: "West Bengal", code: "WB", center: [22.9868, 87.8550] },
  { name: "Jammu and Kashmir", code: "JK", center: [33.7782, 76.5762] },
  { name: "Ladakh", code: "LA", center: [34.1526, 77.5771] },
];

export function getStateByCode(code: string): StateInfo | undefined {
  return indianStates.find((s) => s.code === code);
}
