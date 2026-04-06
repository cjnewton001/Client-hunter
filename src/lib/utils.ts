import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function generateShades(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  // Simple shade generation by adjusting opacity/lightness for CSS variables
  // In a real app we might use a library like 'chroma-js' or 'tinycolor2'
  // For now we'll just use the base color for most and lighter/darker versions
  
  return {
    '--accent-50': `${hex}10`,
    '--accent-100': `${hex}20`,
    '--accent-200': `${hex}40`,
    '--accent-300': `${hex}60`,
    '--accent-400': `${hex}80`,
    '--accent-500': `${hex}a0`,
    '--accent-600': hex,
    '--accent-700': hex, // Simplified
    '--accent-800': hex,
    '--accent-900': hex,
    '--accent-950': hex,
  };
}

// More accurate shade generation using HSL
export function updateAccentColor(hex: string) {
  const root = document.documentElement;
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  
  // For simplicity in this environment, we'll use a set of opacities of the base color
  // to simulate shades, which works well for backgrounds and borders.
  shades.forEach(shade => {
    let opacity = '1';
    if (shade === 50) opacity = '0.05';
    if (shade === 100) opacity = '0.1';
    if (shade === 200) opacity = '0.2';
    if (shade === 300) opacity = '0.3';
    if (shade === 400) opacity = '0.5';
    if (shade === 500) opacity = '0.8';
    
    // We use color-mix to create shades from the base hex
    root.style.setProperty(`--accent-${shade}`, `color-mix(in srgb, ${hex} ${parseFloat(opacity) * 100}%, transparent)`);
  });
  
  // Set the main 600 shade as the solid color
  root.style.setProperty('--accent-600', hex);
  root.style.setProperty('--accent-700', `color-mix(in srgb, ${hex}, black 10%)`);
  root.style.setProperty('--accent-800', `color-mix(in srgb, ${hex}, black 20%)`);
  root.style.setProperty('--accent-900', `color-mix(in srgb, ${hex}, black 30%)`);
  root.style.setProperty('--accent-950', `color-mix(in srgb, ${hex}, black 40%)`);
}
