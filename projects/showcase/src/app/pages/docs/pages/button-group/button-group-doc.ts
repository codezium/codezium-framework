import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzButtonGroupComponent } from 'codezium-ui';
import {
    LucideCheck,
    LucideChevronLeft,
    LucideChevronRight,
    LucidePencil,
    LucideSave,
    LucideTrash,
    LucideX,
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { BUTTON_GROUP_DOC_I18N } from './button-group-doc.i18n';

@Component({
    selector: 'cz-button-group-doc-page',
    imports: [CzButtonGroupComponent, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="button-group">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-button-group>
                        <cz-button label="Save" [icon]="SaveIcon" />
                        <cz-button label="Edit" [icon]="PencilIcon" severity="secondary" />
                        <cz-button label="Delete" [icon]="TrashIcon" severity="danger" />
                    </cz-button-group>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="variants">{{ t().variants }}</h2>
                <p [innerHTML]="t().variantsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-button-group>
                        <cz-button label="Outlined" variant="outlined" />
                        <cz-button label="Group" variant="outlined" severity="secondary" />
                    </cz-button-group>

                    <cz-button-group>
                        <cz-button label="Text" variant="text" />
                        <cz-button label="Group" variant="text" severity="info" />
                    </cz-button-group>

                    <cz-button-group>
                        <cz-button label="Approve" [icon]="CheckIcon" severity="success" />
                        <cz-button label="Reject" [icon]="XIcon" severity="danger" />
                    </cz-button-group>
                </div>
                <app-code [code]="variantsCode" />
            </section>

            <section>
                <h2 id="icons">{{ t().icons }}</h2>
                <p [innerHTML]="t().iconsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-button-group>
                        <cz-button [icon]="ChevronLeftIcon" ariaLabel="Previous" severity="secondary" />
                        <cz-button label="Today" variant="outlined" />
                        <cz-button [icon]="ChevronRightIcon" ariaLabel="Next" severity="secondary" />
                    </cz-button-group>
                </div>
                <app-code [code]="iconsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>default slot</td><td><code>ng-content</code></td><td>Buttons to group: <code>cz-button</code> or native <code>button</code>/<code>a</code> elements.</td></tr>
                            <tr><td>radius</td><td><code>CSS</code></td><td>Inner radii are collapsed and the buttons overlap by 1px so borders connect.</td></tr>
                            <tr><td>focus / hover</td><td><code>CSS</code></td><td>The interacted button is raised above its neighbours (z-index).</td></tr>
                            <tr><td>themes</td><td><code>CSS</code></td><td>Neo renders the group as a single raised pill with pressed halves; glass keeps each button frosted.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ButtonGroupDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => BUTTON_GROUP_DOC_I18N[this.lang.currentLang()] || BUTTON_GROUP_DOC_I18N.es);

    readonly SaveIcon = LucideSave;
    readonly PencilIcon = LucidePencil;
    readonly TrashIcon = LucideTrash;
    readonly CheckIcon = LucideCheck;
    readonly XIcon = LucideX;
    readonly ChevronLeftIcon = LucideChevronLeft;
    readonly ChevronRightIcon = LucideChevronRight;

    importCode: Code = {
        typescript: `import { CzButtonGroupComponent, CzButtonComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-button-group>
    <cz-button label="Save" [icon]="SaveIcon" />
    <cz-button label="Edit" [icon]="PencilIcon" severity="secondary" />
    <cz-button label="Delete" [icon]="TrashIcon" severity="danger" />
</cz-button-group>`,
    };

    variantsCode: Code = {
        html: `<cz-button-group>
    <cz-button label="Outlined" variant="outlined" />
    <cz-button label="Group" variant="outlined" severity="secondary" />
</cz-button-group>

<cz-button-group>
    <cz-button label="Approve" [icon]="CheckIcon" severity="success" />
    <cz-button label="Reject" [icon]="XIcon" severity="danger" />
</cz-button-group>`,
    };

    iconsCode: Code = {
        html: `<cz-button-group>
    <cz-button [icon]="ChevronLeftIcon" ariaLabel="Previous" severity="secondary" />
    <cz-button label="Today" variant="outlined" />
    <cz-button [icon]="ChevronRightIcon" ariaLabel="Next" severity="secondary" />
</cz-button-group>`,
    };
}
