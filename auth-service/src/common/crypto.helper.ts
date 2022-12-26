import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

export async function validateData(
  stringData: string,
  encryptedData: Buffer,
): Promise<boolean> {
  const key = (await promisify(scrypt)(
    process.env.CRYPT_KEY,
    'salt',
    32,
  )) as Buffer;

  const decipher = createDecipheriv(
    'aes-256-ctr',
    key,
    Buffer.from(process.env.CRYPT_IV, 'base64'),
  );

  const decryptedText = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return decryptedText.toString() === stringData;
}

export async function encryptData(data: string): Promise<Buffer> {
  const key = (await promisify(scrypt)(
    process.env.CRYPT_KEY,
    'salt',
    32,
  )) as Buffer;

  const cipher = createCipheriv(
    'aes-256-ctr',
    key,
    Buffer.from(process.env.CRYPT_IV, 'base64'),
  );

  return Buffer.concat([cipher.update(data), cipher.final()]);
}
