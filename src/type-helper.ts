import { Class } from './class.type';
import {
	getAnnotations,
	ClassAnnotation,
	MethodAnnotation,
	ParameterAnnotation,
	PropertyAnnotation,
} from './annotation';
import {
	ANNOTATION_CLASS_DEF_KEY,
	ANNOTATION_METHOD_DEF_KEY,
	ANNOTATION_PROPERTY_DEF_KEY,
	ClassTypeDef,
	MethodTypeDef,
	PropertyTypeDef,
} from './annotation';

// Interfaces
export interface ParameterInfo {
	index: number;
	annotations: ParameterAnnotation[];
	type: Class<any>;
}
export interface ConstructorInfo {
	isReflected: boolean;
	parameters: ParameterInfo[];
}
export interface MethodInfo {
	name: string | symbol;
	isReflected: boolean;
	returnType?: Class<any> | void;
	parameters: ParameterInfo[];
	annotations: MethodAnnotation[];
}
export interface PropertyInfo {
	name: string | symbol;
	isReflected: boolean;
	type?: Class<any>;
	annotations: PropertyAnnotation[];
}
export interface Type<T extends Class<T>> {
	name: string | symbol;
	isReflected: boolean;
	declaringType: Class<T>;
	constructor: ConstructorInfo;
	methods: MethodInfo[];
	properties: PropertyInfo[];
	annotations: ClassAnnotation[];
}

//////////////////////
export function getConstructor(type: Class<any>): ConstructorInfo {
	const annotations = getAnnotations(type);

	// first of all we need to process all class-annotations
	const classAnnotation = annotations.find(
		(s) => s.type == 'class' && s.name == ANNOTATION_CLASS_DEF_KEY,
	) as ClassAnnotation<ClassTypeDef>;

	// if the type has not reflected, we should return empty not-reflected information
	if (!classAnnotation) {
		return {
			isReflected: false,
			parameters: [],
		};
	}

	return {
		isReflected: true,
		parameters: classAnnotation.data.paramtypes.map((p) => ({
			annotations: <ParameterAnnotation[]>(
				annotations.filter((s) => s.type == 'parameter' && s.methodName == 'constructor')
			),
			index: p.index,
			type: p.type,
		})),
	};
}
export function getMethod(type: Class<any>, name: string): MethodInfo {
	// check method exists
	const method = type.prototype[name];
	if (!method) throw new Error(`Method '${name}' not found.`);

	const annotations = getAnnotations(type);

	// first of all we need to process all class-annotations
	const methodAnnotation = annotations.find(
		(s) => s.type == 'method' && s.name == ANNOTATION_METHOD_DEF_KEY && s.methodName == name,
	) as MethodAnnotation<MethodTypeDef>;

	if (!methodAnnotation)
		return {
			isReflected: false,
			annotations: [],
			name: name,
			parameters: [],
			returnType: undefined,
		};

	return {
		name: name,
		isReflected: true,
		parameters: methodAnnotation.data.paramtypes.map((p) => ({
			annotations: <ParameterAnnotation[]>annotations.filter((s) => s.type == 'parameter' && s.methodName == name),
			index: p.index,
			type: p.type,
		})),
		returnType: methodAnnotation.data.returnType,
		annotations: <MethodAnnotation[]>annotations.filter((s) => s.type == 'method' && s.methodName == name),
	};
}
export function getProperty(type: Class<any>, name: string | symbol): PropertyInfo {
	const annotations = getAnnotations(type);

	// first of all we need to process all class-annotations
	const propertyAnnotation = annotations.find(
		(s) => s.type == 'property' && s.name == ANNOTATION_PROPERTY_DEF_KEY,
	) as PropertyAnnotation<PropertyTypeDef>;

	if (!propertyAnnotation)
		return {
			isReflected: false,
			annotations: [],
			name: name,
			type: undefined,
		};

	return {
		name: name,
		isReflected: true,
		type: propertyAnnotation.data.type,
		annotations: <PropertyAnnotation[]>annotations.filter((s) => s.type == 'property' && s.propertyName == name),
	};
}
export function getType(type: Class<any>): Type<any> {
	const annotations = getAnnotations(type);

	// process methods
	const typeMethods: MethodInfo[] = [];
	for (var methodName in type.prototype) {
		typeMethods.push(getMethod(type, methodName));
	}

	const isReflected = annotations.findIndex((s) => s.type == 'class') > -1;

	return {
		isReflected: isReflected,
		name: type.name,
		declaringType: type,
		constructor: getConstructor(type),
		methods: typeMethods,
		properties: annotations
			.filter((s) => s.type == 'property' && s.name == ANNOTATION_PROPERTY_DEF_KEY)
			.map((s: PropertyAnnotation) => getProperty(type, s.propertyName)),
		annotations: annotations.filter((s) => s.type == 'class') as ClassAnnotation[],
	};
}
