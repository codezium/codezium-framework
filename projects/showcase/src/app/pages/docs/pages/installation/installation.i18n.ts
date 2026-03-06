export const INSTALL_I18N = {
    en: {
        title: 'Installation',
        lead: 'Get Codezium UI up and running in your Angular project in minutes.',
        reqs: {
            title: 'System Requirements',
            p1: 'Codezium UI is built exclusively for modern Angular applications and relies heavily on Signals and standalone components. Ensure your environment meets the following requirements:',
            li1: '<strong>Angular</strong>: v20.0.0 or higher',
            li2: '<strong>Node.js</strong>: v18.19.0 or higher'
        },
        npm: {
            title: '1. Install Package',
            p1: 'Run the following command in your terminal to install the Codezium UI library via npm:',
            code: 'npm install codezium-ui'
        },
        styles: {
            title: '2. Import Styles',
            p1: 'The foundation of the theming system lies in the core CSS file. In your <code>angular.json</code>, add the styles entry under the build options:',
            code: `// angular.json
"styles": [
  "node_modules/codezium-ui/styles/codezium.css",
  "src/styles.scss"
]`
        },
        icons: {
            title: '3. Setup Icons (Optional)',
            p1: 'Codezium UI components use <a href="https://lucide.dev/icons/" target="_blank" class="cz-text-primary">Lucide Icons</a> internally as SVGs. If you wish to use them in your own application, you can optionally install their Angular package:',
            code: 'npm install lucide-angular'
        },
        usage: {
            title: '4. First Component',
            p1: 'Import any standalone component directly into your application. No NgModules required.',
            code: `import { Component } from '@angular/core';
import { CzInputTextComponent } from 'codezium-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CzInputTextComponent],
  template: \`
    <div data-theme="base">
      <cz-input-text label="Email Address" />
    </div>
  \`
})
export class AppComponent {}`
        },
        nextSteps: {
            title: 'Next Steps',
            p1: 'Configure your preferred theme in the root element or dive deeper into the documentation.',
        }
    },
    es: {
        title: 'Instalación',
        lead: 'Empieza a usar Codezium UI en tu proyecto Angular en minutos.',
        reqs: {
            title: 'Requisitos del Sistema',
            p1: 'Codezium UI está construido exclusivamente para aplicaciones Angular modernas y depende en gran medida de Signals y componentes standalone. Asegúrate de que tu entorno cumpla con los siguientes requisitos:',
            li1: '<strong>Angular</strong>: v20.0.0 o superior',
            li2: '<strong>Node.js</strong>: v18.19.0 o superior'
        },
        npm: {
            title: '1. Instalar el Paquete',
            p1: 'Ejecuta el siguiente comando en tu terminal para instalar la librería Codezium UI vía npm:',
            code: 'npm install codezium-ui'
        },
        styles: {
            title: '2. Importar Estilos',
            p1: 'La base del sistema de temas reside en el archivo CSS principal. En tu <code>angular.json</code>, añade la ruta de los estilos en las opciones de build:',
            code: `// angular.json
"styles": [
  "node_modules/codezium-ui/styles/codezium.css",
  "src/styles.scss"
]`
        },
        icons: {
            title: '3. Configurar Iconos (Opcional)',
            p1: 'Los componentes de Codezium UI utilizan <a href="https://lucide.dev/icons/" target="_blank" class="cz-text-primary">Lucide Icons</a> internamente como SVGs. Si deseas usarlos en tu propia aplicación, puedes instalar su paquete para Angular de forma opcional:',
            code: 'npm install lucide-angular'
        },
        usage: {
            title: '4. Primer Componente',
            p1: 'Importa cualquier componente standalone directamente a tu aplicación. Sin necesidad de usar NgModules.',
            code: `import { Component } from '@angular/core';
import { CzInputTextComponent } from 'codezium-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CzInputTextComponent],
  template: \`
    <div data-theme="base">
      <cz-input-text label="Correo Electrónico" />
    </div>
  \`
})
export class AppComponent {}`
        },
        nextSteps: {
            title: 'Siguientes Pasos',
            p1: 'Configura tu tema preferido en el elemento raíz o explora a fondo la documentación.',
        }
    },
    pt: {
        title: 'Instalação',
        lead: 'Comece a usar o Codezium UI no seu projeto Angular em minutos.',
        reqs: {
            title: 'Requisitos do Sistema',
            p1: 'O Codezium UI foi desenvolvido exclusivamente para aplicações Angular modernas e depende fortemente de Signals e componentes standalone. Certifique-se de que o seu ambiente atenda aos seguintes requisitos:',
            li1: '<strong>Angular</strong>: v20.0.0 ou superior',
            li2: '<strong>Node.js</strong>: v18.19.0 ou superior'
        },
        npm: {
            title: '1. Instalar o Pacote',
            p1: 'Execute o seguinte comando no seu terminal para instalar a biblioteca Codezium UI via npm:',
            code: 'npm install codezium-ui'
        },
        styles: {
            title: '2. Importar Estilos',
            p1: 'A base do sistema de temas está no arquivo CSS principal. No seu <code>angular.json</code>, adicione a entrada de estilos nas opções de build:',
            code: `// angular.json
"styles": [
  "node_modules/codezium-ui/styles/codezium.css",
  "src/styles.scss"
]`
        },
        icons: {
            title: '3. Configurar Ícones (Opcional)',
            p1: 'Os componentes do Codezium UI usam o <a href="https://lucide.dev/icons/" target="_blank" class="cz-text-primary">Lucide Icons</a> internamente como SVGs. Se você quiser usá-los no seu próprio aplicativo, você pode instalar opcionalmente o pacote Angular deles:',
            code: 'npm install lucide-angular'
        },
        usage: {
            title: '4. Primeiro Componente',
            p1: 'Importe qualquer componente standalone diretamente para o seu aplicativo. Não são necessários NgModules.',
            code: `import { Component } from '@angular/core';
import { CzInputTextComponent } from 'codezium-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CzInputTextComponent],
  template: \`
    <div data-theme="base">
      <cz-input-text label="Endereço de Email" />
    </div>
  \`
})
export class AppComponent {}`
        },
        nextSteps: {
            title: 'Próximos Passos',
            p1: 'Configure o seu tema preferido no elemento raiz ou explore mais a documentação.',
        }
    },
    fr: {
        title: 'Installation',
        lead: 'Déployez Codezium UI dans votre projet Angular en quelques minutes.',
        reqs: {
            title: 'Configuration Requise',
            p1: 'Codezium UI est exclusivement conçu pour des applications Angular modernes s\'appuyant sur les Signals et les composants standalone. Assurez-vous des points suivants :',
            li1: '<strong>Angular</strong> : v20.0.0 ou supérieur',
            li2: '<strong>Node.js</strong> : v18.19.0 ou supérieur'
        },
        npm: {
            title: '1. Installer le Paquet',
            p1: 'Exécutez la commande suivante dans votre terminal pour installer la librairie Codezium UI via npm :',
            code: 'npm install codezium-ui'
        },
        styles: {
            title: '2. Importer les Styles',
            p1: 'La base du système de thèmes se trouve dans le fichier CSS principal. Dans votre <code>angular.json</code>, ajoutez les styles sous les options de build :',
            code: `// angular.json
"styles": [
  "node_modules/codezium-ui/styles/codezium.css",
  "src/styles.scss"
]`
        },
        icons: {
            title: '3. Configurer les Icônes (Optionnel)',
            p1: 'Les composants de Codezium UI utilisent les <a href="https://lucide.dev/icons/" target="_blank" class="cz-text-primary">Lucide Icons</a> en interne comme SVG. Pour votre propre projet, vous pouvez installer leur package Angular :',
            code: 'npm install lucide-angular'
        },
        usage: {
            title: '4. Premier Composant',
            p1: 'Importez n\'importe quel composant standalone directement dans votre application. Aucun NgModule requis.',
            code: `import { Component } from '@angular/core';
import { CzInputTextComponent } from 'codezium-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CzInputTextComponent],
  template: \`
    <div data-theme="base">
      <cz-input-text label="Adresse Email" />
    </div>
  \`
})
export class AppComponent {}`
        },
        nextSteps: {
            title: 'Étapes Suivantes',
            p1: 'Configurez votre thème préféré sur l\'élément racine ou explorez la documentation.',
        }
    },
    de: {
        title: 'Installation',
        lead: 'Starten Sie mit Codezium UI in Ihrem Angular Projekt in wenigen Minuten.',
        reqs: {
            title: 'Systemanforderungen',
            p1: 'Codezium UI wurde ausschließlich für moderne Angular-Anwendungen entwickelt und basiert stark auf Signals und Standalone-Komponenten. Stellen Sie Folgendes sicher:',
            li1: '<strong>Angular</strong>: v20.0.0 oder höher',
            li2: '<strong>Node.js</strong>: v18.19.0 oder höher'
        },
        npm: {
            title: '1. Paket installieren',
            p1: 'Führen Sie folgenden Befehl in Ihrem Terminal aus, um die Codezium UI-Bibliothek über npm zu installieren:',
            code: 'npm install codezium-ui'
        },
        styles: {
            title: '2. Styles importieren',
            p1: 'Die Grundlage des Theming-Systems ist die CSS-Hauptdatei. Fügen Sie in Ihrer <code>angular.json</code> den Styles-Eintrag unter den Build-Optionen hinzu:',
            code: `// angular.json
"styles": [
  "node_modules/codezium-ui/styles/codezium.css",
  "src/styles.scss"
]`
        },
        icons: {
            title: '3. Icons einrichten (Optional)',
            p1: 'Die Komponenten verwenden intern <a href="https://lucide.dev/icons/" target="_blank" class="cz-text-primary">Lucide Icons</a> als SVGs. Wenn Sie diese Icons in Ihrer Anwendung verwenden möchten, können Sie das Angular-Paket installieren:',
            code: 'npm install lucide-angular'
        },
        usage: {
            title: '4. Erste Komponente',
            p1: 'Importieren Sie alle Standalone-Komponenten direkt in Ihre Anwendung. Es werden keine NgModules benötigt.',
            code: `import { Component } from '@angular/core';
import { CzInputTextComponent } from 'codezium-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CzInputTextComponent],
  template: \`
    <div data-theme="base">
      <cz-input-text label="E-Mail-Adresse" />
    </div>
  \`
})
export class AppComponent {}`
        },
        nextSteps: {
            title: 'Nächste Schritte',
            p1: 'Konfigurieren Sie Ihr gewünschtes Theme im Root-Element oder werfen Sie einen Blick in die tiefergehende Dokumentation.',
        }
    }
};
