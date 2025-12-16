// src/lib/errors.ts

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public userMessage?: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function handleError(error: unknown): { message: string; statusCode: number } {
    console.error('Error occurred:', error);

    if (error instanceof AppError) {
        return {
            message: error.userMessage || error.message,
            statusCode: error.statusCode
        };
    }

    if (error instanceof Error) {
        return {
            message: 'Παρουσιάστηκε ένα απροσδόκητο σφάλμα.',
            statusCode: 500
        };
    }

    return {
        message: 'Παρουσιάστηκε ένα άγνωστο σφάλμα.',
        statusCode: 500
    };
}