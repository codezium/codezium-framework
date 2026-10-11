import {
    ChangeDetectionStrategy,
    Component,
    effect,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CzTerminalLine {
    type: 'welcome' | 'command' | 'response';
    text: string;
}

@Component({
    selector: 'cz-terminal',
    imports: [CommonModule, FormsModule],
    templateUrl: './terminal.component.html',
    styleUrl: './terminal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-terminal',
    },
})
export class CzTerminalComponent {
    /** Welcome message shown on start */
    welcomeMessage = input<string>('Welcome to Codezium terminal');

    /** Prompt prefix */
    prompt = input<string>('$');

    /** Command handler: return a response string or null */
    command = input<((command: string) => string | null) | null>(null);

    /** Accessible label */
    ariaLabel = input<string>('Terminal');

    /** Output lines */
    lines = signal<CzTerminalLine[]>([]);

    /** Current input text */
    inputValue = signal<string>('');

    private initialized = false;

    constructor() {
        effect(() => {
            const welcome = this.welcomeMessage();
            if (!this.initialized) {
                this.initialized = true;
                this.lines.set([{ type: 'welcome', text: welcome }]);
            }
        });
    }

    run(): void {
        const raw = this.inputValue().trim();
        if (!raw) return;

        this.lines.update((lines) => [...lines, { type: 'command', text: raw }]);

        const response = this.command()?.(raw);
        if (typeof response === 'string') {
            this.lines.update((lines) => [...lines, { type: 'response', text: response }]);
        }

        this.inputValue.set('');
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.run();
        }
    }

    clear(): void {
        this.lines.set([{ type: 'welcome', text: this.welcomeMessage() }]);
    }
}
