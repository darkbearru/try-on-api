import {
	IsAlphanumeric,
	IsDecimal,
	IsInt,
	IsJSON,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';

export class GoodsDTO {
	@IsString()
	@MinLength(4)
	name: string;

	@IsDecimal()
	price: number;

	@IsInt()
	count: number;

	@IsAlphanumeric()
	@MinLength(5)
	code: string;

	@IsOptional()
	@IsJSON()
	options?: {};

	@IsOptional()
	@IsInt()
	categories?: number;
}
