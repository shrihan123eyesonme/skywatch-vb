// Text delivery via Twilio. Gated behind env vars, same pattern as email.ts —
// until credentials are set, sendAlertSms() is a no-op that reports itself
// as skipped.

export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER
  );
}

export async function sendAlertSms(params: {
  to: string;
  body: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isSmsConfigured()) {
    return {
      sent: false,
      error: "TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER not set",
    };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: params.to,
          From: process.env.TWILIO_FROM_NUMBER!,
          Body: params.body,
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      return { sent: false, error: `Twilio ${res.status}: ${body}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
