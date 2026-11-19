import { z } from 'zod';

// İletişim formunu Resend üzerinden firmanın e-posta adresine ileten Vercel fonksiyonu.
// Gerekli ortam değişkeni: RESEND_API_KEY. İsteğe bağlı: CONTACT_TO, CONTACT_FROM.
// Alan adı Resend'de doğrulanmadan yalnızca Resend hesabının sahibi olan adrese gönderim yapılabilir.

// Varsayılan alıcı, src/content/contact.ts içindeki CONTACT.email ile aynı olmalıdır.
const DEFAULT_TO = 'info@adanex.com.tr';
const DEFAULT_FROM = 'Adanex Web <onboarding@resend.dev>';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  language: z.enum(['tr', 'en']),
  // Bal küpü alanı: insanlar görmez, dolu gelirse istek bottur.
  company: z.string().max(200).optional(),
});

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status });

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return json(405, { ok: false, error: 'method_not_allowed' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY tanımlı değil');
      return json(500, { ok: false, error: 'not_configured' });
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return json(400, { ok: false, error: 'invalid_body' });
    }

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return json(400, { ok: false, error: 'invalid_fields' });
    }

    const { name, email, message, language, company } = parsed.data;

    // Bota başarılı yanıt dönülür ki tekrar denemesin, e-posta gönderilmez.
    if (company) {
      return json(200, { ok: true });
    }

    // Konu satırına satır sonu girmesin diye ad tek satıra indirilir.
    const singleLineName = name.replace(/\s+/g, ' ');

    // Bu e-posta yalnızca firmaya gider, site metni değildir.
    const text = [
      `Ad: ${name}`,
      `E-posta: ${email}`,
      `Dil: ${language.toUpperCase()}`,
      'KVKK onayı: Verildi',
      '',
      message,
    ].join('\n');

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'adanex-website/1.0',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || DEFAULT_FROM,
          to: [process.env.CONTACT_TO || DEFAULT_TO],
          reply_to: [email],
          subject: `Web sitesinden mesaj: ${singleLineName}`,
          text,
        }),
      });

      if (!response.ok) {
        console.error('Resend hatası', response.status, await response.text());
        return json(502, { ok: false, error: 'send_failed' });
      }
    } catch (error) {
      console.error('Resend isteği başarısız', error);
      return json(502, { ok: false, error: 'send_failed' });
    }

    return json(200, { ok: true });
  },
};
