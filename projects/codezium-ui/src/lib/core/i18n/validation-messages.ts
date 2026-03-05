export type CzValidationLocale = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'it' | 'zh' | 'ja' | 'ru' | 'ar' | 'hi' | 'ko' | 'nl' | 'tr';

export interface CzValidationErrorKeys {
    required: string;
    email: string;
    minlength: (requiredLength: number) => string;
    maxlength: (requiredLength: number) => string;
    default: string;
    [key: string]: string | ((...args: any[]) => string); // Extensibilidad
}

export const CZ_VALIDATION_MESSAGES: Record<CzValidationLocale, CzValidationErrorKeys> = {
    en: {
        required: 'This field is required.',
        email: 'Invalid email format.',
        minlength: (len) => `Minimum ${len} characters required.`,
        maxlength: (len) => `Maximum ${len} characters allowed.`,
        default: 'Invalid value.'
    },
    es: {
        required: 'Este campo es requerido.',
        email: 'Formato de correo electrónico inválido.',
        minlength: (len) => `Mínimo ${len} caracteres.`,
        maxlength: (len) => `Máximo ${len} caracteres.`,
        default: 'El valor ingresado es inválido.'
    },
    pt: {
        required: 'Este campo é obrigatório.',
        email: 'Formato de email inválido.',
        minlength: (len) => `Mínimo de ${len} caracteres.`,
        maxlength: (len) => `Máximo de ${len} caracteres.`,
        default: 'Valor inválido.'
    },
    fr: {
        required: 'Ce champ est obligatoire.',
        email: "Format d'e-mail invalide.",
        minlength: (len) => `Minimum ${len} caractères.`,
        maxlength: (len) => `Maximum ${len} caractères.`,
        default: 'Valeur invalide.'
    },
    de: {
        required: 'Dieses Feld ist erforderlich.',
        email: 'Ungültiges E-Mail-Format.',
        minlength: (len) => `Mindestens ${len} Zeichen.`,
        maxlength: (len) => `Maximal ${len} Zeichen.`,
        default: 'Ungültiger Wert.'
    },
    it: {
        required: 'Questo campo è obbligatorio.',
        email: 'Formato e-mail non valido.',
        minlength: (len) => `Minimo ${len} caratteri.`,
        maxlength: (len) => `Massimo ${len} caratteri.`,
        default: 'Valore non valido.'
    },
    zh: {
        required: '此字段是必填项。',
        email: '电子邮件格式无效。',
        minlength: (len) => `至少 ${len} 个字符。`,
        maxlength: (len) => `最多 ${len} 个字符。`,
        default: '无效值。'
    },
    ja: {
        required: 'このフィールドは必須です。',
        email: '無効なメール形式です。',
        minlength: (len) => `最小 ${len} 文字。`,
        maxlength: (len) => `最大 ${len} 文字。`,
        default: '無効な値です。'
    },
    ru: {
        required: 'Это поле обязательно для заполнения.',
        email: 'Неверный формат электронной почты.',
        minlength: (len) => `Минимум ${len} символов.`,
        maxlength: (len) => `Максимум ${len} символов.`,
        default: 'Недопустимое значение.'
    },
    ar: {
        required: 'هذا الحقل مطلوب.',
        email: 'صيغة البريد الإلكتروني غير صالحة.',
        minlength: (len) => `الحد الأدنى ${len} حرفاً.`,
        maxlength: (len) => `الحد الأقصى ${len} حرفاً.`,
        default: 'قيمة غير صالحة.'
    },
    hi: {
        required: 'यह क्षेत्र अनिवार्य है।',
        email: 'अमान्य ईमेल प्रारूप।',
        minlength: (len) => `न्यूनतम ${len} अक्षर।`,
        maxlength: (len) => `अधिकतम ${len} अक्षर।`,
        default: 'अमान्य मान।'
    },
    ko: {
        required: '이 필드는 필수입니다.',
        email: '잘못된 이메일 형식입니다.',
        minlength: (len) => `최소 ${len}자입니다.`,
        maxlength: (len) => `최대 ${len}자입니다.`,
        default: '잘못된 값입니다.'
    },
    nl: {
        required: 'Dit veld is verplicht.',
        email: 'Ongeldig e-mailformaat.',
        minlength: (len) => `Minimaal ${len} tekens.`,
        maxlength: (len) => `Maximaal ${len} tekens.`,
        default: 'Ongeldige waarde.'
    },
    tr: {
        required: 'Bu alan zorunludur.',
        email: 'Geçersiz e-posta formatı.',
        minlength: (len) => `En az ${len} karakter.`,
        maxlength: (len) => `En fazla ${len} karakter.`,
        default: 'Geçersiz değer.'
    }
};
