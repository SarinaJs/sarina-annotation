import 'reflect-metadata';
import { ANNOTATIONS_KEY } from '@sarina/annotation';
import {
	Annotation,
	ClassAnnotation,
	MethodAnnotation,
	PropertyAnnotation,
	ParameterAnnotation,
} from '@sarina/annotation';
import {
	getAnnotations,
	setAnnotation,
	classAnnotationDecoratorMaker,
	methodAnnotationDecoratorMaker,
	parameterAnnotationDecoratorMaker,
	propertyAnnotationDecoratorMaker,
} from '@sarina/annotation';
import { ANNOTATION_CLASS_DEF_KEY, ANNOTATION_METHOD_DEF_KEY, ANNOTATION_PROPERTY_DEF_KEY } from '@sarina/annotation';
import {
	ClassAnnotationAlreadyExistsError,
	MethodAnnotationAlreadyExistsError,
	PropertyAnnotationAlreadyExistsError,
	ParameterAnnotationAlreadyExistsError,
} from '@sarina/annotation';

describe('annotation', () => {
	describe('annotation-helper', () => {
		describe('getAnnotations', () => {
			it('should_define_and_return_empty_array_if_meta_not_found', () => {
				// Arrange
				class SampleType {}

				// Act
				const annotations = getAnnotations(SampleType);

				// Assert
				expect(annotations).toHaveLength(0);
			});
			it('should_return_existing_meta_if_meta_already_exists', () => {
				// Arrange
				class SampleType {}
				const meta: Annotation[] = [
					{
						type: 'class',
						data: {},
						name: 'test_annotation',
					},
				];
				Reflect.defineMetadata(ANNOTATIONS_KEY, meta, SampleType);

				// Act
				const annotations = getAnnotations(SampleType);

				// Assert
				expect(annotations).toHaveLength(1);
				expect(annotations[0].name).toBe('test_annotation');
			});
			it('should_return_all_annotations', () => {
				// Arrange
				class SampleType {}
				const meta: Annotation[] = [
					{
						type: 'class',
						data: {},
						name: 'name',
					},
				];
				Reflect.defineMetadata(ANNOTATIONS_KEY, meta, SampleType);

				// Act
				const annotations = getAnnotations(SampleType);

				// Assert
				expect(annotations).toHaveLength(1);
				expect(annotations).toMatchObject(meta);
			});
			it('should_return_annotations_filterd_by_type', () => {
				// Arrange
				class SampleType {}
				const meta: Annotation[] = [
					{
						type: 'class',
						data: {},
						name: 'class_2',
					},
					{
						type: 'class',
						data: {},
						name: 'class_1',
					},
					{
						type: 'method',
						data: {},
						name: 'run_method',
						methodName: 'run',
					},
				];
				Reflect.defineMetadata(ANNOTATIONS_KEY, meta, SampleType);

				// Act
				const annotations = getAnnotations(SampleType, { type: 'class' });

				// Assert
				expect(annotations).toHaveLength(2);
				expect(annotations).toMatchObject([meta[0], meta[1]]);
			});
			it('should_return_annotations_filterd_by_name', () => {
				// Arrange
				class SampleType {}
				const meta: Annotation[] = [
					{
						type: 'class',
						data: {},
						name: 'a1',
					},
					{
						type: 'class',
						data: {},
						name: 'a2',
					},
					{
						type: 'method',
						data: {},
						name: 'a1',
						methodName: 'run',
					},
				];
				Reflect.defineMetadata(ANNOTATIONS_KEY, meta, SampleType);

				// Act
				const annotations = getAnnotations(SampleType, { name: 'a1' });

				// Assert
				expect(annotations).toHaveLength(2);
				expect(annotations).toMatchObject([meta[0], meta[2]]);
			});
			it('should_return_annotations_filterd_by_name_and_type', () => {
				// Arrange
				class SampleType {}
				const meta: Annotation[] = [
					{
						type: 'class',
						data: {},
						name: 'a1',
					},
					{
						type: 'class',
						data: {},
						name: 'a2',
					},
					{
						type: 'method',
						data: {},
						name: 'a1',
						methodName: 'run',
					},
				];
				Reflect.defineMetadata(ANNOTATIONS_KEY, meta, SampleType);

				// Act
				const annotations = getAnnotations(SampleType, { type: 'class', name: 'a1' });

				// Assert
				expect(annotations).toHaveLength(1);
				expect(annotations).toMatchObject([meta[0]]);
			});
			it('should_return_copy_of_annotations', () => {
				// Arrange
				class SampleType {}
				const meta = [];
				Reflect.defineMetadata(ANNOTATIONS_KEY, meta, SampleType);

				// Act
				const annotations = getAnnotations(SampleType);

				// Assert
				expect(annotations).not.toBe(meta);
			});
		});
		describe('setAnnotation', () => {
			it('should_define_and_set_annotation_if_meta_not_found', () => {
				// Arrange
				class SampleType {}

				// Act
				const annotation: ClassAnnotation = {
					type: 'class',
					data: {},
					name: 'test',
				};
				setAnnotation(SampleType, annotation);

				// Assert
				const meta = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType);
				expect(meta).toHaveLength(1);
				expect(meta).toMatchObject([annotation]);
			});
			it('should_add_into_existing_annotation_if_meta_found', () => {
				// Arrange
				class SampleType {}
				const annotation1: ClassAnnotation = {
					type: 'class',
					data: {},
					name: 'annotation1',
				};
				Reflect.defineMetadata(ANNOTATIONS_KEY, [annotation1], SampleType);
				const meta = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType);

				// Act
				const annotation2: ClassAnnotation = {
					type: 'class',
					data: {},
					name: 'annotation2',
				};
				setAnnotation(SampleType, annotation2);

				// Assert
				expect(meta).toHaveLength(2);
				expect(meta).toMatchObject([annotation1, annotation2]);
			});
		});
		describe('classAnnotationDecoratorMaker', () => {
			it('should_return_decorator_function', () => {
				// Arrange
				class SampleType {}

				// Act
				const decorator = classAnnotationDecoratorMaker('my_decorator', false);
				decorator(SampleType);

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				const theAnnotaton = annotations.find((s) => s.name == 'my_decorator');
				expect(theAnnotaton.name).toBe('my_decorator');
				expect(theAnnotaton.type).toBe('class');
			});
			it('should_be_able_to_use_as_class_decorator', () => {
				// Arrange
				const decorator = classAnnotationDecoratorMaker('my_decorator', false);

				// Act
				@decorator
				class SampleType {}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				const theAnnotaton = annotations.find((s) => s.name == 'my_decorator');
				expect(theAnnotaton.name).toBe('my_decorator');
				expect(theAnnotaton.type).toBe('class');
			});
			it('should_set_data', () => {
				// Arrange
				const decorator = classAnnotationDecoratorMaker('my_decorator', false, { key: 'value' });

				// Act
				@decorator
				class SampleType {
					public constructor(key: string) {}
				}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				const theAnnotaton = annotations.find((s) => s.name == 'my_decorator');
				expect(theAnnotaton.data).toMatchObject({
					key: 'value',
				});
			});
			it('should_raise_error_if_annotation_of_type_exists_is_single', () => {
				// Arrange
				class SampleType {}
				const decorator = classAnnotationDecoratorMaker('my_decorator', false);
				decorator(SampleType);

				// Act
				const action = () => decorator(SampleType);

				// Assert
				try {
					action();
				} catch (err) {
					const error = err as ClassAnnotationAlreadyExistsError;
					expect(error.message).toBe("Annotation 'my_decorator' already have defined for 'SampleType'.");
				}
			});
			it('should_define_multiple_annotation_if_is_multi', () => {
				// Arrange
				class SampleType {}
				const decorator = classAnnotationDecoratorMaker('my_decorator', true);
				decorator(SampleType);

				// Act
				const action = () => decorator(SampleType);

				// Assert
				expect(action).not.toThrow();
			});
			it('should_define_class_def_annotation', () => {
				// Arrange
				const decorator = classAnnotationDecoratorMaker('my_decorator', false);

				// Act
				@decorator
				class SampleType {
					public constructor(key: string) {}
				}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				const theAnnotaton = annotations.find((s) => s.name == ANNOTATION_CLASS_DEF_KEY);
				expect(theAnnotaton.type).toBe('class');
				expect(theAnnotaton.data).toMatchObject({
					type: SampleType,
					paramtypes: [
						{
							index: 0,
							type: String,
						},
					],
				});
			});
			it('should_not_define_class_def_annotation_if_already_has_defined', () => {
				// Arrange
				const decorator = classAnnotationDecoratorMaker('my_decorator', true);

				// Act
				@decorator
				@decorator
				class SampleType {
					public constructor(key: string) {}
				}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				expect(annotations).toHaveLength(3);
			});
		});
		describe('methodAnnotationDecoratorMaker', () => {
			it('should_return_decorator_function', () => {
				// Arrange
				class SampleType {}

				// Act
				const decorator = methodAnnotationDecoratorMaker('my_decorator', false);
				const descriptor = {};
				decorator(SampleType.prototype, 'run', descriptor);

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as MethodAnnotation[];
				expect(decorators[0].name).toBe('my_decorator');
				expect(decorators[0].type).toBe('method');
				expect(decorators[0].methodName).toBe('run');
			});
			it('should_be_able_to_use_as_method_decorator', () => {
				// Arrange
				const decorator = methodAnnotationDecoratorMaker('my_decorator', false);

				// Act
				class SampleType {
					@decorator
					public run() {}
				}

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as MethodAnnotation[];
				expect(decorators[0].name).toBe('my_decorator');
				expect(decorators[0].type).toBe('method');
				expect(decorators[0].methodName).toBe('run');
			});
			it('should_set_data', () => {
				// Arrange
				const decorator = methodAnnotationDecoratorMaker('my_decorator', false, { key: 'value' });

				// Act

				class SampleType {
					@decorator
					public run() {}
				}

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as MethodAnnotation[];
				expect(decorators[0].data).toMatchObject({ key: 'value' });
			});
			it('should_raise_error_if_annotation_of_type_exists_is_single', () => {
				// Arrange
				class SampleType {}
				const decorator = methodAnnotationDecoratorMaker('my_decorator', false);
				decorator(SampleType.prototype, 'run', {});

				// Act
				const action = () => decorator(SampleType.prototype, 'run', {});

				// Assert
				try {
					action();
				} catch (err) {
					const error = err as MethodAnnotationAlreadyExistsError;
					expect(error.message).toBe(
						"Annotation 'my_decorator' already have defined for 'run' method of 'SampleType'.",
					);
				}
			});
			it('should_define_multiple_annotation_if_is_multi', () => {
				// Arrange
				class SampleType {}
				const decorator = methodAnnotationDecoratorMaker('my_decorator', true);
				decorator(SampleType.prototype, 'run', {});

				// Act
				const action = () => decorator(SampleType.prototype, 'run', {});

				// Assert
				expect(action).not.toThrow();
			});
			it('should_define_method_def_annotation', () => {
				// Arrange
				const decorator = methodAnnotationDecoratorMaker('my_decorator', false);

				// Act
				class SampleType {
					@decorator
					public run(key: string): string {
						return 'hi';
					}
				}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				const theAnnotaton = annotations.find((s) => s.name == ANNOTATION_METHOD_DEF_KEY);
				expect(theAnnotaton.type).toBe('method');
				expect(theAnnotaton.data).toMatchObject({
					type: SampleType,
					name: 'run',
					returnType: String,
					descriptor: {},
					paramtypes: [
						{
							index: 0,
							type: String,
						},
					],
				});
			});
			it('should_not_define_class_def_annotation_if_already_has_defined', () => {
				// Arrange
				const decorator = methodAnnotationDecoratorMaker('my_decorator', true);

				// Act
				class SampleType {
					@decorator
					@decorator
					public run(key: string) {}
				}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as Annotation[];
				expect(annotations).toHaveLength(3);
			});
			it('should_set_returnType_null_for_void', () => {
				// Arrange
				const decorator = methodAnnotationDecoratorMaker('my_decorator', false);

				// Act
				class SampleType {
					@decorator
					public run(key: string) {}
				}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				const theAnnotaton = annotations.find((s) => s.name == ANNOTATION_METHOD_DEF_KEY);
				expect(theAnnotaton.type).toBe('method');
				expect(theAnnotaton.data).toMatchObject({
					type: SampleType,
					name: 'run',
					returnType: undefined,
					descriptor: {},
					paramtypes: [
						{
							index: 0,
							type: String,
						},
					],
				});
			});
		});
		describe('parameterAnnotationDecoratorMaker', () => {
			it('should_return_decorator_function', () => {
				// Arrange
				class SampleType {}

				// Act
				const decorator = parameterAnnotationDecoratorMaker('my_decorator', false);
				decorator(SampleType, null, 0);

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ParameterAnnotation[];
				expect(decorators[0].name).toBe('my_decorator');
				expect(decorators[0].type).toBe('parameter');
				expect(decorators[0].parameterIndex).toBe(0);
			});
			it('should_be_able_to_use_as_constructor_parameter_decorator', () => {
				// Arrange
				const decorator = parameterAnnotationDecoratorMaker('my_decorator', false);

				// Act
				class SampleType {
					public constructor(@decorator name: string) {}
				}

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ParameterAnnotation[];
				expect(decorators[0].name).toBe('my_decorator');
				expect(decorators[0].type).toBe('parameter');
				expect(decorators[0].parameterIndex).toBe(0);
				expect(decorators[0].methodName).toBe('constructor');
			});
			it('should_be_able_to_use_as_method_parameter_decorator', () => {
				// Arrange
				const decorator = parameterAnnotationDecoratorMaker('my_decorator', false);

				// Act
				class SampleType {
					public run(@decorator name: string) {}
				}

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ParameterAnnotation[];
				expect(decorators[0].name).toBe('my_decorator');
				expect(decorators[0].type).toBe('parameter');
				expect(decorators[0].parameterIndex).toBe(0);
				expect(decorators[0].methodName).toBe('run');
			});
			it('should_set_data', () => {
				// Arrange
				const decorator = parameterAnnotationDecoratorMaker('my_decorator', false, { key: 'value' });

				// Act
				class SampleType {
					public constructor(@decorator name: string) {}
				}

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ParameterAnnotation[];
				expect(decorators[0].data).toMatchObject({ key: 'value' });
			});
			it('should_raise_error_if_annotation_of_type_exists_is_single', () => {
				// Arrange
				class SampleType {}
				const decorator = parameterAnnotationDecoratorMaker('my_decorator', false);
				decorator(SampleType, null, 0);

				// Act
				const action = () => decorator(SampleType, null, 0);

				// Assert
				try {
					action();
				} catch (err) {
					const error = err as ParameterAnnotationAlreadyExistsError;
					expect(error.message).toBe(
						"Annotation 'my_decorator' already have defined for 'constructor#0' method parameter of 'SampleType'.",
					);
				}
			});
			it('should_define_multiple_annotation_if_is_multi', () => {
				// Arrange
				class SampleType {}
				const decorator = parameterAnnotationDecoratorMaker('my_decorator', true);
				decorator(SampleType, null, 0);

				// Act
				const action = () => decorator(SampleType, null, 0);

				// Assert
				expect(action).not.toThrow();
			});
		});
		describe('propertyAnnotationDecoratorMaker', () => {
			it('should_return_decorator_function', () => {
				// Arrange
				class SampleType {}

				// Act
				const decorator = propertyAnnotationDecoratorMaker('my_decorator', false);
				decorator(SampleType.prototype, 'title');

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as PropertyAnnotation[];
				expect(decorators[0].name).toBe('my_decorator');
				expect(decorators[0].type).toBe('property');
				expect(decorators[0].propertyName).toBe('title');
			});
			it('should_be_able_to_use_as_property_decorator', () => {
				// Arrange
				const decorator = propertyAnnotationDecoratorMaker('my_decorator', false);

				// Act

				class SampleType {
					@decorator
					public title: string;
				}

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as PropertyAnnotation[];
				expect(decorators[0].name).toBe('my_decorator');
				expect(decorators[0].type).toBe('property');
				expect(decorators[0].propertyName).toBe('title');
			});
			it('should_set_data', () => {
				// Arrange
				const decorator = propertyAnnotationDecoratorMaker('my_decorator', false, { key: 'value' });

				// Act

				class SampleType {
					@decorator
					public title: string;
				}

				// Assert
				const decorators = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as PropertyAnnotation[];
				expect(decorators[0].data).toMatchObject({ key: 'value' });
			});
			it('should_raise_error_if_annotation_of_type_exists_is_single', () => {
				// Arrange
				class SampleType {}
				const decorator = propertyAnnotationDecoratorMaker('my_decorator', false);
				decorator(SampleType.prototype, 'title');

				// Act
				const action = () => decorator(SampleType.prototype, 'title');

				// Assert
				try {
					action();
				} catch (err) {
					const error = err as ParameterAnnotationAlreadyExistsError;
					expect(error.message).toBe(
						"Annotation 'my_decorator' already have defined for 'title' property of 'SampleType'.",
					);
				}
			});
			it('should_define_multiple_annotation_if_is_multi', () => {
				// Arrange
				class SampleType {}
				const decorator = propertyAnnotationDecoratorMaker('my_decorator', true);
				decorator(SampleType.prototype, 'title');

				// Act
				const action = () => decorator(SampleType.prototype, 'title');

				// Assert
				expect(action).not.toThrow();
			});
			it('should_define_property_def_annotation', () => {
				// Arrange
				const decorator = propertyAnnotationDecoratorMaker('my_decorator', false);

				// Act
				class SampleType {
					@decorator
					public title: string;
				}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				const theAnnotaton = annotations.find((s) => s.name == ANNOTATION_PROPERTY_DEF_KEY);
				expect(theAnnotaton.type).toBe('property');
				expect(theAnnotaton.data).toMatchObject({
					type: String,
					name: 'title',
				});
			});
			it('should_not_define_property_def_annotation_if_already_has_defined', () => {
				// Arrange
				const decorator = propertyAnnotationDecoratorMaker('my_decorator', true);

				// Act
				class SampleType {
					@decorator
					@decorator
					public title: string;
				}

				// Assert
				const annotations = Reflect.getMetadata(ANNOTATIONS_KEY, SampleType) as ClassAnnotation[];
				expect(annotations).toHaveLength(3);
			});
		});
	});
});
