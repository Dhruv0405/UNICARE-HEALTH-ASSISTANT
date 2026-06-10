---
name: Clinical Clarity Mobile
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#525f73'
  on-secondary: '#ffffff'
  secondary-container: '#d6e3fb'
  on-secondary-container: '#586579'
  tertiary: '#004e33'
  on-tertiary: '#ffffff'
  tertiary-container: '#006846'
  on-tertiary-container: '#7ee7b4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#d6e3fb'
  secondary-fixed-dim: '#bac7de'
  on-secondary-fixed: '#0f1c2d'
  on-secondary-fixed-variant: '#3b485a'
  tertiary-fixed: '#8ef7c4'
  tertiary-fixed-dim: '#71daa9'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  grid-columns: '4'
  margin: 16px
  gutter: 16px
  touch-target-min: 48px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 32px
---

## Brand & Style

This design system is engineered for clinical precision and maximum accessibility on mobile devices. It targets healthcare professionals and patients who require immediate, error-free data interpretation in high-pressure or mobile environments. 

The aesthetic is **Corporate / Modern**, heavily influenced by Material Design 3 principles but refined for a medical context. The UI evokes a sense of calm, reliability, and technical competence. High-contrast ratios, generous touch targets, and a rigorous adherence to legibility ensure that the interface remains functional under various lighting conditions and physical contexts.

## Colors

The palette is anchored by a professional "Clinical Blue" (#0052cc), selected for its association with trust and authority in healthcare. 

- **Primary:** Used for key actions, active states, and branding.
- **Secondary:** A muted slate used for secondary actions and supporting information to prevent visual fatigue.
- **Tertiary:** A calm green reserved for success states and positive clinical indicators.
- **Neutral:** A range of cool grays that provide a clean canvas, ensuring content remains the primary focus.

The default color mode is light to maintain a high-key, "sterile" and clean feel, though all tokens are optimized for AA/AAA accessibility compliance.

## Typography

This design system utilizes **Atkinson Hyperlegible Next** across all roles. This typeface is specifically designed to increase character recognition and improve legibility for readers with low vision, which is critical in a clinical setting where mistaking a "5" for a "6" can have serious consequences.

On mobile, headlines are scaled down to prevent excessive line wrapping while maintaining a strong hierarchy. Body text is kept at a 16px minimum for primary content to ensure readability at arm's length. Labels use increased letter spacing and semi-bold weights to remain legible at small sizes on dense data screens.

## Layout & Spacing

The layout follows an **8dp spacing grid** consistent with Android's system logic. For mobile, a 4-column fluid grid is used with 16px outer margins and 16px gutters.

- **Touch Targets:** All interactive elements must maintain a minimum height/width of 48px to ensure ease of use during movement or for users with limited dexterity.
- **Density:** While clinical apps often require high data density, this design system mandates generous vertical breathing room (minimum 16px) between distinct content blocks to reduce cognitive load.
- **Adaptation:** On larger mobile screens (e.g., Foldables), the 4-column grid scales but maintains the 16px margin until reaching tablet breakpoints.

## Elevation & Depth

Hierarchy is established using **Tonal Layers** supplemented by subtle **Ambient Shadows**. 

- **Surface Levels:** The background uses the Neutral base. Cards and modals use a pure white surface to "pop" forward.
- **Shadows:** Shadows are highly diffused and low-opacity (10-15% alpha) to avoid a "dirty" look. They are primarily used to indicate interactivity or modal overlays.
- **Z-Index:** Navigation bars (Bottom Nav) are fixed at the highest elevation with a subtle top border or very light shadow to separate them from scrolling content.
- **State Tones:** Hover/Press states on mobile are communicated through tonal shifts (overlaying a 5% black or primary-color tint) rather than shadow changes.

## Shapes

The design system utilizes **Rounded** geometry (0.5rem / 8px base radius). This strikes a balance between the sterile precision of sharp corners and the overly casual nature of pill shapes.

- **Small Components:** Checkboxes and small buttons use the base 8px radius.
- **Large Components:** Cards and bottom sheets use a 16px (rounded-lg) radius to feel approachable and modern.
- **Consistency:** All containers must share these radii to maintain a cohesive, "molded" look across the application.

## Components

The component library is optimized for one-handed Android usage.

- **Bottom Navigation:** The primary navigation hub, featuring 3-5 destinations with 24px icons and Label-sm text.
- **Cards:** Material-inspired cards use an 8px radius and a 1px soft border or minimal elevation. They serve as the primary container for patient records or clinical metrics.
- **Buttons:** 
    - *Primary:* Filled with `#0052cc`, white text, 48px height.
    - *Outlined:* 1px border for secondary actions like "Cancel" or "Back."
- **Input Fields:** Outlined style with a 16px internal padding. Labels remain visible (floating) upon focus to ensure context is never lost.
- **Chips:** Small, rounded-xl (pill) shapes used for filtering or indicating status (e.g., "Critical," "Stable").
- **Lists:** High-density lists use 16px horizontal padding and an 8px vertical padding between items, with subtle dividers to separate data points.