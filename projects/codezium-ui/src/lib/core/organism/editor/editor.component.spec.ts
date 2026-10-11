import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CzEditorComponent } from './editor.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzEditorComponent', () => {
    let component: CzEditorComponent;
    let fixture: ComponentFixture<CzEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzEditorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzEditorComponent);
        component = fixture.componentInstance;
    });

    function content(): HTMLElement {
        return fixture.nativeElement.querySelector('.cz-editor-content') as HTMLElement;
    }

    function buttons(): HTMLElement[] {
        return Array.from(fixture.nativeElement.querySelectorAll('.cz-editor-btn')) as HTMLElement[];
    }

    it('should create with the toolbar, content and textbox role', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-editor-toolbar')).toBeTruthy();
        expect(content().getAttribute('contenteditable')).toBe('true');
        expect(content().getAttribute('role')).toBe('textbox');
    });

    it('should expose the placeholder through data-placeholder', () => {
        fixture.componentRef.setInput('placeholder', 'Write something...');
        fixture.detectChanges();

        expect(content().getAttribute('data-placeholder')).toBe('Write something...');
    });

    it('should write and emit HTML values through the CVA', () => {
        component.writeValue('<p>Hello <b>World</b></p>');
        fixture.detectChanges();

        expect(content().innerHTML).toBe('<p>Hello <b>World</b></p>');

        const changeSpy = vi.fn();
        component.registerOnChange(changeSpy);

        content().innerHTML = '<p>Changed</p>';
        content().dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(changeSpy).toHaveBeenCalledWith('<p>Changed</p>');
        expect(component.getText()).toBe('Changed');
    });

    it('should emit onTextChange and onEditorChange while typing', () => {
        fixture.detectChanges();

        const textSpy = vi.fn();
        const changeSpy = vi.fn();
        component.onTextChange.subscribe(textSpy);
        component.onEditorChange.subscribe(changeSpy);

        content().innerHTML = '<p>Typing</p>';
        content().dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(textSpy).toHaveBeenCalledWith(expect.objectContaining({ htmlValue: '<p>Typing</p>', source: 'user' }));
        expect(changeSpy).toHaveBeenCalled();
    });

    it('should apply readonly and disabled states', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        expect(content().getAttribute('contenteditable')).toBe('false');
        expect(fixture.nativeElement.classList.contains('cz-editor--readonly')).toBe(true);

        fixture.componentRef.setInput('readonly', false);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        expect(content().getAttribute('contenteditable')).toBe('false');
        expect(fixture.nativeElement.classList.contains('cz-editor--disabled')).toBe(true);

        component.setDisabledState?.(false);
        fixture.componentRef.setInput('disabled', false);
        component.setDisabledState?.(true);
        fixture.detectChanges();
        expect(content().getAttribute('contenteditable')).toBe('false');
    });

    it('should apply the invalid state', () => {
        fixture.componentRef.setInput('invalid', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.classList.contains('cz-editor--invalid')).toBe(true);
        expect(content().getAttribute('aria-invalid')).toBe('true');
    });

    it('should filter toolbar controls with the formats whitelist', () => {
        fixture.componentRef.setInput('formats', ['bold', 'italic']);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-editor-select')).toBeNull();
        expect(buttons().length).toBe(2);
        expect(buttons()[0].getAttribute('aria-label')).toBe('Bold');
        expect(buttons()[1].getAttribute('aria-label')).toBe('Italic');
    });

    it('should expose the editor API through onEditorInit', () => {
        const spy = vi.fn();
        component.onEditorInit.subscribe(spy);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ editor: component.api }));
    });

    it('should emit api-sourced changes after commands', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onTextChange.subscribe(spy);

        component.exec('bold');
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ source: 'api' }));
    });

    it('should emit onFocus and onBlur', () => {
        fixture.detectChanges();

        const focusSpy = vi.fn();
        const blurSpy = vi.fn();
        component.onFocusEvent.subscribe(focusSpy);
        component.onBlurEvent.subscribe(blurSpy);

        content().dispatchEvent(new FocusEvent('focus'));
        content().dispatchEvent(new FocusEvent('blur'));
        fixture.detectChanges();

        expect(focusSpy).toHaveBeenCalledWith({ source: 'user' });
        expect(blurSpy).toHaveBeenCalledWith({ source: 'user' });
    });

    it('should render the custom toolbar template with the editor API', () => {
        const hostFixture = TestBed.createComponent(CustomToolbarHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-toolbar')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.cz-editor-select')).toBeNull();

        (hostFixture.nativeElement.querySelector('.custom-bold') as HTMLElement).click();
        hostFixture.detectChanges();

        expect(hostFixture.componentInstance.editorRef).toBeTruthy();
    });

    it('should return default selection when nothing is selected', () => {
        fixture.detectChanges();
        expect(component.getSelection()).toEqual({ index: 0, length: 0 });
    });

    it('should render font family and size selects with the configured options', () => {
        fixture.componentRef.setInput('fontFamilies', ['Sora', 'Georgia']);
        fixture.componentRef.setInput('fontSizes', [12, 16]);
        fixture.detectChanges();

        const familySelect = fixture.nativeElement.querySelector('.cz-editor-select[aria-label="Font family"]');
        expect(familySelect).toBeTruthy();
        expect(familySelect.querySelectorAll('option').length).toBe(3);

        const sizeSelect = fixture.nativeElement.querySelector('.cz-editor-select[aria-label="Font size"]');
        expect(sizeSelect).toBeTruthy();
        expect(sizeSelect.querySelectorAll('option').length).toBe(3);
    });

    it('should emit api changes when setting font family and size', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onTextChange.subscribe(spy);

        component.setFont('Georgia');
        component.setFontSize(24);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ source: 'api' }));
    });

    it('should convert font elements to spans with inline styles', () => {
        fixture.detectChanges();

        const content = fixture.nativeElement.querySelector('.cz-editor-content') as HTMLElement;
        content.innerHTML = '<font face="Georgia">Hello</font>';

        const execSpy = vi.fn();
        (document as unknown as { execCommand: unknown }).execCommand = execSpy;

        component.setFont('Georgia');
        fixture.detectChanges();

        expect(content.innerHTML).not.toContain('<font');
        expect(content.innerHTML).toContain('font-family: Georgia');
        expect(content.innerHTML).toContain('Hello');

        delete (document as unknown as { execCommand?: unknown }).execCommand;
    });

    it('should open the hidden image picker and insert files as data URLs', async () => {
        fixture.detectChanges();

        const imageInput = fixture.nativeElement.querySelector('.cz-editor-image-input') as HTMLInputElement;
        const clickSpy = vi.spyOn(imageInput, 'click');

        component.pickImage();
        expect(clickSpy).toHaveBeenCalled();

        const spy = vi.fn();
        component.onTextChange.subscribe(spy);

        component.insertImageFile(new File(['fake-image'], 'photo.png', { type: 'image/png' }));

        await new Promise((resolve) => setTimeout(resolve, 50));
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ source: 'api' }));
    });

    it('should paste images from the clipboard', () => {
        fixture.detectChanges();

        const insertSpy = vi.fn();
        component.insertImageFile = insertSpy;

        const file = new File(['img'], 'clip.png', { type: 'image/png' });
        const event = {
            clipboardData: {
                items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
            },
            preventDefault: vi.fn(),
        } as unknown as ClipboardEvent;

        component.onContentPaste(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(insertSpy).toHaveBeenCalledWith(file);
    });

    it('should ignore paste without images', () => {
        fixture.detectChanges();

        const insertSpy = vi.fn();
        component.insertImageFile = insertSpy;

        const event = {
            clipboardData: {
                items: [{ kind: 'string', type: 'text/plain', getAsFile: () => null }],
            },
            preventDefault: vi.fn(),
        } as unknown as ClipboardEvent;

        component.onContentPaste(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(insertSpy).not.toHaveBeenCalled();
    });

    it('should not block native selects on toolbar mousedown but keep buttons from stealing focus', () => {
        fixture.detectChanges();

        const select = fixture.nativeElement.querySelector('.cz-editor-select') as HTMLElement;
        const selectEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        select.dispatchEvent(selectEvent);
        expect(selectEvent.defaultPrevented).toBe(false);

        const button = fixture.nativeElement.querySelector('.cz-editor-btn') as HTMLElement;
        const buttonEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        button.dispatchEvent(buttonEvent);
        expect(buttonEvent.defaultPrevented).toBe(true);
    });

    it('should restore the selection before running commands after toolbar interaction', () => {
        fixture.detectChanges();

        const content = fixture.nativeElement.querySelector('.cz-editor-content') as HTMLElement;
        content.innerHTML = '<p>Hello</p>';

        const range = document.createRange();
        range.selectNodeContents(content.querySelector('p') as HTMLElement);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Toolbar button mousedown saves the selection
        const button = fixture.nativeElement.querySelector('.cz-editor-btn') as HTMLElement;
        button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));

        // The selection is lost (like when interacting with a native select)
        selection?.removeAllRanges();
        expect(selection?.rangeCount).toBe(0);

        const execSpy = vi.fn();
        (document as unknown as { execCommand: unknown }).execCommand = execSpy;

        component.setFont('Georgia');

        expect(execSpy).toHaveBeenCalledWith('fontName', false, 'Georgia');
        expect(selection?.rangeCount).toBeGreaterThan(0);

        delete (document as unknown as { execCommand?: unknown }).execCommand;
    });

    it('should expose the new image and font methods through the API', () => {
        fixture.detectChanges();

        expect(typeof component.api.setFont).toBe('function');
        expect(typeof component.api.setFontSize).toBe('function');
        expect(typeof component.api.insertImageFile).toBe('function');
        expect(typeof component.api.pickImage).toBe('function');
    });
});

@Component({
    imports: [CzEditorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-editor>
            <ng-template #headerTemplate let-editor="editor">
                <span class="custom-toolbar">
                    <button type="button" class="custom-bold" (click)="capture(editor)">B</button>
                </span>
            </ng-template>
        </cz-editor>
    `,
})
class CustomToolbarHostComponent {
    editorRef: any = null;

    capture(editor: any): void {
        this.editorRef = editor;
        editor.exec('bold');
    }
}
