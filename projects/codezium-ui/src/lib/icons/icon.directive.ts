import {
    Directive,
    Input,
    ElementRef,
    Renderer2,
    ViewContainerRef,
    ComponentRef,
    OnChanges,
    SimpleChanges,
    inject
} from '@angular/core';
import { type LucideIconData } from 'lucide-angular';
import { CzIconComponent } from './icon.component';

@Directive({
    selector: '[czIcon]',
    standalone: true
})
export class CzIconDirective implements OnChanges {
    // Input principal para recibir el icono. Usamos Input antiguo para compatibilidad amplia
    // en lugar de input.required() debido a limitantes de Angular al crear componentes dinámicos simples
    @Input('czIcon') icon!: LucideIconData;

    // Tamaño del icono
    @Input() czIconSize: number | string = 20;

    // Clase personalizada para el icono
    @Input() czIconClass: string = '';

    // Dónde colocar el icono respecto al texto ('left' o 'right')
    @Input() czIconPosition: 'left' | 'right' = 'left';

    // Margen automático entre el ícono y el texto
    @Input() czIconGap: string = '0.5rem';

    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    private viewContainerRef = inject(ViewContainerRef);

    private iconComponentRef: ComponentRef<CzIconComponent> | null = null;
    private gapElement: HTMLElement | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['icon'] && this.icon) {
            this.renderIcon();
        } else if (this.iconComponentRef) {
            this.updateIconProps();
        }
    }

    private renderIcon(): void {
        // 1. Limpiamos iconos inyectados previamente
        this.viewContainerRef.clear();
        if (this.gapElement) {
            this.renderer.removeChild(this.el.nativeElement, this.gapElement);
            this.gapElement = null;
        }

        // 2. Preparamos el contenedor anfitrión para alinear bien el icono con Flexbox
        this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-flex');
        this.renderer.setStyle(this.el.nativeElement, 'align-items', 'center');
        this.renderer.setStyle(this.el.nativeElement, 'justify-content', 'center');

        // 3. Creamos e inyectamos el componente CzIconComponent anidado
        this.iconComponentRef = this.viewContainerRef.createComponent(CzIconComponent);

        // 4. Se inyecta la referencia de instancia al DOM del Host
        const iconNativeElement = this.iconComponentRef.location.nativeElement;

        // 5. Creamos un gap (Margen) usando un span hueco para no lidiar con pseudo-clases dinámicas
        this.gapElement = this.renderer.createElement('span');
        this.renderer.setStyle(this.gapElement, 'display', 'inline-block');
        this.renderer.setStyle(this.gapElement, 'width', this.czIconGap);

        // 6. Insertamos en el DOM dependiendo de la posición deseada
        if (this.czIconPosition === 'left') {
            // Inserción inicial: Icono -> Gap -> [Contenido Original del botón/host]
            this.renderer.insertBefore(this.el.nativeElement, iconNativeElement, this.el.nativeElement.firstChild);
            this.renderer.insertBefore(this.el.nativeElement, this.gapElement, this.el.nativeElement.firstChild.nextSibling);
        } else {
            // Position Right: [Contenido Original] -> Gap -> Icono
            this.renderer.appendChild(this.el.nativeElement, this.gapElement);
            this.renderer.appendChild(this.el.nativeElement, iconNativeElement);
        }

        // 7. Enlazamos los valores iniciales de la directiva hacia el componente
        this.updateIconProps();
    }

    private updateIconProps(): void {
        if (this.iconComponentRef) {
            this.iconComponentRef.setInput('icon', this.icon);
            this.iconComponentRef.setInput('size', this.czIconSize);
            this.iconComponentRef.setInput('customClass', this.czIconClass);
        }
    }
}
