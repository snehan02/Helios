import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Vercel sometimes strips the /api prefix or handles paths differently.
    // We need to ensure the Express app handles the request correctly.
    // This wrapper ensures we're compatible with Vercel's serverless function signature.
    return app(req, res);
}
