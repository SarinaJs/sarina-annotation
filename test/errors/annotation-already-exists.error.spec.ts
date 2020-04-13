import {
	ClassAnnotationAlreadyExistsError,
	MethodAnnotationAlreadyExistsError,
	ParameterAnnotationAlreadyExistsError,
	PropertyAnnotationAlreadyExistsError,
	symbolOrStringToString,
} from '@sarina/annotation';

describe('errors', () => {
	describe('AnnotationAlreadyExistsError', () => {
		describe('symbolOrStringToString', () => {
			it('should_return_value_for_string', () => {
				// Arrange

				// Act
				const value = symbolOrStringToString('test');

				// Assert
				expect(value).toBe('test');
			});
			it('should_return_value_for_symbol', () => {
				// Arrange

				// Act
				const value = symbolOrStringToString(Symbol('test'));
				expect(value).toBe('Symbol(test)');
			});
		});
		it('ClassAnnotationAlreadyExistsError_should_provider_values', () => {
			// Arrange
			class SampleType {}

			// Act
			const err = new ClassAnnotationAlreadyExistsError(SampleType, 'injectable');

			// Assert
			expect(err.message).toBe(`Annotation 'injectable' already have defined for 'SampleType'.`);
			expect(err.annotationName).toBe('injectable');
			expect(err.targetClass).toBe(SampleType);
		});
		it('MethodAnnotationAlreadyExistsError_should_provider_values', () => {
			// Arrange
			class SampleType {}

			// Act
			const err = new MethodAnnotationAlreadyExistsError(SampleType, 'run', 'injectable');

			// Assert
			expect(err.message).toBe(`Annotation 'injectable' already have defined for 'run' method of 'SampleType'.`);
			expect(err.annotationName).toBe('injectable');
			expect(err.targetClass).toBe(SampleType);
			expect(err.methodName).toBe('run');
		});
		it('ParameterAnnotationAlreadyExistsError_should_provider_values', () => {
			// Arrange
			class SampleType {}

			// Act
			const err = new ParameterAnnotationAlreadyExistsError(SampleType, 'run', 0, 'injectable');

			// Assert
			expect(err.message).toBe(
				"Annotation 'injectable' already have defined for 'run#0' method parameter of 'SampleType'.",
			);
			expect(err.annotationName).toBe('injectable');
			expect(err.targetClass).toBe(SampleType);
			expect(err.methodName).toBe('run');
			expect(err.parameterIndex).toBe(0);
		});
		it('PropertyAnnotationAlreadyExistsError_should_provider_values', () => {
			// Arrange
			class SampleType {}

			// Act
			const err = new PropertyAnnotationAlreadyExistsError(SampleType, 'title', 'injectable');

			// Assert
			expect(err.message).toBe("Annotation 'injectable' already have defined for 'title' property of 'SampleType'.");
			expect(err.annotationName).toBe('injectable');
			expect(err.targetClass).toBe(SampleType);
			expect(err.propertyKey).toBe('title');
		});
	});
});
