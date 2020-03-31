import { getAnnotations } from '@sarina/annotation';
import { reflectable, REFLECTABLE_META_KEY } from '@sarina/annotation';

describe('reflectable', () => {
	it('should_set_reflectable_class_annotation', () => {
		//Arange

		// Act
		@reflectable()
		class SampleType {}

		// Assert
		const annotations = getAnnotations(SampleType, { type: 'class', name: REFLECTABLE_META_KEY });
		expect(annotations.length).toBe(1);
	});

	it('should_set_reflectable_property_annotation', () => {
		// Act
		class SampleType {
			@reflectable()
			public title: string;
		}

		// Assert
		const annotations = getAnnotations(SampleType, { type: 'property', name: REFLECTABLE_META_KEY });
		expect(annotations.length).toBe(1);
	});
	it('should_set_reflectable_constructor_parameter_annotation', () => {
		// Act
		class SampleType {
			public constructor(@reflectable() name: string) {}
		}

		// Assert
		const annotations = getAnnotations(SampleType, { type: 'parameter', name: REFLECTABLE_META_KEY });
		expect(annotations.length).toBe(1);
	});
	it('should_set_reflectable_method_parameter_annotation', () => {
		// Act
		class SampleType {
			public run(@reflectable() name: string) {}
		}

		// Assert
		const annotations = getAnnotations(SampleType, { type: 'parameter', name: REFLECTABLE_META_KEY });
		expect(annotations.length).toBe(1);
	});
	it('should_set_reflectable_method_annotation', () => {
		// Act
		class SampleType {
			@reflectable()
			public run(name: string) {}
		}

		// Assert
		const annotations = getAnnotations(SampleType, { type: 'method', name: REFLECTABLE_META_KEY });
		expect(annotations.length).toBe(1);
	});
});
