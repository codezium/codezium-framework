import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CzBlockUIService } from './block-ui.service';

describe('CzBlockUIService', () => {
    let service: CzBlockUIService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CzBlockUIService);
        service.reset();
    });

    it('should start unblocked', () => {
        expect(service.blocked()).toBe(false);
    });

    it('should block while at least one operation is active', () => {
        service.block();
        service.block();
        expect(service.blocked()).toBe(true);

        service.unblock();
        expect(service.blocked()).toBe(true);

        service.unblock();
        expect(service.blocked()).toBe(false);
    });

    it('should never go below zero', () => {
        service.unblock();
        expect(service.blocked()).toBe(false);

        service.block();
        expect(service.blocked()).toBe(true);
    });

    it('should release every active block with reset', () => {
        service.block();
        service.block();
        service.reset();

        expect(service.blocked()).toBe(false);
    });
});
