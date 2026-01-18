import type { Cookie, Session } from "electron";

export async function setCookiesToSession(
  session: Session,
  cookies: Cookie[],
  fallbackUrl: string,
): Promise<void> {
  for (const cookie of cookies) {
    try {
      const cleanDomain = cookie.domain?.startsWith(".")
        ? cookie.domain.substring(1)
        : (cookie.domain ?? new URL(fallbackUrl).hostname);
      const scheme = cookie.secure ? "https" : "http";
      const cookieUrl = `${scheme}://${cleanDomain}`;

      await session.cookies.set({
        url: cookieUrl,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path ?? "/",
        secure: cookie.secure ?? false,
        httpOnly: cookie.httpOnly ?? false,
        expirationDate: cookie.expirationDate,
        sameSite: cookie.sameSite ?? "unspecified",
      });
    } catch (e) {
      console.warn(`Skipping bad cookie: ${cookie.name}`, e);
    }
  }
}
