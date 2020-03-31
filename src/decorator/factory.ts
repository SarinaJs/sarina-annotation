import { Class } from '../class.type';
import { DecoratorFactory } from './decorators-factory.type';

export const classDecoratorFactoryMaker = (): DecoratorFactory<ClassDecorator> => {
	return (...args: any[]): ClassDecorator => {
		return (target: Function) => void {
            
        };
	};
};
