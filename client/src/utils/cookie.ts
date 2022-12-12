export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift();
}

interface CookieOptions {
  name: string;
  value: string;
  maxAge?: number;
}

export function setCookie({ name, value, maxAge }: CookieOptions) {
  document.cookie = `${name}=${value}; max-age=${maxAge};`;
}
