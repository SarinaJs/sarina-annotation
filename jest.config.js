module.exports = {
	name: 'sarina-reflect',
	verbose: true,
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testRegex: '.spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['src/**/*.(t|j)s'],
	coverageDirectory: 'test_result/coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'@sarina/annotation/(.*)': '<rootDir>/src/$1',
		'@sarina/annotation': '<rootDir>/src/index.ts',
	},
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: -10,
		},
	},
};
