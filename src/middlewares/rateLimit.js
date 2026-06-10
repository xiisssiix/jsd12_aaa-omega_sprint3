import { rateLimit } from "express-rate-limit";

const isProd = process.env.NODE_ENV === "production";

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: isProd ? process.env.RATELIMIT : 1000,
	standardHeaders: true,
	legacyHeaders: false
});