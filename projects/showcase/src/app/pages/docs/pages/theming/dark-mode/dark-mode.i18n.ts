export const DARK_MODE_I18N = {
    en: {
        title: 'Dark Mode',
        lead: 'Codezium UI comes with first-class Dark Mode support. Every theme (Base, Glass, Neo) is fully optimized for low-light environments out of the box.',
        whatIs: {
            title: 'How it Works',
            p1: 'Codezium UI handles Dark Mode natively via CSS variables. When the <code>.dark</code> class is applied, the framework automatically swaps all the semantic tokens (like <code>--cz-theme-surface</code> or <code>--cz-theme-text-primary</code>) to their dark equivalents.',
            p2: 'This guarantees absolutely zero JavaScript calculations during runtime, zero Flash of Unstyled Content (FOUC), and an instant transition for the user.'
        },
        usage: {
            title: 'Activating Dark Mode',
            p1: 'To activate Dark Mode, simply attach the <code>dark</code> class to any parent element. To apply it globally, attach it exactly to the element that holds your <code>data-theme</code> attribute (usually <code>&lt;html&gt;</code>).',
            code: `<html lang="en" data-theme="base" class="dark">`
        },
        nesting: {
            title: 'Local Dark Mode',
            p1: 'Just like themes, Dark Mode can be applied locally to any component or section of your application without affecting the rest of the page.',
            code: `<body data-theme="base">
  <!-- Light Mode by default -->
  <cz-input-text label="Light Input" />

  <!-- This specific container forces Dark Mode -->
  <div class="dark cz-p-md" data-theme="glass">
    <cz-input-text label="Dark Glass Input" />
  </div>
</body>`
        }
    },
    es: {
        title: 'Modo Oscuro (Dark Mode)',
        lead: 'Codezium UI viene con soporte de primera clase para Modo Oscuro. Cada tema (Base, Glass, Neo) está totalmente optimizado para entornos con poca luz de fábrica.',
        whatIs: {
            title: 'Cómo Funciona',
            p1: 'Codezium UI maneja el Modo Oscuro nativamente a través de variables CSS. Cuando se aplica la clase <code>.dark</code>, el framework intercambia automáticamente todos los tokens semánticos (como <code>--cz-theme-surface</code>) a sus equivalentes oscuros.',
            p2: 'Esto garantiza absolutamente cero cálculos JavaScript durante la ejecución, cero parpadeos (FOUC) y una transición instantánea para el usuario.'
        },
        usage: {
            title: 'Activando el Modo Oscuro',
            p1: 'Para activar el Modo Oscuro, simplemente añade la clase <code>dark</code> a cualquier elemento padre. Para aplicarlo globalmente, añádelo exactamente al elemento que tiene tu atributo <code>data-theme</code> (usualmente <code>&lt;html&gt;</code>).',
            code: `<html lang="es" data-theme="base" class="dark">`
        },
        nesting: {
            title: 'Modo Oscuro Local',
            p1: 'Al igual que los temas, el Modo Oscuro puede aplicarse localmente a cualquier componente o sección de tu aplicación sin afectar el resto de la página.',
            code: `<body data-theme="base">
  <!-- Modo Claro por defecto -->
  <cz-input-text label="Input Claro" />

  <!-- Este contenedor específico fuerza el Modo Oscuro -->
  <div class="dark cz-p-md" data-theme="glass">
    <cz-input-text label="Input Glass Oscuro" />
  </div>
</body>`
        }
    },
    pt: {
        title: 'Modo Escuro (Dark Mode)',
        lead: 'O Codezium UI vem com suporte de primeira classe para o Modo Escuro. Cada tema (Base, Glass, Neo) é totalmente otimizado para ambientes com pouca luz de fábrica.',
        whatIs: {
            title: 'Como Funciona',
            p1: 'O Codezium UI lida com o Modo Escuro nativamente por meio de variáveis CSS. Quando a classe <code>.dark</code> é aplicada, o framework troca automaticamente todos os tokens semânticos (como <code>--cz-theme-surface</code>) para seus equivalentes escuros.',
            p2: 'Isso garante absolutamente nenhum cálculo JavaScript em tempo de execução, zero piscadas (FOUC) e uma transição instantânea para o usuário.'
        },
        usage: {
            title: 'Ativando o Modo Escuro',
            p1: 'Para ativar o Modo Escuro, basta adicionar a classe <code>dark</code> a qualquer elemento pai. Para aplicá-lo globalmente, anexe exatamente ao elemento que contém o seu atributo <code>data-theme</code> (geralmente <code>&lt;html&gt;</code>).',
            code: `<html lang="pt" data-theme="base" class="dark">`
        },
        nesting: {
            title: 'Modo Escuro Local',
            p1: 'Assim como os temas, o Modo Escuro pode ser aplicado localmente a qualquer componente ou seção do seu aplicativo sem afetar o resto da página.',
            code: `<body data-theme="base">
  <!-- Modo Claro por padrão -->
  <cz-input-text label="Input Claro" />

  <!-- Este contêiner específico força o Modo Escuro -->
  <div class="dark cz-p-md" data-theme="glass">
    <cz-input-text label="Input Glass Escuro" />
  </div>
</body>`
        }
    },
    fr: {
        title: 'Mode Sombre (Dark Mode)',
        lead: 'Codezium UI offre un support de premier ordre pour le Mode Sombre. Chaque thème (Base, Glass, Neo) est entièrement optimisé pour les environnements peu éclairés.',
        whatIs: {
            title: 'Comment ça Marche',
            p1: 'Codezium UI gère le Mode Sombre nativement via des variables CSS. Lorsque la classe <code>.dark</code> est appliquée, le framework échange automatiquement tous les tokens sémantiques (comme <code>--cz-theme-surface</code>) vers leurs équivalents sombres.',
            p2: 'Cela garantit zéro calcul JavaScript à l\'exécution, aucun clignotement (FOUC) et une transition instantanée pour l\'utilisateur.'
        },
        usage: {
            title: 'Activer le Mode Sombre',
            p1: 'Pour activer le Mode Sombre, ajoutez simplement la classe <code>dark</code> à n\'importe quel élément parent. Pour l\'appliquer globalement, attachez-la exactement à l\'élément contenant votre attribut <code>data-theme</code> (généralement <code>&lt;html&gt;</code>).',
            code: `<html lang="fr" data-theme="base" class="dark">`
        },
        nesting: {
            title: 'Mode Sombre Local',
            p1: 'Tout comme les thèmes, le Mode Sombre peut être appliqué localement à n\'importe quel composant ou section de votre application sans affecter le reste de la page.',
            code: `<body data-theme="base">
  <!-- Mode Clair par défaut -->
  <cz-input-text label="Input Clair" />

  <!-- Ce conteneur spécifique force le Mode Sombre -->
  <div class="dark cz-p-md" data-theme="glass">
    <cz-input-text label="Input Glass Sombre" />
  </div>
</body>`
        }
    },
    de: {
        title: 'Dark Mode',
        lead: 'Codezium UI bietet erstklassige Dark Mode Unterstützung. Jedes Theme (Base, Glass, Neo) ist standardmäßig vollständig für Umgebungen mit wenig Licht optimiert.',
        whatIs: {
            title: 'Wie es funktioniert',
            p1: 'Codezium UI handhabt den Dark Mode nativ über CSS-Variablen. Wenn die Klasse <code>.dark</code> angewendet wird, tauscht das Framework automatisch alle semantischen Tokens (wie <code>--cz-theme-surface</code>) gegen ihre dunklen Entsprechungen aus.',
            p2: 'Dies garantiert absolut keine JavaScript-Berechnungen zur Laufzeit, kein Flackern (FOUC) und einen sofortigen Übergang für den Benutzer.'
        },
        usage: {
            title: 'Dark Mode aktivieren',
            p1: 'Um den Dark Mode zu aktivieren, fügen Sie einfach die Klasse <code>dark</code> zu einem beliebigen übergeordneten Element hinzu. Um ihn global anzuwenden, hängen Sie diese genau an das Element an, das Ihr <code>data-theme</code>-Attribut enthält (normalerweise <code>&lt;html&gt;</code>).',
            code: `<html lang="de" data-theme="base" class="dark">`
        },
        nesting: {
            title: 'Lokaler Dark Mode',
            p1: 'Genau wie Themes kann auch der Dark Mode lokal auf jede Komponente oder jeden Bereich Ihrer Anwendung angewendet werden, ohne den Rest der Seite zu beeinflussen.',
            code: `<body data-theme="base">
  <!-- Standardmäßig Light Mode -->
  <cz-input-text label="Heller Input" />

  <!-- Dieser spezifische Container erzwingt den Dark Mode -->
  <div class="dark cz-p-md" data-theme="glass">
    <cz-input-text label="Dunkler Glass Input" />
  </div>
</body>`
        }
    }
};
