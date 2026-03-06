export const THEMING_I18N = {
    en: {
        title: 'Theming',
        lead: 'Codezium UI uses a native CSS Custom Properties architecture to support multiple themes and dark mode. Zero JavaScript providers required.',
        themes: {
            title: 'Available Themes',
            base: '<strong>Base</strong> — Clean, minimal design built on standard CSS tokens.',
            glass: '<strong>Glass</strong> — Glassmorphism with backdrop blur and translucency.',
            neo: '<strong>Neo</strong> — Neumorphism with soft 3D raised and pressed shadows.'
        },
        architecture: {
            title: 'Why CSS variables over JS Providers?',
            p1: 'Unlike libraries like PrimeNG that require injecting themes via JavaScript (<code>providePrimeNG</code>), Codezium UI embraces the native web platform:',
            li1: '<strong>Zero FOUC (Flash of Unstyled Content)</strong>: CSS parses instantly before Angular even boots.',
            li2: '<strong>Smaller Bundle Size</strong>: Theme definitions don\'t bloat your main <code>main.js</code> payload.',
            li3: '<strong>Theme Nesting</strong>: You can effortlessly mix distinct themes on the exact same screen.'
        },
        usage: {
            title: 'Global Usage',
            p1: 'To apply a theme to your entire application, simply add the <code>data-theme</code> attribute to your root element (e.g., in <code>index.html</code> or <code>app.component.html</code>):',
            code: `<html lang="en" data-theme="glass">`
        },
        darkMode: {
            title: 'Dark Mode',
            p1: 'Toggle dark mode universally by appending the <code>dark</code> CSS class alongside your theme attribute. Our 3-tier CSS variables automatically invert all semantic tokens.',
            code: `<html lang="en" data-theme="glass" class="dark">`
        },
        nesting: {
            title: 'Local Theme Nesting',
            p1: 'Because Codezium UI relies on the native cascading behavior of CSS, you can apply different themes to specific sections of a page simultaneously:',
            code: `<!-- Dashboard uses Base theme -->
<body data-theme="base">
   <cz-input-text label="Username" />
   
   <!-- This specific card acts as a focal point using Neo -->
   <div class="checkout-card" data-theme="neo">
      <cz-input-text label="Credit Card" />
   </div>
</body>`
        }
    },
    es: {
        title: 'Temas (Theming)',
        lead: 'Codezium UI utiliza una arquitectura nativa de Variables CSS para soportar múltiples temas y modo oscuro. Cero proveedores JavaScript requeridos.',
        themes: {
            title: 'Temas Disponibles',
            base: '<strong>Base</strong> — Diseño limpio y minimalista basado en tokens CSS estándar.',
            glass: '<strong>Glass</strong> — Efecto Glassmorphism con desenfoque de fondo y translucidez.',
            neo: '<strong>Neo</strong> — Efecto Neumorphism con suaves sombras 3D elevadas y hundidas.'
        },
        architecture: {
            title: '¿Por qué Variables CSS sobre Proveedores JS?',
            p1: 'A diferencia de librerías como PrimeNG que requieren inyectar temas vía JavaScript (<code>providePrimeNG</code>), Codezium UI adopta la plataforma web nativa:',
            li1: '<strong>Cero FOUC (Flash of Unstyled Content)</strong>: El CSS pinta instantáneamente antes de que Angular arranque.',
            li2: '<strong>Bundle Más Pequeño</strong>: Las definiciones de temas no engordan el peso de tu <code>main.js</code>.',
            li3: '<strong>Anidamiento de Temas</strong>: Puedes mezclar temas distintos en la misma pantalla sin esfuerzo.'
        },
        usage: {
            title: 'Uso Global',
            p1: 'Para aplicar un tema a toda tu aplicación, simplemente añade el atributo <code>data-theme</code> a tu elemento raíz (ej. en <code>index.html</code> o <code>app.component.html</code>):',
            code: `<html lang="es" data-theme="glass">`
        },
        darkMode: {
            title: 'Modo Oscuro',
            p1: 'Activa el modo oscuro universalmente añadiendo la clase CSS <code>dark</code> junto al atributo del tema. Nuestras variables de 3 capas invierten automáticamente todos los tokens semánticos.',
            code: `<html lang="es" data-theme="glass" class="dark">`
        },
        nesting: {
            title: 'Anidamiento de Temas Locales',
            p1: 'Dado que Codezium UI depende del comportamiento en cascada nativo de CSS, puedes aplicar diferentes temas a secciones específicas de una página simultáneamente:',
            code: `<!-- El Dashboard usa el tema Base -->
<body data-theme="base">
   <cz-input-text label="Nombre" />
   
   <!-- Esta tarjeta específica destaca usando el tema Neo -->
   <div class="checkout-card" data-theme="neo">
      <cz-input-text label="Tarjeta de Crédito" />
   </div>
</body>`
        }
    },
    pt: {
        title: 'Temas (Theming)',
        lead: 'O Codezium UI usa uma arquitetura nativa de Variáveis CSS para suportar vários temas e modo escuro. Zero provedores JavaScript necessários.',
        themes: {
            title: 'Temas Disponíveis',
            base: '<strong>Base</strong> — Design clean e minimalista baseado em tokens CSS padrão.',
            glass: '<strong>Glass</strong> — Glassmorphism com desfoque de fundo e translucidez.',
            neo: '<strong>Neo</strong> — Neomorfismo com sombras 3D elevadas e pressionadas.'
        },
        architecture: {
            title: 'Por que Variáveis CSS em vez de Provedores JS?',
            p1: 'Diferente de bibliotecas como PrimeNG que exigem injeção de temas via JavaScript (<code>providePrimeNG</code>), o Codezium UI adota a plataforma web nativa:',
            li1: '<strong>Zero FOUC (Flash of Unstyled Content)</strong>: O CSS pinta instantaneamente antes mesmo do Angular iniciar.',
            li2: '<strong>Tamanho de Bundle Menor</strong>: As definições de tema não sobrecarregam sua carga principal do <code>main.js</code>.',
            li3: '<strong>Aninhamento de Temas</strong>: Você pode misturar temas distintos na mesma tela sem esforço.'
        },
        usage: {
            title: 'Uso Global',
            p1: 'Para aplicar um tema a toda a sua aplicação, basta adicionar o atributo <code>data-theme</code> ao seu elemento raiz (ex., no <code>index.html</code> ou <code>app.component.html</code>):',
            code: `<html lang="pt" data-theme="glass">`
        },
        darkMode: {
            title: 'Modo Escuro',
            p1: 'Alterne o modo escuro universalmente adicionando a classe CSS <code>dark</code> junto com seu atributo de tema. Nossas variáveis CSS de 3 camadas invertem automaticamente todos os tokens semânticos.',
            code: `<html lang="pt" data-theme="glass" class="dark">`
        },
        nesting: {
            title: 'Aninhamento de Temas Locais',
            p1: 'Como o Codezium UI depende do comportamento nativo de cascata do CSS, você pode aplicar temas diferentes a seções específicas de uma página simultaneamente:',
            code: `<!-- O Dashboard usa o tema Base -->
<body data-theme="base">
   <cz-input-text label="Usuário" />
   
   <!-- Este cartão específico se destaca usando Neo -->
   <div class="checkout-card" data-theme="neo">
      <cz-input-text label="Cartão de Crédito" />
   </div>
</body>`
        }
    },
    fr: {
        title: 'Thèmes (Theming)',
        lead: 'Codezium UI utilise une architecture native de Propriétés Personnalisées CSS pour prendre en charge plusieurs thèmes et le mode sombre. Zéro fournisseur JavaScript requis.',
        themes: {
            title: 'Thèmes Disponibles',
            base: '<strong>Base</strong> — Design épuré, basé sur des tokens CSS standards.',
            glass: '<strong>Glass</strong> — Glassmorphism avec flou d\'arrière-plan et translucidité.',
            neo: '<strong>Neo</strong> — Neumorphism avec de douces ombres 3D en relief ou en creux.'
        },
        architecture: {
            title: 'Pourquoi des Variables CSS plutôt que des Fournisseurs JS ?',
            p1: 'Contrairement aux bibliothèques comme PrimeNG qui nécessitent l\'injection de thèmes via JavaScript (<code>providePrimeNG</code>), Codezium UI adopte la plateforme web native :',
            li1: '<strong>Zéro FOUC (Flash of Unstyled Content)</strong> : Le CSS s\'affiche instantanément avant même qu\'Angular ne démarre.',
            li2: '<strong>Taille de Bundle Réduite</strong> : Les définitions de thèmes n\'alourdissent pas votre payload <code>main.js</code>.',
            li3: '<strong>Imbrication de Thèmes</strong> : Vous pouvez mélanger sans effort différents thèmes sur le même écran.'
        },
        usage: {
            title: 'Utilisation Globale',
            p1: 'Pour appliquer un thème à toute votre application, ajoutez simplement l\'attribut <code>data-theme</code> à votre élément racine (ex. dans <code>index.html</code> ou <code>app.component.html</code>) :',
            code: `<html lang="fr" data-theme="glass">`
        },
        darkMode: {
            title: 'Mode Sombre',
            p1: 'Activez le mode sombre universellement en ajoutant la classe CSS <code>dark</code> avec votre attribut de thème. Nos variables CSS à 3 niveaux inversent automatiquement tous les tokens sémantiques.',
            code: `<html lang="fr" data-theme="glass" class="dark">`
        },
        nesting: {
            title: 'Imbrication de Thèmes Locaux',
            p1: 'Puisque Codezium UI s\'appuie sur le comportement natif en cascade de CSS, vous pouvez appliquer différents thèmes à des sections spécifiques d\'une page simultanément :',
            code: `<!-- Le Dashboard utilise le thème Base -->
<body data-theme="base">
   <cz-input-text label="Utilisateur" />
   
   <!-- Cette carte spécifique utilise Neo pour se démarquer -->
   <div class="checkout-card" data-theme="neo">
      <cz-input-text label="Carte de Crédit" />
   </div>
</body>`
        }
    },
    de: {
        title: 'Theming',
        lead: 'Codezium UI verwendet eine native CSS-Custom-Properties-Architektur, um mehrere Themes und den Dark Mode zu unterstützen. Keine JavaScript-Provider erforderlich.',
        themes: {
            title: 'Verfügbare Themes',
            base: '<strong>Base</strong> — Klares, minimales Design basierend auf Standard-CSS-Tokens.',
            glass: '<strong>Glass</strong> — Glassmorphismus mit Hintergrundunschärfe und Transparenz.',
            neo: '<strong>Neo</strong> — Neumorphismus mit weichen 3D-Schatten.'
        },
        architecture: {
            title: 'Warum CSS-Variablen statt JS-Provider?',
            p1: 'Im Gegensatz zu Bibliotheken wie PrimeNG, die Themes über JavaScript injizieren müssen (<code>providePrimeNG</code>), macht sich Codezium UI die native Webplattform zu eigen:',
            li1: '<strong>Kein FOUC (Flash of Unstyled Content)</strong>: CSS wird sofort gerendert, bevor Angular überhaupt startet.',
            li2: '<strong>Kleinere Bundle-Größe</strong>: Theming-Definitionen blähen Ihren <code>main.js</code> Payload nicht auf.',
            li3: '<strong>Theme-Verschachtelung</strong>: Sie können mühelos verschiedene Themes auf demselben Bildschirm mischen.'
        },
        usage: {
            title: 'Globale Nutzung',
            p1: 'Um ein Theme auf Ihre gesamte Anwendung anzuwenden, fügen Sie einfach das Attribut <code>data-theme</code> zu Ihrem Root-Element hinzu (z. B. in <code>index.html</code> oder <code>app.component.html</code>):',
            code: `<html lang="de" data-theme="glass">`
        },
        darkMode: {
            title: 'Dark Mode',
            p1: 'Schalten Sie den Dark Mode universell ein, indem Sie die CSS-Klasse <code>dark</code> zusammen mit dem Theme-Attribut hinzufügen. Unsere 3-stufigen CSS-Variablen kehren automatisch alle semantischen Tokens um.',
            code: `<html lang="de" data-theme="glass" class="dark">`
        },
        nesting: {
            title: 'Lokale Theme-Verschachtelung',
            p1: 'Da Codezium UI auf dem nativen Kaskadierverhalten von CSS aufbaut, können Sie gleichzeitig verschiedene Themes auf bestimmte Abschnitte einer Seite anwenden:',
            code: `<!-- Das Dashboard verwendet das Base Theme -->
<body data-theme="base">
   <cz-input-text label="Benutzername" />
   
   <!-- Diese spezifische Karte wird mit Neo hervorgehoben -->
   <div class="checkout-card" data-theme="neo">
      <cz-input-text label="Kreditkarte" />
   </div>
</body>`
        }
    }
};
