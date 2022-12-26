import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DB_URL,
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3309,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  synchronize: process.env.DB_SYNC === 'true',
  sslEnabled: process.env.DB_SSL_ENABLED === 'true',
  rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED === 'true',
  ca: process.env.DB_CA,
  key: process.env.DB_KEY,
  cert: process.env.DB_CERT,
}));
