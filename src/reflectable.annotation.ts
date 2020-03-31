import 'reflect-metadata';
import {
	classAnnotationDecoratorMaker,
	parameterAnnotationDecoratorMaker,
	methodAnnotationDecoratorMaker,
	propertyAnnotationDecoratorMaker,
} from '@sarina/annotation';

export const REFLECTABLE_META_KEY = 'reflectable';
const classDecorator = classAnnotationDecoratorMaker(REFLECTABLE_META_KEY, false);
const parameterDecorator = parameterAnnotationDecoratorMaker(REFLECTABLE_META_KEY, false);
const methodDecorator = methodAnnotationDecoratorMaker(REFLECTABLE_META_KEY, false);
const propertyDecorator = propertyAnnotationDecoratorMaker(REFLECTABLE_META_KEY, false);

const isUndefinedOrNull = (v) => {
	return v == undefined || v == null;
};

type GeneralDecorator = (...args: any[]) => void;
export const reflectable: () => GeneralDecorator = (...args: any[]) => {
	return (target: any, propertyKey: string, descriptorOrIndex: number | PropertyDescriptor) => {
		// class-decorator
		if (isUndefinedOrNull(propertyKey) && isUndefinedOrNull(descriptorOrIndex)) return classDecorator(target);
		// property descriptor
		else if (!isUndefinedOrNull(propertyKey) && isUndefinedOrNull(descriptorOrIndex))
			return propertyDecorator(target, propertyKey);
		// constructor-parameter
		else if (isUndefinedOrNull(propertyKey) && !isUndefinedOrNull(descriptorOrIndex))
			return parameterDecorator(target, propertyKey, descriptorOrIndex as number);
		// method-parameter
		else if (!isUndefinedOrNull(propertyKey) && typeof descriptorOrIndex == 'number')
			return parameterDecorator(target, propertyKey, descriptorOrIndex as number);
		// method
		else return methodDecorator(target, propertyKey, descriptorOrIndex as PropertyDescriptor);
	};
};
