import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTerminalComponent } from './terminal.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzTerminalComponent', () => {
    let component: CzTerminalComponent;
    let fixture: ComponentFixture<CzTerminalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzTerminalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzTerminalComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('welcomeMessage', 'Hello terminal');
    });

    it('should create and show the welcome message', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-terminal-output').textContent).toContain('Hello terminal');
    });

    it('should run commands and append responses', () => {
        fixture.componentRef.setInput('command', (cmd: string) => `echo: ${cmd}`);
        fixture.detectChanges();

        component.inputValue.set('help');
        component.run();
        fixture.detectChanges();

        const lines = fixture.debugElement.queryAll(By.css('.cz-terminal-line'));
        expect(lines.length).toBe(3);
        expect(lines[1].nativeElement.textContent).toContain('help');
        expect(lines[2].nativeElement.textContent).toContain('echo: help');
        expect(component.inputValue()).toBe('');
    });

    it('should not append responses when the handler returns null', () => {
        fixture.componentRef.setInput('command', () => null);
        fixture.detectChanges();

        component.inputValue.set('silent');
        component.run();
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('.cz-terminal-line')).length).toBe(2);
    });

    it('should ignore empty commands', () => {
        fixture.detectChanges();

        component.inputValue.set('   ');
        component.run();
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('.cz-terminal-line')).length).toBe(1);
    });

    it('should run on Enter key', () => {
        fixture.componentRef.setInput('command', (cmd: string) => `ok:${cmd}`);
        fixture.detectChanges();

        component.inputValue.set('ls');
        component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
        fixture.detectChanges();

        expect(component.lines().length).toBe(3);
    });

    it('should clear back to the welcome message', () => {
        fixture.componentRef.setInput('command', () => 'response');
        fixture.detectChanges();

        component.inputValue.set('cmd');
        component.run();
        component.clear();
        fixture.detectChanges();

        expect(component.lines().length).toBe(1);
        expect(component.lines()[0].text).toBe('Hello terminal');
    });

    it('should expose a log role and the prompt', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[role="log"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-terminal-prompt').textContent).toContain('$');
    });
});
