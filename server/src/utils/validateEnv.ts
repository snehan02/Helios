import { z } from 'zod';

const envSchema = z.object({
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    UPLOADTHING_TOKEN: z.string().min(1, "UPLOADTHING_TOKEN is required"),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),
    FRONTEND_URL: z.string().optional(),
});

export const validateEnv = () => {
    try {
        const env = envSchema.parse(process.env as any);
        console.log("✅ Environment variables validated");
        return env;
    } catch (error) {
        console.error("❌ Invalid environment variables:", JSON.stringify(error, null, 2));
        process.exit(1);
    }
};
