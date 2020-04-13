import { Class } from '../class.type';

export class MethodNotFoundError extends Error {
	public targetClass: Class<any>;
	public methodName: string;

	public constructor(targetClass: Class<any>, methodName: string) {
		super(`No Method as '${methodName}' found for ${targetClass.name}.`);
		this.targetClass = targetClass;
		this.methodName = methodName;
	}
}
