import { NextFunction, Request, Response } from 'express';

export interface IGoodsController {
	list: (req: Request, res: Response, next: NextFunction) => void;
	add: (req: Request, res: Response, next: NextFunction) => void;
	delete: (req: Request, res: Response, next: NextFunction) => void;
	update: (req: Request, res: Response, next: NextFunction) => void;
}
