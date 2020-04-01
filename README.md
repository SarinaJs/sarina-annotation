# sarina-annotation

A simplified Typescript decorator metadata library



- [sarina-annotation](#sarina-annotation)
- [What is Annotation](#what-is-annotation)
- [Installation](#installation)
- [Usage](#usage)
  - [Creating an Annotation](#creating-an-annotation)
  - [Reflecting Types](#reflecting-types)

# What is Annotation

Annotations is a Typescript decorator which attachs metadata to the types. Then this metada will be used in order of type reflection on runtime. 


# Installation

using npm:
```bash
npm install @sarina/annotation
```
using yarn:
```bash
yarn add @sarina/annotation
```

# Usage

Library have provided 4 functions in order to define an annotation decorator. annotations contains:

- `name`: which is required and used to re-call annoation on reflection process.
- `isMulti`: if you the annotation should be dfined once per type, pass `false`. decorator will rais error if annotation is duplicated. 
- `data`: an optionla data object which will attaches to the Type and are available during the reflection process.


## Creating an Annotation


```typescript
import { 
    classAnnotationDecoratorMaker, 
    methodAnnotationDecoratorMaker, 
    parameterAnnotationDecoratorMaker,
    parameterAnnotationDecoratorMaker
} from '@sarina/annotation';

const injectable : (name:string)=> ClassDecorator = (isGlobal:boolean=false)=> classAnnotationDecoratorMaker(
    'injectable', // the annotation name
    false, // single or multiple annotation
    {
        isGlobal:isGlobal
    });

const inject : (token?:string)=> ClassDecorator = (token?:string)=> parameterAnnotationDecoratorMaker(
    'inject', // the annotation name
    false, // single or multiple annotation
    {
        token:token
    });

const lazyInject : ( token?: string | symbol )=> ClassDecorator = (token:string)=> propertyAnnotationDecoratorMaker(
    'lazyInject', // the annotation name
    false, // single or multiple annotation
    {
        token:token
    });


const get : (prefix:string)=> ClassDecorator = (prefix:string)=> methodAnnotationDecoratorMaker(
    'get', // the annotation name
    false, // single or multiple annotation
    {
        prefix:prefix,
        method:'get',
    });

@injectable(true)
class SampleType{


    @lazyInject('nameValue')
    public name:string;

    public constructor(@Inject() myService: MyService){

    }

    @get('/')
    public run(){
    }

}
```

## Reflecting Types

```typescript

import { 
    getConstructor, 
    getMethod, 
    getProperty, 
    getType,
    ParameterInfo,
    ConstructorInfo,
    MethodInfo,
    PropertyInfo,
    Type
} from '@sarina/annotation';


const constructorInfo:ConstructorInfo = getConstructor(SampleType);
const runMethodInfo:MethodInfo = getMethod(SampleType,'run');
const namePropertyInfo:PropertyInfo = getProperty(SampleType,'name');
const typeInfo:PropertyInfo = getType(SampleType);

```

models:
```typescript
export interface ParameterInfo {
	index: number;
	annotations: ParameterAnnotation[];
	type: Class<any>;
}
export interface ConstructorInfo {
	isReflected: boolean;
	parameters: ParameterInfo[];
}
export interface MethodInfo {
	name: string | symbol;
	isReflected: boolean;
	returnType?: Class<any> | void;
	parameters: ParameterInfo[];
	annotations: MethodAnnotation[];
}
export interface PropertyInfo {
	name: string | symbol;
	isReflected: boolean;
	type?: Class<any>;
	annotations: PropertyAnnotation[];
}
export interface Type<T extends Class<T>> {
	name: string | symbol;
	isReflected: boolean;
	declaringType: Class<T>;
	constructor: ConstructorInfo;
	methods: MethodInfo[];
	properties: PropertyInfo[];
	annotations: ClassAnnotation[];
}
```