import { Directive } from '@angular/core';

/**
 * CzFluidDirective
 *
 * Layout directive that makes descendant Codezium components span the full
 * width of their container.
 *
 * Usage:
 *   <div czFluid>
 *     <cz-input-text label="Name" />
 *   </div>
 */
@Directive({
    selector: '[czFluid]',
    host: {
        'class': 'cz-fluid',
    },
})
export class CzFluidDirective {}
