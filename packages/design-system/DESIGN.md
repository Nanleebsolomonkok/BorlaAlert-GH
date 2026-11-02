---
name: Civic Cleantech System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6e7b6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2d'
  primary: '#006b2c'
  on-primary: '#ffffff'
  primary-container: '#00873a'
  on-primary-container: '#f7fff2'
  inverse-primary: '#62df7d'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#00685f'
  on-tertiary: '#ffffff'
  tertiary-container: '#008378'
  on-tertiary-container: '#f4fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  headline-xl:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Epilogue
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Epilogue
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Epilogue
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.5px
  numeric-currency:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.2px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-utility, civic-minded cleantech experience engineered specifically for mobile-first urban Ghana. It connects residential households with municipal and informal waste operators (including motorized tricycles or *Aboboyaa*, flatbed trucks, and sorting hubs) across Greater Accra's distinct zones (e.g., Osu, East Legon, Kaneshie, Jamestown, Madina). 

The emotional tone balances civic dependability, ecological action, and immediate practical utility. It must feel as accessible and fail-safe as a critical utility or mobile money interface, avoiding decorative fluff in favor of outdoor legibility, rapid dispatching, and transparent micro-transactions.

### Visual Style
- **Aesthetic Framework:** Contemporary Material 3 utility tuned for high-ambient-light environments.
- **Physical Usability:** Ergonomic thumb zones, minimum 48px touch targets across all interactive surfaces to support single-handed outdoor operation.
- **Visual Clarity:** Crisp structural separation, high-contrast text ratios exceeding WCAG AAA for key alerts, and subtle tonal nesting to combat equatorial sun glare on mid-range Android screens.

## Colors

The palette is tuned specifically for the intense glare of Accra's sunlight, prioritizing punchy primary accents, non-ambiguous status alerts, and glare-resistant background layers.

### Role Allocation
- **Primary (`#16A34A` - Eco Green):** Reserved for confirmed pickups, positive account balances, successful AI waste classifications, and primary calls to action (e.g., "Request Borla Pickup").
- **Secondary (`#F59E0B` - Alert Amber):** Serves operational urgency, approaching *Aboboyaa* pickups, pending MoMo authorizations, and full bin alerts.
- **Tertiary (`#0D9488` - Recycled Teal):** Highlights recycling programs, sorting categorizations (plastics, organic, e-waste), and verified environmental impact metrics.
- **Neutral Dark (`#111827` - Deep Charcoal):** Primary text and key iconography, avoiding pure `#000000` to prevent harsh eye strain while guaranteeing a 12:1+ contrast ratio against light backgrounds.
- **Neutral Secondary (`#6B7280` - Muted Slate):** Subtitles, metadata, timestamp trackers, and inactive states. Minimum contrast ratio of 4.6:1 against white surfaces.
- **Surface & Canvas (`#FFFFFF` & `#F8FAFC`):** Primary canvas uses `#FFFFFF`; secondary card surfaces and elevated containers utilize `#F8FAFC` paired with subtle borders to retain distinct container boundaries outdoors.
- **Functional Error (`#EF4444`):** Urgent operational alerts, failed MoMo prompt transactions, missed collections, and hazardous waste warnings.

## Typography

Typography prioritizes legibility at a glance. Epilogue provides an authoritative, geometric presence for titles, zone names, and AI confidence ratings, while Inter handles data density, microcopy, route instructions, and currency ledgers.

### Application Rules
- **Monetary & Quota Formats:** All Ghana Cedi values (`GH₵`) and volume measures (`kg`, `bags`) use `numeric-currency` or `label-lg` with tabular numbers enabled (`tnum`) to maintain clean alignment during MoMo billing.
- **Accra Sub-district Hierarchy:** Top-level screens display the target operational zone (e.g., "Zone 4: Adabraka") in `headline-sm` with a secondary tag for precise driver orientation.
- **Outdoor Scannability:** Crucial metadata tags (e.g., collector arrival times, AI bin full percentages) must never drop below 12px (`body-sm`), rendered at 600 weight to ensure readability through mobile screen protectors.

## Layout & Spacing

The layout is built around a mobile-first, 4-column fluid layout that expands to 8 columns on tablets and operational dispatch terminals.

### Breakpoints & Canvas
- **Mobile (< 600px):** 4 columns, 16px (`1rem`) outer margin, 16px (`1rem`) gutter. Single primary column for core actions.
- **Tablet / Dispatch Dashboard (600px - 1023px):** 8 columns, 32px (`2rem`) outer margin, 24px (`1.5rem`) gutter. Master-detail views split collection queue from live Accra GPS map tracking.

### Touch Target Rule
All clickable, tappable, or swipeable interactive components strictly enforce a minimum dimension of `48px x 48px` with at least `space-sm` (8px) of clearance between adjacent touch targets.

## Elevation & Depth

To remain clear under direct sunlight, depth relies primarily on high-contrast surface containment, structural borders, and subtle tinted ambient shadows rather than deep blur effects.

### Tonal Surface System
- **Level 0 (Base Canvas):** `#FFFFFF`. The ground floor for lists, settings, and forms.
- **Level 1 (Card & Module Layer):** `#F8FAFC` bounded by a 1px solid `#E2E8F0` border. Used for collector dispatch cards, AI analysis summaries, and MoMo payment receipts.
- **Level 2 (Active Modals & Drawers):** `#FFFFFF` paired with an ambient shadow: `0 4px 16px -2px rgba(17, 24, 39, 0.08), 0 2px 4px -1px rgba(17, 24, 39, 0.04)`.
- **Level 3 (Emergency / Real-Time Floating Controls):** `#FFFFFF` with elevated green-tinted shadow: `0 10px 24px -4px rgba(22, 163, 74, 0.15)`. Used for instant pickup FABs and active driver tracking alerts.

## Shapes

The design uses a balanced rounded corner language (0.5rem / 8px baseline) that aligns with Material 3 principles while avoiding excessive pill shapes that waste horizontal screen real estate.

### Geometry Hierarchy
- **Inputs & standard cards (`rounded`):** `8px` (`0.5rem`). Conveys order, stability, and structure for forms, schedule pickers, and transaction logs.
- **Containers & Sheets (`rounded-lg`):** `16px` (`1rem`). Applied to bottom sheets, pickup status modules, and modal overlays.
- **Chips, Badges, & Action Pills:** Full rounded (`9999px`) reserved only for contextual status pills (e.g., "Aboboyaa Dispatched", "AI Verified", "MoMo Paid").

## Components

### Buttons
- **Primary Action (e.g., "Request Pickup Now"):** Minimum height 52px. Solid background `#16A34A`, text `#FFFFFF`, font `label-lg`, radius `8px`. Active press scales to `0.98` with `#15803D`.
- **Secondary Action (e.g., "Schedule Later", "Call Collector"):** Minimum height 48px. Background transparent, border 1.5px solid `#16A34A`, text `#16A34A`.
- **Alert / Destructive (e.g., "Report Overflow", "Cancel Dispatch"):** Background `#FEE2E2`, text `#B91C1C`, border 1px solid `#EF4444`.

### Cards
- **Collector Dispatch Card:** `#F8FAFC` background, 1px solid border `#E2E8F0`, padding `16px`, radius `12px`. Header features collector verification shield, vehicle indicator (Icon + "Aboboyaa" / "Compactor"), and live ETA badge in `#F59E0B`.
- **AI Smart Waste Scanner Card:** Container with dashed inner border `#16A34A`, dynamic camera viewport preview, category tag (e.g., "Organic", "Plastic PET"), and calculated collection price in `GH₵`.

### Chips & Badges
- **Status Badges:** Height 28px, horizontal padding `10px`, pill-shaped radius (`9999px`). 
  - *Pending Collection:* `#FEF3C7` background, `#92400E` text.
  - *Collector In Route:* `#DCFCE7` background, `#166534` text.
  - *Service Delayed:* `#FEE2E2` background, `#991B1B` text.
- **Zone Filter Chips:** Height 36px, horizontal padding `14px`, 8px radius. Tap target padded out to 48px invisibly. Selected state uses `#16A34A` background with white text; unselected uses `#F8FAFC` with `#111827` text and `#E2E8F0` border.

### Input Fields
- **Text & Address Inputs:** 52px height. White background, 1px solid `#D1D5DB` border (transitions to 2px `#16A34A` on focus). Label rendered above field in `label-sm` (`#111827`). Support for Ghana Post GPS code format (`XX-000-0000`) with monospace spacing.
- **Mobile Money (MoMo) Selector:** Grouped radio selection cards with carrier icons (MTN MoMo, Telecel Cash, AT Money). Active selection gets a 2px `#16A34A` outline and soft green background tint (`#F0FDF4`).

### Lists & Activity Feeds
- **Pickup Log Items:** Separated by 1px solid `#F1F5F9`. Leading icon identifies waste stream (Recycling, Solid Waste, Bulky). Trailing stack shows transaction amount formatted as `GH₵ XX.XX` above date and time.
- **Zero-State Feedback:** Clean illustrated placeholder with clear direct CTA when no active pickups are booked.

### Checkboxes & Radios
- Size 24px x 24px enclosed within a minimum 48px interactive target container. Selected checkbox fills with `#16A34A` displaying a white checkmark; unselected uses a 2px outline of `#6B7280`.