type NewsletterResult = {
  ok: boolean;
  message: string;
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const decoded = atob(normalized);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function deriveProjectUrl(apiKey: string): string | null {
  const payload = decodeJwtPayload(apiKey);
  const issuer = payload?.iss;

  if (typeof issuer !== 'string') {
    return null;
  }

  if (!issuer.startsWith('https://') || !issuer.includes('.supabase.co/')) {
    return null;
  }

  return issuer.replace('/auth/v1', '');
}

function getSupabaseConfig(): { url: string; apiKey: string } | null {
  const apiKey = (import.meta.env.VITE_SUPABASE_API_KEY || '').trim();
  if (!apiKey) {
    return null;
  }

  const explicitUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const url = explicitUrl || deriveProjectUrl(apiKey);

  if (!url) {
    return null;
  }

  return { url, apiKey };
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      message: 'Newsletter is not configured. Add VITE_SUPABASE_API_KEY in your env file.'
    };
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const response = await fetch(`${config.url}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.apiKey,
        Authorization: `Bearer ${config.apiKey}`,
        Prefer: 'resolution=ignore-duplicates,return=minimal'
      },
      body: JSON.stringify({
        email: normalizedEmail,
        source: 'website-footer'
      })
    });

    if (response.ok) {
      return {
        ok: true,
        message: 'Subscribed successfully. Invitations will arrive in your inbox.'
      };
    }

    return {
      ok: false,
      message: 'Unable to subscribe right now. Please try again in a moment.'
    };
  } catch {
    return {
      ok: false,
      message: 'Unable to connect to newsletter service. Please try again.'
    };
  }
}
