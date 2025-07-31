declare module 'color-blind' {
  interface ColorBlind {
    protanomaly(color: string): string;
    protanopia(color: string): string;
    deuteranomaly(color: string): string;
    deuteranopia(color: string): string;
    tritanomaly(color: string): string;
    tritanopia(color: string): string;
    achromatopsia(color: string): string;
    achromatomaly(color: string): string;
  }

  const colorBlind: ColorBlind;
  export default colorBlind;
}