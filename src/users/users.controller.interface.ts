import { NextFunction, Request, Response } from 'express';

export interface IUsersController {
	register: (req: Request, res: Response, next: NextFunction) => void;
	login: (req: Request, res: Response, next: NextFunction) => void;
	logout: (req: Request, res: Response, next: NextFunction) => void;
	refresh: (req: Request, res: Response, next: NextFunction) => void;
	activate: (req: Request, res: Response, next: NextFunction) => void;

}
