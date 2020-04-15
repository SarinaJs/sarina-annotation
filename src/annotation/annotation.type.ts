import { Class } from '@sarina/annotation';

export type AnnotationTypes = 'class' | 'parameter' | 'property' | 'method';

export type Annotation<TData = any> =
	| ClassAnnotation<TData>
	| ParameterAnnotation<TData>
	| PropertyAnnotation<TData>
	| MethodAnnotation<TData>;

export interface BaseAnnotation<TData = any> {
	type: AnnotationTypes;
	name: string;
	data: TData;
}
export interface ClassAnnotation<TData = any> extends BaseAnnotation<TData> {
	type: 'class';
}
export interface ParameterAnnotation<TData = any> extends BaseAnnotation<TData> {
	type: 'parameter';
	methodName: string | symbol;
	parameterIndex: number;
}
export interface PropertyAnnotation<TData = any> extends BaseAnnotation<TData> {
	type: 'property';
	propertyName: string | symbol;
}
export interface MethodAnnotation<TData = any> extends BaseAnnotation<TData> {
	type: 'method';
	methodName: string | symbol;
}
