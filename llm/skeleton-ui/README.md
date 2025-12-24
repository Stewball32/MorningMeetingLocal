# Skeleton UI Notes

Quick jump sheet for the downloaded docs (last sync noted in files). Use these paths to open the full notes.

## Getting Started
- `notes/skeleton-ui/get-started/introduction.md`: What Skeleton is, design-system + Zag-based components, and philosophy (framework-agnostic, native-first, utility/opt-in, adaptive, OSS).
- `notes/skeleton-ui/get-started/fundamentals.md`: Three pillars (design system, Tailwind extensions, optional framework components), Zag.js rationale, import/styling patterns, extensible markup, custom animations, provider pattern.
- `notes/skeleton-ui/get-started/core-api.md`: Core Tailwind extensions: `@base` globals, `@theme` tokens (colors, pairings, spacing, typography, radius/edge defaults), `@utility` Tailwind components, `@variant` theming, optional presets and preset themes.

## Guides
- `notes/skeleton-ui/guides/dark-mode.md`: Tailwind dark-mode strategies (media, selector, data attribute), `dark:` usage, color-scheme helpers powered by color pairings, and a note to roll your own light switch.
- `notes/skeleton-ui/guides/layouts.md`: Quick reference copy of the core API sections (`@base`, `@theme`, utilities, variants, presets/themes).

## Design System
- `notes/skeleton-ui/design-system/colors.md`: Palette syntax (`property-color-shade`), contrast tokens, color pairings via `light-dark()`, and transparency support.
- `notes/skeleton-ui/design-system/iconagraphy.md`: Icon approach; Lucide recommended, with install/usage pointers and alternate libraries.
- `notes/skeleton-ui/design-system/spacing.md`: Theme-driven spacing scale via Tailwind spacing property; override per theme.
- `notes/skeleton-ui/design-system/presets.md`: Filled/tonal/outlined presets, pairing-aware syntax, and recipes for custom presets (glass, gradients, validation states).
- `notes/skeleton-ui/design-system/themes.md`: How to import preset/custom themes, register/activate via `data-theme`, tweak properties, target themes with `@variant`, and add custom fonts/backgrounds.
- `notes/skeleton-ui/design-system/typography.md`: Opt-in utility classes for semantic elements, typographic scale via `--text-scaling`, and patterns for building semantic type presets.

## Tailwind Components (core primitives)
- `notes/skeleton-ui/components-tailwind/buttons.md`: Button styles, presets, sizes, disabled state, simple groups.
- `notes/skeleton-ui/components-tailwind/badges.md`: Non-interactive badges, presets, overlap/notification badges.
- `notes/skeleton-ui/components-tailwind/cards.md`: Card container patterns, preset fills/tonal/outlined options.
- `notes/skeleton-ui/components-tailwind/chips.md`: Interactive chips with presets, disabled/selection examples.
- `notes/skeleton-ui/components-tailwind/dividers.md`: Horizontal/vertical rules with Tailwind width/style/color utilities.
- `notes/skeleton-ui/components-tailwind/forms-and-inputs.md`: Tailwind Forms dependency, browser caveats, inputs/selects/checkbox/radio, kitchen-sink native elements, input groups.
- `notes/skeleton-ui/components-tailwind/placeholders.md`: Skeleton loading placeholders (rectangles/circles, pulse animation).
- `notes/skeleton-ui/components-tailwind/tables.md`: Table styling, headers/footers/captions, hover rows, navigation cells.

## Framework Components (Zag-powered)

### Navigation & Layout
- `notes/skeleton-ui/components-framework/app-bar.md`: Header bar slots (lead/headline/trail), grid layout control, responsive/extended variants, API.
- `notes/skeleton-ui/components-framework/navigation.md`: Navigation patterns (bar, rail, sidebar, toggle) with layout guidance per screen size.
- `notes/skeleton-ui/components-framework/floating-panel.md`: Draggable/resizable panel with stages (min/max), size constraints, controlled state, portal positioning.
- `notes/skeleton-ui/components-framework/pagination.md`: Client/server pagination controls with prev/next, ellipsis, configurable page size and RTL support.
- `notes/skeleton-ui/components-framework/steps.md`: Multi-step flow with triggers, separators, prev/next controls, controlled state, vertical orientation.

### Overlays & Feedback
- `notes/skeleton-ui/components-framework/dialog.md`: Headless modal/alert dialog; backdrop/positioner/content anatomy, close behaviors, drawers, z-index, RTL.
- `notes/skeleton-ui/components-framework/popover.md`: Headless popover with trigger/anchor, arrow, positioning via portal, close trigger.
- `notes/skeleton-ui/components-framework/tooltip.md`: Headless tooltip; placement, arrow, z-index control, provider pattern, RTL.
- `notes/skeleton-ui/components-framework/toast.md`: Global toaster singleton; info/success/warning/error helpers, group rendering pattern.
- `notes/skeleton-ui/components-framework/progress-linear.md`: Linear progress (controlled/indeterminate), orientation, custom colors/heights, native `<progress>` styling.
- `notes/skeleton-ui/components-framework/progress-circular.md`: Circular progress with sizing, color customization, centered content, controlled via slider example.

### Data Display & Structure
- `notes/skeleton-ui/components-framework/avatar.md`: Avatar image with fallback, sizing, optional SVG filters, provider API.
- `notes/skeleton-ui/components-framework/listbox.md`: Single/multi select list, grouping with `useListCollection`, indicators.
- `notes/skeleton-ui/components-framework/menu.md`: Trigger/context menus, grouped items, nested/option items, close-on-select controls, positioning/arrow.
- `notes/skeleton-ui/components-framework/tabs.md`: Controlled tabs with indicator, navigation links, fluid/stretch layouts.
- `notes/skeleton-ui/components-framework/tree-view.md`: Hierarchical tree using `createTreeViewCollection`, branch/item rendering, controlled state hooks.
- `notes/skeleton-ui/components-framework/accordion.md`: Expand/collapse sections; controlled/multiple/collapsible modes, custom indicators.
- `notes/skeleton-ui/components-framework/collapsible.md`: Simple toggle container with indicators, alignment, controlled open/rtl, disabled.

### Inputs & Selection
- `notes/skeleton-ui/components-framework/combobox.md`: Searchable combobox with `useListCollection`, grouping, filtering on input, clear trigger, portal positioning.
- `notes/skeleton-ui/components-framework/tags-input.md`: Multi-value input with inline editing, clear trigger, custom delete icons, provider pattern.
- `notes/skeleton-ui/components-framework/file-upload.md`: Dropzone/button-only patterns, accepted files list with delete/clear, disabled/rtl, drag/drop enablement.
- `notes/skeleton-ui/components-framework/date-picker.md`: Multi-view calendar (day/month/year) with portal, controlled values, triggers/inputs, disabled mode.
- `notes/skeleton-ui/components-framework/slider.md`: Range input with markers, color customization, disabled/read-only, multiple thumbs and steps.
- `notes/skeleton-ui/components-framework/rating-group.md`: Star-style rating, half steps, custom icons, label/disabled/required handling.
- `notes/skeleton-ui/components-framework/segmented-control.md`: Option pills with indicator, icons, vertical orientation, controlled value.
- `notes/skeleton-ui/components-framework/toggle-group.md`: Grouped toggles (single/multiple), orientation/RTL, controlled values.
- `notes/skeleton-ui/components-framework/switch.md`: On/off toggle with label, state-based styling, icon thumb content, list layout, RTL.

## Notes
- Files originate from Skeleton docs (timestamps in each file) and may include headless/unstyled components; most examples rely on Tailwind utility classes and Skeleton presets/themes.
- Provider pattern appears across components (e.g., Combobox, TagsInput, Tooltip) for direct API access.
