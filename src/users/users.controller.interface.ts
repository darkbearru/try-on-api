import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../types/custom';

export interface IUsersController {
	register: (req: Request, res: Response, next: NextFunction) => void;
	login: (req: Request, res: Response, next: NextFunction) => void;
	logout: (req: Request, res: Response, next: NextFunction) => void;
	refresh: (req: Request, res: Response, next: NextFunction) => void;
	delete: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: CustomRequest, res: Response, next: NextFunction) => void;
}
