export type Unit = 'cm' | 'in';

export interface BgColorOption {
  id: string;
  name: string;
  bgColor: string;
  canvasBg: string;
  minorLineColor: string;
  majorLineColor: string;
  axisLineColor: string;
  textColor: string;
  subTickColor: string;
  guideLineColor: string;
  guideHandleColor: string;
  cardBgClass: string;
}

export const BG_COLOR_OPTIONS: BgColorOption[] = [
  {
    id: 'white',
    name: '白色 (預設)',
    bgColor: '#ffffff',
    canvasBg: '#ffffff',
    minorLineColor: '#e2e8f0', // soft slate
    majorLineColor: '#cbd5e1', // medium slate
    axisLineColor: '#1e293b',  // dark slate
    textColor: '#0f172a',
    subTickColor: '#94a3b8',
    guideLineColor: '#ef4444', // vibrant red
    guideHandleColor: '#ef4444',
    cardBgClass: 'bg-white',
  },
  {
    id: 'yellow',
    name: '方格牛皮黃',
    bgColor: '#fef9c3', // warm pale craft yellow
    canvasBg: '#fef9c3',
    minorLineColor: '#fde047', // warm amber yellow
    majorLineColor: '#eab308',
    axisLineColor: '#713f12',  // deep warm amber/brown
    textColor: '#713f12',
    subTickColor: '#ca8a04',
    guideLineColor: '#dc2626',
    guideHandleColor: '#dc2626',
    cardBgClass: 'bg-amber-50',
  },
  {
    id: 'grey',
    name: '工藝灰',
    bgColor: '#f1f5f9', // soft slate grey
    canvasBg: '#f1f5f9',
    minorLineColor: '#e2e8f0',
    majorLineColor: '#94a3b8',
    axisLineColor: '#334155',
    textColor: '#1e293b',
    subTickColor: '#64748b',
    guideLineColor: '#e11d48',
    guideHandleColor: '#e11d48',
    cardBgClass: 'bg-slate-100',
  },
  {
    id: 'black',
    name: '深黑夜間',
    bgColor: '#09090b', // zinc-950 deep black
    canvasBg: '#09090b',
    minorLineColor: '#27272a', // zinc-800
    majorLineColor: '#3f3f46', // zinc-700
    axisLineColor: '#e4e4e7',  // zinc-200
    textColor: '#fafafa',
    subTickColor: '#71717a',
    guideLineColor: '#f87171', // bright light red for high contrast
    guideHandleColor: '#ef4444',
    cardBgClass: 'bg-zinc-900',
  },
];

// ISO/IEC 7810 ID-1 standard card dimensions (Credit Card, HK Octopus Card, Taiwan EasyCard, ID Card)
export const CARD_STANDARD_HEIGHT_CM = 5.398; // 53.98 mm
export const CARD_STANDARD_WIDTH_CM = 8.560;  // 85.60 mm
