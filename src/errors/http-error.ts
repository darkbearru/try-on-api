export class HttpError extends Error {
	constructor(public statusCode: number, message: string, public context?: string) {
		super(message);
	}
}
