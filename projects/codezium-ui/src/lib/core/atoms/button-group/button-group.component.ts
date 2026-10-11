import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * CzButtonGroupComponent
 *
 * Groups adjacent buttons into a single segmented control: inner radii are
 * collapsed and the buttons overlap by 1px so borders and colors connect.
 *
 *   <cz-button-group>
 *       <cz-button label="Save" />
 *       <cz-button label="Delete" severity="danger" />
 *   </cz-button-group>
 */
@Component({
    selector: 'cz-button-group',
    template: `<ng-content />`,
    styleUrl: './button-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-button-group',
    },
})
export class CzButtonGroupComponent {}
