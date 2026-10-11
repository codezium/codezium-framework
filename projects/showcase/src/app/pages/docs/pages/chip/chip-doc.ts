import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzChipComponent } from 'codezium-ui';
import { LucideUser } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CHIP_DOC_I18N } from './chip-doc.i18n';

@Component({
    selector: 'cz-chip-doc-page',
    imports: [CzChipComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="chip">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-chip label="Angular" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="icons">{{ t().icons }}</h2>
                <p [innerHTML]="t().iconsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-chip label="User" [icon]="UserIcon" />
                    <cz-chip label="With image" image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" />
                </div>
                <app-code [code]="iconsCode" />
            </section>

            <section>
                <h2 id="removable">{{ t().removable }}</h2>
                <p [innerHTML]="t().removableDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    @for (tag of tags(); track tag) {
                        <cz-chip [label]="tag" [removable]="true" (onRemove)="removeTag(tag)" />
                    }
                </div>
                <app-code [code]="removableCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Text of the chip.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Optional Lucide icon.</td></tr>
                            <tr><td><code>image</code></td><td><code>string</code></td><td><code>''</code></td><td>Optional image url (overrides icon).</td></tr>
                            <tr><td><code>removable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the remove button.</td></tr>
                            <tr><td><code>onRemove</code></td><td><code>output&lt;MouseEvent&gt;</code></td><td>-</td><td>Emitted when removed.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ChipDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => CHIP_DOC_I18N[this.lang.currentLang()] || CHIP_DOC_I18N.es);

    readonly UserIcon = LucideUser;
    readonly tags = signal(['Angular', 'TypeScript', 'Signals']);

    removeTag(tag: string): void {
        this.tags.update((tags) => tags.filter((t) => t !== tag));
    }

    importCode: Code = {
        typescript: `import { CzChipComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-chip label="Angular" />`,
    };

    iconsCode: Code = {
        html: `<cz-chip label="User" [icon]="UserIcon" />
<cz-chip label="With image" image="avatar.png" />`,
        typescript: `import { LucideUser } from '@lucide/angular';

export class MyComponent {
    UserIcon = LucideUser;
}`,
    };

    removableCode: Code = {
        html: `@for (tag of tags; track tag) {
    <cz-chip [label]="tag" [removable]="true" (onRemove)="removeTag(tag)" />
}`,
        typescript: `tags = signal(['Angular', 'TypeScript', 'Signals']);

removeTag(tag: string) {
    this.tags.update(tags => tags.filter(t => t !== tag));
}`,
    };
}
