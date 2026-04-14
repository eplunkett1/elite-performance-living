const EMAIL_SIGNUP_URL =
  "https://script.google.com/macros/s/AKfycbyI4DqjV3JxoNu4mgG1-vilEujx2FGMY3K0kLfCkK-V_BER7TrW62fPZjd3b_Sl46bU_A/exec";

/**
 * POST lead to Google Apps Script web app (expects doPost + JSON body).
 * Tries a normal CORS POST first; if that fails or returns non-OK, falls back to
 * mode "no-cors" with text/plain (same JSON string) so the browser allows the request.
 * @param {{ name: string, email: string, source: 'homepage' | 'assessment' }} payload
 */
export async function submitEmailSignup({ name, email, source }) {
  const body = JSON.stringify({
    name: (name ?? "").trim(),
    email: (email ?? "").trim(),
    source,
  });

  try {
    const response = await fetch(EMAIL_SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (response.ok) {
      return response;
    }
  } catch {
    // CORS or network error — try no-cors fallback below
  }

  // Opaque response: cannot read status; Apps Script still receives postData.contents as JSON
  await fetch(EMAIL_SIGNUP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body,
  });
}
