import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzGalleryComponent, CzGalleryImage } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { GALLERY_DOC_I18N } from './gallery-doc.i18n';

@Component({
    selector: 'cz-gallery-doc-page',
    imports: [CzGalleryComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="gallery">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-gallery [images]="images" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-gallery [images]="images" />
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
                            <tr><td><code>images</code></td><td><code>CzGalleryImage[]</code></td><td><code>[]</code></td><td>Images (src, alt, thumbnail).</td></tr>
                            <tr><td><code>activeIndex</code></td><td><code>number (model)</code></td><td><code>0</code></td><td>Active image index.</td></tr>
                            <tr><td><code>fullscreen</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Preview visibility.</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class GalleryDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => GALLERY_DOC_I18N[this.lang.currentLang()] || GALLERY_DOC_I18N.es);

    readonly images: CzGalleryImage[] = [
        { src: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg', alt: 'Nature' },
        { src: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg', alt: 'Forest' },
        { src: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg', alt: 'Lake' },
        { src: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg', alt: 'City' },
    ];

    importCode: Code = {
        typescript: `import { CzGalleryComponent, CzGalleryImage } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-gallery [images]="images" />`,
        typescript: `images: CzGalleryImage[] = [
    { src: 'photo-1.jpg', alt: 'Nature' },
    { src: 'photo-2.jpg', thumbnail: 'photo-2-thumb.jpg' },
];`,
    };

    optionsCode: Code = {
        html: `<!-- Click a thumbnail to open the fullscreen preview -->
<cz-gallery [images]="images" />`,
    };
}
