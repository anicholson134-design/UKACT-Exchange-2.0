/**
 * Shared retro colour palette for KEEP the Wheelbarrow.
 * Built from the KEEP brand tokens (see app/globals.css) plus a handful of
 * punchier accents needed for 8-bit style readability against the sky.
 */

export const PALETTE = {
  // Brand core
  forest: '#1C2B1E',
  canopy: '#2D4A32',
  moss: '#4A6741',
  sage: '#8FAF7E',
  stone: '#C4B49A',
  sand: '#E8DCC8',
  cream: '#F5F0E8',
  gold: '#B8935A',
  goldLight: '#D4A96A',
  ink: '#1A1A18',
  mist: '#F0EDE6',
  white: '#FDFAF5',

  // Retro accents (kept within the same warm/earthy family)
  skyTop: '#7FB6C4',
  skyBottom: '#C9E4D8',
  sunYellow: '#F2C879',
  woodDark: '#5B3A29',
  woodLight: '#8A5A3C',
  metal: '#9AA5A0',
  metalDark: '#5E6963',
  rust: '#A85C32',
  leafDark: '#25401F',
  leafLight: '#3F6B34',
  water: '#4E92A6',
  waterLight: '#8FCBDB',
  red: '#B5442E',
  redDark: '#7A2C1D',
  cream2: '#EFE2C0',
  black: '#0F0F0E',
  white2: '#FFFFFF',
  pink: '#D98A9B',
  purple: '#6B5B8A',
} as const

export type PaletteKey = keyof typeof PALETTE
