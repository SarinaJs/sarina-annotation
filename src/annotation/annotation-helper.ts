import { Class } from '../class.type';
import { ANNOTATIONS_KEY } from './consts';
import {
	ClassAnnotationAlreadyExistsError,
	PropertyAnnotationAlreadyExistsError,
	ParameterAnnotationAlreadyExistsError,
	MethodAnnotationAlreadyExistsError,
} from './../errors';
import { AnnotationTypes, Annotation, ClassAnnotation, MethodAnnotation, PropertyAnnotation } from './annotation.type';
import {
	ANNOTATION_CLASS_DEF_KEY,
	ANNOTATION_METHOD_DEF_KEY,
	ANNOTATION_PROPERTY_DEF_KEY,
	ClassTypeDef,
	MethodTypeDef,
	PropertyTypeDef,
} from './type-def.model';

// Methods
export function getAnnotations<TAnnotation extends Annotation>(
	target: any,
	filter?: { type?: AnnotationTypes; name?: string },
): TAnnotation[] {
	const getOrDefineAnnotations = () => {
		// if already exists, use the existing one
		if (Reflect.hasMetadata(ANNOTATIONS_KEY, target))
			return Reflect.getMetadata(ANNOTATIONS_KEY, target) as TAnnotation[];

		// define and return the array of decorators
		const annotations: TAnnotation[] = [];
		Reflect.defineMetadata(ANNOTATIONS_KEY, annotations, target);

		return annotations;
	};

	const annotations = getOrDefineAnnotations();

	// return all annotations
	if (!filter?.name && !filter?.type) return [...annotations];

	// filter an return annotations
	return [
		...annotations.filter((s) => (!filter.name || s.name == filter.name) && (!filter.type || s.type == filter.type)),
	];
}
export function setAnnotation<TAnnotation extends Annotation>(target: any, annotation: TAnnotation): void {
	let annotations: TAnnotation[] = null;
	if (Reflect.hasMetadata(ANNOTATIONS_KEY, target))
		annotations = Reflect.getMetadata(ANNOTATIONS_KEY, target) as TAnnotation[];
	else {
		annotations = [];
		Reflect.defineMetadata(ANNOTATIONS_KEY, annotations, target);
	}
	annotations.push(annotation);
}

export const classAnnotationDecoratorMaker = (name: string, isMulti: boolean, data?: any): ClassDecorator => {
	return (target: Function): void => {
		// fetch type annotations array
		const annotations = getAnnotations(target);

		// the annotation can be single/multi.
		//	single: only one annotation of type should be able to define for target
		if (!isMulti)
			if (annotations.findIndex((dec: Annotation) => dec.type == 'class' && dec.name == name) > -1)
				throw new ClassAnnotationAlreadyExistsError(target as Class<any>, name);

		// push into annotations list
		setAnnotation<ClassAnnotation>(target, {
			type: 'class',
			name: name,
			data: data,
		});

		// also we need to register type-def-meta
		if (annotations.findIndex((s) => s.type == 'class' && s.name == ANNOTATION_CLASS_DEF_KEY) == -1) {
			// fetch constructor parameter information
			const paramtypes = (Reflect.getMetadata('design:paramtypes', target) as any[]) || [];

			setAnnotation<ClassAnnotation>(target, {
				type: 'class',
				name: ANNOTATION_CLASS_DEF_KEY,
				data: {
					paramtypes: paramtypes.map((p, index) => ({ type: p, index: index })),
					type: target,
				} as ClassTypeDef,
			});
		}
	};
};
export const methodAnnotationDecoratorMaker = (name: string, isMulti: boolean, data?: any): MethodDecorator => {
	return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
		// fetch type annotations array
		const annotations = getAnnotations(target.constructor);

		// the annotation can be single/multi.
		//	single: only one annotation of type should be able to define for target
		if (!isMulti)
			if (
				annotations.findIndex(
					(dec: Annotation) =>
						dec.type == 'method' && //
						dec.methodName == propertyKey &&
						dec.name == name,
				) > -1
			)
				throw new MethodAnnotationAlreadyExistsError(target.constructor as Class<any>, propertyKey, name);

		// push into annotations list
		setAnnotation(target.constructor, {
			type: 'method',
			name: name,
			methodName: propertyKey,
			data: data,
		} as MethodAnnotation);

		// also we need to register type-def-meta
		if (
			annotations.findIndex(
				(s) => s.type == 'method' && s.name == ANNOTATION_METHOD_DEF_KEY && s.methodName == propertyKey,
			) == -1
		) {
			// fetch method information
			const returnType = Reflect.getMetadata('design:returntype', target, propertyKey);
			const paramtypes = (Reflect.getMetadata('design:paramtypes', target, propertyKey) as any[]) || [];

			setAnnotation<MethodAnnotation>(target.constructor, {
				type: 'method',
				name: ANNOTATION_METHOD_DEF_KEY,
				methodName: propertyKey,
				data: {
					type: target.constructor,
					name: propertyKey,
					returnType: returnType,
					descriptor: descriptor,
					paramtypes: paramtypes.map((p, index) => ({ type: p, index: index })),
				} as MethodTypeDef,
			});
		}
	};
};
export const parameterAnnotationDecoratorMaker = (name: string, isMulti: boolean, data?: any): ParameterDecorator => {
	return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {
		// get the method name and the target
		// 	- if property-key be null, it means the parameter has defined in constructor,
		//			the constructor is keywrod and only one function with `constructor` can be define in class
		//	- if the property-key is not-null, it's method annotation
		const methodName = !propertyKey ? 'constructor' : propertyKey;
		const theTarget = !propertyKey ? target : target.constructor; // for methods, the target is an object, we should use constructor of that

		// fetch type annotations array
		const annotations = getAnnotations(theTarget);

		// the annotation can be single/multi.
		//	single: only one annotation of type should be able to define for target
		if (!isMulti)
			if (
				annotations.findIndex(
					(dec: Annotation) =>
						dec.type == 'parameter' && //
						dec.methodName == methodName && //
						dec.name == name,
				) > -1
			)
				throw new ParameterAnnotationAlreadyExistsError(theTarget as Class<any>, methodName, parameterIndex, name);

		setAnnotation(theTarget, {
			type: 'parameter',
			name: name,
			methodName: methodName,
			parameterIndex: parameterIndex,
			data: data,
		});
	};
};
export const propertyAnnotationDecoratorMaker = (name: string, isMulti: boolean, data?: any): PropertyDecorator => {
	return (target: any, propertyKey: string | symbol): void => {
		// fetch type annotations array
		const annotations = getAnnotations(target.constructor);

		// the annotation can be single/multi.
		//	single: only one annotation of type should be able to define for target
		if (!isMulti)
			if (
				annotations.findIndex(
					(dec: Annotation) =>
						dec.type == 'property' && //
						dec.propertyName == propertyKey &&
						dec.name == name,
				) > -1
			)
				throw new PropertyAnnotationAlreadyExistsError(target.constructor as Class<any>, propertyKey, name);

		// the parameter-decorator can apply to the method/property/constructor
		//		- propertyKey == undefined -> if the function is constructor
		//		- propertyKey != undefined -> if the function is method/property ( Not constructor )
		setAnnotation(target.constructor, {
			type: 'property',
			name: name,
			propertyName: propertyKey,
			data: data,
		});

		// also we need to register type-def-meta
		if (
			annotations.findIndex(
				(s) =>
					s.type == 'property' && //
					s.propertyName == propertyKey && //
					s.name == ANNOTATION_PROPERTY_DEF_KEY,
			) == -1
		) {
			// fetch property type
			const typeMeta = Reflect.getMetadata('design:type', target, propertyKey);
			const dataType = typeMeta;

			setAnnotation<PropertyAnnotation>(target.constructor, {
				type: 'property',
				name: ANNOTATION_PROPERTY_DEF_KEY,
				propertyName: propertyKey,
				data: {
					name: propertyKey,
					type: dataType,
				} as PropertyTypeDef,
			});
		}
	};
};
