import crypto from 'crypto';

export function signCommand(command: Partial<{ 'content-type': string; 'content-length': string; key: string; clientId: string }>, secretKey: string) {
  const canonicalRequest = [
    command.clientId,
    command.key,
    command['content-length'],
    command['content-type'],
  ]
    .filter(item => item !== undefined || item !== null)
    .sort()
    .join('\n');
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(canonicalRequest)
    .digest('hex');
  return signature;
}

export function compareSignature(command: Parameters<typeof signCommand>[0], signature: string, secretKey: string) {
  return signCommand(command, secretKey) === signature;
}