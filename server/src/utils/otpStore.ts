import { createClient } from 'redis';


const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

export const storeOTP = async (email: string, otp: string) => {
  await client.setEx(`otp:${email}`, 300, otp);
};

export const getOTP = async (email: string) => {
  return await client.get(`otp:${email}`);
};

export const deleteOTP = async (email: string) => {
  await client.del(`otp:${email}`);
};