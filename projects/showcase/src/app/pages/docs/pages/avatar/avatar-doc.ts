import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzAvatarComponent } from 'codezium-ui';
import { LucideUser } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { AVATAR_DOC_I18N } from './avatar-doc.i18n';

@Component({
    selector: 'cz-avatar-doc-page',
    imports: [CzAvatarComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="avatar">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-avatar label="MT" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="content">{{ t().content }}</h2>
                <p [innerHTML]="t().contentDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-avatar label="MT" />
                    <cz-avatar [icon]="UserIcon" />
                    <cz-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" />
                </div>
                <app-code [code]="contentCode" />
            </section>

            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-avatar label="SM" size="sm" />
                    <cz-avatar label="MD" size="md" />
                    <cz-avatar label="LG" size="lg" />
                    <cz-avatar label="XL" size="xl" />
                    <cz-avatar label="SQ" size="lg" shape="square" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Text label (initials).</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Optional Lucide icon.</td></tr>
                            <tr><td><code>image</code></td><td><code>string</code></td><td><code>''</code></td><td>Optional image url (overrides icon/label).</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg' | 'xl'</code></td><td><code>'md'</code></td><td>Avatar size.</td></tr>
                            <tr><td><code>shape</code></td><td><code>'circle' | 'square'</code></td><td><code>'circle'</code></td><td>Avatar shape.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class AvatarDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => AVATAR_DOC_I18N[this.lang.currentLang()] || AVATAR_DOC_I18N.es);

    readonly UserIcon = LucideUser;

    importCode: Code = {
        typescript: `import { CzAvatarComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-avatar label="MT" />`,
    };

    contentCode: Code = {
        html: `<cz-avatar label="MT" />
<cz-avatar [icon]="UserIcon" />
<cz-avatar image="avatar.png" />`,
        typescript: `import { LucideUser } from '@lucide/angular';

export class MyComponent {
    UserIcon = LucideUser;
}`,
    };

    sizesCode: Code = {
        html: `<cz-avatar label="SM" size="sm" />
<cz-avatar label="MD" size="md" />
<cz-avatar label="LG" size="lg" />
<cz-avatar label="XL" size="xl" />
<cz-avatar label="SQ" size="lg" shape="square" />`,
    };
}
