import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CzMessageService } from './message.service';

describe('CzMessageService', () => {
    let service: CzMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CzMessageService);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        service.clear();
    });

    it('should push messages and expose them through the messages signal', () => {
        service.add({ severity: 'success', summary: 'Saved' });

        expect(service.messages().length).toBe(1);
        expect(service.messages()[0].severity).toBe('success');
        expect(service.messages()[0].summary).toBe('Saved');
    });

    it('should default to info severity', () => {
        service.add({ summary: 'Note' });

        expect(service.messages()[0].severity).toBe('info');
    });

    it('should auto-dismiss messages after their life', () => {
        service.add({ summary: 'Temporary' });

        expect(service.messages().length).toBe(1);
        vi.advanceTimersByTime(4000);
        expect(service.messages().length).toBe(0);
    });

    it('should keep sticky messages when life is 0', () => {
        service.add({ summary: 'Sticky', life: 0 });

        vi.advanceTimersByTime(10000);
        expect(service.messages().length).toBe(1);
    });

    it('should provide severity shorthands', () => {
        service.success('ok', 'detail');
        service.info('note');
        service.warning('careful');
        service.error('boom', 'detail');

        const severities = service.messages().map(m => m.severity);
        expect(severities).toEqual(['success', 'info', 'warning', 'danger']);
        expect(service.messages()[0].detail).toBe('detail');
    });

    it('should remove a single message by id and clear all', () => {
        const first = service.add({ summary: 'One', life: 0 });
        service.add({ summary: 'Two', life: 0 });

        service.remove(first);
        expect(service.messages().map(m => m.summary)).toEqual(['Two']);

        service.clear();
        expect(service.messages().length).toBe(0);
    });
});
