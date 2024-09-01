import { AsyncFunction } from 'type-fest/source/async-return-type';

export type METHOD_TYPE_T = 'get' | 'put' | 'post' | 'delete' | 'patch';
export interface IBaseRouterElement {
	path: string;
	pathCallback: AsyncFunction;
	method: METHOD_TYPE_T[];
	allowed?: string[];
}