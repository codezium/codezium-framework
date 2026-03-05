import { Component, input, HostBinding, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, type LucideIconData } from 'lucide-angular';

/**
 * CzIconComponent
 * Wrapper oficial de Codezium UI para íconos Lucide.
 * Usando Signals de Angular v20+.
 */
@Component({
    selector: 'cz-icon',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <lucide-icon 
      [img]="icon()" 
      [color]="actualColor()" 
      [size]="actualSize()"
      [strokeWidth]="strokeWidth()"
      [class]="customClass()">
    </lucide-icon>
  `,
    styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      line-height: 1;
    }
    
    /* Si no se provee color, el ícono hereda el color del texto del contenedor */
    lucide-icon {
      color: inherit;
    }
  `]
})
export class CzIconComponent {
    // El icono importado directamente desde lucide-angular (ej: import { Home } from 'lucide-angular')
    icon = input.required<LucideIconData>();

    // Talla del ícono (puede ser número o string como '24px' o '1.5rem')
    size = input<number | string>(24);

    // Grosor de la línea
    strokeWidth = input<number>(2);

    // Color explícito (hex, rgb o var(--cz-color-*)). Si es undefined, hereda el color del texto.
    color = input<string | undefined>(undefined);

    // Clases utilitarias extra para inyectar si es necesario (ej: 'cz-animate-spin')
    customClass = input<string>('');

    // Computamos el tamaño final para asegurar unidades
    actualSize = computed(() => {
        const s = this.size();
        return typeof s === 'number' ? `${s}px` : s;
    });

    // Pasamos el color solo si está definido explicitamente
    actualColor = computed(() => {
        const c = this.color();
        return c ? c : 'currentColor';
    });
}
