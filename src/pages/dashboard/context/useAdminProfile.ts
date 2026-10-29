import { useContext } from "react";
import {
  AdminProfileContext,
  type AdminProfileContextValue,
} from "./adminProfileContextInstance";

/**
 * Hook d'accès sécurisé au profil et à la photo de l'administrateur
 * Conforme aux normes ANSSI & OWASP
 */
export function useAdminProfile(): AdminProfileContextValue {
  const context = useContext(AdminProfileContext);
  if (!context) {
    throw new Error(
      "useAdminProfile doit être utilisé à l'intérieur d'un AdminProfileProvider"
    );
  }
  return context;
}

