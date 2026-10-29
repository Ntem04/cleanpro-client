/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CleanPro — Module de Cybersécurité & Conformité (ANSSI / OWASP / CWE / CVE)
 * ─────────────────────────────────────────────────────────────────────────────
 * Normes appliquées :
 * - OWASP Top 10 (A03:2021 Injection, A04:2021 Insecure Design, A08:2021 Integrity Failures)
 * - OWASP ASVS 4.0 (V5 Validation & Sanitization, V13 API Security)
 * - ANSSI Recommandations pour le développement sécurisé d'applications Web
 * - CWE-79 (Cross-Site Scripting / Stored XSS via Avatar/Image URL)
 * - CWE-116 (Improper Output Encoding / Attribute Injection)
 * - CWE-400 (Uncontrolled Resource Consumption / Client-side DoS)
 * - CWE-434 (Unrestricted Upload of Dangerous File Types)
 * - CWE-611 (XML External Entity - prévention via exclusion stricte SVG actif)
 */

/** Longueur maximale autorisée pour une URL distante (RFC 7230 / CWE-400) */
const MAX_URL_LENGTH = 2048;

/** Taille maximale autorisée pour une image encodée en base64 (~2.8 Mo de payload pour un fichier de 2 Mo) */
const MAX_BASE64_LENGTH = 3 * 1024 * 1024 * 1.37; // ~4.1 Mo de caractères

/** Whitelist stricte des types MIME autorisés pour les avatars (CWE-434) */
export const ALLOWED_IMAGE_MIME_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/** Extensions de fichiers associées aux MIME autorisés */
export const ALLOWED_IMAGE_EXTENSIONS = Object.freeze([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

/** Limite de taille en octets pour un fichier uploadé (2 Mo) (CWE-400) */
export const MAX_AVATAR_FILE_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * Regex pour valider les Data URIs matriciels sécurisés.
 * EXCLUT STRICTEMENT `data:image/svg+xml` pour éviter les attaques Stored XSS
 * via scripts intégrés ou balises <animate>/<foreignObject> (CWE-79, CWE-611).
 */
const SAFE_DATA_IMAGE_REGEX =
  /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

/**
 * Regex pour détecter les schémas d'URI malveillants ou dangereux (CWE-79)
 */
const DANGEROUS_SCHEMES_REGEX =
  /^(?:javascript|vbscript|data:text\/html|data:image\/svg\+xml|file):/i;

/**
 * Assainit et valide rigoureusement une URL d'avatar provenant de la base de données
 * ou d'une source externe avant son injection dans le DOM (CWE-79, ANSSI).
 *
 * @param rawUrl URL ou DataURI brute reçue du backend ou d'un input
 * @returns Une URL vérifiée et sûre, ou `null` si la validation échoue (Fail-Safe)
 */
export function sanitizeAvatarUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== "string") {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) {
    return null;
  }

  // 1. Détection des caractères de contrôle ASCII illégaux (\x00-\x1F, \x7F)
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return null;
  }

  // 2. Rejet immédiat de tout schéma d'exécution de script (XSS)
  if (DANGEROUS_SCHEMES_REGEX.test(trimmed)) {
    return null;
  }

  // 3. Traitement des Data URIs (Base64)
  if (trimmed.startsWith("data:")) {
    // Vérification de longueur pour éviter les saturations mémoire DoS (CWE-400)
    if (trimmed.length > MAX_BASE64_LENGTH) {
      return null;
    }

    // Doit correspondre à un format matriciel sain (PNG, JPEG, WebP)
    if (!SAFE_DATA_IMAGE_REGEX.test(trimmed)) {
      return null;
    }

    return trimmed;
  }

  // 4. Traitement des chemins relatifs locaux de l'application (ex: /assets/..., /image/...)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    if (trimmed.length > MAX_URL_LENGTH) {
      return null;
    }
    // Assainissement des tentatives de Directory Traversal (CWE-22)
    if (trimmed.includes("..") || trimmed.includes("\\")) {
      return null;
    }
    return encodeURI(trimmed);
  }

  // 5. Traitement des URLs absolues HTTP / HTTPS
  if (trimmed.length > MAX_URL_LENGTH) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    // Seuls HTTPS (en production) et HTTP (développement local) sont admis
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    // Vérification que le hostname est valide
    if (!parsed.hostname || parsed.hostname.includes("<") || parsed.hostname.includes(">")) {
      return null;
    }

    return parsed.toString();
  } catch {
    // Si l'URL ne peut être parsée de manière sécurisée -> Fail-Closed
    return null;
  }
}

/**
 * Validation robuste d'un fichier image avant lecture en mémoire (CWE-434, CWE-400)
 */
export function validateImageUpload(file: File): {
  readonly valid: boolean;
  readonly error?: string;
} {
  // 1. Vérification de la présence
  if (!file) {
    return { valid: false, error: "Aucun fichier sélectionné." };
  }

  // 2. Vérification de la taille (CWE-400 : Prévention déni de service mémoire)
  if (file.size <= 0) {
    return { valid: false, error: "Le fichier est vide." };
  }
  if (file.size > MAX_AVATAR_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `La photo dépasse la limite autorisée de 2 Mo (taille actuelle: ${(file.size / (1024 * 1024)).toFixed(1)} Mo).`,
    };
  }

  // 3. Vérification stricte du type MIME (CWE-434 : Whitelist MIME)
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as typeof ALLOWED_IMAGE_MIME_TYPES[number])) {
    return {
      valid: false,
      error: "Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP.",
    };
  }

  // 4. Vérification de la cohérence de l'extension de fichier
  const lowerName = file.name.toLowerCase();
  const hasValidExt = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
    lowerName.endsWith(ext)
  );
  if (!hasValidExt) {
    return {
      valid: false,
      error: "Extension de fichier non sécurisée. Formats acceptés : .jpg, .jpeg, .png, .webp.",
    };
  }

  return { valid: true };
}

/**
 * Échappement et assainissement textuel pour le DOM (CWE-116)
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }
  return input
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "'":
          return "&#39;";
        case '"':
          return "&quot;";
        case "&":
          return "&amp;";
        default:
          return char;
      }
    })
    .trim();
}

/**
 * Extrait des initiales sécurisées à partir d'un nom complet (ex: "Amina Diallo" -> "AD")
 */
export function getSafeInitials(fullName: unknown): string {
  if (typeof fullName !== "string") {
    return "AD";
  }
  const clean = fullName.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim();
  if (!clean) return "AD";

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

