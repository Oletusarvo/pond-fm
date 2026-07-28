export abstract class ObjectEncoder {
  static encodeToBase64Url(obj: Record<string, any>) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);

    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  static decodeFromBase64Url(base64url: string) {
    // Convert back to standard Base64
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

    // Restore padding
    while (base64.length % 4) {
      base64 += '=';
    }

    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json);
  }
}
