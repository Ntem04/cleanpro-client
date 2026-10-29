import { useState } from "react";
import { User } from "lucide-react";
import { useAdminProfile } from "../context/useAdminProfile";
import { sanitizeAvatarUrl, getSafeInitials } from "../../../utils/securityUtils";

export type AdminAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AdminAvatarProps {
  readonly size?: AdminAvatarSize;
  readonly customUrl?: string | null;
  readonly customName?: string;
  readonly className?: string;
  readonly showOnlineIndicator?: boolean;
}

const SIZE_CLASSES: Record<AdminAvatarSize, { container: string; text: string; icon: number; indicator: string }> = {
  xs: { container: "h-7 w-7", text: "text-[11px]", icon: 14, indicator: "h-2 w-2" },
  sm: { container: "h-9 w-9", text: "text-sm", icon: 16, indicator: "h-2 w-2" },
  md: { container: "h-11 w-11", text: "text-sm", icon: 20, indicator: "h-2.5 w-2.5" },
  lg: { container: "h-12 w-12", text: "text-base", icon: 22, indicator: "h-3 w-3" },
  xl: { container: "h-16 w-16", text: "text-lg", icon: 28, indicator: "h-3.5 w-3.5" },
};

/**
 * Composant d'Avatar Administrateur sécurisé et résilient (ANSSI / OWASP / CWE-79)
 * - Validation stricte des flux d'images issus de la base de données
 * - Basculement automatique en cas d'erreur de chargement (Fail-Safe Fallback)
 * - Protection anti-fuite de données (crossOrigin anonymous, referrerPolicy no-referrer)
 */
export default function AdminAvatar({
  size = "sm",
  customUrl,
  customName,
  className = "",
  showOnlineIndicator = false,
}: AdminAvatarProps) {
  const { profile, avatarUrl: contextAvatarUrl } = useAdminProfile();
  const [imageError, setImageError] = useState<boolean>(false);

  const rawUrl = customUrl !== undefined ? customUrl : contextAvatarUrl;
  const safeUrl = sanitizeAvatarUrl(rawUrl);

  const displayName = customName || profile.name || "Amina Diallo";
  const initials = getSafeInitials(displayName);
  const sizeConfig = SIZE_CLASSES[size];

  const handleImageError = () => {
    // Si l'URL distante renvoie 404, 500 ou est bloquée par la CSP
    setImageError(true);
  };

  const shouldRenderImage = safeUrl && !imageError;

  return (
    <div className={`relative inline-block shrink-0 ${sizeConfig.container} ${className}`}>
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-slate-200/90 bg-[#15364a] text-white font-bold select-none ${sizeConfig.text}`}
      >
        {shouldRenderImage ? (
          <img
            src={safeUrl}
            alt={`Photo de profil de ${displayName}`}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <span aria-hidden="true">{initials}</span>
        ) : (
          <User size={sizeConfig.icon} aria-hidden={true} className="text-white" />
        )}
      </div>

      {showOnlineIndicator && (
        <span
          className={`absolute bottom-0 right-0 rounded-full bg-emerald-500 ring-2 ring-white ${sizeConfig.indicator}`}
          title="Administrateur en ligne"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

