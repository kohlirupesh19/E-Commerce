import { API_BASE_URL } from '../lib/api';

type NewsletterResult = {
  ok: boolean;
  message: string;
};

export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        ok: true,
        message: data.message || 'Subscribed successfully. Invitations will arrive in your inbox.'
      };
    }

    return {
      ok: false,
      message: data.message || 'Unable to subscribe right now. Please try again in a moment.'
    };
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return {
      ok: false,
      message: 'Unable to connect to newsletter service. Please try again.'
    };
  }
}
