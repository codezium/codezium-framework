import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzTerminalComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TERMINAL_DOC_I18N } from './terminal-doc.i18n';

@Component({
    selector: 'cz-terminal-doc-page',
    imports: [CzTerminalComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="terminal">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-terminal [command]="handleCommand" prompt="$" welcomeMessage="Type 'help' to get started" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-terminal [command]="handleCommand" prompt="cz>" welcomeMessage="Codezium shell v1.0" />
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
                            <tr><td><code>welcomeMessage</code></td><td><code>string</code></td><td><code>'Welcome to Codezium terminal'</code></td><td>Initial output line.</td></tr>
                            <tr><td><code>prompt</code></td><td><code>string</code></td><td><code>'$'</code></td><td>Prompt prefix.</td></tr>
                            <tr><td><code>command</code></td><td><code>(cmd) =&gt; string | null</code></td><td><code>null</code></td><td>Command handler.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TerminalDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TERMINAL_DOC_I18N[this.lang.currentLang()] || TERMINAL_DOC_I18N.es);

    readonly handleCommand = (command: string): string | null => {
        switch (command.trim()) {
            case 'help':
                return 'Available commands: help, whoami, date, clear';
            case 'whoami':
                return 'codezium-user';
            case 'date':
                return new Date().toLocaleString();
            default:
                return `Command not found: ${command}`;
        }
    };

    importCode: Code = {
        typescript: `import { CzTerminalComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-terminal [command]="handleCommand" prompt="$" welcomeMessage="Type 'help' to get started" />`,
        typescript: `handleCommand = (command: string): string | null => {
    switch (command.trim()) {
        case 'help':
            return 'Available commands: help, whoami, date';
        case 'whoami':
            return 'codezium-user';
        default:
            return \`Command not found: \${command}\`;
    }
};`,
    };

    optionsCode: Code = {
        html: `<cz-terminal [command]="handleCommand" prompt="cz>" welcomeMessage="Codezium shell v1.0" />`,
    };
}
