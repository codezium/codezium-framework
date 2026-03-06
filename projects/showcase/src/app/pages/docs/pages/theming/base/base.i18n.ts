export const BASE_THEME_I18N = {
    en: {
        title: 'Base Theme',
        lead: 'The foundation of Codezium UI. A clean, minimal, and fully tokenized CSS variable system that adapts to light and dark modes natively.',
        whatIs: {
            title: 'What is the Base Theme?',
            p1: 'The Base Theme is the default look and feel of the framework. It maps primitive color tokens (like <code>--cz-blue-500</code>) to semantic variables (like <code>--cz-color-primary</code>) and finally to component-level variables (like <code>--cz-theme-surface</code>).',
            p2: 'It relies on standard CSS properties like borders, solid backgrounds, and subtle box-shadows, ensuring maximum compatibility and performance.'
        },
        usage: {
            title: 'Usage',
            p1: 'The Base Theme is active by default. However, you can explicitly scope it to any section or the entire app using the <code>data-theme</code> attribute.',
            code: `<html lang="en" data-theme="base">`
        },
        variables: {
            title: 'Core Semantic Tokens',
            p1: 'These are the primary variables exposed by the Base Theme. They automatically invert their values when the <code>.dark</code> class is present.',
            table: {
                token: 'CSS Token',
                light: 'Light Value',
                dark: 'Dark Value',
                desc: 'Description'
            },
            surface: { desc: 'Main background color for cards, modals, and input fields.' },
            surfaceHover: { desc: 'Background color on hover state for interactive surfaces.' },
            textPrimary: { desc: 'Main text color for high contrast readability.' },
            textSecondary: { desc: 'Secondary text color for descriptions and subtitles.' },
            border: { desc: 'Default border color for dividers and outlines.' }
        }
    },
    es: {
        title: 'Tema Base',
        lead: 'La base de Codezium UI. Un sistema de variables CSS limpio, minimalista y completamente tokenizado que se adapta a los modos claro y oscuro de forma nativa.',
        whatIs: {
            title: '¿Qué es el Tema Base?',
            p1: 'El Tema Base es el aspecto visual por defecto del framework. Mapea tokens de colores primitivos (como <code>--cz-blue-500</code>) a variables semánticas (como <code>--cz-color-primary</code>) y finalmente a variables de componentes (como <code>--cz-theme-surface</code>).',
            p2: 'Se basa en propiedades CSS estándar como bordes, fondos sólidos y sutiles sombras de caja (box-shadows), garantizando la máxima compatibilidad y rendimiento.'
        },
        usage: {
            title: 'Uso',
            p1: 'El Tema Base está activo por defecto. Sin embargo, puedes limitarlo explícitamente a cualquier sección o a toda la aplicación usando el atributo <code>data-theme</code>.',
            code: `<html lang="es" data-theme="base">`
        },
        variables: {
            title: 'Tokens Semánticos Principales',
            p1: 'Estas son las variables primarias expuestas por el Tema Base. Invierten automáticamente sus valores cuando la clase <code>.dark</code> está presente.',
            table: {
                token: 'Token CSS',
                light: 'Valor Claro',
                dark: 'Valor Oscuro',
                desc: 'Descripción'
            },
            surface: { desc: 'Color de fondo principal para tarjetas, modales y campos de entrada.' },
            surfaceHover: { desc: 'Color de fondo en estado hover para superficies interactivas.' },
            textPrimary: { desc: 'Color de texto principal para legibilidad de alto contraste.' },
            textSecondary: { desc: 'Color de texto secundario para descripciones y subtítulos.' },
            border: { desc: 'Color de borde por defecto para divisores y contornos.' }
        }
    },
    pt: {
        title: 'Tema Base',
        lead: 'A base do Codezium UI. Um sistema de variáveis CSS limpo, minimalista e totalmente tokenizado que se adapta aos modos claro e escuro nativamente.',
        whatIs: {
            title: 'O que é o Tema Base?',
            p1: 'O Tema Base é o visual padrão do framework. Ele mapeia tokens de cores primitivas (como <code>--cz-blue-500</code>) para variáveis semânticas (como <code>--cz-color-primary</code>) e, finalmente, para variáveis de componentes (como <code>--cz-theme-surface</code>).',
            p2: 'Ele depende de propriedades CSS padrão, como bordas, fundos sólidos e sombras de caixa (box-shadows) sutis, garantindo máxima compatibilidade e desempenho.'
        },
        usage: {
            title: 'Uso',
            p1: 'O Tema Base está ativo por padrão. No entanto, você pode limitá-lo explicitamente a qualquer seção ou a todo o aplicativo usando o atributo <code>data-theme</code>.',
            code: `<html lang="pt" data-theme="base">`
        },
        variables: {
            title: 'Tokens Semânticos Principais',
            p1: 'Estas são as variáveis primárias expostas pelo Tema Base. Elas invertem automaticamente seus valores quando a classe <code>.dark</code> está presente.',
            table: {
                token: 'Token CSS',
                light: 'Valor Claro',
                dark: 'Valor Escuro',
                desc: 'Descrição'
            },
            surface: { desc: 'Cor de fundo principal para cartões, modais e campos de entrada.' },
            surfaceHover: { desc: 'Cor de fundo no estado hover para superfícies interativas.' },
            textPrimary: { desc: 'Cor de texto principal para legibilidade de alto contraste.' },
            textSecondary: { desc: 'Cor de texto secundária para descrições e subtítulos.' },
            border: { desc: 'Cor de borda padrão para divisores e contornos.' }
        }
    },
    fr: {
        title: 'Thème Base',
        lead: 'La fondation de Codezium UI. Un système de variables CSS épuré, minimaliste et entièrement paramétré qui s\'adapte nativement aux modes clair et sombre.',
        whatIs: {
            title: 'Qu\'est-ce que le Thème Base ?',
            p1: 'Le Thème Base est l\'apparence par défaut du framework. Il mappe des tokens de couleurs primaires (comme <code>--cz-blue-500</code>) à des variables sémantiques (comme <code>--cz-color-primary</code>) et enfin à des variables de composants (comme <code>--cz-theme-surface</code>).',
            p2: 'Il repose sur des propriétés CSS standards telles que les bordures, les arrière-plans unis et de subtiles ombres portées (box-shadows), garantissant une compatibilité et des performances maximales.'
        },
        usage: {
            title: 'Utilisation',
            p1: 'Le Thème Base est actif par défaut. Cependant, vous pouvez le limiter explicitement à n\'importe quelle section ou à toute l\'application en utilisant l\'attribut <code>data-theme</code>.',
            code: `<html lang="fr" data-theme="base">`
        },
        variables: {
            title: 'Tokens Sémantiques Principaux',
            p1: 'Ce sont les variables principales exposées par le Thème Base. Elles inversent automatiquement leurs valeurs lorsque la classe <code>.dark</code> est présente.',
            table: {
                token: 'Token CSS',
                light: 'Valeur Claire',
                dark: 'Valeur Sombre',
                desc: 'Description'
            },
            surface: { desc: 'Couleur d\'arrière-plan principale pour les cartes, modales et champs de saisie.' },
            surfaceHover: { desc: 'Couleur d\'arrière-plan au survol pour les surfaces interactives.' },
            textPrimary: { desc: 'Couleur de texte principale pour une lisibilité à fort contraste.' },
            textSecondary: { desc: 'Couleur de texte secondaire pour les descriptions et sous-titres.' },
            border: { desc: 'Couleur de bordure par défaut pour les séparateurs et contours.' }
        }
    },
    de: {
        title: 'Base Theme',
        lead: 'Das Fundament von Codezium UI. Ein klares, minimalistisches und vollständig tokenisiertes CSS-Variablensystem, das sich nativ an helle und dunkle Modi anpasst.',
        whatIs: {
            title: 'Was ist das Base Theme?',
            p1: 'Das Base Theme ist das Standard-Aussehen des Frameworks. Es ordnet primitive Farb-Tokens (wie <code>--cz-blue-500</code>) semantischen Variablen (wie <code>--cz-color-primary</code>) und schließlich Komponenten-Variablen (wie <code>--cz-theme-surface</code>) zu.',
            p2: 'Es verlässt sich auf Standard-CSS-Eigenschaften wie Rahmen, einfarbige Hintergründe und subtile Box-Shadows und gewährleistet so maximale Kompatibilität und Leistung.'
        },
        usage: {
            title: 'Verwendung',
            p1: 'Das Base Theme ist standardmäßig aktiv. Sie können es jedoch mit dem Attribut <code>data-theme</code> explizit auf jeden Bereich oder die gesamte App anwenden.',
            code: `<html lang="de" data-theme="base">`
        },
        variables: {
            title: 'Wichtige Semantische Tokens',
            p1: 'Dies sind die primären Variablen, die vom Base Theme bereitgestellt werden. Sie kehren ihre Werte automatisch um, wenn die Klasse <code>.dark</code> vorhanden ist.',
            table: {
                token: 'CSS Token',
                light: 'Heller Wert',
                dark: 'Dunkler Wert',
                desc: 'Beschreibung'
            },
            surface: { desc: 'Haupthintergrundfarbe für Karten, Modale und Eingabefelder.' },
            surfaceHover: { desc: 'Hintergrundfarbe im Hover-Status für interaktive Oberflächen.' },
            textPrimary: { desc: 'Haupttextfarbe für kontrastreiche Lesbarkeit.' },
            textSecondary: { desc: 'Sekundäre Textfarbe für Beschreibungen und Untertitel.' },
            border: { desc: 'Standardrahmenfarbe für Trennlinien und Umrisse.' }
        }
    }
};
