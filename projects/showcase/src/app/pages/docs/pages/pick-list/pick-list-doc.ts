import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzPickListComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { PICK_LIST_DOC_I18N } from './pick-list-doc.i18n';

@Component({
    selector: 'cz-pick-list-doc-page',
    imports: [CzPickListComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="pick-list">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-pick-list
                        [source]="available"
                        optionLabel="name"
                        [ngModel]="target()"
                        (ngModelChange)="target.set($event)"
                    />
                    <span class="cz-text-sm">Target: {{ targetNames() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-pick-list
                        [source]="available"
                        optionLabel="name"
                        [ngModel]="target()"
                        (ngModelChange)="target.set($event)"
                        (onMoveToTarget)="moves.set(moves() + 1)"
                    />
                    <span class="cz-text-sm">Transfers: {{ moves() }}</span>
                    <cz-pick-list [source]="available" optionLabel="name" [ngModel]="target()" [disabled]="true" />
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>source</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>Available items.</td></tr>
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used to display items.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>onMoveToTarget</code></td><td><code>output&lt;any[]&gt;</code></td><td>-</td><td>Emitted with the moved items.</td></tr>
                            <tr><td><code>onMoveToSource</code></td><td><code>output&lt;any[]&gt;</code></td><td>-</td><td>Emitted with the returned items.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class PickListDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => PICK_LIST_DOC_I18N[this.lang.currentLang()] || PICK_LIST_DOC_I18N.es);

    readonly available = [
        { name: 'Angular' },
        { name: 'React' },
        { name: 'Vue' },
        { name: 'Svelte' },
        { name: 'Solid' },
    ];

    readonly target = signal([{ name: 'Angular' }]);
    readonly moves = signal(0);

    readonly targetNames = computed(() => this.target().map((i) => i.name).join(', ') || '-');

    importCode: Code = {
        typescript: `import { CzPickListComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-pick-list [source]="available" optionLabel="name" [ngModel]="target()" (ngModelChange)="target.set($event)" />`,
        typescript: `available = [{ name: 'Angular' }, { name: 'React' }];
target = signal([{ name: 'Angular' }]);`,
    };

    optionsCode: Code = {
        html: `<cz-pick-list [source]="available" optionLabel="name" [ngModel]="target()" (onMoveToTarget)="onMove($event)" />

<cz-pick-list [source]="available" optionLabel="name" [ngModel]="target()" [disabled]="true" />`,
    };
}
