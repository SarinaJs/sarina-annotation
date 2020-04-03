import { reflectable, methodAnnotationDecoratorMaker, classAnnotationDecoratorMaker } from '@sarina/annotation';
import { getConstructor, getMethod, getProperty, getType } from '@sarina/annotation';
import { parameterAnnotationDecoratorMaker, propertyAnnotationDecoratorMaker } from '@sarina/annotation';

describe('type-helper', () => {
	describe('getConstructor', () => {
		it('should_return_not_reflected_if_not_reflected_decorator_founds', () => {
			// Arrange
			class SampleType {}

			// Act
			const cstr = getConstructor(SampleType);

			// Assert
			expect(cstr.isReflected).toBe(false);
		});
		it('should_return_empty_constructor', () => {
			// Arrange
			@reflectable()
			class SampleType {}

			// Act
			const constructor = getConstructor(SampleType);

			// Assert
			expect(constructor.parameters).toHaveLength(0);
		});
		it('should_return_no_annotated_constructor', () => {
			// Arrange
			@reflectable()
			class SampleType {
				constructor(name: string) {}
			}

			// Act
			const constructor = getConstructor(SampleType);

			// Assert
			expect(constructor.parameters).toHaveLength(1);
			expect(constructor.parameters[0].index).toBe(0);
			expect(constructor.parameters[0].type).toBe(String);
			expect(constructor.parameters[0].annotations).toHaveLength(0);
		});
		it('should_return_annotated_constructor', () => {
			// Arrange
			const optional = (isOptional: boolean = true) =>
				parameterAnnotationDecoratorMaker('optional', true, { isOptional: isOptional });

			@reflectable()
			class SampleType {
				constructor(@optional(true) name: string) {}
			}

			// Act
			const constructor = getConstructor(SampleType);

			// Assert
			expect(constructor.parameters).toHaveLength(1);
			expect(constructor.parameters[0].index).toBe(0);
			expect(constructor.parameters[0].type).toBe(String);
			expect(constructor.parameters[0].annotations).toHaveLength(1);
			expect(constructor.parameters[0].annotations[0].data).toMatchObject({ isOptional: true });
			expect(constructor.parameters[0].annotations[0].name).toBe('optional');
			expect(constructor.parameters[0].annotations[0].parameterIndex).toBe(0);
		});
	});
	describe('getMethod', () => {
		it('should_raise_if_method_not_found', () => {
			// Arrange
			@reflectable()
			class SampleType {}

			// Act
			const action = () => getMethod(SampleType, 'run');

			// Assert
			expect(action).toThrow("Method 'run' not found.");
		});
		it('should_return_result_with_not_reflected_value', () => {
			// Arrange
			class SampleType {
				run() {}
			}

			// Act
			const method = getMethod(SampleType, 'run');

			// Assert
			expect(method.isReflected).toBe(false);
			expect(method.annotations).toHaveLength(0);
			expect(method.name).toBe('run');
			expect(method.parameters).toHaveLength(0);
			expect(method.returnType).toBeUndefined();
		});
		it('should_return_result_with_reflected_value', () => {
			// Arrange
			class SampleType {
				@reflectable()
				run() {}
			}

			// Act
			const method = getMethod(SampleType, 'run');

			// Assert
			expect(method.isReflected).toBe(true);
		});
		it('should_return_empty_method', () => {
			// Arrange
			@reflectable()
			class SampleType {
				public run() {}
			}

			// Act
			const methodInfo = getMethod(SampleType, 'run');

			// Assert
			expect(methodInfo.name).toBe('run');
			expect(methodInfo.parameters).toHaveLength(0);
			expect(methodInfo.annotations).toHaveLength(0);
		});
		it('should_return_parameters', () => {
			// Arrange
			class SampleType {
				@reflectable()
				public run(name: string): string {
					return 'test';
				}
			}

			// Act
			const methodInfo = getMethod(SampleType, 'run');

			// Assert
			expect(methodInfo.name).toBe('run');
			expect(methodInfo.parameters).toHaveLength(1);
			expect(methodInfo.parameters[0].index).toBe(0);
			expect(methodInfo.parameters[0].type).toBe(String);
		});
		it('should_return_parameters_annotations', () => {
			// Arrange
			const optional = parameterAnnotationDecoratorMaker('optional', true);
			class SampleType {
				@reflectable()
				public run(@optional name: string): string {
					return 'test';
				}
			}

			// Act
			const methodInfo = getMethod(SampleType, 'run');

			// Assert
			expect(methodInfo.name).toBe('run');
			expect(methodInfo.parameters).toHaveLength(1);
			expect(methodInfo.parameters[0].index).toBe(0);
			expect(methodInfo.parameters[0].annotations).toHaveLength(1);
			expect(methodInfo.parameters[0].annotations[0].type).toBe('parameter');
			expect(methodInfo.parameters[0].annotations[0].name).toBe('optional');
		});
		it('should_return_void_returnType_method', () => {
			// Arrange
			@reflectable()
			class SampleType {
				@reflectable()
				public run(): void {}
			}

			// Act
			const methodInfo = getMethod(SampleType, 'run');

			// Assert
			expect(methodInfo.name).toBe('run');
			expect(methodInfo.returnType).toBeUndefined();
		});
		it('should_return_returnType_method', () => {
			// Arrange
			@reflectable()
			class SampleType {
				@reflectable()
				public run(): string {
					return 'test';
				}
			}

			// Act
			const methodInfo = getMethod(SampleType, 'run');

			// Assert
			expect(methodInfo.name).toBe('run');
			expect(methodInfo.returnType).toBe(String);
		});
		it('should_return_parameters', () => {
			// Arrange
			@reflectable()
			class SampleType {
				@reflectable()
				public run(name: string): string {
					return 'test';
				}
			}

			// Act
			const methodInfo = getMethod(SampleType, 'run');

			// Assert
			expect(methodInfo.name).toBe('run');
			expect(methodInfo.parameters).toHaveLength(1);
			expect(methodInfo.parameters[0].index).toBe(0);
			expect(methodInfo.parameters[0].type).toBe(String);
		});
		it('should_return_annotations', () => {
			// Arrange
			const inject = methodAnnotationDecoratorMaker('inject', true);
			class SampleType {
				@reflectable()
				@inject
				public run(): string {
					return 'test';
				}
			}

			// Act
			const methodInfo = getMethod(SampleType, 'run');

			// Assert
			expect(methodInfo.name).toBe('run');
			expect(methodInfo.annotations).toHaveLength(3);
			const theInjectAnnotation = methodInfo.annotations.find((s) => s.name == 'inject');
			expect(theInjectAnnotation.name).toBe('inject');
			expect(theInjectAnnotation.methodName).toBe('run');
		});
	});
	describe('getProperty', () => {
		it('should_return_result_with_not_reflected_value_if_property_not_found', () => {
			// Arrange
			class SampleType {}

			// Act
			const prop = getProperty(SampleType, 'title');

			// Assert
			expect(prop.isReflected).toBe(false);
			expect(prop.name).toBe('title');
			expect(prop.annotations).toHaveLength(0);
		});
		it('should_return_result_with_reflected_value', () => {
			// Arrange
			class SampleType {
				@reflectable()
				title: string;
			}

			// Act
			const prop = getProperty(SampleType, 'title');

			// Assert
			expect(prop.isReflected).toBe(true);
		});
		it('should_return_property_type', () => {
			// Arrange
			class SampleType {
				@reflectable()
				title: string;
			}

			// Act
			const prop = getProperty(SampleType, 'title');

			// Assert
			expect(prop.isReflected).toBe(true);
			expect(prop.type).toBe(String);
		});
		it('should_return_property_annotations', () => {
			// Arrange
			const optional = propertyAnnotationDecoratorMaker('optional', true);
			class SampleType {
				@reflectable()
				@optional
				title: string;
			}

			// Act
			const prop = getProperty(SampleType, 'title');

			// Assert
			expect(prop.annotations).toHaveLength(3);
			const theOptionalAnnotation = prop.annotations.find((s) => s.name == 'optional');
			expect(theOptionalAnnotation.name).toBe('optional');
			expect(theOptionalAnnotation.propertyName).toBe('title');
		});
	});
	describe('getType', () => {
		it('should_return_result_with_not_reflected_value_if_type_not_reflected', () => {
			// Arrange
			class SampleType {
				run() {}
			}

			// Act
			const type = getType(SampleType);

			// Assert
			expect(type.isReflected).toBe(false);
			expect(type.annotations).toHaveLength(0);
			expect(type.constructor.isReflected).toBeFalsy();
			expect(type.methods).toHaveLength(1);
			expect(type.methods[0].isReflected).toBeFalsy();
			expect(type.name).toBe('SampleType');
			expect(type.properties).toHaveLength(0);
		});
		it('should_return_result_with_reflected_value_if_type_reflected', () => {
			// Arrange
			@reflectable()
			class SampleType {
				run() {}
			}

			// Act
			const type = getType(SampleType);

			// Assert
			expect(type.isReflected).toBe(true);
			expect(type.annotations).toHaveLength(2);
			expect(type.constructor.isReflected).toBeTruthy();
			expect(type.methods).toHaveLength(1);
			expect(type.methods[0].isReflected).toBeFalsy();
			expect(type.name).toBe('SampleType');
			expect(type.properties).toHaveLength(0);
		});
		it('should_set_the_type_name', () => {
			// Arrange
			@reflectable()
			class SampleType {
				run() {}
			}

			// Act
			const type = getType(SampleType);

			// Assert
			expect(type.name).toBe('SampleType');
		});
		it('should_set_the_declration_type', () => {
			// Arrange
			@reflectable()
			class SampleType {
				run() {}
			}

			// Act
			const type = getType(SampleType);

			// Assert
			expect(type.declaringType).toBe(SampleType);
		});
		it('should_set_the_constructor', () => {
			// Arrange
			@reflectable()
			class SampleType {
				public constructor(name: string) {}
			}

			// Act
			const type = getType(SampleType);

			// Assert
			expect(type.constructor.isReflected).toBe(true);
			expect(type.constructor.parameters).toHaveLength(1);
			expect(type.constructor.parameters[0].index).toBe(0);
			expect(type.constructor.parameters[0].type).toBe(String);
		});
		it('should_set_the_methods', () => {
			// Arrange
			@reflectable()
			class SampleType {
				@reflectable()
				public run(name: string) {}
			}

			// Act
			const type = getType(SampleType);

			// Assert
			expect(type.isReflected).toBe(true);
			expect(type.methods).toHaveLength(1);
			expect(type.methods[0].name).toBe('run');
		});
		it('should_set_the_properties', () => {
			// Arrange
			@reflectable()
			class SampleType {
				@reflectable()
				public title: string;
			}

			// Act
			const type = getType(SampleType);

			// Assert
			expect(type.isReflected).toBe(true);
			expect(type.properties).toHaveLength(1);
			expect(type.properties[0].name).toBe('title');
		});
		it('should_set_the_annotations', () => {
			// Arrange
			const injectable = classAnnotationDecoratorMaker('injectable', true);
			@reflectable()
			@injectable
			class SampleType {}

			// Act
			const type = getType(SampleType);

			// Assert
			expect(type.isReflected).toBe(true);
			expect(type.annotations).toHaveLength(3);
			const names = type.annotations.map((s) => s.name);
			expect(names).toContain('reflectable');
			expect(names).toContain('injectable');
		});
	});
});
