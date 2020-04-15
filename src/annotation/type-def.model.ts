import { Class } from '../class.type';

export const ANNOTATION_CLASS_DEF_KEY = '__class_def_annotation__';
export const ANNOTATION_METHOD_DEF_KEY = '__method_def_annotation__';
export const ANNOTATION_PROPERTY_DEF_KEY = '__property_def_annotation__';

export interface ParameterTypeDef {
	index: number;
	type: Class<any>;
}
export interface ClassTypeDef {
	type: Class<any>;
	paramtypes: ParameterTypeDef[];
}
export interface MethodTypeDef {
	name: string;
	returnType: Class<any>;
	paramtypes: ParameterTypeDef[];
	descriptor: PropertyDescriptor;
}
export interface PropertyTypeDef {
	name: string;
	type: Class<any>;
}
