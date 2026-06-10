---
name: Clinical Clarity
colors:
  surface: '#f6fafe'
  surface-dim: '#d6dade'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f8'
  surface-container: '#eaeef2'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#434654'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#edf1f5'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#8c000a'
  on-tertiary: '#ffffff'
  tertiary-container: '#b90012'
  on-tertiary-container: '#ffc5be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
typography:
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  sos-label:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  touch-target-min: 48px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is anchored in the principles of **Empathetic Precision**. It prioritizes absolute clarity and ease of use to reduce cognitive load for patients, caregivers, and medical professionals. The aesthetic is a blend of **Corporate Modern** and **High-Contrast Minimalism**, ensuring that every interface element serves a functional purpose while maintaining a calming, professional atmosphere.

The target audience ranges from tech-savvy clinicians to elderly patients with visual or motor impairments. To support this, the design system employs generous whitespace, high-contrast ratios for text readability, and a clear visual hierarchy that guides the user through complex health data without friction. The emotional response should be one of safety, reliability, and "quiet" assistance.

## Colors
This design system utilizes a palette designed for high legibility and psychological comfort. 

- **Primary (Trust Blue):** A deep, stable blue used for primary actions, branding, and active states. It meets WCAG AAA contrast requirements against white backgrounds.
- **Secondary (Healing Teal):** Used for wellness-related indicators, success states, and secondary visual accents to provide a calming counterpoint to the primary blue.
- **Tertiary (Urgency Red):** Reserved exclusively for the SOS functionality and critical system alerts to ensure immediate recognition.
- **Neutral (Slate & Sky):** A range of soft grays and off-whites are used for surfaces and backgrounds to prevent eye strain and create a distinct separation between content containers.

The default mode is **Light**, providing a paper-like reading experience that feels traditional and trustworthy for medical contexts.

## Typography
Typography is the primary accessibility tool in this design system. We utilize **Atkinson Hyperlegible Next** for all critical information and body text. This font was specifically designed to increase character recognition and improve legibility for readers with low vision.

- **Scale:** Sizes are intentionally larger than standard web defaults. The base body size starts at 18px to accommodate elderly users.
- **Hierarchy:** Bold weights are used frequently for headlines to ensure the user always knows where they are in the application.
- **UI Labels:** **Inter** is used for small utility labels and functional micro-copy where a more systematic, neutral tone is required.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model optimized for an Electron desktop environment. Content is housed within a central container that scales to a maximum width, ensuring line lengths remain comfortable for reading.

- **Grid:** A 12-column grid is used for dashboard layouts, while a 1-column stack is used for focused patient intake forms.
- **Touch Targets:** A strict minimum of 48x48px for all interactive elements to accommodate users with tremors or limited motor precision.
- **Rhythm:** An 8px baseline grid ensures vertical consistency. Generous padding (stack-md or stack-lg) is used between sections to prevent the UI from feeling cluttered or overwhelming.

## Elevation & Depth
To maintain high contrast and accessibility, the design system avoids heavy shadows or complex blurs. Depth is communicated through **Tonal Layers** and **Subtle Outlines**:

1.  **Background (Level 0):** The primary application canvas uses the Neutral color.
2.  **Surface (Level 1):** Cards and content containers are pure white with a 1px solid border in a soft gray.
3.  **Raised (Level 2):** On hover or selection, elements gain a soft, diffused ambient shadow (8% opacity) and a 2px primary-colored border to indicate focus.
4.  **Overlay (Level 3):** Modals and urgent alerts use a semi-opaque dark scrim to dim background distractions, focusing the user entirely on the task at hand.

## Shapes
The shape language is **Soft and Approachable**. 

- **Base Radius:** 0.5rem (8px) is applied to buttons, input fields, and small UI components.
- **Large Radius:** 1.5rem (24px) is reserved for cards and main navigation containers to create a friendly, modern "shell" for the data.
- **Interactive Elements:** Buttons utilize the base radius. However, the SOS button is a perfect circle or a pill-shape to distinguish it visually from standard navigational buttons.

## Components
- **SOS Button:** A persistent, high-contrast red button. It should be larger than all other UI elements, featuring a clear icon and the "sos-label" typography style.
- **Data Cards:** Content is grouped into cards with clear headers. Use high-contrast charts (accessible color palettes) for vitals tracking.
- **Input Fields:** Large text inputs with 16px internal padding and permanent labels (no floating labels that disappear). Focus states must have a 3px high-visibility outline.
- **Persistent Navigation:** A wide sidebar with large icons and text labels. Icons must be accompanied by text to ensure clarity for all users.
- **Chips:** Used for medical tags or status indicators. They should have high-contrast text and a subtle background tint to indicate category (e.g., Green for "Normal", Yellow for "Review").
- **Buttons:** Primary buttons use the Trust Blue background with White text. Secondary buttons use an outline style with the Primary color for the border and text.