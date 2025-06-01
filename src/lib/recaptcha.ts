interface RecaptchaResponse {
    success: boolean;
    score?: number;
    action?: string;
    challenge_ts?: string;
    hostname?: string;
    'error-codes'?: string[];
}

export async function verifyRecaptcha(token: string, expectedAction?: string): Promise<{ success: boolean; score?: number; error?: string }> {
    // Skip reCAPTCHA verification in development
    if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Skipping reCAPTCHA verification');
        return { success: true, score: 1.0 };
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        console.warn('RECAPTCHA_SECRET_KEY not found in environment variables');
        return { success: false, error: 'reCAPTCHA not configured' };
    }

    if (!token) {
        return { success: false, error: 'No reCAPTCHA token provided' };
    }

    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: secretKey,
                response: token,
            }),
        });

        const data: RecaptchaResponse = await response.json();

        if (!data.success) {
            console.log('reCAPTCHA verification failed:', data['error-codes']);
            return {
                success: false,
                error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}`
            };
        }

        // Check action if provided (for reCAPTCHA v3)
        if (expectedAction && data.action !== expectedAction) {
            console.log(`reCAPTCHA action mismatch: expected "${expectedAction}", got "${data.action}"`);
            return {
                success: false,
                error: `Invalid action: expected "${expectedAction}"`
            };
        }

        // Check score (reCAPTCHA v3 score, 0.0 is bot, 1.0 is human)
        // You can adjust this threshold based on your needs
        const minScore = 0.5;
        if (data.score !== undefined && data.score < minScore) {
            console.log(`reCAPTCHA score too low: ${data.score} (minimum: ${minScore})`);
            return {
                success: false,
                score: data.score,
                error: 'Request appears to be automated'
            };
        }

        return {
            success: true,
            score: data.score
        };

    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return {
            success: false,
            error: 'Failed to verify reCAPTCHA'
        };
    }
} 