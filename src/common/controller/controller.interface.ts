import { Response } from 'express';

export interface IController {
	created: (res: Response) => Response;
	send: <T>(res: Response, code: number, body: T, message: string) => Response;
	ok: <T>(res: Response, body: T, message: string) => Response;
}
