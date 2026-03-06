import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../../core/services/language.service';
import { INTRO_I18N } from './introduction.i18n';

@Component({
    selector: 'cz-introduction-page',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">

            <!-- ── HERO ── -->
            <div class="doc-hero">
                <div class="doc-hero__badge">{{ t().hero.badge }}</div>
                <h1 id="introduction">{{ t().hero.title }} <span class="doc-hero__accent">{{ t().hero.accent }}</span></h1>
                <p class="doc-lead" [innerHTML]="t().hero.lead"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-sm">
                    <a routerLink="/docs/installation" class="doc-cta doc-cta--primary">
                        {{ t().hero.btnStarted }}
                    </a>
                    <a href="https://github.com/codezium/codezium-framework"
                        target="_blank" rel="noopener noreferrer" class="doc-cta doc-cta--ghost">
                        {{ t().hero.btnGithub }}
                    </a>
                </div>
            </div>

            <!-- ── WHAT IS ── -->
            <section>
                <h2 id="what-is">{{ t().whatIs.title }}</h2>
                <p [innerHTML]="t().whatIs.p1"></p>
                <p [innerHTML]="t().whatIs.p2"></p>
            </section>

            <!-- ── FEATURE CARDS ── -->
            <section>
                <h2 id="features">{{ t().features.title }}</h2>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-gap-md doc-cards">
                    @for (card of t().features.cards; track card.title) {
                    <div class="doc-card">
                        <div class="doc-card__icon">{{ card.icon }}</div>
                        <h3>{{ card.title }}</h3>
                        <p [innerHTML]="card.desc"></p>
                    </div>
                    }
                </div>
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().themes.title }}</h2>
                <p>{{ t().themes.desc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-sm doc-theme-list">
                    @for (theme of t().themes.items; track theme.id) {
                    <div class="doc-theme-item">
                        <span class="doc-theme-dot" [class]="'doc-theme-dot--' + theme.id"></span>
                        <div>
                            <strong>{{ theme.name }}</strong> <span [innerHTML]="theme.desc"></span>
                        </div>
                    </div>
                    }
                </div>
            </section>

            <!-- ── NEXT STEPS ── -->
            <section>
                <h2 id="next-steps">{{ t().nextSteps.title }}</h2>
                <p>{{ t().nextSteps.desc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-sm">
                    <a routerLink="/docs/installation" class="doc-cta doc-cta--primary">
                        {{ t().nextSteps.btnInstall }}
                    </a>
                    <a routerLink="/docs/theming" class="doc-cta doc-cta--ghost">
                        {{ t().nextSteps.btnTheming }}
                    </a>
                    <a routerLink="/docs/components/input-text" class="doc-cta doc-cta--ghost">
                        {{ t().nextSteps.btnComponents }}
                    </a>
                </div>
            </section>

        </div>
    `,
    styles: [`
        section {
            margin-top: 48px;
        }

        /* ── Hero ── */
        .doc-hero {
            padding-bottom: 8px;
        }

        .doc-hero__badge {
            display: inline-flex;
            align-items: center;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            padding: 3px 10px;
            border-radius: 99px;
            background: var(--cz-color-primary-50, #eef2ff);
            color: var(--cz-color-primary, #6366f1);
            border: 1px solid var(--cz-color-primary-200, #c7d2fe);
            margin-bottom: 20px;
        }

        .doc-hero__accent {
            color: var(--cz-color-primary, #6366f1);
        }

        /* ── CTAs ── */
        .doc-cta {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 22px;
            border-radius: 8px;
            font-size: 0.9375rem;
            font-weight: 600;
            text-decoration: none;
            transition: opacity 0.15s ease, background 0.15s ease;

            &--primary {
                background: var(--cz-color-primary, #6366f1);
                color: #fff;

                &:hover { opacity: 0.88; }
            }

            &--ghost {
                background: var(--cz-theme-surface-hover, rgba(0 0 0 / 0.06));
                color: var(--cz-theme-text-primary, #111827);
                border: 1px solid var(--cz-theme-border-color, #e5e7eb);

                &:hover { background: var(--cz-theme-border-color, #e5e7eb); }
            }
        }

        /* ── Feature cards ── */
        .doc-cards {
            margin-top: 8px;
        }

        .doc-card {
            padding: 20px 22px;
            border: 1px solid var(--cz-theme-border-color, #e5e7eb);
            border-radius: 12px;
            background: var(--cz-theme-surface, #fff);
            transition: box-shadow 0.18s ease, border-color 0.18s ease;

            &:hover {
                border-color: var(--cz-color-primary-200, #c7d2fe);
                box-shadow: 0 4px 16px rgba(99 102 241 / 0.08);
            }
        }

        .doc-card__icon {
            font-size: 1.5rem;
            margin-bottom: 10px;
        }

        .doc-card p {
            font-size: 0.875rem;
            margin: 0;
        }

        /* ── Theme list ── */
        .doc-theme-item {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 16px 18px;
            border: 1px solid var(--cz-theme-border-color, #e5e7eb);
            border-radius: 10px;
            background: var(--cz-theme-surface, #fff);
            font-size: 0.9rem;
            line-height: 1.6;
            color: var(--cz-theme-text-secondary, #4b5563);
        }

        .doc-theme-dot {
            display: block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-top: 4px;
            flex-shrink: 0;

            &--base { background: #6b7280; }
            &--glass {
                background: linear-gradient(135deg, #a5b4fc, #818cf8);
                box-shadow: 0 0 0 2px rgba(99 102 241 / 0.25);
            }
            &--neo { background: #e2e8f0; box-shadow: 3px 3px 6px #b0b9c5, -2px -2px 5px #fff; }
        }
    `],
})
export class IntroductionPage {
    private readonly lang = inject(LanguageService);

    // Reactive dictionary: updates automatically when currentLang changes
    readonly t = computed(() => INTRO_I18N[this.lang.currentLang() as keyof typeof INTRO_I18N]);
}
