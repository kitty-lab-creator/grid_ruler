export type Unit = 'cm' | 'in';
export type GuideMode = 'off' | 'all' | 'lines';

export interface BgColorOption {
  id: string;
  name: string;
  bgColor: string;
  canvasBg: string;
  minorLineColor: string;
  majorLineColor: string;
  axisLineColor: string;
  textColor: string;
  guideLineColor: string;
}

export const BG_COLOR_OPTIONS: BgColorOption[] = [
  {
    id: 'white',
    name: '白色 (預設)',
    bgColor: '#ffffff',
    canvasBg: '#ffffff',
    minorLineColor: '#e2e8f0', // soft slate
    majorLineColor: '#cbd5e1', // medium slate
    axisLineColor: '#0f172a',  // deep slate
    textColor: '#0f172a',
    guideLineColor: '#dc2626', // vibrant red
  },
  {
    id: 'yellow',
    name: 'Tajima 捲尺黃',
    bgColor: '#ffd000', // Iconic Tajima measuring tape industrial yellow
    canvasBg: '#ffd000',
    minorLineColor: '#dfb500', // warm subtle 1mm grid
    majorLineColor: '#b88e00', // 1cm grid
    axisLineColor: '#000000',  // solid black Tajima scale lines
    textColor: '#000000',      // bold black numbering
    guideLineColor: '#dc2626', // vivid red solid guide line
  },
  {
    id: 'grey',
    name: '50% 標準灰',
    bgColor: '#808080', // 50% neutral grey
    canvasBg: '#808080',
    minorLineColor: '#919191', // soft lighter grey grid
    majorLineColor: '#5a5a5a', // darker contrast line
    axisLineColor: '#ffffff',  // crisp white axis line
    textColor: '#ffffff',      // clean white legible text
    guideLineColor: '#ef4444', // high-contrast red guide line
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
    guideLineColor: '#f87171', // bright red for dark theme
  },
];

// ISO/IEC 7810 ID-1 standard card dimensions (Credit Card, HK Octopus Card, Taiwan EasyCard, ID Card)
export const CARD_STANDARD_HEIGHT_CM = 5.398; // 53.98 mm (standard credit card short-edge height)
export const CARD_STANDARD_WIDTH_CM = 8.560;  // 85.60 mm (standard credit card long-edge width)
