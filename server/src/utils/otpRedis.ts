import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) await redisClient.connect();
}

export async function storeOTP(email: string, otp: string, ttlSeconds = 300) {
  await connectRedis();
  const key = `otp:${email.toLowerCase()}`;
  await redisClient.set(key, otp, { EX: ttlSeconds });
}

export async function getOTP(email: string) {
  await connectRedis();
  const key = `otp:${email.toLowerCase()}`;
  return await redisClient.get(key);
}

export async function deleteOTP(email: string) {
  await connectRedis();
  const key = `otp:${email.toLowerCase()}`;
  await redisClient.del(key);
}
