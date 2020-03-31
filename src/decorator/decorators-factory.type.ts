// Types
export type DecoratorFactory<TDecorator extends Function> = (...args: any[]) => TDecorator;
