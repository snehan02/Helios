import { z } from 'zod';

const envSchema = z.object({
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    UPLOADTHING_SECRET: z.string().min(1, "UPLOADTHING_SECRET is required"),
    UPLOADTHING_APP_ID: z.string().min(1, "UPLOADTHING_APP_ID is required"),
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
        if (error instanceof z.ZodError) {
            console.error("❌ Invalid environment variables:");
            (error as any).errors.forEach((err: any) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1); // Fail fast
        }
        throw error;
    }
};
