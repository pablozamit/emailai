import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const userId = '1'; // Hardcoded user ID for now

    try {
        // Ensure the table exists
        await sql`
            CREATE TABLE IF NOT EXISTS user_data (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) UNIQUE NOT NULL,
                prompt_data JSONB,
                feedback_history JSONB
            );
        `;

        if (req.method === 'POST') {
            const { promptData, feedbackHistory } = req.body;

            if (!promptData || !feedbackHistory) {
                return res.status(400).json({ message: 'Missing required parameters' });
            }

            await sql`
                INSERT INTO user_data (user_id, prompt_data, feedback_history)
                VALUES (${userId}, ${JSON.stringify(promptData)}, ${JSON.stringify(feedbackHistory)})
                ON CONFLICT (user_id)
                DO UPDATE SET
                    prompt_data = EXCLUDED.prompt_data,
                    feedback_history = EXCLUDED.feedback_history;
            `;

            return res.status(200).json({ message: 'Data saved successfully' });
        } else if (req.method === 'GET') {
            const { rows } = await sql`
                SELECT prompt_data, feedback_history
                FROM user_data
                WHERE user_id = ${userId};
            `;

            if (rows.length === 0) {
                return res.status(200).json(null);
            }

            return res.status(200).json({
                promptData: rows[0].prompt_data,
                feedbackHistory: rows[0].feedback_history,
            });
        } else {
            return res.status(405).json({ message: 'Only POST and GET requests allowed' });
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
