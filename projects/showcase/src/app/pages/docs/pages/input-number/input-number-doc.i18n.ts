export const INPUT_NUMBER_DOC_I18N = {
    en: {
        title: 'InputNumber',
        lead: 'InputNumber is an angular directive that formats and parses numerical values using Internationalization (Intl), supporting decimals, currency, min/max limits, and more independently of the visual element.',

        importTitle: 'Import',
        importCode: `import { CzInputNumberDirective } from 'codezium-ui';`,

        numeralsTitle: 'Numerals',
        numeralsDesc: 'InputNumber is used as a directive with the <code>czInputNumber</code> attribute. It can be applied on <code>&#x3C;cz-input-text&#x3E;</code> or native <code>&#x3C;input&#x3E;</code> tags. It formats strict decimal types ensuring the underlying value is a JavaScript number.',

        currencyTitle: 'Currency',
        currencyDesc: 'Currency formatting is specified by setting the <code>mode</code> property to <code>currency</code> and providing the <code>currency</code> code property (e.g., USD, EUR). It utilizes the native Intl API to render symbols and formats accordingly.',

        prefixSuffixTitle: 'Prefix & Suffix',
        prefixSuffixDesc: 'In decimal mode, you can assign custom text before or after the input visually using the <code>prefix</code> and <code>suffix</code> properties without altering the numerical value.',

        constraintsTitle: 'Min-Max Boundaries & Fractions',
        constraintsDesc: 'Boundaries are provided using <code>min</code> and <code>max</code> properties. If the user types a value out of range, the value is securely capped upon losing focus. You can also specify <code>minFractionDigits</code> and <code>maxFractionDigits</code>.',

        nativeTitle: 'Native Input Integration',
        nativeDesc: 'As a directive, <code>czInputNumber</code> works beautifully on standard HTML <code>&#x3C;input&#x3E;</code> fields. The directive automatically bubbles the validation, event handlers, and parsing formatting.',

        apiTitle: 'API Reference',
        table: {
            prop: 'Property',
            type: 'Type',
            default: 'Default',
            desc: 'Description'
        }
    },
    es: {
        title: 'InputNumber',
        lead: 'InputNumber es una directiva angular que formatea y parsea valores numéricos utilizando Internacionalización (Intl), soportando decimales, moneda, límites mínimos/máximos y más de manera independiente al elemento visual.',

        importTitle: 'Importación',
        importCode: `import { CzInputNumberDirective } from 'codezium-ui';`,

        numeralsTitle: 'Números y Decimales',
        numeralsDesc: 'InputNumber se utiliza como una directiva con el atributo <code>czInputNumber</code>. Puede aplicarse sobre etiquetas <code>&#x3C;cz-input-text&#x3E;</code> o <code>&#x3C;input&#x3E;</code> nativo. Formatea tipos decimales estrictos asegurando que el valor subyacente sea un número puro de JavaScript.',

        currencyTitle: 'Formato de Moneda',
        currencyDesc: 'El formateo de moneda se especifica configurando la propiedad <code>mode</code> en <code>currency</code> y proporcionando el código <code>currency</code> (ej: USD, EUR). Utiliza la API nativa Intl para renderizar símbolos y formatos automáticamente.',

        prefixSuffixTitle: 'Prefijos y Sufijos',
        prefixSuffixDesc: 'En modo decimal, puedes asignar un texto personalizado visual antes o después del texto usando las propiedades <code>prefix</code> y <code>suffix</code> sin alterar el valor numérico interno.',

        constraintsTitle: 'Límites, Topes y Fracciones',
        constraintsDesc: 'Los topes son provistos utilizando las propiedades <code>min</code> y <code>max</code>. Si el usuario ingresa un valor fuera de rango, éste se restringe y corrige al perder el foco. También puedes configurar <code>minFractionDigits</code> y <code>maxFractionDigits</code>.',

        nativeTitle: 'Integración con Input Nativo',
        nativeDesc: 'Como directiva, <code>czInputNumber</code> funciona hermosamente en campos HTML estándar de tipo <code>&#x3C;input&#x3E;</code>. La directiva automáticamente aplica la validación, filtrado de eventos de teclado y formato visual.',

        apiTitle: 'Referencia API',
        table: {
            prop: 'Propiedad',
            type: 'Tipo',
            default: 'Defecto',
            desc: 'Descripción'
        }
    },
    pt: {
        title: 'InputNumber',
        lead: 'InputNumber é uma diretiva angular que formata e converte valores numéricos usando Internacionalização (Intl), com suporte para decimais, moeda, limites mín/máx e mais de forma independente do elemento visual.',

        importTitle: 'Importação',
        importCode: `import { CzInputNumberDirective } from 'codezium-ui';`,

        numeralsTitle: 'Numerais',
        numeralsDesc: 'O InputNumber é usado como uma diretiva com o atributo <code>czInputNumber</code>. Ele pode ser aplicado a tags <code>&#x3C;cz-input-text&#x3E;</code> ou <code>&#x3C;input&#x3E;</code> nativas. Ele formata tipos decimais estritos garantindo que o valor subjacente seja um número JavaScript.',

        currencyTitle: 'Moeda',
        currencyDesc: 'A formatação de moeda é especificada definindo a propriedade <code>mode</code> como <code>currency</code> e fornecendo o código <code>currency</code> (ex: USD, EUR). Utiliza a API Intl nativa para renderizar símbolos e formatos de acordo.',

        prefixSuffixTitle: 'Prefixo e Sufixo',
        prefixSuffixDesc: 'No modo decimal, você pode atribuir um texto personalizado antes ou depois do input visualmente usando as propriedades <code>prefix</code> e <code>suffix</code> sem alterar o valor numérico interno.',

        constraintsTitle: 'Limites Mín-Máx e Frações',
        constraintsDesc: 'Os limites são fornecidos usando as propriedades <code>min</code> e <code>max</code>. Se o usuário digitar um valor fora do intervalo, o valor será restrito ao perder o foco. Você também pode especificar <code>minFractionDigits</code> e <code>maxFractionDigits</code>.',

        nativeTitle: 'Integração de Input Nativo',
        nativeDesc: 'Como uma diretriz, <code>czInputNumber</code> funciona lindamente em campos <code>&#x3C;input&#x3E;</code> HTML padrão. A diretiva aciona automaticamente a validação, filtragem de eventos e formatação visual.',

        apiTitle: 'Referência API',
        table: {
            prop: 'Propriedade',
            type: 'Tipo',
            default: 'Padrão',
            desc: 'Descrição'
        }
    },
    fr: {
        title: 'InputNumber',
        lead: 'InputNumber est une directive angulaire qui formate et analyse les valeurs numériques en utilisant l\'internationalisation (Intl), prenant en charge les décimales, les devises, les limites min/max et plus indépendamment de l\'élément visuel.',

        importTitle: 'Import',
        importCode: `import { CzInputNumberDirective } from 'codezium-ui';`,

        numeralsTitle: 'Chiffres',
        numeralsDesc: 'InputNumber est utilisé comme une directive avec l\'attribut <code>czInputNumber</code>. Il peut être appliqué sur les balises <code>&#x3C;cz-input-text&#x3E;</code> ou <code>&#x3C;input&#x3E;</code> natives. Il formate des types décimaux stricts garantissant que la valeur sous-jacente est un nombre JavaScript.',

        currencyTitle: 'Devise',
        currencyDesc: 'Le formatage des devises est spécifié en définissant la propriété <code>mode</code> sur <code>currency</code> et en fournissant le code <code>currency</code> (ex: USD, EUR). Il utilise l\'API Intl native pour rendre les symboles et formater correctement.',

        prefixSuffixTitle: 'Préfixe et Suffixe',
        prefixSuffixDesc: 'En mode décimal, vous pouvez assigner un texte visuel personnalisé avant ou après l\'entrée en utilisant les propriétés <code>prefix</code> et <code>suffix</code> sans modifier la valeur numérique.',

        constraintsTitle: 'Limites Min-Max et Fractions',
        constraintsDesc: 'Les limites sont définies à l\'aide des propriétés <code>min</code> et <code>max</code>. Si l\'utilisateur saisit une valeur hors limite, celle-ci est corrigée en toute sécurité à la perte du focus. Vous pouvez également spécifier <code>minFractionDigits</code> et <code>maxFractionDigits</code>.',

        nativeTitle: 'Intégration d\'Input Natif',
        nativeDesc: 'En tant que directive, <code>czInputNumber</code> fonctionne magnifiquement sur les champs <code>&#x3C;input&#x3E;</code> standards HTML. La directive exécute automatiquement la validation, la capture du clavier et le traitement du formatage.',

        apiTitle: 'Référence API',
        table: {
            prop: 'Propriété',
            type: 'Type',
            default: 'Défaut',
            desc: 'Description'
        }
    },
    de: {
        title: 'InputNumber',
        lead: 'InputNumber ist eine angular-Direktive, die numerische Werte mit Hilfe von Internationalisierung (Intl) formatiert und verarbeitet. Sie unterstützt Dezimalzahlen, Währungen, Min-/Max-Grenzen und mehr – ganz unabhängig vom visuellen Element.',

        importTitle: 'Import',
        importCode: `import { CzInputNumberDirective } from 'codezium-ui';`,

        numeralsTitle: 'Zahlen',
        numeralsDesc: 'InputNumber wird als Direktive mit dem Attribut <code>czInputNumber</code> verwendet. Sie kann auf <code>&#x3C;cz-input-text&#x3E;</code>- oder native <code>&#x3C;input&#x3E;</code>-Tags angewendet werden. Sie formatiert eine strikte Dezimaldarstellung, um zu garantieren, dass der zugrunde liegende Wert eine JavaScript-Zahl ist.',

        currencyTitle: 'Währung',
        currencyDesc: 'Die Währungsformatierung wird festgelegt, indem die Eigenschaft <code>mode</code> auf <code>currency</code> gesetzt und ein <code>currency</code>-Code (z. B. USD, EUR) angegeben wird. Es wird die native Intl-API verwendet, um Symbole und Formate automatisch anzupassen.',

        prefixSuffixTitle: 'Präfix und Suffix',
        prefixSuffixDesc: 'Im Dezimalmodus können Sie visuellen, benutzerdefinierten Text vor oder nach der Eingabe mit den Eigenschaften <code>prefix</code> und <code>suffix</code> hinzufügen, ohne dass sich dies auf den internen numerischen Wert auswirkt.',

        constraintsTitle: 'Min-Max Grenzen und Fraktionen',
        constraintsDesc: 'Einschränkungen werden über die Eigenschaften <code>min</code> und <code>max</code> festgelegt. Wird ein Wert außerhalb der Grenzen eingegeben, so wird er automatisch gedeckelt, sobald der Eingabefokus aufgehoben wird. Zusätzlich können <code>minFractionDigits</code> und <code>maxFractionDigits</code> bestimmt werden.',

        nativeTitle: 'Native Eingabe-Integration',
        nativeDesc: 'Als Direktive funktioniert <code>czInputNumber</code> hervorragend auf regulären HTML-<code>&#x3C;input&#x3E;</code>-Feldern. Die Direktive leitet die Validierung, das Event-Handling und das Formatieren absolut automatisch ab.',

        apiTitle: 'API-Referenz',
        table: {
            prop: 'Eigenschaft',
            type: 'Typ',
            default: 'Standard',
            desc: 'Beschreibung'
        }
    }
};
