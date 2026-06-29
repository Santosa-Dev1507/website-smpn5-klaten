---
name: Sistem Manajemen Akademik SMPN 5 Klaten
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#454652'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#767683'
  outline-variant: '#c6c5d4'
  surface-tint: '#4c56af'
  primary: '#000666'
  on-primary: '#ffffff'
  primary-container: '#1a237e'
  on-primary-container: '#8690ee'
  inverse-primary: '#bdc2ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#8df5e4'
  on-secondary-container: '#007165'
  tertiary: '#001944'
  on-tertiary: '#ffffff'
  tertiary-container: '#002c6e'
  on-tertiary-container: '#6b95f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#343d96'
  secondary-fixed: '#8df5e4'
  secondary-fixed-dim: '#70d8c8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#b0c6ff'
  on-tertiary-fixed: '#001945'
  on-tertiary-fixed-variant: '#00429c'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system embodies a **Modern Academic** aesthetic, specifically tailored for the Indonesian public school context (SMPN). The brand personality is rooted in three pillars: **Otoritas** (Authority), **Kejelasan** (Clarity), and **Kemajuan** (Progress). 

The visual language balances the rigorous, data-dense needs of administrators with an inviting, structured environment for students. It utilizes a **Corporate Modern** style—relying on a disciplined grid, logical information architecture, and subtle depth to guide the eye. The interface must feel institutional yet accessible, ensuring that users from varying digital literacy levels can navigate academic records, attendance, and scheduling with confidence.

## Colors

The palette is designed to evoke a sense of stability and institutional trust. 

- **Primary (Navy Blue):** Used for navigation headers, primary buttons, and institutional branding. It signifies the formal authority of SMPN 5 Klaten.
- **Secondary (Professional Teal):** Reserved for "Success" states, achievement badges, and positive progress indicators (e.g., *Nilai Tuntas*). 
- **Tertiary (School Blue):** A lighter blue used for secondary actions, active states in sidebars, and link highlights.
- **Backgrounds:** A tiered system of neutral greys. `neutral_color_hex` is used for the main application background to reduce eye strain, while `surface_white` is used for cards and content containers to create a clear visual hierarchy.

## Typography

This design system utilizes **Inter** for its exceptional legibility and neutral, systematic character. The type scale is optimized for high information density.

- **Bahasa Indonesia Optimization:** Ensure line heights are generous enough to accommodate the frequent use of capital letters and long words common in formal Indonesian academic terminology.
- **Display & Headlines:** Used for dashboard summaries (e.g., *Statistik Siswa*) and page titles.
- **Body Text:** Use `body-lg` for student-facing content and `body-sm` for administrative data tables to maximize visibility of complex information.
- **Labels:** Uppercase labels with slight letter spacing are used for table headers and section categorizers to differentiate them from interactive content.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid**. On desktop, content is contained within a 1280px max-width container, while the sidebar remains fixed.

- **Desktop (12 Columns):** 24px gutters. Used for administrative dashboards where data comparison is frequent.
- **Tablet (8 Columns):** 16px gutters. Sidebar collapses into a hamburger menu or a slim icon-only bar.
- **Mobile (4 Columns):** 16px margins. Content stacks vertically.
- **Spacing Rhythm:** All spacing must be a multiple of 4px. Use `lg` (24px) for padding within cards and `md` (16px) for spacing between related input elements.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Ambient Shadows**. 

1. **Level 0 (Base):** The main background (`#F5F5F7`).
2. **Level 1 (Surface):** Cards, data tables, and input containers. These use a 1px border in a light neutral tone or a very soft, diffused shadow (Blur: 4px, Y: 2px, Opacity: 4%).
3. **Level 2 (Navigation/Floating):** Top navigation bars and floating action buttons. These use a more pronounced shadow (Blur: 12px, Y: 4px, Opacity: 8%) to indicate they sit above the content.
4. **Interactive States:** Buttons should feel tactile. On hover, they gain a slight elevation increase; on press, they flatten.

## Shapes

The design system uses **Soft (0.25rem)** roundedness to maintain a professional, serious tone without appearing overly clinical or sharp.

- **Standard Elements:** Input fields, buttons, and small tags use `rounded` (4px).
- **Large Containers:** Dashboard cards and modal windows use `rounded-lg` (8px).
- **Avatars/Indicators:** Student profile photos should use a circle (full round) to provide a soft contrast to the rectangular grid of the rest of the UI.

## Components

All component labels must use **Bahasa Indonesia**.

- **Buttons (Tombol):** 
    - *Primary:* Navy background, white text. For main actions like "Simpan Data" or "Kirim Tugas".
    - *Secondary:* Teal border, teal text. For positive actions like "Tambah Siswa".
- **Inputs (Input Field):**
    - High-contrast labels above the field. 
    - Error states must use `#D32F2F` with a small helper text icon.
- **Cards (Kartu):** 
    - Used for student profiles, class summaries, and schedule blocks. 
    - Cards should include a 4px left-border accent using the status color (e.g., Teal for "Hadir", Red for "Alpa").
- **Chips/Badges (Lencana):** 
    - Used for status indicators like "Aktif", "Lulus", or "Perlu Perbaikan". Use a subtle background tint of the status color with high-contrast text.
- **Data Tables (Tabel Data):** 
    - Essential for Admin users. Use zebra-striping (alternating row colors) and sticky headers for long lists of student grades or attendance records.
- **Iconography:** 
    - Use clean, linear icons. Avoid filled icons unless it is for an "Active" state in the navigation. Use icons to represent "Jadwal", "Nilai", "Kehadiran", and "Profil".