import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Переменная окружения ${name} не задана`);
  }
  return value;
}

const DB_HOST = requireEnv('DB_HOST');
const DB_PORT = Number(requireEnv('DB_PORT'));
const DB_NAME = requireEnv('DB_NAME');
const DB_USER = requireEnv('DB_USER');
const DB_PASSWORD = requireEnv('DB_PASSWORD');


export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
});
