import { MethodNotFoundError } from '@sarina/annotation';

describe('errors', () => {
	describe('MethodNotFoundError', () => {
		it('should_create_error_with_currect_message', () => {
			// Arrange
			class MySampleType {}

			// Act
			const err = new MethodNotFoundError(MySampleType, 'run');

			// Assert
			expect(err.message).toBe("No Method as 'run' found for MySampleType.");
			expect(err.targetClass).toBe(MySampleType);
			expect(err.methodName).toBe('run');
		});
	});
});
