# Codezium UI — Component Roadmap

Reference: [PrimeNG](https://primeng.dev/components) (93 components, 10 categories).
Architecture: Atomic Design (atoms → molecules → organisms), `cz-` prefix, standalone + signals, no NgModules.

## Definition of Done (per component)

- [ ] Implementation: `cz-` prefixed selector, standalone component/directive, signal `input()`/`output()`, `ControlValueAccessor` when it is a form control.
- [ ] i18n: reuse `CZ_VALIDATION_MESSAGES` + `locale`/`customErrors` inputs when validation applies.
- [ ] Theming: works with `base`, `glass` and `neo` themes (and dark mode) via `--cz-theme-*` / `--cz-*` tokens only.
- [ ] Accessibility: WCAG AA — semantic roles, ARIA attributes, keyboard support, visible focus.
- [ ] Barrel: exported through its `index.ts` and the parent `atoms|molecules|organism/index.ts`.
- [ ] Unit tests: spec file with checklist (create → CVA → validation/i18n → interaction/keyboard → a11y → variants → edge cases).
- [ ] Docs: showcase page (`<name>-doc.ts` + i18n), lazy route in `docs.routes.ts` and entry in `docs-nav.data.ts`.

## Status legend

| Symbol | Meaning |
| --- | --- |
| ☐ | Pending |
| 🚧 | In progress |
| ✅ | Done |

---

## Already implemented (PrimeNG parity)

`input-text`, `password`, `select`, `textarea`, `checkbox`, `radio-button`, `rating`, `select-button`, `slider`, `knob`, `toggle-button`, `icon-field` + `input-icon`, `input-number`, `key-filter`, `autocomplete`, `cz-icon` / `czIcon`.

---

## Batch 1 — UI Atoms

| Component | PrimeNG Reference | Impl | Spec | Docs |
| --- | --- | --- | --- | --- |
| `cz-button` | Button | ✅ | ✅ | ✅ |
| `cz-badge` | Badge | ✅ | ✅ | ✅ |
| `cz-tag` | Tag | ✅ | ✅ | ✅ |
| `cz-chip` | Chip | ✅ | ✅ | ✅ |
| `cz-avatar` | Avatar | ✅ | ✅ | ✅ |
| `cz-divider` | Divider | ✅ | ✅ | ✅ |
| `cz-skeleton` | Skeleton | ✅ | ✅ | ✅ |
| `cz-progress-bar` | ProgressBar | ✅ | ✅ | ✅ |
| `cz-progress-spinner` | ProgressSpinner | ✅ | ✅ | ✅ |
| `czRipple` (directive) | Ripple | ✅ | ✅ | ✅ |

## Batch 2 — Form Atoms

| Component | PrimeNG Reference | Impl | Spec | Docs |
| --- | --- | --- | --- | --- |
| `cz-toggle-switch` | ToggleSwitch | ✅ | ✅ | ✅ |
| `cz-listbox` | Listbox | ✅ | ✅ | ✅ |
| `cz-input-mask` | InputMask | ✅ | ✅ | ✅ |
| `cz-input-group` | InputGroup | ✅ | ✅ | ✅ |
| `cz-input-otp` | InputOtp | ✅ | ✅ | ✅ |
| `cz-input-tags` | InputTags | ✅ | ✅ | ✅ |
| `cz-label` | Label | ✅ | ✅ | ✅ |
| `cz-color-picker` | InputColor | ✅ | ✅ | ✅ |
| `cz-date-picker` | DatePicker | ✅ | ✅ | ✅ |
| `cz-cascade-select` | CascadeSelect | ✅ | ✅ | ✅ |
| `cz-tree-select` | TreeSelect | ✅ | ✅ | ✅ |

## Batch 3 — Container & Message Molecules

| Component | PrimeNG Reference | Impl | Spec | Docs |
| --- | --- | --- | --- | --- |
| `cz-message` | Message | ✅ | ✅ | ✅ |
| `cz-toast` | Toast | ✅ | ✅ | ✅ |
| `cz-card` | Card | ✅ | ✅ | ✅ |
| `cz-panel` | Panel | ✅ | ✅ | ✅ |
| `cz-fieldset` | Fieldset | ✅ | ✅ | ✅ |
| `cz-tabs` | Tabs | ✅ | ✅ | ✅ |
| `cz-accordion` | Accordion | ✅ | ✅ | ✅ |
| `cz-toolbar` | Toolbar | ✅ | ✅ | ✅ |
| `cz-breadcrumb` | Breadcrumb | ✅ | ✅ | ✅ |
| `cz-paginator` | Paginator | ✅ | ✅ | ✅ |
| `cz-float-label` | FloatLabel | ✅ | ✅ | ✅ |
| `cz-ifta-label` | IftaLabel | ✅ | ✅ | ✅ |

## Batch 4 — Overlays

| Component | PrimeNG Reference | Impl | Spec | Docs |
| --- | --- | --- | --- | --- |
| `cz-dialog` | Dialog | ✅ | ✅ | ✅ |
| `cz-drawer` | Drawer | ✅ | ✅ | ✅ |
| `cz-confirm-dialog` | ConfirmDialog | ✅ | ✅ | ✅ |
| `cz-confirm-popup` | ConfirmPopup | ✅ | ✅ | ✅ |
| `cz-dynamic-dialog` | DynamicDialog | ✅ | ✅ | ✅ |
| `cz-popover` | Popover | ✅ | ✅ | ✅ |
| `czTooltip` (directive) | Tooltip | ✅ | ✅ | ✅ |
| `cz-block-ui` | BlockUI | ✅ | ✅ | ✅ |
| `czFocusTrap` (directive) | FocusTrap | ✅ | ✅ | ✅ |

## Batch 5 — Data Organisms

| Component | PrimeNG Reference | Impl | Spec | Docs |
| --- | --- | --- | --- | --- |
| `cz-table` | Table | ✅ | ✅ | ✅ |
| `cz-tree` | Tree | ✅ | ✅ | ✅ |
| `cz-tree-table` | TreeTable | ✅ | ✅ | ✅ |
| `cz-data-view` | DataView | ✅ | ✅ | ✅ |
| `cz-org-chart` | OrgChart | ✅ | ✅ | ✅ |
| `cz-order-list` | OrderList | ✅ | ✅ | ✅ |
| `cz-pick-list` | PickList | ✅ | ✅ | ✅ |
| `cz-virtual-scroller` | VirtualScroller | ✅ | ✅ | ✅ |
| `cz-timeline` | Timeline | ✅ | ✅ | ✅ |

## Batch 6 — Navigation Organisms

| Component | PrimeNG Reference | Impl | Spec | Docs |
| --- | --- | --- | --- | --- |
| `cz-menu` | Menu | ✅ | ✅ | ✅ |
| `cz-menubar` | Menubar | ✅ | ✅ | ✅ |
| `cz-tiered-menu` | TieredMenu | ✅ | ✅ | ✅ |
| `cz-mega-menu` | MegaMenu | ✅ | ✅ | ✅ |
| `cz-context-menu` | ContextMenu | ✅ | ✅ | ✅ |
| `cz-dock` | Dock | ✅ | ✅ | ✅ |
| `cz-sidebar` | Sidebar | ✅ | ✅ | ✅ |
| `cz-command-menu` | CommandMenu | ✅ | ✅ | ✅ |
| `cz-split-button` | SplitButton | ✅ | ✅ | ✅ |
| `cz-speed-dial` | SpeedDial | ✅ | ✅ | ✅ |
| `cz-stepper` | Stepper | ✅ | ✅ | ✅ |

## Batch 7 — Media, File & Misc

| Component | PrimeNG Reference | Impl | Spec | Docs |
| --- | --- | --- | --- | --- |
| `cz-carousel` | Carousel | ✅ | ✅ | ✅ |
| `cz-gallery` | Gallery | ✅ | ✅ | ✅ |
| `cz-compare` | Compare | ✅ | ✅ | ✅ |
| `cz-file-upload` | FileUpload | ✅ | ✅ | ✅ |
| `cz-inplace` | Inplace | ✅ | ✅ | ✅ |
| `cz-meter-group` | MeterGroup | ✅ | ✅ | ✅ |
| `cz-scroll-top` | ScrollTop | ✅ | ✅ | ✅ |
| `cz-splitter` | Splitter | ✅ | ✅ | ✅ |
| `cz-scroll-area` | ScrollArea | ✅ | ✅ | ✅ |
| `cz-terminal` | Terminal | ✅ | ✅ | ✅ |
| `czAnimateOnScroll` (directive) | AnimateOnScroll | ✅ | ✅ | ✅ |
| `czAutoFocus` (directive) | AutoFocus | ✅ | ✅ | ✅ |
| `czBind` (directive) | Bind | ✅ | ✅ | ✅ |
| `czClassNames` (directive) | ClassNames | ✅ | ✅ | ✅ |
| `czFluid` (directive) | Fluid | ✅ | ✅ | ✅ |
| `czStyleClass` (directive) | StyleClass | ✅ | ✅ | ✅ |

---

**Total pending: 0 components — roadmap complete.** 🎉 Existing components keep their PrimeNG-parity naming and API conventions.
