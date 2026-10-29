import apiClient, { type ApiErrorResponse } from "./apiClient";

export interface ContactPayload {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

export interface ContactResponse {
  readonly success: boolean;
  readonly message: string;
  readonly referenceId?: string;
}

/**
 * Service de contact pour la transmission sécurisée des messages vers l'API.
 */
export const contactService = {
  /**
   * Envoie un message de contact validé au backend Node.js.
   */
  async sendMessage(payload: ContactPayload): Promise<ContactResponse> {
    try {
      const response = await apiClient.post<ContactResponse>("/contact", payload);
      return response.data;
    } catch (error) {
      throw error as ApiErrorResponse;
    }
  },
};
