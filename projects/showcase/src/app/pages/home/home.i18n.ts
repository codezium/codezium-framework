/** home.i18n.ts
 * Fichero de traducciones para la página de inicio del Showcase.
 * Añadir un idioma: agregar una nueva clave al tipo HomeLocale y
 * su entrada correspondiente en HOME_TRANSLATIONS.
 */

export type HomeLocale = 'en' | 'es' | 'pt' | 'fr' | 'de';

export interface HomeTranslation {
    /* Navbar */
    nav: {
        features: string;
        components: string;
        themes: string;
        docs: string;
        getStarted: string;
    };
    /* Hero */
    hero: {
        badge: string;
        titleLine1: string;
        titleAccent: string;
        titleLine2: string;
        description: string;
        ctaPrimary: string;
        ctaGithub: string;
    };
    /* Why section */
    why: {
        title: string;
        subtitle: string;
        features: Array<{ icon: string; title: string; description: string }>;
    };
    /* Components preview */
    components: {
        title: string;
        subtitle: string;
        exploreLink: string;
        card1: { title: string; item1: { name: string; updated: string }; item2: { name: string; updated: string }; btnViewDetails: string };
        card2: { title: string; labelName: string; labelMessage: string; placeholder: string; privacy: string; btnSend: string };
    };
    /* Themes */
    themes: {
        title: string;
        subtitle: string;
        base: { name: string; description: string };
        glass: { name: string; description: string };
        neo: { name: string; description: string };
    };
    /* CTA */
    cta: {
        title: string;
        subtitle: string;
        btnDownload: string;
        btnDocs: string;
    };
    /* Footer */
    footer: {
        tagline: string;
        resources: string;
        community: string;
        support: string;
        links: {
            documentation: string;
            components: string;
            github: string;
            npm: string;
            discord: string;
            twitter: string;
            discussions: string;
            caseStudies: string;
            enterprise: string;
            faq: string;
            contact: string;
            privacy: string;
        };
        copyright: string;
    };
}

export const HOME_TRANSLATIONS: Record<HomeLocale, HomeTranslation> = {
    en: {
        nav: {
            features: 'Features', components: 'Components',
            themes: 'Themes', docs: 'Docs', getStarted: 'Get Started',
        },
        hero: {
            badge: 'Angular v20+ · Signals · Standalone',
            titleLine1: 'The Next Generation',
            titleAccent: 'Angular UI',
            titleLine2: 'Framework',
            description: 'Build beautiful and performant web applications with ease using our enterprise-grade component library. Designed for the modern web with Signals, Atomic Design and full theming support.',
            ctaPrimary: 'Get Started Now',
            ctaGithub: 'View on GitHub',
        },
        why: {
            title: 'Why Codezium UI?',
            subtitle: 'Designed for high-performance enterprise applications with modern aesthetics.',
            features: [
                { icon: '⚡', title: 'High Performance', description: 'Optimized bundle sizes and lightning-fast rendering. We use the latest Angular Signals to ensure your app stays smooth.' },
                { icon: '🎨', title: 'Highly Customizable', description: 'Easily themeable with CSS variables and token-based styling. Switch between Base, Glassmorphism, and Neumorphism in seconds.' },
                { icon: '♿', title: 'Accessible & Responsive', description: 'WCAG AA compliant and mobile-first responsive design. Accessibility out of the box for all users across any device.' },
                { icon: '🌍', title: 'Built-in i18n', description: 'Validation messages in 14 languages out of the box: English, Spanish, Portuguese, German, French, Russian, Arabic and more.' },
                { icon: '🔒', title: 'Angular Forms Ready', description: 'Full ControlValueAccessor integration with intelligent auto-error detection. Works natively with ReactiveForms and NgModel.' },
                { icon: '🛡️', title: 'Atomic Design', description: 'Organized using Atomic Design principles — Atoms, Molecules, Organisms — giving you a clear and scalable architecture.' },
            ],
        },
        components: {
            title: 'Elegant UI Components',
            subtitle: 'Handcrafted components to speed up your development workflow.',
            exploreLink: 'Explore all components →',
            card1: { title: 'Project Overview', item1: { name: 'Revenue Report', updated: 'Updated 5h ago' }, item2: { name: 'New Customers', updated: 'Monthly report' }, btnViewDetails: 'View Details' },
            card2: { title: 'Quick Contact', labelName: 'Full Name', labelMessage: 'Message', placeholder: 'How can we help?', privacy: 'I agree to the privacy policy', btnSend: '➤ Send Message' },
        },
        themes: {
            title: 'Three Stunning Themes',
            subtitle: 'Switch themes at runtime — no recompilation needed.',
            base: { name: 'Base (Default)', description: 'Clean, modern and professional. Perfect for enterprise dashboards and SaaS products.' },
            glass: { name: 'Glassmorphism', description: 'Frosted glass effect with translucent surfaces and vivid depth. Stunning visual style.' },
            neo: { name: 'Neumorphism', description: 'Soft UI with extruded shadows for a tactile, clay-like feel. Sleek and futuristic design.' },
        },
        cta: {
            title: 'Ready to build something amazing?',
            subtitle: 'Join thousands of developers building enterprise applications with Codezium UI. Get started for free today.',
            btnDownload: 'Download Now',
            btnDocs: 'Read Documentation',
        },
        footer: {
            tagline: 'A modern UI toolkit for Angular developers who value performance and accessibility.',
            resources: 'RESOURCES', community: 'COMMUNITY', support: 'SUPPORT',
            links: { documentation: 'Documentation', components: 'Components', github: 'GitHub Repository', npm: 'NPM Package', discord: 'Discord Server', twitter: 'Twitter / X', discussions: 'GitHub Discussions', caseStudies: 'Case Studies', enterprise: 'Enterprise Support', faq: 'F.A.Q.', contact: 'Contact Us', privacy: 'Privacy Policy' },
            copyright: 'Built with ❤️ for the Angular community.',
        },
    },

    es: {
        nav: {
            features: 'Características', components: 'Componentes',
            themes: 'Temas', docs: 'Documentación', getStarted: 'Comenzar',
        },
        hero: {
            badge: 'Angular v20+ · Signals · Standalone',
            titleLine1: 'El Framework Angular',
            titleAccent: 'de Nueva',
            titleLine2: 'Generación',
            description: 'Crea aplicaciones web hermosas y de alto rendimiento con nuestra librería de componentes de nivel empresarial. Diseñada para la web moderna con Signals, Atomic Design y soporte completo de temas.',
            ctaPrimary: 'Empezar Ahora',
            ctaGithub: 'Ver en GitHub',
        },
        why: {
            title: '¿Por qué Codezium UI?',
            subtitle: 'Diseñado para aplicaciones empresariales de alto rendimiento con estética moderna.',
            features: [
                { icon: '⚡', title: 'Alto Rendimiento', description: 'Tamaños de bundle optimizados y renderizado ultrarrápido. Usamos los últimos Signals de Angular para que tu app sea siempre fluida.' },
                { icon: '🎨', title: 'Altamente Personalizable', description: 'Fácilmente temificable con variables CSS y tokens de diseño. Cambia entre Base, Glassmorphism y Neumorfismo en segundos.' },
                { icon: '♿', title: 'Accesible y Responsivo', description: 'Compatible con WCAG AA y diseño responsivo móvil primero. Accesibilidad de serie para todos los usuarios en cualquier dispositivo.' },
                { icon: '🌍', title: 'i18n Integrado', description: 'Mensajes de validación en 14 idiomas de serie: inglés, español, portugués, alemán, francés, ruso, árabe y más.' },
                { icon: '🔒', title: 'Listo para Angular Forms', description: 'Integración completa con ControlValueAccessor y detección automática de errores. Funciona con ReactiveForms y NgModel.' },
                { icon: '🛡️', title: 'Diseño Atómico', description: 'Organizado con principios de Atomic Design — Átomos, Moléculas, Organismos — con una arquitectura clara y escalable.' },
            ],
        },
        components: {
            title: 'Componentes UI Elegantes',
            subtitle: 'Componentes artesanales para acelerar tu flujo de desarrollo.',
            exploreLink: 'Explorar todos los componentes →',
            card1: { title: 'Resumen del Proyecto', item1: { name: 'Informe de Ingresos', updated: 'Actualizado hace 5h' }, item2: { name: 'Nuevos Clientes', updated: 'Informe mensual' }, btnViewDetails: 'Ver Detalles' },
            card2: { title: 'Contacto Rápido', labelName: 'Nombre Completo', labelMessage: 'Mensaje', placeholder: '¿Cómo podemos ayudarte?', privacy: 'Acepto la política de privacidad', btnSend: '➤ Enviar Mensaje' },
        },
        themes: {
            title: 'Tres Temas Impresionantes',
            subtitle: 'Cambia temas en tiempo de ejecución — sin recompilación.',
            base: { name: 'Base (Por defecto)', description: 'Limpio, moderno y profesional. Perfecto para dashboards empresariales y productos SaaS.' },
            glass: { name: 'Glassmorphism', description: 'Efecto de vidrio esmerilado con superficies translúcidas y profundidad vívida. Estilo visual impresionante.' },
            neo: { name: 'Neumorfismo', description: 'UI suave con sombras extruidas para una sensación táctil. Diseño elegante y futurista.' },
        },
        cta: {
            title: '¿Listo para construir algo increíble?',
            subtitle: 'Únete a miles de desarrolladores creando aplicaciones empresariales con Codezium UI. Comienza gratis hoy.',
            btnDownload: 'Descargar Ahora',
            btnDocs: 'Leer Documentación',
        },
        footer: {
            tagline: 'Un toolkit de UI moderno para desarrolladores Angular que valoran el rendimiento y la accesibilidad.',
            resources: 'RECURSOS', community: 'COMUNIDAD', support: 'SOPORTE',
            links: { documentation: 'Documentación', components: 'Componentes', github: 'Repositorio GitHub', npm: 'Paquete NPM', discord: 'Servidor Discord', twitter: 'Twitter / X', discussions: 'Discusiones GitHub', caseStudies: 'Casos de Estudio', enterprise: 'Soporte Empresarial', faq: 'Preguntas Frecuentes', contact: 'Contáctanos', privacy: 'Política de Privacidad' },
            copyright: 'Construido con ❤️ para la comunidad Angular.',
        },
    },

    pt: {
        nav: {
            features: 'Recursos', components: 'Componentes',
            themes: 'Temas', docs: 'Documentação', getStarted: 'Começar',
        },
        hero: {
            badge: 'Angular v20+ · Signals · Standalone',
            titleLine1: 'O Framework Angular',
            titleAccent: 'de Nova',
            titleLine2: 'Geração',
            description: 'Crie aplicações web belas e de alto desempenho com nossa biblioteca de componentes de nível empresarial. Projetada para a web moderna com Signals, Atomic Design e suporte completo a temas.',
            ctaPrimary: 'Começar Agora',
            ctaGithub: 'Ver no GitHub',
        },
        why: {
            title: 'Por que Codezium UI?',
            subtitle: 'Projetado para aplicações empresariais de alto desempenho com estética moderna.',
            features: [
                { icon: '⚡', title: 'Alto Desempenho', description: 'Tamanhos de bundle otimizados e renderização ultrarrápida. Usamos os Signals mais recentes do Angular.' },
                { icon: '🎨', title: 'Altamente Personalizável', description: 'Facilmente temático com variáveis CSS e tokens. Alterne entre Base, Glassmorphism e Neumorfismo em segundos.' },
                { icon: '♿', title: 'Acessível e Responsivo', description: 'Compatível com WCAG AA e design responsivo mobile-first. Acessibilidade pronta para todos.' },
                { icon: '🌍', title: 'i18n Integrado', description: 'Mensagens de validação em 14 idiomas: inglês, espanhol, português, alemão, francês, russo, árabe e mais.' },
                { icon: '🔒', title: 'Pronto para Angular Forms', description: 'Integração completa com ControlValueAccessor e detecção automática de erros com ReactiveForms.' },
                { icon: '🛡️', title: 'Design Atômico', description: 'Organizado com princípios de Atomic Design — Átomos, Moléculas, Organismos — para uma arquitetura escalável.' },
            ],
        },
        components: {
            title: 'Componentes UI Elegantes',
            subtitle: 'Componentes artesanais para acelerar seu fluxo de desenvolvimento.',
            exploreLink: 'Explorar todos os componentes →',
            card1: { title: 'Visão do Projeto', item1: { name: 'Relatório de Receita', updated: 'Atualizado há 5h' }, item2: { name: 'Novos Clientes', updated: 'Relatório mensal' }, btnViewDetails: 'Ver Detalhes' },
            card2: { title: 'Contato Rápido', labelName: 'Nome Completo', labelMessage: 'Mensagem', placeholder: 'Como podemos ajudar?', privacy: 'Concordo com a política de privacidade', btnSend: '➤ Enviar Mensagem' },
        },
        themes: {
            title: 'Três Temas Impressionantes',
            subtitle: 'Alterne temas em tempo de execução — sem recompilação.',
            base: { name: 'Base (Padrão)', description: 'Limpo, moderno e profissional. Perfeito para dashboards empresariais e produtos SaaS.' },
            glass: { name: 'Glassmorphism', description: 'Efeito de vidro fosco com superfícies translúcidas. Estilo visual impressionante.' },
            neo: { name: 'Neumorfismo', description: 'UI suave com sombras extrudidas para uma sensação tátil. Design elegante e futurista.' },
        },
        cta: {
            title: 'Pronto para construir algo incrível?',
            subtitle: 'Junte-se a milhares de desenvolvedores criando aplicações empresariais com Codezium UI. Comece gratuitamente hoje.',
            btnDownload: 'Baixar Agora',
            btnDocs: 'Ler Documentação',
        },
        footer: {
            tagline: 'Um toolkit de UI moderno para desenvolvedores Angular que valorizam desempenho e acessibilidade.',
            resources: 'RECURSOS', community: 'COMUNIDADE', support: 'SUPORTE',
            links: { documentation: 'Documentação', components: 'Componentes', github: 'Repositório GitHub', npm: 'Pacote NPM', discord: 'Servidor Discord', twitter: 'Twitter / X', discussions: 'Discussões GitHub', caseStudies: 'Estudos de Caso', enterprise: 'Suporte Empresarial', faq: 'Perguntas Frequentes', contact: 'Contate-nos', privacy: 'Política de Privacidade' },
            copyright: 'Construído com ❤️ para a comunidade Angular.',
        },
    },

    fr: {
        nav: {
            features: 'Fonctionnalités', components: 'Composants',
            themes: 'Thèmes', docs: 'Documentation', getStarted: 'Commencer',
        },
        hero: {
            badge: 'Angular v20+ · Signals · Standalone',
            titleLine1: 'Le Framework Angular',
            titleAccent: 'de Nouvelle',
            titleLine2: 'Génération',
            description: "Créez de belles applications web performantes avec notre bibliothèque de composants de niveau entreprise. Conçue pour le web moderne avec Signals, Atomic Design et un support complet des thèmes.",
            ctaPrimary: 'Commencer Maintenant',
            ctaGithub: 'Voir sur GitHub',
        },
        why: {
            title: 'Pourquoi Codezium UI ?',
            subtitle: "Conçu pour des applications d'entreprise haute performance avec une esthétique moderne.",
            features: [
                { icon: '⚡', title: 'Haute Performance', description: "Tailles de bundle optimisées et rendu ultra-rapide. Nous utilisons les derniers Signals d'Angular." },
                { icon: '🎨', title: 'Hautement Personnalisable', description: "Facilement thématisable avec des variables CSS. Passez entre Base, Glassmorphism et Neomorphism en secondes." },
                { icon: '♿', title: 'Accessible et Réactif', description: "Conforme WCAG AA et design réactif mobile-first. Accessibilité intégrée pour tous les utilisateurs." },
                { icon: '🌍', title: 'i18n Intégré', description: "Messages de validation en 14 langues : anglais, espagnol, portugais, allemand, français, russe, arabe et plus." },
                { icon: '🔒', title: 'Prêt pour Angular Forms', description: "Intégration complète ControlValueAccessor avec détection automatique des erreurs. Compatible ReactiveForms." },
                { icon: '🛡️', title: 'Atomic Design', description: "Organisé selon les principes d'Atomic Design — Atomes, Molécules, Organismes — pour une architecture scalable." },
            ],
        },
        components: {
            title: 'Composants UI Élégants',
            subtitle: 'Composants artisanaux pour accélérer votre flux de développement.',
            exploreLink: 'Explorer tous les composants →',
            card1: { title: 'Aperçu du Projet', item1: { name: "Rapport de Revenus", updated: 'Mis à jour il y a 5h' }, item2: { name: 'Nouveaux Clients', updated: 'Rapport mensuel' }, btnViewDetails: 'Voir les Détails' },
            card2: { title: 'Contact Rapide', labelName: 'Nom Complet', labelMessage: 'Message', placeholder: 'Comment pouvons-nous vous aider ?', privacy: "J'accepte la politique de confidentialité", btnSend: '➤ Envoyer le Message' },
        },
        themes: {
            title: 'Trois Thèmes Époustouflants',
            subtitle: 'Changez de thème au runtime — sans recompilation.',
            base: { name: 'Base (Défaut)', description: 'Propre, moderne et professionnel. Parfait pour les tableaux de bord d\'entreprise.' },
            glass: { name: 'Glassmorphism', description: 'Effet verre dépoli avec surfaces translucides. Style visuel époustouflant.' },
            neo: { name: 'Néomorphisme', description: 'UI douce avec ombres extrudées pour un rendu tactile. Design élégant et futuriste.' },
        },
        cta: {
            title: 'Prêt à construire quelque chose d\'incroyable ?',
            subtitle: 'Rejoignez des milliers de développeurs créant des applications d\'entreprise avec Codezium UI.',
            btnDownload: 'Télécharger',
            btnDocs: 'Lire la Documentation',
        },
        footer: {
            tagline: "Un toolkit UI moderne pour les développeurs Angular qui valorisent les performances et l'accessibilité.",
            resources: 'RESSOURCES', community: 'COMMUNAUTÉ', support: 'SUPPORT',
            links: { documentation: 'Documentation', components: 'Composants', github: 'Dépôt GitHub', npm: 'Package NPM', discord: 'Serveur Discord', twitter: 'Twitter / X', discussions: 'Discussions GitHub', caseStudies: "Études de Cas", enterprise: 'Support Entreprise', faq: 'F.A.Q.', contact: 'Nous Contacter', privacy: 'Politique de Confidentialité' },
            copyright: 'Construit avec ❤️ pour la communauté Angular.',
        },
    },

    de: {
        nav: {
            features: 'Funktionen', components: 'Komponenten',
            themes: 'Themen', docs: 'Dokumentation', getStarted: 'Loslegen',
        },
        hero: {
            badge: 'Angular v20+ · Signals · Standalone',
            titleLine1: 'Das Angular Framework',
            titleAccent: 'der Nächsten',
            titleLine2: 'Generation',
            description: 'Erstellen Sie schöne und leistungsstarke Webanwendungen mit unserer Komponentenbibliothek auf Unternehmensniveau. Entwickelt für das moderne Web mit Signals, Atomic Design und vollständiger Themenunterstützung.',
            ctaPrimary: 'Jetzt starten',
            ctaGithub: 'Auf GitHub ansehen',
        },
        why: {
            title: 'Warum Codezium UI?',
            subtitle: 'Entwickelt für leistungsstarke Unternehmensanwendungen mit moderner Ästhetik.',
            features: [
                { icon: '⚡', title: 'Hohe Leistung', description: 'Optimierte Bundle-Größen und blitzschnelles Rendering. Wir nutzen die neuesten Angular Signals.' },
                { icon: '🎨', title: 'Hochgradig Anpassbar', description: 'Einfach thematisierbar mit CSS-Variablen. Wechseln Sie zwischen Base, Glassmorphism und Neomorphism in Sekunden.' },
                { icon: '♿', title: 'Zugänglich & Responsiv', description: 'WCAG-AA-konform und Mobile-First-Design. Barrierefreiheit für alle Benutzer auf jedem Gerät.' },
                { icon: '🌍', title: 'i18n Eingebaut', description: 'Validierungsmeldungen in 14 Sprachen: Englisch, Spanisch, Portugiesisch, Deutsch, Französisch, Russisch, Arabisch und mehr.' },
                { icon: '🔒', title: 'Angular Forms Bereit', description: 'Vollständige ControlValueAccessor-Integration mit intelligenter Fehlererkennung. Funktioniert mit ReactiveForms und NgModel.' },
                { icon: '🛡️', title: 'Atomic Design', description: 'Nach Atomic Design-Prinzipien organisiert — Atome, Moleküle, Organismen — für eine klare und skalierbare Architektur.' },
            ],
        },
        components: {
            title: 'Elegante UI-Komponenten',
            subtitle: 'Handgefertigte Komponenten, um Ihren Entwicklungsworkflow zu beschleunigen.',
            exploreLink: 'Alle Komponenten erkunden →',
            card1: { title: 'Projektübersicht', item1: { name: 'Umsatzbericht', updated: 'Vor 5h aktualisiert' }, item2: { name: 'Neue Kunden', updated: 'Monatsbericht' }, btnViewDetails: 'Details anzeigen' },
            card2: { title: 'Schnellkontakt', labelName: 'Vollständiger Name', labelMessage: 'Nachricht', placeholder: 'Wie können wir helfen?', privacy: 'Ich stimme der Datenschutzrichtlinie zu', btnSend: '➤ Nachricht senden' },
        },
        themes: {
            title: 'Drei beeindruckende Themes',
            subtitle: 'Themes zur Laufzeit wechseln — keine Neukompilierung erforderlich.',
            base: { name: 'Basis (Standard)', description: 'Sauber, modern und professionell. Perfekt für Unternehmens-Dashboards und SaaS-Produkte.' },
            glass: { name: 'Glassmorphism', description: 'Mattglas-Effekt mit transluzenten Oberflächen. Beeindruckender visueller Stil.' },
            neo: { name: 'Neomorphismus', description: 'Weiche UI mit extrudierten Schatten für ein taktiles Gefühl. Elegantes und futuristisches Design.' },
        },
        cta: {
            title: 'Bereit, etwas Großartiges zu bauen?',
            subtitle: 'Schließen Sie sich Tausenden von Entwicklern an, die Unternehmensanwendungen mit Codezium UI erstellen.',
            btnDownload: 'Jetzt herunterladen',
            btnDocs: 'Dokumentation lesen',
        },
        footer: {
            tagline: 'Ein modernes UI-Toolkit für Angular-Entwickler, die Leistung und Barrierefreiheit schätzen.',
            resources: 'RESSOURCEN', community: 'GEMEINSCHAFT', support: 'SUPPORT',
            links: { documentation: 'Dokumentation', components: 'Komponenten', github: 'GitHub-Repository', npm: 'NPM-Paket', discord: 'Discord-Server', twitter: 'Twitter / X', discussions: 'GitHub-Diskussionen', caseStudies: 'Fallstudien', enterprise: 'Unternehmens-Support', faq: 'Häufige Fragen', contact: 'Kontakt', privacy: 'Datenschutzrichtlinie' },
            copyright: 'Mit ❤️ für die Angular-Community erstellt.',
        },
    },
};

export const HOME_LOCALES: Array<{ code: HomeLocale; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];
