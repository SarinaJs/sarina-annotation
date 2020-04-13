import { Class } from '../class.type';

export function symbolOrStringToString(value: string | symbol) {
	if (typeof value === 'symbol') return value.toString();
	return value;
}

export class ClassAnnotationAlreadyExistsError extends Error {
	public targetClass: Class<any>;
	public annotationName: string;

	public constructor(targetClass: Class<any>, annotationName: string) {
		super(`Annotation '${annotationName}' already have defined for '${targetClass.name}'.`);
		this.targetClass = targetClass;
		this.annotationName = annotationName;
	}
}
export class MethodAnnotationAlreadyExistsError extends Error {
	public targetClass: Class<any>;
	public annotationName: string;
	public methodName: string | symbol;

	public constructor(targetClass: Class<any>, methodName: string | symbol, annotationName: string) {
		super(
			`Annotation '${annotationName}' already have defined for '${symbolOrStringToString(methodName)}' method of '${
				targetClass.name
			}'.`,
		);
		this.targetClass = targetClass;
		this.annotationName = annotationName;
		this.methodName = methodName;
	}
}
export class ParameterAnnotationAlreadyExistsError extends Error {
	public targetClass: Class<any>;
	public annotationName: string;
	public methodName: string | symbol;
	public parameterIndex: number;

	public constructor(
		targetClass: Class<any>,
		methodName: string | symbol,
		parameterIndex: number,
		annotationName: string,
	) {
		super(
			`Annotation '${annotationName}' already have defined for '${symbolOrStringToString(
				methodName,
			)}#${parameterIndex}' method parameter of '${targetClass.name}'.`,
		);
		this.targetClass = targetClass;
		this.annotationName = annotationName;
		this.methodName = methodName;
		this.parameterIndex = parameterIndex;
	}
}

export class PropertyAnnotationAlreadyExistsError extends Error {
	public targetClass: Class<any>;
	public annotationName: string;
	public propertyKey: string | symbol;

	public constructor(targetClass: Class<any>, propertyKey: string | symbol, annotationName: string) {
		super(
			`Annotation '${annotationName}' already have defined for '${symbolOrStringToString(propertyKey)}' property of '${
				targetClass.name
			}'.`,
		);
		this.targetClass = targetClass;
		this.annotationName = annotationName;
		this.propertyKey = propertyKey;
	}
}
