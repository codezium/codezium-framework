export const INTRO_I18N = {
    en: {
        hero: {
            badge: 'v1.0 · Angular v20+',
            title: 'Codezium',
            accent: 'UI',
            lead: 'A modern Angular component library built on <strong>Signals</strong>, standalone components, and a powerful <strong>3-tier theming system</strong> — designed to build beautiful, accessible interfaces at any scale.',
            btnStarted: 'Get started →',
            btnGithub: 'View on GitHub',
        },
        whatIs: {
            title: 'What is Codezium UI?',
            p1: 'Codezium UI is an open-source Angular component library that leverages the latest Angular primitives — <strong>Signals</strong>, <strong>standalone components</strong>, and the <strong>inject()</strong> API — to deliver a developer experience that is both modern and predictable. Every component is built with <strong>OnPush</strong> change detection, ensuring minimal re-renders and maximum performance.',
            p2: 'The theming system is built on three layers of CSS custom properties: <em>primitives</em> (raw values), <em>semantic tokens</em> (contextual meanings), and <em>component tokens</em> (per-component overrides). Switch between <strong>Base</strong>, <strong>Glass</strong> and <strong>Neo</strong> themes — or create your own — without touching a single component.',
        },
        features: {
            title: 'Key Features',
            cards: [
                { icon: '⚡', title: 'Angular v20+ Native', desc: 'Built from scratch using Signals, <code>input()</code>, <code>output()</code>, and <code>inject()</code>. Zero legacy patterns.' },
                { icon: '🎨', title: '3-Tier Theming', desc: 'Swap between Base, Glassmorphism and Neumorphism themes at runtime via CSS custom properties. Dark mode included.' },
                { icon: '♿', title: 'Accessible by Default', desc: 'Every component ships with ARIA attributes, keyboard navigation, and WCAG AA color contrast compliance.' },
                { icon: '📦', title: 'Zero Runtime Deps', desc: 'No heavy external UI libraries. Only Lucide icons for SVGs. Slim bundle, full control.' },
                { icon: '🔬', title: 'OnPush by Default', desc: 'All components use <code>ChangeDetectionStrategy.OnPush</code> and Signal-driven state for predictable, minimal re-renders.' },
                { icon: '🛠️', title: 'Utility Classes', desc: 'A built-in utility system (<code>cz-flex</code>, <code>cz-grid</code>, <code>cz-gap-*</code>…) keeps your component styles lean and consistent.' },
            ]
        },
        themes: {
            title: 'Built-in Themes',
            desc: 'Codezium UI ships with three distinct visual identities, all powered by the same component API:',
            items: [
                { id: 'base', name: 'Base', desc: '— Clean, minimal design with sharp shadows and solid surfaces. Great as a neutral starting point.' },
                { id: 'glass', name: 'Glass', desc: '— Frosted glass surfaces, luminous borders and <code>backdrop-filter</code> blur for a modern, depth-rich UI.' },
                { id: 'neo', name: 'Neo', desc: '— Soft neumorphic shadows that push and press elements into the surface. Tactile and distinctive.' },
            ]
        },
        nextSteps: {
            title: 'Next Steps',
            desc: 'Ready to start building? Follow the installation guide to add Codezium UI to your Angular project in under two minutes.',
            btnInstall: 'Installation →',
            btnTheming: 'Explore Theming',
            btnComponents: 'Browse Components',
        }
    },
    es: {
        hero: {
            badge: 'v1.0 · Angular v20+',
            title: 'Codezium',
            accent: 'UI',
            lead: 'Una biblioteca moderna de componentes Angular construida sobre <strong>Signals</strong>, standalone components, y un poderoso <strong>sistema de theming de 3 capas</strong> — diseñada para construir interfaces hermosas y accesibles a cualquier escala.',
            btnStarted: 'Comenzar →',
            btnGithub: 'Ver en GitHub',
        },
        whatIs: {
            title: '¿Qué es Codezium UI?',
            p1: 'Codezium UI es una biblioteca de componentes de código abierto que aprovecha las últimas primitivas de Angular — <strong>Signals</strong>, <strong>standalone components</strong> y <strong>inject()</strong> — para ofrecer una experiencia de desarrollo moderna y predecible. Cada componente usa detección de cambios <strong>OnPush</strong>, asegurando rendimiento máximo.',
            p2: 'El sistema de temas se basa en tres capas de variables CSS: <em>primitivas</em>, <em>tokens semánticos</em> (significado base) y <em>tokens de componente</em>. Cambia entre los temas <strong>Base</strong>, <strong>Glass</strong> y <strong>Neo</strong> — o crea el tuyo — sin tocar la lógica de ningún componente.',
        },
        features: {
            title: 'Características Clave',
            cards: [
                { icon: '⚡', title: 'Nativo Angular v20+', desc: 'Hecho desde cero usando Signals, <code>input()</code>, <code>output()</code>, e <code>inject()</code>. Sin patrones heredados.' },
                { icon: '🎨', title: 'Theming de 3 Capas', desc: 'Intercambia entre Base, Glassmorphism y Neumorphism en tiempo de ejecución. Dark mode incluido.' },
                { icon: '♿', title: 'Accesible por Defecto', desc: 'Atributos ARIA, navegación por teclado y cumplimiento de contraste de color WCAG AA.' },
                { icon: '📦', title: 'Cero Dependencias', desc: 'Sin librerías UI pesadas. Solo Lucide icons para vectoriales. Bundle ligero y control total.' },
                { icon: '🔬', title: 'OnPush por Defecto', desc: 'Todos los componentes usan <code>ChangeDetectionStrategy.OnPush</code> y estado basado en Signals.' },
                { icon: '🛠️', title: 'Clases Utilitarias', desc: 'Sistema utilitario integrado (<code>cz-flex</code>, <code>cz-grid</code>...) para estilos limpios y consistentes.' },
            ]
        },
        themes: {
            title: 'Temas Integrados',
            desc: 'Codezium UI incluye tres identidades visuales distintas, todas impulsadas por la misma API:',
            items: [
                { id: 'base', name: 'Base', desc: '— Diseño limpio y minimalista con sombras marcadas y superficies sólidas. Excelente punto de partida.' },
                { id: 'glass', name: 'Glass', desc: '— Superficies de cristal esmerilado, bordes luminosos y desenfoque para una interfaz moderna y profunda.' },
                { id: 'neo', name: 'Neo', desc: '— Sombras neumórficas suaves que presionan los elementos contra la superficie. Táctil y distintivo.' },
            ]
        },
        nextSteps: {
            title: 'Siguientes Pasos',
            desc: '¿Listo para empezar a construir? Sigue la guía de instalación para agregar Codezium UI a tu proyecto Angular en menos de dos minutos.',
            btnInstall: 'Instalación →',
            btnTheming: 'Explorar Theming',
            btnComponents: 'Ver Componentes',
        }
    },
    pt: {
        hero: {
            badge: 'v1.0 · Angular v20+',
            title: 'Codezium',
            accent: 'UI',
            lead: 'Uma biblioteca moderna de componentes Angular construída com <strong>Signals</strong>, componentes autônomos e um poderoso <strong>sistema de temas de 3 camadas</strong> — projetada para construir interfaces bonitas e acessíveis em qualquer escala.',
            btnStarted: 'Começar →',
            btnGithub: 'Ver no GitHub',
        },
        whatIs: {
            title: 'O que é o Codezium UI?',
            p1: 'Codezium UI é uma biblioteca de componentes de código aberto que aproveita as mais recentes primitivas do Angular — <strong>Signals</strong>, <strong>componentes standalone</strong> e <strong>inject()</strong> — para oferecer uma experiência de desenvolvimento moderna e previsível. Cada componente usa a detecção de alterações <strong>OnPush</strong>.',
            p2: 'O sistema de temas baseia-se em três camadas de variáveis CSS: <em>primitivas</em>, <em>tokens semânticos</em> e <em>tokens de componentes</em>. Alterne entre os temas <strong>Base</strong>, <strong>Glass</strong> e <strong>Neo</strong> — ou crie o seu — sem alterar a lógica.',
        },
        features: {
            title: 'Principais Recursos',
            cards: [
                { icon: '⚡', title: 'Nativo Angular v20+', desc: 'Feito do zero usando Signals, <code>input()</code>, <code>output()</code> e <code>inject()</code>. Sem padrões legados.' },
                { icon: '🎨', title: 'Temas de 3 Camadas', desc: 'Troque entre Base, Glassmorphism e Neumorphism em tempo de execução. Modo escuro incluído.' },
                { icon: '♿', title: 'Acessível por Padrão', desc: 'Atributos ARIA, navegação por teclado e conformidade de contraste de cor WCAG AA.' },
                { icon: '📦', title: 'Zero Dependências', desc: 'Sem bibliotecas UI pesadas. Apenas ícones Lucide. Bundle leve e controle total.' },
                { icon: '🔬', title: 'OnPush por Padrão', desc: 'Todos os componentes usam <code>ChangeDetectionStrategy.OnPush</code> e estado baseado em Signals.' },
                { icon: '🛠️', title: 'Classes Utilitárias', desc: 'Sistema utilitário integrado (<code>cz-flex</code>, <code>cz-grid</code>) para manter seus estilos limpos.' },
            ]
        },
        themes: {
            title: 'Temas Integrados',
            desc: 'O Codezium UI inclui três identidades visuais distintas, todas desenvolvidas usando a mesma API:',
            items: [
                { id: 'base', name: 'Base', desc: '— Design clean com sombras nítidas e superfícies sólidas. Ponto de partida neutro ideal.' },
                { id: 'glass', name: 'Glass', desc: '— Superfícies de vidro fosco, bordas luminosas e desfoque para uma UI moderna e profunda.' },
                { id: 'neo', name: 'Neo', desc: '— Sombras neumórficas suaves para elementos táteis pressionados na superfície.' },
            ]
        },
        nextSteps: {
            title: 'Próximos Passos',
            desc: 'Pronto para começar? Siga o guia de instalação para adicionar o Codezium UI ao seu projeto Angular em menos de dois minutos.',
            btnInstall: 'Instalação →',
            btnTheming: 'Explorar Temas',
            btnComponents: 'Ver Componentes',
        }
    },
    fr: {
        hero: {
            badge: 'v1.0 · Angular v20+',
            title: 'Codezium',
            accent: 'UI',
            lead: 'Une bibliothèque de composants Angular moderne basée sur les <strong>Signals</strong>, les composants standalone et un puissant <strong>système de thème à 3 niveaux</strong> — conçue pour créer des interfaces magnifiques.',
            btnStarted: 'Commencer →',
            btnGithub: 'Voir sur GitHub',
        },
        whatIs: {
            title: 'Qu\'est-ce que Codezium UI ?',
            p1: 'Codezium UI est une bibliothèque de composants open source utilisant les dernières primitives d\'Angular — <strong>Signals</strong>, <strong>composants standalone</strong> et <strong>inject()</strong>. Chaque composant est optimisé avec <strong>OnPush</strong> pour assurer une performance maximale.',
            p2: 'Le système de thème repose sur trois couches de variables CSS : <em>primitives</em>, <em>jetons sémantiques</em> et <em>jetons de composants</em>. Passez entre les thèmes <strong>Base</strong>, <strong>Glass</strong> et <strong>Neo</strong> — sans modifier les composants.',
        },
        features: {
            title: 'Fonctionnalités Clés',
            cards: [
                { icon: '⚡', title: 'Natif Angular v20+', desc: 'Conçu à partir de zéro avec Signals, <code>input()</code>, <code>output()</code>, et <code>inject()</code>.' },
                { icon: '🎨', title: 'Thèmes à 3 Niveaux', desc: 'Alternez entre Base, Glassmorphism et Neumorphism à la volée. Mode sombre inclus.' },
                { icon: '♿', title: 'Accessible par Défaut', desc: 'Attributs ARIA, navigation au clavier et contraste WCAG AA intégrés d\'office.' },
                { icon: '📦', title: 'Zéro Dépendance', desc: 'Aucune dépendance lourde, uniquement des icônes Lucide. Bundle ultra léger.' },
                { icon: '🔬', title: 'OnPush par Défaut', desc: 'Performance maximale avec <code>ChangeDetectionStrategy.OnPush</code> partout.' },
                { icon: '🛠️', title: 'Classes Utilitaires', desc: 'Un système utilitaire intégré (<code>cz-flex</code>, <code>cz-grid</code>…) pour des css légers.' },
            ]
        },
        themes: {
            title: 'Thèmes Intégrés',
            desc: 'Codezium UI inclut trois identités visuelles distinctes :',
            items: [
                { id: 'base', name: 'Base', desc: '— Design épuré, ombres nettes et surfaces solides. Excellent point de départ neutre.' },
                { id: 'glass', name: 'Glass', desc: '— Surfaces en verre dépoli, bordures lumineuses et flou pour une interface moderne.' },
                { id: 'neo', name: 'Neo', desc: '— Ombres neumorphiques douces, pressées dans la surface. Tactile et distinctif.' },
            ]
        },
        nextSteps: {
            title: 'Étapes Suivantes',
            desc: 'Prêt à construire ? Suivez le guide d\'installation pour ajouter Codezium UI à votre projet.',
            btnInstall: 'Installation →',
            btnTheming: 'Explorer les Thèmes',
            btnComponents: 'Voir les Composants',
        }
    },
    de: {
        hero: {
            badge: 'v1.0 · Angular v20+',
            title: 'Codezium',
            accent: 'UI',
            lead: 'Eine moderne Angular Komponenten-Bibliothek basierend auf <strong>Signals</strong>, Standalone-Komponenten und einem mächtigen <strong>3-Ebenen-Designsystem</strong> — entwickelt für wunderschöne, UI-Skalierung.',
            btnStarted: 'Loslegen →',
            btnGithub: 'Auf GitHub ansehen',
        },
        whatIs: {
            title: 'Was ist Codezium UI?',
            p1: 'Codezium UI ist eine quelloffene Komponenten-Bibliothek für Angular, welche die neusten Primitiven — <strong>Signals</strong>, <strong>Standalone-Komponenten</strong> und <strong>inject()</strong> — verwendet. Jede Komponente nutzt <strong>OnPush</strong> für maximale Performance.',
            p2: 'Das Theme-System basiert auf drei Schichten von CSS-Variablen: <em>Primitive</em>, <em>Semantische Tokens</em> und <em>Komponenten-Tokens</em>. Wechseln Sie frei zwischen <strong>Base</strong>, <strong>Glass</strong> und <strong>Neo</strong>.',
        },
        features: {
            title: 'Hauptfunktionen',
            cards: [
                { icon: '⚡', title: 'Nativ Angular v20+', desc: 'Gebaut von Grund auf mit Signals, <code>input()</code>, <code>output()</code> und <code>inject()</code>.' },
                { icon: '🎨', title: '3-Ebenen-Themes', desc: 'Wechseln Sie zur Laufzeit zwischen Base, Glassmorphism und Neumorphism. Dunkelmodus inkl.' },
                { icon: '♿', title: 'Barrierefrei', desc: 'ARIA-Attribute, Tastaturnavigation und WCAG AA-Farbkontraste out-of-the-box.' },
                { icon: '📦', title: 'Keine Abhängigkeiten', desc: 'Keine schweren UI-Bibliotheken. Nur Lucide Icons. Schlankes Bundle, volle Kontrolle.' },
                { icon: '🔬', title: 'OnPush by Default', desc: 'Alle Komponenten nutzen <code>ChangeDetectionStrategy.OnPush</code> für reaktive State-Updates.' },
                { icon: '🛠️', title: 'Utility-Klassen', desc: 'Integriertes Hilfssystem (<code>cz-flex</code>, <code>cz-grid</code>), um Styles konsistent zu halten.' },
            ]
        },
        themes: {
            title: 'Integrierte Themes',
            desc: 'Codezium UI wird mit drei unterschiedlichen visuellen Identitäten geliefert:',
            items: [
                { id: 'base', name: 'Base', desc: '— Klares, minimalistisches Design mit soliden Oberflächen. Guter neutraler Startpunkt.' },
                { id: 'glass', name: 'Glass', desc: '— Milchglasoberflächen, leuchtende Ränder und Unschärfe für ein modernes Interface.' },
                { id: 'neo', name: 'Neo', desc: '— Weiche neumorphische Schatten. Fühlt sich taktil und besonders an.' },
            ]
        },
        nextSteps: {
            title: 'Nächste Schritte',
            desc: 'Bereit anzufangen? Folgen Sie der Installationsanleitung, um Codezium UI hinzuzufügen.',
            btnInstall: 'Installation →',
            btnTheming: 'Themes Erkunden',
            btnComponents: 'Komponenten Durchsuchen',
        }
    }
};
