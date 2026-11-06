# QUICKMOVE SOLUTIONS — DESIGN SYSTEM & VISUAL GUIDELINES (`DESIGN_SYSTEM.md`)

**Phase:** Phase 1 Deliverable  
**Status:** Implemented & Verified  
**Primary Brand Tagline:** *"Moving Made Easy. Space Made Clear."*

---

## 1. Official Colour System

All UI components, marketing layouts, quotation PDFs, and AI-generated visual concepts strictly follow the official five-colour palette defined in Section 3.2 of `KNOWLEDGE.md`:

| Token | Name | Hex | Tailwind Class | Usage Rules |
|---|---|---|---|---|
| `brand-navy` | Brand Navy | `#101D35` | `bg-brand-navy` / `text-brand-navy` | Primary brand identity colour: navigation bars, hero backgrounds, headings, footer, and high-trust sections. |
| `brand-orange` | Action Orange | `#F47732` | `bg-brand-orange` / `text-brand-orange` | Primary CTAs (*Get a Free Quote*), active selection states, step progress indicators, and key icon highlights. |
| `brand-surface-white` | Pure White | `#FFFFFF` | `bg-white` | Primary page background and elevated card surfaces. |
| `brand-surface-grey` | Light Grey | `#F4F6F8` | `bg-brand-surface-grey` | Alternating section backgrounds, form control backgrounds, and subtle container contrast. |
| `brand-charcoal` | Body Charcoal | `#222A35` | `text-brand-charcoal` | Primary body copy for optimal contrast and readability. |

---

## 2. Typography Hierarchy

- **Heading Font (`font-heading`):** `Manrope` (700 Bold / 800 ExtraBold)
- **Body & UI Font (`font-sans`):** `Inter` (400 Regular / 500 Medium / 600 SemiBold)

### Responsive Fluid Scale (`tailwind.config.ts`)
- `text-display-xl`: `clamp(2.5rem, 5vw + 1rem, 4.25rem)` — Hero Headlines
- `text-display-lg`: `clamp(2rem, 3.8vw + 0.75rem, 3.25rem)` — Major Landing Headers
- `text-heading-1`: `clamp(1.75rem, 2.8vw + 0.5rem, 2.5rem)` — Section Titles (`<h2>`)
- `text-heading-2`: `clamp(1.375rem, 2vw + 0.4rem, 1.875rem)` — Feature & Sub-section Titles
- `text-heading-3`: `clamp(1.125rem, 1.2vw + 0.3rem, 1.375rem)` — Card Titles (`<h3>`)

---

## 3. Spacing & Responsive Breakpoints

- **Breakpoints:**
  - `sm`: `640px` (Large phones / Portrait phablets)
  - `md`: `768px` (Tablets)
  - `lg`: `1024px` (Laptops / Landscape tablets)
  - `xl`: `1280px` (Desktop full navigation threshold)
  - `2xl`: `1400px` (Max container width)
- **Section Vertical Rhythm (`Section.tsx`):**
  - `sm`: `py-10 sm:py-14`
  - `md`: `py-14 sm:py-20`
  - `lg`: `py-16 sm:py-24 lg:py-28`
  - `xl`: `py-20 sm:py-28 lg:py-32`

---

## 4. Reusable Component Library (`src/components/ui/`)

1. **`Button.tsx`:**
   - Variants: `primary` (`#F47732` Orange CTA), `secondary` (`#101D35` Navy), `outline`, `outline-light`, `ghost`, `white`, `call`.
   - Sizes: `sm`, `md`, `lg`, `xl`.
   - Automatically renders Next.js `<Link>` for internal routes, `<a>` for `tel:` / `mailto:` / external links, or `<button>` for form actions.
2. **`Badge.tsx`:**
   - Variants: `navy`, `orange`, `orange-solid`, `light`, `outline`, `success`, `warning`, `info`.
3. **`Card.tsx`:**
   - Variants: `default`, `grey`, `navy`, `outlined`, `interactive` (with smooth hover lift and orange border accent).
4. **`FormControls.tsx`:**
   - `FormField`, `Input`, `Textarea`, `Select`, and `SelectionCard` (interactive visual cards with `aria-pressed` state used in Moving & Junk Removal Quote Wizards).
5. **`Section.tsx` & `SectionHeader.tsx`:**
   - Enforces consistent container widths, alternating backgrounds (`white`, `grey`, `navy`, `navy-mesh`), eyebrows, and headings.
6. **`Accordion.tsx`:**
   - Accessible FAQ component with `aria-expanded`, `aria-controls`, and keyboard navigation.
7. **`IconBox.tsx`:**
   - Standardized icon badges using `lucide-react` iconography.
8. **`MotionWrapper.tsx` (`FadeIn`):**
   - Framer Motion scroll-reveal wrapper that automatically checks `useReducedMotion()` and disables motion when the user prefers reduced motion.

---

## 5. Navigation & Contact Rules (`src/components/layout/`)

- **`BrandLogo.tsx`:** Custom SVG QuickMove Solutions truck & space-clearing emblem + wordmark.
- **`Header.tsx`:**
  - Top bar displays official phone `(587) 999-9565` (`tel:+15879999565`), official email `quickmoversolu@gmail.com` (`mailto:quickmoversolu@gmail.com`), and service areas.
  - Desktop dropdown menus for **Moving Services** (Residential, Commercial, Local, Long-Distance, Packing & Unpacking) and **Service Areas** (Calgary, Airdrie, Strathmore, Red Deer, Edmonton).
  - Mobile drawer with expandable sub-menus and full-width **Get a Free Quote** and **Call (587) 999-9565** buttons.
- **`Footer.tsx`:**
  - Displays all official service links, service area links, Facebook & Instagram links, approved-item junk removal disclaimer, and legal links.

