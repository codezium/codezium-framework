# Codezium UI — Component Integration Guide

How the 90+ components compose with each other. Every recipe below is built on three shared
contracts:

1. **`ControlValueAccessor`** on every form control → mix any control in the same `FormGroup` / `ngModel`.
2. **Shared models** — `CzMenuItem` (navigation/actions), `CzSeverity` (feedback/colors), `CzInputSize` (sizes).
3. **Theme tokens** — every component reads `--cz-theme-*`, so `base` / `glass` / `neo` + dark mode work in any combination.

---

## 1. Built-in integrations (already wired)

| Component | Integrates with | Mechanism |
| --- | --- | --- |
| `cz-data-view` | `cz-paginator` | internal `ngModel` footer |
| `cz-input-tags` | `cz-chip` | renders removable chips |
| `cz-block-ui` | `cz-progress-spinner` | loading overlay |
| `cz-dock` | `czTooltip` | floating labels |
| `cz-confirm-dialog` | `cz-dialog` + `cz-button` | `CzConfirmationService` |
| `cz-confirm-popup` | `cz-button` | same service, anchored at event coordinates |
| `cz-dynamic-dialog` | `cz-dialog` | `CzDynamicDialogService.open(Component)` injects `data` and `ref` inputs |
| `cz-toast` | `CzToastService` | `success/info/warning/error` helpers |
| `cz-stepper` | `cz-step` + `cz-button` | `contentChildren` orchestration |
| `cz-table` | `cz-paginator` | optional `rows` footer |
| `cz-input-number` / `czInputMask` / `czKeyFilter` | native `input` **or** `cz-input-text` | optional component injection |
| `cz-icon-field` | `cz-input-icon` + any input | slot projection |
| `cz-dialog` | `czFocusTrap` | Tab focus is trapped by default |

---

## 2. Global hosts (place once at the app root)

Service-driven components render nothing until a service pushes data, so mount them **once**:

```html
<!-- app.html -->
<router-outlet />

<cz-toast position="top-right" />
<cz-confirm-dialog />
<cz-confirm-popup />
<cz-dynamic-dialog />
```

Then any component can trigger them:

```ts
private toast = inject(CzToastService);
private confirm = inject(CzConfirmationService);
private dialogs = inject(CzDynamicDialogService);

delete(row: Customer) {
    this.confirm.confirm({
        header: 'Delete customer',
        message: `Delete ${row.name}?`,
        severity: 'danger',
        accept: () => {
            this.remove(row);
            this.toast.success('Customer deleted');
        },
    });
}

edit(row: Customer) {
    const ref = this.dialogs.open(CustomerFormComponent, {
        header: 'Edit customer',
        data: row,
    });
    this.dialogs.onClose(ref.id, (saved) => saved && this.reload());
}
```

---

## 3. Recipes

### 3.1 Complete form field

```html
<cz-fieldset legend="Profile">
    <div czFluid class="cz-flex cz-flex-col cz-gap-md">
        <cz-input-text label="Name" labelPosition="float" [formControl]="form.controls.name" />
        <cz-select label="Country" labelPosition="float" [options]="countries"
                   optionLabel="label" optionValue="value" [formControl]="form.controls.country" />
        <cz-date-picker [formControl]="form.controls.birthday" placeholder="Birthday" />
        <cz-toggle-switch label="Newsletter" [formControl]="form.controls.newsletter" />
    </div>
</cz-fieldset>
```

Every control shows localized validation automatically (`locale`, `customErrors`, `czError` / `czHelp` slots).

### 3.2 Field decoration

```html
<!-- Icon inside the field -->
<cz-icon-field iconPosition="left">
    <cz-input-icon [icon]="LucideSearch" color="primary" />
    <cz-input-text label="Search" labelPosition="float" />
</cz-icon-field>

<!-- Addons + button -->
<cz-input-group>
    <cz-input-group-addon>$</cz-input-group-addon>
    <cz-input-text placeholder="Amount" />
    <cz-button label="Apply" />
</cz-input-group>

<!-- Stacked input directives (all on the same control) -->
<input czKeyFilter="integer" czInputMask="999-99" czInputNumber />
```

### 3.3 CRUD screen (the most complete combo)

```html
<cz-toolbar>
    <cz-button label="New" [icon]="LucidePlus" czToolbarStart (onClick)="openCreate()" />
    <cz-input-text placeholder="Filter..." [formControl]="filter" czToolbarEnd />
</cz-toolbar>

<cz-block-ui [(blocked)]="saving">
    <cz-table [columns]="columns" [value]="customers()" [sortable]="true" [striped]="true"
              selectionMode="single" [rows]="10"
              (onRowSelect)="openEdit($event)" />
</cz-block-ui>
```

- `onRowSelect` → `dynamic-dialog` with the edit form
- delete → `confirm-dialog` → `toast`
- loading → `skeleton` rows or `block-ui`
- empty state → `cz-table` `emptyMessage`

### 3.4 Application layout

```html
<div class="cz-flex">
    <cz-sidebar header="Codezium" [items]="navItems()" [(collapsed)]="mini" />
    <div class="cz-flex cz-flex-col cz-flex-1">
        <cz-menubar [items]="menuItems()" />
        <cz-breadcrumb [items]="crumbs()" />
        <router-outlet />
    </div>
</div>
<cz-scroll-top [threshold]="400" />
```

The same `CzMenuItem[]` feeds `menu`, `menubar`, `tiered-menu`, `mega-menu`, `context-menu`,
`dock`, `command-menu`, `sidebar`, `split-button` and `speed-dial` — build the navigation model once.

### 3.5 Overlays composition

```html
<cz-context-menu [items]="rowActions" (onItemSelect)="run($event)">
    <div class="row">Right click me</div>
</cz-context-menu>

<cz-popover position="bottom">
    <cz-button label="Filters" czPopoverTrigger />
    <cz-input-text label="Search" labelPosition="float" />
</cz-popover>

<cz-command-menu #palette [items]="commands()" />
```

- `command-menu` commands can open `dynamic-dialog`, navigate, or push toasts
- `confirm-popup` anchors to the clicked button coordinates
- `tooltip` and `ripple` decorate any element: `<cz-button czTooltip="Save" czRipple />`
- dialog content traps Tab focus (`czFocusTrap` is applied by default); add `czAutoFocus` to the first field

### 3.6 Wizard flow

```html
<cz-stepper [linear]="true">
    <cz-step label="Account"><form [formGroup]="accountStep">...</form></cz-step>
    <cz-step label="Profile"><form [formGroup]="profileStep">...</form></cz-step>
    <cz-step label="Confirm"><summary /></cz-step>
</cz-stepper>
```

Finish with `confirm-dialog` + `toast`. Each step form is a normal `FormGroup`.

### 3.7 Data visualization

| Need | Composition |
| --- | --- |
| Paged cards/list | `cz-data-view` (`layout="grid"`) + built-in paginator |
| Hierarchical table | `cz-tree-table` inside `cz-card` |
| Large lists | `cz-virtual-scroller` inside `cz-card` (never inside `cz-scroll-area`) |
| Trees / orgs | `cz-tree`, `cz-org-chart` |
| Events | `cz-timeline` with `CzSeverity` markers |
| Reordering | `cz-order-list` / `cz-pick-list` as form controls |
| Before/after | `cz-compare`; galleries with `cz-gallery` / `cz-carousel` |

### 3.8 Feedback ladder

| Scope | Component |
| --- | --- |
| Inline, persistent | `cz-message` |
| Global, transient | `cz-toast` + `CzToastService` |
| Blocking a region | `cz-block-ui` |
| Progress | `cz-progress-bar` / `cz-progress-spinner` |
| Placeholder | `cz-skeleton` |
| Decisions | `cz-confirm-dialog` / `cz-confirm-popup` |

All share `CzSeverity`, so colors stay consistent across the app.

### 3.9 Utility directives (glue)

| Directive | Use with |
| --- | --- |
| `czFluid` | inputs inside cards/panels/splitters |
| `czClassNames` | conditional styling (string / array / record) |
| `czBind` | bulk attributes (e.g., aria maps) |
| `czStyleClass` | animated open/close classes |
| `czAnimateOnScroll` | cards/sections on landing pages |
| `czAutoFocus` | first field of dialogs and command palettes |
| `czFocusTrap` | custom overlays |

---

## 4. Harmony rules

- **Never nest conflicting scrolls**: `cz-scroll-area` and `cz-virtual-scroller` are alternatives.
- **`cz-float-label` / `cz-ifta-label`** work with native `input` + `label` pairs; `cz-input-text`, `cz-password`, `cz-textarea`, `cz-select` and `cz-autocomplete` already provide `labelPosition` (`none` / `over` / `in` / `float`).
- **Sizes**: use `CzInputSize` (`sm` / `md` / `lg`) so buttons, inputs and tables line up.
- **Severities**: use `CzSeverity` everywhere (`primary`, `secondary`, `success`, `info`, `warning`, `danger`, `dark`).
- **Overlays**: all use `--cz-z-glass-overlay` and render above regular content; keep the four service hosts at the root.
- **Theming**: never hardcode colors; use `--cz-theme-*` tokens so `data-theme` switching works.
