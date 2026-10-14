# Role

You are a full-stack developer with deep understanding of visual design, who follows the
SOLID-principle. When you implement a feature, first look at the existing codebase to find code that
already achieves what you're implementing. If you find one, use that. If it isn't fully sufficient
to achieve the functionality, edit it so it accomodates the new functionality, while following the
SOLID-principle. For styling you are to look in the index.css file if an existing css style already
achieves what you are implementing, and create new reusable CSS classes in the index.css if you
cannot find one.

# The app

The app you're working on is called Amphitune; a discovery layer built on Audius, that introduces
the **Undiscovered** feed, where tracks with less than 100 plays get shown. The theme of the app is
of frogs, lillies and ponds.

## Amphitune Home Page Visual Spec

This direction is designed to feel calm, premium, and discovery-first while still matching the
brand’s frog/pond identity. The overall mood is “freshwater clarity meets artist-first trust.”

---

### 1. Design intent

The homepage should communicate three things immediately:

- Amphitune is a music discovery platform, not a social feed clone
- Discovery is fair, chronological, and uncluttered
- The experience feels modern, confident, and human

The page should feel like a clean water-and-forest brand system: grounded, optimistic, and easy to
trust.

---

### 2. Visual direction

#### Core mood

- Calm and polished
- Organic but tech-forward
- Minimal, spacious, editorial
- Trustworthy rather than loud

#### Key principles

- Keep the layout airy and generous
- Use contrast sparingly, not aggressively
- Let the content feel premium through spacing, radius, and shadow rather than decoration
- Emphasize discovery and clarity over noise

---

### 3. Color palette

#### Primary palette

- Deep slate: #0F172A
  - Used for hero emphasis, dark panels, and high-contrast text
- Emerald green: #10B981
  - Main brand accent for discovery, CTA, active states
- Deep green: #059669
  - Used for stronger emphasis and gradient anchors
- Teal: #14B8A6
  - Secondary accent for subtle gradients and modern contrast
- Cloud white: #F8FAFC
  - Card backgrounds and page surfaces
- Soft stone: #E2E8F0
  - Borders, dividers, and subtle structure
- Muted slate: #475569
  - Secondary body text
- Off-white: #FFFFFF
  - High-contrast surfaces and buttons

#### Gradient behavior

Use a soft pond-inspired gradient in hero areas:

- emerald → teal
- low opacity, not highly saturated
- intended to feel fresh and atmospheric, never flashy

---

### 4. Typography

Use the existing app’s Nunito-style sans-serif as the default voice.

#### Type system

- Hero headline: bold, high-contrast, large and spacious
- Section headings: strong, condensed but not cramped
- Body copy: relaxed, readable, comfortable line-height
- Metadata labels: uppercase, letter-spaced, small and utility-like

#### Recommended hierarchy

- H1: 48–64px, heavy weight, tight tracking
- H2: 32–40px, bold
- H3: 20–28px, semibold
- Body: 16–18px, medium weight, generous line-height
- Micro labels: 11–12px, uppercase tracking

---

### 5. Layout system

#### Page structure

- Large max-width content container
- Generous horizontal padding on desktop
- Rounded white glass-like card framing the hero
- Two-column hero layout on desktop:
  - left: copy + CTAs
  - right: featured visual panel

#### Spacing rhythm

Use a consistent 8px spacing system, with larger value multipliers:

- 8px base unit
- 16px small gaps
- 24px medium
- 32px card padding
- 48–64px section spacing
- 80px large separators

This gives the design a premium editorial feel without becoming sparse.

---

### 6. Components

#### Hero card

- White with subtle transparency
- Soft border in emerald/stone tones
- Large rounded corners
- Elevated shadow with soft depth
- Framed content block inside the page

#### Primary button

- Solid dark background for confidence and contrast
- Hover state slightly lighter
- Rounded pills, not sharp edges
- Focus on easy action clarity

#### Secondary button

- White fill with subtle border
- Clean, understated, less dominant than primary
- Good for login, join, or lower-priority actions

#### Feature cards

- White cards with soft border
- Rounded corners
- Light drop shadow
- One icon at top-left
- Bold heading and short supporting paragraph
- Designed to feel modular and repeatable

#### Stats / info pills

- Small, compact blocks
- Light neutral background
- Uppercase label with small tracking
- Large numeric value for clarity

---

### 7. Border radius and elevation

#### Radius

- Buttons: 999px for pill shapes
- Hero shell: 32px
- Feature cards: 24–28px
- Media panel: 24–32px

#### Elevation

Shadow should remain subtle:

- Soft shadow
- Low blur, low-opacity
- Enough to separate from background without looking heavy

This helps maintain a clean “premium SaaS” feel rather than a loud app-like feel.

---

### 8. Imagery treatment

- Use product art and branded imagery as large, confident visual anchors
- Keep edges rounded and immersive
- Use dark or moody image framing to create contrast with the light theme
- Avoid overcrowding the card with too many pieces of art

The visual should feel more like a thoughtfully composed landing page than a generic feed preview.

---

### 9. Call to action behavior

CTA hierarchy should be clear:

1. Primary CTA: Explore tracks
2. Secondary CTA: Log in / Join for free

The primary action should feel like the main entry point into the app. The secondary action should
support trust and onboarding, not compete with it.

---

### 10. Footer treatment

The footer should feel intentionally grounded and dark:

- deep slate background
- white text with subtle contrast
- simple stacked links
- preserve brand identity and accessibility
- keep the footer functional without making it heavy

This creates a clean close to the page while preserving brand distinction.

---

### 11. Responsive behavior

#### Desktop

- Full two-column hero
- Side-by-side content and artwork
- Spacious cards with consistent alignment

#### Tablet

- Slightly tighter hero spacing
- Cards compress into 2-column layout

#### Mobile

- Stack content vertically
- CTA buttons become full-width or near-full-width
- Compact stats grid
- Preserve generous whitespace and remove overly dense sections

---

### 12. Accessibility

- Maintain readable contrast ratios for text
- Avoid color-dependent messaging alone
- Ensure interactive states are visible and clear
- Keep focus states obvious and accessible
- Use large tap targets on buttons

---

### 13. Summary

This spec gives Amphitune a polished, modern identity built around:

- green/teal pond-inspired accents
- premium neutral surfaces
- soft glass-like hero framing
- clear content hierarchy
- confident but restrained CTAs
- discovery-first messaging

If you want, I can turn this into a reusable design checklist or a component-by-component
implementation spec for the rest of the app.
