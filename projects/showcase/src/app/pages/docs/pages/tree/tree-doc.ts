import { ChangeDetectionStrategy, Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CzAvatarComponent,
    CzButtonComponent,
    CzCheckboxComponent,
    CzIconComponent,
    CzMenuItem,
    CzProgressSpinnerComponent,
    CzSkeletonComponent,
    CzTagComponent,
    CzToastService,
    CzToggleSwitchComponent,
    CzTreeNode,
    CzTreeComponent,
} from 'codezium-ui';
import {
    LucideCopy,
    LucideFile,
    LucideFolder,
    LucideMinusCircle,
    LucidePencil,
    LucidePlusCircle,
    LucideRefreshCw,
    LucideStar,
    LucideTrash,
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TREE_DOC_I18N } from './tree-doc.i18n';

@Component({
    selector: 'cz-tree-doc-page',
    imports: [
        FormsModule,
        CzTreeComponent,
        CzAvatarComponent,
        CzTagComponent,
        CzButtonComponent,
        CzIconComponent,
        CzCheckboxComponent,
        CzToggleSwitchComponent,
        CzSkeletonComponent,
        CzProgressSpinnerComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tree">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="fileNodes" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── SELECTION ── -->
            <section>
                <h2 id="selection">{{ t().selection }}</h2>
                <p [innerHTML]="t().selectionDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md" style="max-width: 24rem;">
                    <div>
                        <strong class="cz-text-sm">{{ t().singleSelection }}</strong>
                        <cz-tree [value]="fileNodes" selectionMode="single"
                            (onNodeSelect)="lastSelected.set($event.label)" />
                        <span class="cz-text-sm">{{ t().selected }}: {{ lastSelected() || '-' }}</span>
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().multipleSelection }}</strong>
                        <div class="cz-flex cz-items-center cz-gap-sm cz-mb-sm">
                            <cz-toggle-switch [ngModel]="metaKey()" (ngModelChange)="metaKey.set($event)"
                                [ariaLabel]="t().metaKey" />
                            <span class="cz-text-sm">{{ t().metaKey }}</span>
                        </div>
                        <cz-tree [value]="fileNodes" selectionMode="multiple" [metaKeySelection]="metaKey()"
                            [selection]="multiSelection()" (onSelectionChange)="multiSelection.set($event)" />
                        <span class="cz-text-sm">{{ t().selectedCount }}: {{ multiSelection().length }}</span>
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().checkboxSelection }}</strong>
                        <p class="cz-text-sm cz-mb-sm" [innerHTML]="t().checkboxDesc"></p>
                        <cz-tree [value]="fileNodes" selectionMode="checkbox" [selection]="checkboxSelection()"
                            (onSelectionChange)="checkboxSelection.set($event)" />
                        <span class="cz-text-sm">{{ t().selectedCount }}: {{ checkboxSelection().length }}</span>
                    </div>
                </div>
                <app-code [code]="selectionCode" />
            </section>

            <!-- ── EXPANSION / CONTROLLED ── -->
            <section>
                <h2 id="expansion">{{ t().expansion }}</h2>
                <p [innerHTML]="t().expansionDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-button [label]="t().expandAll" size="sm" (onClick)="expandAll()" />
                    <cz-button [label]="t().collapseAll" size="sm" variant="outlined" (onClick)="collapseAll()" />
                    <span class="cz-text-sm">{{ t().lastEvent }}: {{ lastNodeEvent() || '-' }}</span>
                </div>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="fileNodes" dataKey="label" [expandedKeys]="expandedKeys()"
                        (expandedKeysChange)="expandedKeys.set($event)"
                        (onNodeExpand)="lastNodeEvent.set('expand: ' + $event.label)"
                        (onNodeCollapse)="lastNodeEvent.set('collapse: ' + $event.label)" />
                </div>
                <app-code [code]="expansionCode" />
            </section>

            <!-- ── EVENTS ── -->
            <section>
                <h2 id="events">{{ t().events }}</h2>
                <p [innerHTML]="t().eventsDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="fileNodes" selectionMode="single" (onNodeSelect)="logEvent('select', $event)"
                        (onNodeUnselect)="logEvent('unselect', $event)"
                        (onNodeExpand)="logEvent('expand', $event)"
                        (onNodeCollapse)="logEvent('collapse', $event)"
                        (onNodeDoubleClick)="logEvent('dblclick', $event)" />
                    <ul class="cz-text-sm cz-mt-sm" style="font-family: var(--cz-font-code);">
                        @for (entry of eventsLog(); track entry) {
                            <li>{{ entry }}</li>
                        }
                    </ul>
                </div>
                <app-code [code]="eventsCode" />
            </section>

            <!-- ── FILTER ── -->
            <section>
                <h2 id="filtering">{{ t().filtering }}</h2>
                <p [innerHTML]="t().filteringDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="fileNodes" [filter]="true" [filterPlaceholder]="t().searchPlaceholder" />
                </div>
                <app-code [code]="filteringCode" />
            </section>

            <!-- ── KEYBOARD ── -->
            <section>
                <h2 id="keyboard">{{ t().keyboard }}</h2>
                <p [innerHTML]="t().keyboardDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <div class="cz-flex cz-items-center cz-justify-between cz-gap-sm cz-p-sm cz-mb-sm cz-rounded-md"
                        style="background: var(--cz-theme-surface-hover);">
                        <span class="cz-text-sm">
                            <kbd class="cz-p-xs cz-rounded-sm" style="background: var(--cz-theme-surface);">↑</kbd>
                            <kbd class="cz-p-xs cz-rounded-sm" style="background: var(--cz-theme-surface);">↓</kbd>
                            <kbd class="cz-p-xs cz-rounded-sm" style="background: var(--cz-theme-surface);">→</kbd>
                            <kbd class="cz-p-xs cz-rounded-sm" style="background: var(--cz-theme-surface);">←</kbd>
                            <kbd class="cz-p-xs cz-rounded-sm" style="background: var(--cz-theme-surface);">Space</kbd>
                        </span>
                        <span class="cz-text-sm">{{ t().selectedCount }}: {{ keyboardSelection().length }}</span>
                    </div>
                    <cz-tree [value]="fileNodes" selectionMode="multiple" [metaKeySelection]="false"
                        [selection]="keyboardSelection()" (onSelectionChange)="keyboardSelection.set($event)" />
                </div>
                <app-code [code]="keyboardCode" />
            </section>

            <!-- ── SELECT ALL ── -->
            <section>
                <h2 id="select-all">{{ t().selectAll }}</h2>
                <p [innerHTML]="t().selectAllDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="fileNodes" selectionMode="checkbox" [selection]="selectAllSelection()"
                        (onSelectionChange)="selectAllSelection.set($event)" [headerTemplate]="selectAllHeaderTpl() ?? null" />
                </div>
                <app-code [code]="selectAllCode" />

                <ng-template #selectAllHeader>
                    <div class="cz-flex cz-items-center cz-gap-sm">
                        <cz-checkbox [binary]="true" [ngModel]="isAllSelected()" [indeterminate]="isSomeSelected()"
                            (ngModelChange)="toggleAllNodes($event)" [ariaLabel]="t().selectAllLabel" />
                        <span class="cz-font-medium">{{ t().selectAllLabel }}</span>
                    </div>
                </ng-template>
            </section>

            <!-- ── TOGGLE INDICATOR ── -->
            <section>
                <h2 id="toggle-indicator">{{ t().toggleIndicator }}</h2>
                <p [innerHTML]="t().toggleIndicatorDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="fileNodes" [togglerIconTemplate]="toggleIndicatorTpl() ?? null" />
                </div>
                <app-code [code]="toggleIndicatorCode" />

                <ng-template #toggleIndicator let-expanded let-loading="loading">
                    @if (expanded) {
                        <cz-icon [icon]="MinusCircleIcon" [size]="14" />
                    } @else {
                        <cz-icon [icon]="PlusCircleIcon" [size]="14" />
                    }
                </ng-template>
            </section>

            <!-- ── LAZY ── -->
            <section>
                <h2 id="lazy">{{ t().lazy }}</h2>
                <p [innerHTML]="t().lazyDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="lazyNodes()" loadingMode="icon" [togglerIconTemplate]="lazyTogglerTpl() ?? null"
                        (onNodeExpand)="handleLazyExpand($event)" />
                </div>
                <app-code [code]="lazyCode" />

                <ng-template #lazyToggler let-expanded let-loading="loading">
                    @if (loading) {
                        <cz-progress-spinner [size]="14" [strokeWidth]="2" ariaLabel="Loading" />
                    } @else if (expanded) {
                        <cz-icon [icon]="MinusCircleIcon" [size]="14" />
                    } @else {
                        <cz-icon [icon]="PlusCircleIcon" [size]="14" />
                    }
                </ng-template>
            </section>

            <!-- ── LOADING ── -->
            <section>
                <h2 id="loading">{{ t().loading }}</h2>
                <p [innerHTML]="t().loadingDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md" style="max-width: 24rem;">
                    <div>
                        <cz-button [label]="t().refresh" size="sm" [icon]="RefreshIcon" [loading]="loadingData()"
                            (onClick)="refresh()" />
                        <cz-tree class="cz-mt-sm" [value]="fileNodes" [loading]="loadingData()"
                            [loadingIconTemplate]="loadingIconTpl() ?? null" />
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().loadingSkeleton }}</strong>
                        <cz-tree class="cz-mt-sm" [value]="loadingData() ? skeletonNodes : fileNodes"
                            [nodeTemplate]="skeletonTpl() ?? null" />
                    </div>
                </div>
                <app-code [code]="loadingCode" />

                <ng-template #loadingIcon>
                    <cz-progress-spinner [size]="32" [strokeWidth]="3" ariaLabel="Loading" />
                </ng-template>

                <ng-template #skeletonNode let-node let-depth="depth">
                    @if (loadingData()) {
                        <span class="cz-flex cz-items-center cz-gap-sm">
                            <cz-skeleton shape="circle" width="1rem" height="1rem" />
                            <cz-skeleton width="10rem" borderRadius="4px" />
                        </span>
                    } @else {
                        @if (node.children?.length) {
                            <cz-icon [icon]="FolderIcon" [size]="14" class="cz-tree-icon" />
                        } @else {
                            <cz-icon [icon]="FileIcon" [size]="14" class="cz-tree-icon" />
                        }
                        <span class="cz-tree-label">{{ node.label }}</span>
                    }
                </ng-template>
            </section>

            <!-- ── VIRTUAL SCROLL ── -->
            <section>
                <h2 id="virtual-scroll">{{ t().virtualScroll }}</h2>
                <p [innerHTML]="t().virtualScrollDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="virtualNodes" scrollHeight="250px" [virtualScroll]="true"
                        [virtualScrollItemSize]="35" />
                </div>
                <app-code [code]="virtualScrollCode" />
            </section>

            <!-- ── NODE TEMPLATE ── -->
            <section>
                <h2 id="node-template">{{ t().nodeTemplate }}</h2>
                <p [innerHTML]="t().nodeTemplateDesc"></p>
                <div class="cz-mb-md" style="max-width: 28rem;">
                    <cz-tree [value]="productNodes" [nodeTemplate]="productTpl() ?? null" />

                    <ng-template #productNode let-node let-depth="depth">
                        <span class="cz-flex cz-items-center cz-gap-sm cz-w-full">
                            @if (node.value?.image) {
                                <cz-avatar [image]="node.value.image" shape="circle" size="sm" [ariaLabel]="node.label" />
                            } @else {
                                <cz-avatar [label]="node.label.charAt(0)" shape="circle" size="sm" />
                            }
                            <span class="cz-flex-1" [class.cz-font-semibold]="depth === 0">{{ node.label }}</span>
                            @if (node.value?.price) {
                                <span class="cz-text-sm cz-font-semibold">\${{ node.value.price }}</span>
                            }
                            @if (node.value?.status) {
                                <cz-tag [value]="statusLabel(node.value.status)" [severity]="statusSeverity(node.value.status)"
                                    size="sm" />
                            }
                        </span>
                    </ng-template>
                </div>

                <div class="cz-mb-md" style="max-width: 28rem;">
                    <cz-tree [value]="linkNodes" [nodeTemplate]="linkTpl() ?? null" />

                    <ng-template #linkNode let-node>
                        @if (node.value?.startsWith?.('http')) {
                            <a [href]="node.value" target="_blank" rel="noopener noreferrer"
                                style="color: var(--cz-color-primary);">{{ node.label }}</a>
                        } @else {
                            <strong>{{ node.label }}</strong>
                        }
                    </ng-template>
                </div>
                <app-code [code]="nodeTemplateCode" />
            </section>

            <!-- ── CONTEXT MENU ── -->
            <section>
                <h2 id="context-menu">{{ t().contextMenu }}</h2>
                <p [innerHTML]="t().contextMenuDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="fileNodes" [contextMenuItems]="contextItems"
                        (onContextMenuSelect)="notify($event.item.label || '', $event.node.label)" />
                    <span class="cz-text-sm">{{ t().lastAction }}: {{ lastAction() || '-' }}</span>
                </div>
                <app-code [code]="contextMenuCode" />
            </section>

            <!-- ── EMPTY ── -->
            <section>
                <h2 id="empty">{{ t().empty }}</h2>
                <p [innerHTML]="t().emptyDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-tree [value]="[]" [emptyTemplate]="emptyTpl() ?? null" />

                    <ng-template #emptyState>
                        <div class="cz-flex cz-flex-col cz-items-center cz-gap-sm cz-py-lg">
                            <cz-icon [icon]="StarIcon" [size]="28" />
                            <strong>{{ t().emptyTitle }}</strong>
                            <span class="cz-text-sm">{{ t().emptyHint }}</span>
                        </div>
                    </ng-template>
                </div>
                <app-code [code]="emptyCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
                    <li [innerHTML]="t().a11yList2"></li>
                    <li [innerHTML]="t().a11yKeyboard"></li>
                </ul>
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>value</code></td><td><code>CzTreeNode[]</code></td><td><code>[]</code></td><td>Hierarchical nodes (<code>label</code>, <code>value</code>, <code>icon</code>, <code>children</code>, <code>key</code>, <code>expanded</code>, <code>selectable</code>, <code>leaf</code>, <code>loading</code>).</td></tr>
                            <tr><td><code>options</code></td><td><code>CzTreeNode[]</code></td><td><code>[]</code></td><td>Legacy alias of <code>value</code>.</td></tr>
                            <tr><td><code>selectionMode</code></td><td><code>'none' | 'single' | 'multiple' | 'checkbox'</code></td><td><code>'single'</code></td><td>Selection mode.</td></tr>
                            <tr><td><code>selection</code></td><td><code>CzTreeNode[] (model)</code></td><td><code>[]</code></td><td>Selected nodes in multiple / checkbox mode (two-way).</td></tr>
                            <tr><td><code>metaKeySelection</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Requires metaKey/ctrl to toggle in multiple mode; set <code>false</code> so each click toggles.</td></tr>
                            <tr><td><code>highlightOnSelect</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Highlights the node on select.</td></tr>
                            <tr><td><code>dataKey</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Node property that identifies a node for expansion &amp; selection.</td></tr>
                            <tr><td><code>expandedKeys</code></td><td><code>Record&lt;string, boolean&gt; (model)</code></td><td><code>&#123;&#125;</code></td><td>Expanded state by key (two-way). Nodes with <code>expanded: true</code> start open.</td></tr>
                            <tr><td><code>propagateSelectionDown</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Checks/unchecks descendants when toggling a checkbox node.</td></tr>
                            <tr><td><code>propagateSelectionUp</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Checks/unchecks ancestors when toggling a checkbox node.</td></tr>
                            <tr><td><code>filter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays a built-in filter input.</td></tr>
                            <tr><td><code>filterPlaceholder</code></td><td><code>string</code></td><td><code>''</code></td><td>Filter input placeholder.</td></tr>
                            <tr><td><code>filterBy</code></td><td><code>string</code></td><td><code>'label'</code></td><td>Fields searched by the built-in filter (comma separated).</td></tr>
                            <tr><td><code>filterMode</code></td><td><code>'lenient' | 'strict'</code></td><td><code>'lenient'</code></td><td><code>lenient</code> matches contains, <code>strict</code> matches starts with.</td></tr>
                            <tr><td><code>globalFilter</code></td><td><code>string</code></td><td><code>''</code></td><td>Programmatic filter; ancestors of matches are kept and auto-expanded.</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays a loading overlay.</td></tr>
                            <tr><td><code>loadingMode</code></td><td><code>'mask' | 'icon'</code></td><td><code>'mask'</code></td><td>Loading display mode.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Height of the scrollable viewport.</td></tr>
                            <tr><td><code>virtualScroll</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders only the visible window of rows for large data sets.</td></tr>
                            <tr><td><code>virtualScrollItemSize</code></td><td><code>number</code></td><td><code>0</code></td><td>Height of a row in pixels for virtual scrolling.</td></tr>
                            <tr><td><code>indentation</code></td><td><code>number</code></td><td><code>1.25</code></td><td>Indentation factor (rem) for nested levels.</td></tr>
                            <tr><td><code>ariaLabel / ariaLabelledBy</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Labels the tree for accessibility.</td></tr>
                            <tr><td><code>togglerAriaLabel</code></td><td><code>string</code></td><td><code>'Toggle node'</code></td><td>Label for the toggler icons.</td></tr>
                            <tr><td><code>nodeTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Node content template (<code>$implicit</code> node, <code>depth</code>, <code>expanded</code>).</td></tr>
                            <tr><td><code>togglerIconTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Toggler icon template (<code>$implicit</code> expanded, <code>loading</code>).</td></tr>
                            <tr><td><code>headerTemplate / footerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Content above / below the tree (e.g. select all).</td></tr>
                            <tr><td><code>loadingIconTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom loading icon.</td></tr>
                            <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td><code>'No records found'</code></td><td>Fallback empty message.</td></tr>
                            <tr><td><code>emptyTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom empty state.</td></tr>
                            <tr><td><code>contextMenuItems</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Built-in node context menu (right click).</td></tr>
                            <tr><td><code>onNodeSelect</code></td><td><code>output&lt;CzTreeNode&gt;</code></td><td><code>—</code></td><td>Emitted when a node is selected.</td></tr>
                            <tr><td><code>onNodeUnselect</code></td><td><code>output&lt;CzTreeNode&gt;</code></td><td><code>—</code></td><td>Emitted when a node is unselected.</td></tr>
                            <tr><td><code>onNodeExpand / onNodeCollapse</code></td><td><code>output&lt;CzTreeNode&gt;</code></td><td><code>—</code></td><td>Emitted when a node expands / collapses.</td></tr>
                            <tr><td><code>onNodeDoubleClick</code></td><td><code>output&lt;CzTreeNode&gt;</code></td><td><code>—</code></td><td>Emitted when a node is double clicked.</td></tr>
                            <tr><td><code>onFilter</code></td><td><code>output&lt;&#123; filter &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when the built-in filter changes.</td></tr>
                            <tr><td><code>onScroll / onScrollIndexChange</code></td><td><code>output</code></td><td><code>—</code></td><td>Virtual scroll events.</td></tr>
                            <tr><td><code>onNodeContextMenu / onContextMenuSelect</code></td><td><code>output</code></td><td><code>—</code></td><td>Right click and context menu item activation.</td></tr>
                            <tr><td><code>resetFilter()</code></td><td><code>method</code></td><td><code>—</code></td><td>Resets the built-in filter.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TreeDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => TREE_DOC_I18N[this.lang.currentLang()] || TREE_DOC_I18N.es);

    readonly StarIcon = LucideStar;
    readonly RefreshIcon = LucideRefreshCw;
    readonly PlusCircleIcon = LucidePlusCircle;
    readonly MinusCircleIcon = LucideMinusCircle;
    readonly FolderIcon = LucideFolder;
    readonly FileIcon = LucideFile;

    readonly lastSelected = signal('');
    readonly lastAction = signal('');
    readonly lastNodeEvent = signal('');
    readonly metaKey = signal(false);
    readonly expandedKeys = signal<Record<string, boolean>>({ Documents: true });
    readonly multiSelection = signal<CzTreeNode[]>([]);
    readonly checkboxSelection = signal<CzTreeNode[]>([]);
    readonly keyboardSelection = signal<CzTreeNode[]>([]);
    readonly selectAllSelection = signal<CzTreeNode[]>([]);
    readonly eventsLog = signal<string[]>([]);
    readonly loadingData = signal(false);
    readonly lazyNodes = signal<CzTreeNode[]>([
        { key: '0', label: 'Node 0', leaf: false, loading: true },
        { key: '1', label: 'Node 1', leaf: false, loading: true },
        { key: '2', label: 'Node 2', leaf: false, loading: true },
    ]);

    readonly fileNodes: CzTreeNode[] = [
        {
            label: 'Documents',
            value: '75kb',
            icon: LucideFolder,
            children: [
                {
                    label: 'Work',
                    value: '55kb',
                    icon: LucideFolder,
                    children: [{ label: 'Expenses.doc', value: '30kb', icon: LucideFile }],
                },
                { label: 'Home', value: '20kb', icon: LucideFolder },
            ],
        },
        {
            label: 'Photos',
            value: '150kb',
            icon: LucideFolder,
            children: [{ label: 'Mountain.jpg', value: '90kb', icon: LucideFile }],
        },
    ];

    readonly productNodes: CzTreeNode[] = [
        {
            label: 'Audio',
            value: { quantity: 75 },
            children: [
                { label: 'Echo Headphones', value: { image: '/images/dataview/product-4.svg', price: 249, status: 'OUTOFSTOCK' } },
                { label: 'Echo Buds', value: { image: '/images/dataview/product-4.svg', price: 99, status: 'INSTOCK' } },
                { label: 'BoomBox Mini', value: { image: '/images/dataview/product-6.svg', price: 129, status: 'INSTOCK' } },
            ],
        },
        {
            label: 'Laptops',
            value: { quantity: 21 },
            children: [
                { label: 'UltraBook Pro', value: { image: '/images/dataview/product-1.svg', price: 1499, status: 'INSTOCK' } },
                { label: 'UltraBook Air', value: { image: '/images/dataview/product-1.svg', price: 1199, status: 'INSTOCK' } },
            ],
        },
    ];

    readonly linkNodes: CzTreeNode[] = [
        {
            key: '0',
            label: 'Introduction',
            children: [
                { key: '0-0', label: 'What is Angular', value: 'https://angular.io' },
                { key: '0-1', label: 'Getting Started', value: 'https://angular.io/guide/setup-local' },
                { key: '0-2', label: 'Learn and Explore', value: 'https://angular.io/guide/architecture' },
            ],
        },
        {
            key: '1',
            label: 'Components In-Depth',
            children: [
                { key: '1-0', label: 'Component Registration', value: 'https://angular.io/guide/component-interaction' },
                { key: '1-1', label: 'Lifecycle Hooks', value: 'https://angular.io/guide/lifecycle-hooks' },
            ],
        },
    ];

    readonly virtualNodes: CzTreeNode[] = Array.from({ length: 150 }, (_, i) => ({
        key: `v-${i}`,
        label: `Node ${i}`,
        children: i % 5 === 0 ? [{ key: `v-${i}-0`, label: `Child of ${i}` }] : undefined,
    }));

    readonly skeletonNodes: CzTreeNode[] = Array.from({ length: 6 }, (_, i) => ({
        key: `sk-${i}`,
        label: '',
        leaf: true,
    }));

    readonly contextItems: CzMenuItem[] = [
        { label: 'Edit', icon: LucidePencil, command: () => this.toast.info('Edit', 'Context menu') },
        { label: 'Duplicate', icon: LucideCopy, command: () => this.toast.info('Duplicate', 'Context menu') },
        { separator: true },
        { label: 'Delete', icon: LucideTrash, disabled: true },
    ];

    /* Templates (viewChild) */
    readonly selectAllHeaderTpl = viewChild<TemplateRef<unknown>>('selectAllHeader');
    readonly toggleIndicatorTpl = viewChild<TemplateRef<unknown>>('toggleIndicator');
    readonly lazyTogglerTpl = viewChild<TemplateRef<unknown>>('lazyToggler');
    readonly loadingIconTpl = viewChild<TemplateRef<unknown>>('loadingIcon');
    readonly skeletonTpl = viewChild<TemplateRef<unknown>>('skeletonNode');
    readonly productTpl = viewChild<TemplateRef<unknown>>('productNode');
    readonly linkTpl = viewChild<TemplateRef<unknown>>('linkNode');
    readonly emptyTpl = viewChild<TemplateRef<unknown>>('emptyState');

    readonly allNodes = computed(() => this.flatten(this.fileNodes));
    readonly isAllSelected = computed(
        () => this.allNodes().length > 0 && this.selectAllSelection().length === this.allNodes().length,
    );
    readonly isSomeSelected = computed(() => this.selectAllSelection().length > 0 && !this.isAllSelected());

    constructor() {
        setTimeout(() => this.lazyNodes.set(this.lazyNodes().map(node => ({ ...node, loading: false }))), 1500);
    }

    expandAll(): void {
        const keys: Record<string, boolean> = {};
        const walk = (nodes: CzTreeNode[]) => {
            for (const node of nodes) {
                if (node.children?.length) {
                    keys[node.label] = true;
                    walk(node.children);
                }
            }
        };
        walk(this.fileNodes);
        this.expandedKeys.set(keys);
    }

    collapseAll(): void {
        this.expandedKeys.set({});
    }

    logEvent(type: string, node: CzTreeNode): void {
        this.eventsLog.update(log => [`${type}: ${node.label}`, ...log].slice(0, 5));
    }

    toggleAllNodes(checked: boolean): void {
        this.selectAllSelection.set(checked ? this.allNodes() : []);
    }

    handleLazyExpand(node: CzTreeNode): void {
        if (node.children?.length) return;

        this.patchLazyNode(node.key!, { loading: true });

        setTimeout(() => {
            this.patchLazyNode(node.key!, {
                loading: false,
                children: [0, 1, 2].map(i => ({ key: `${node.key}-${i}`, label: `Lazy ${node.label} - ${i}` })),
            });
        }, 1000);
    }

    private patchLazyNode(key: string, patch: Partial<CzTreeNode>): void {
        const walk = (nodes: CzTreeNode[]): CzTreeNode[] =>
            nodes.map(node =>
                node.key === key ? { ...node, ...patch } : node.children ? { ...node, children: walk(node.children) } : node,
            );
        this.lazyNodes.set(walk(this.lazyNodes()));
    }

    refresh(): void {
        this.loadingData.set(true);
        setTimeout(() => this.loadingData.set(false), 2000);
    }

    private flatten(list: CzTreeNode[]): CzTreeNode[] {
        return list.reduce<CzTreeNode[]>((acc, node) => {
            acc.push(node);
            if (node.children) acc.push(...this.flatten(node.children));
            return acc;
        }, []);
    }

    statusLabel(status: string): string {
        switch (status) {
            case 'INSTOCK': return 'In Stock';
            case 'LOWSTOCK': return 'Low Stock';
            default: return 'Out of Stock';
        }
    }

    statusSeverity(status: string): 'success' | 'warning' | 'danger' {
        switch (status) {
            case 'INSTOCK': return 'success';
            case 'LOWSTOCK': return 'warning';
            default: return 'danger';
        }
    }

    notify(action: string, name: string): void {
        this.lastAction.set(`${action}: ${name}`);
        this.toast.success(`${action}: ${name}`);
    }

    importCode: Code = {
        typescript: `import { CzTreeComponent, CzTreeNode } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-tree [value]="nodes" />`,
        typescript: `nodes: CzTreeNode[] = [
    {
        label: 'Documents',
        value: '75kb',
        icon: LucideFolder,
        children: [
            { label: 'Work', value: '55kb', icon: LucideFolder },
            { label: 'Expenses.doc', value: '30kb', icon: LucideFile },
        ],
    },
];`,
    };

    selectionCode: Code = {
        html: `<!-- Single -->
<cz-tree [value]="nodes" selectionMode="single" (onNodeSelect)="onSelect($event)" />

<!-- Multiple (metaKey/ctrl required by default; disable with metaKeySelection=false) -->
<cz-tree [value]="nodes" selectionMode="multiple" [metaKeySelection]="false" [(selection)]="selected" />

<!-- Checkbox with propagation + indeterminate parents -->
<cz-tree
    [value]="nodes"
    selectionMode="checkbox"
    [(selection)]="selected"
    [propagateSelectionDown]="true"
    [propagateSelectionUp]="true"
/>`,
    };

    expansionCode: Code = {
        html: `<!-- Controlled expansion + expand/collapse all -->
<cz-tree
    [value]="nodes"
    dataKey="label"
    [(expandedKeys)]="expandedKeys"
    (onNodeExpand)="onExpand($event)"
    (onNodeCollapse)="onCollapse($event)"
/>

<!-- Nodes can also start expanded with the expanded flag -->
{ label: 'Documents', expanded: true, children: [...] }`,
        typescript: `expandAll(): void {
    const keys: Record<string, boolean> = {};
    // mark every parent key as expanded
    this.expandedKeys.set(keys);
}`,
    };

    eventsCode: Code = {
        html: `<cz-tree
    [value]="nodes"
    selectionMode="single"
    (onNodeSelect)="log('select', $event)"
    (onNodeUnselect)="log('unselect', $event)"
    (onNodeExpand)="log('expand', $event)"
    (onNodeCollapse)="log('collapse', $event)"
    (onNodeDoubleClick)="log('dblclick', $event)"
/>`,
    };

    filteringCode: Code = {
        html: `<!-- Built-in filter input -->
<cz-tree
    [value]="nodes"
    [filter]="true"
    filterPlaceholder="Search"
    filterBy="label,value"
    filterMode="lenient"
    (onFilter)="onFilter($event)"
/>

<!-- Programmatic filter (ancestors kept and auto-expanded) -->
<cz-tree [value]="nodes" [globalFilter]="query()" />`,
        typescript: `// resetFilter() clears the built-in filter programmatically`,
    };

    keyboardCode: Code = {
        html: `<!-- Arrow keys navigate, right/left expand/collapse, Space selects -->
<cz-tree [value]="nodes" selectionMode="multiple" [metaKeySelection]="false" [(selection)]="selected" />`,
        typescript: `// Up / Down: move focus
// Right: expand (or focus first child)
// Left: collapse (or focus parent)
// Enter / Space: select the focused node`,
    };

    selectAllCode: Code = {
        html: `<cz-tree [value]="nodes" selectionMode="checkbox" [(selection)]="selection" [headerTemplate]="header" />

<ng-template #header>
    <cz-checkbox
        [binary]="true"
        [ngModel]="isAllSelected"
        [indeterminate]="isSomeSelected"
        (ngModelChange)="toggleAll($event)"
    />
    Select All
</ng-template>`,
    };

    toggleIndicatorCode: Code = {
        html: `<cz-tree [value]="nodes" [togglerIconTemplate]="toggler" />

<ng-template #toggler let-expanded let-loading="loading">
    @if (loading) {
        <cz-progress-spinner [size]="14" />
    } @else if (expanded) {
        <cz-icon [icon]="MinusCircle" [size]="14" />
    } @else {
        <cz-icon [icon]="PlusCircle" [size]="14" />
    }
</ng-template>`,
    };

    lazyCode: Code = {
        html: `<cz-tree
    [value]="nodes"
    loadingMode="icon"
    [togglerIconTemplate]="toggler"
    (onNodeExpand)="onNodeExpand($event)"
/>

<!-- Nodes start as leaf:false + loading:true -->
{ key: '0', label: 'Node 0', leaf: false, loading: true }`,
        typescript: `onNodeExpand(event: CzTreeNode): void {
    if (event.children?.length) return;

    // mark as loading, fetch children, then patch the node
    this.loadChildren(event).then(children => this.patch(event.key, { loading: false, children }));
}`,
    };

    loadingCode: Code = {
        html: `<!-- Loading overlay with custom icon -->
<cz-tree [value]="nodes" [loading]="loading()" [loadingIconTemplate]="icon" />

<ng-template #icon>
    <cz-progress-spinner [size]="32" />
</ng-template>

<!-- Skeleton rows: swap the value for placeholder nodes -->
<cz-tree [value]="loading() ? placeholders : nodes" [nodeTemplate]="skeleton" />

<ng-template #skeleton let-node>
    @if (loading()) {
        <cz-skeleton shape="circle" width="1rem" height="1rem" />
        <cz-skeleton width="10rem" borderRadius="4px" />
    } @else {
        {{ node.label }}
    }
</ng-template>`,
    };

    virtualScrollCode: Code = {
        html: `<cz-tree
    [value]="nodes"
    scrollHeight="250px"
    [virtualScroll]="true"
    [virtualScrollItemSize]="35"
    [indentation]="1.25"
    (onScrollIndexChange)="onRangeChange($event)"
/>`,
    };

    nodeTemplateCode: Code = {
        html: `<cz-tree [value]="nodes" [nodeTemplate]="node" />

<ng-template #node let-node let-depth="depth" let-expanded="expanded">
    @if (node.value?.image) {
        <cz-avatar [image]="node.value.image" shape="circle" size="sm" />
    } @else {
        <cz-avatar [label]="node.label.charAt(0)" shape="circle" size="sm" />
    }
    <span [class.font-semibold]="depth === 0">{{ node.label }}</span>
    @if (node.value?.status) {
        <cz-tag [value]="node.value.status" size="sm" />
    }
</ng-template>

<!-- Links -->
<ng-template #link let-node>
    @if (node.value?.startsWith?.('http')) {
        <a [href]="node.value" target="_blank">{{ node.label }}</a>
    } @else {
        <strong>{{ node.label }}</strong>
    }
</ng-template>`,
    };

    contextMenuCode: Code = {
        html: `<cz-tree [value]="nodes" [contextMenuItems]="items" (onContextMenuSelect)="onAction($event)" />

items = [
    { label: 'Edit', icon: LucidePencil, command: () => this.edit() },
    { label: 'Duplicate', icon: LucideCopy, command: () => this.duplicate() },
    { separator: true },
    { label: 'Delete', icon: LucideTrash, disabled: true },
];`,
    };

    emptyCode: Code = {
        html: `<cz-tree [value]="[]" [emptyMessage]="'No records'" />

<cz-tree [value]="[]" [emptyTemplate]="emptyTpl" />

<ng-template #emptyTpl>
    <strong>No records</strong>
    <span>Add new data to get started.</span>
</ng-template>`,
    };
}
