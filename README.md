# Sarina Annotation

A simplified Typescript decorator metadata library



- [Sarina Annotation](#sarina-annotation)
- [Installation](#installation)
- [Background](#background)
- [Goals](#goals)
- [Syntax](#syntax)
  - [Creating and using an annotation](#creating-and-using-an-annotation)
  - [Reflecting Types](#reflecting-types)
- [How to contribute](#how-to-contribute)

# Installation

using npm:
```bash
npm install @sarina/annotation
```
using yarn:
```bash
yarn add @sarina/annotation
```

Also enabling `emitDecoratorMetadata` and `experimentalDecorators` for typescript compiler is required.


# Background

Languages like C# or Java support annotations or attributes that add metadata to types, along with reflective API for reading metadata. Typescript emmits type definitions as meta and by using `reflect-metadata` its possible to access defined meta. 


# Goals

- Reflecting type definitions at runtime.
- Attaching custom metadata with custom data to the types.
- Compatible with `reflect-metadata` library


# Syntax

Library have provided 4 functions in order to define an annotation decorator:
- classAnnotationDecoratorMaker
- methodAnnotationDecoratorMaker
- parameterAnnotationDecoratorMaker
- parameterAnnotationDecoratorMaker

All makers function, requires following parameters:

- `name`: required, used to re-call annoation on reflection process.
- `isMulti`: required, set `false` if only one annotation by name is allowed.
- `data`: optional, extra information to store as annotation.


## Creating and using an annotation

```typescript
import { 
    classAnnotationDecoratorMaker, 
    methodAnnotationDecoratorMaker, 
    parameterAnnotationDecoratorMaker,
    parameterAnnotationDecoratorMaker
} from '@sarina/annotation';

const injectable : (name:string)=> ClassDecorator = (isGlobal:boolean=false)=> classAnnotationDecoratorMaker(
    'injectable',
    false,
    {
        isGlobal:isGlobal
    });

const inject : (token?:string)=> ParamterDecorator = (token?:string)=> parameterAnnotationDecoratorMaker(
    'inject',
    false,
    {
        token:token
    });
const query : (name)=> ParamterDecorator = (name)=> parameterAnnotationDecoratorMaker(
    'query',
    false,
    {
        name:name
    });

const lazyInject : ( token?: string | symbol )=> PropertyDecorator = (token:string)=> propertyAnnotationDecoratorMaker(
    'lazyInject',
    false,
    {
        token:token
    });


const get : (prefix:string)=> MethodDecorator = (prefix:string)=> methodAnnotationDecoratorMaker(
    'route',
    false,
    {
        prefix:prefix,
        method:'GET',
    });

@injectable(true)
class SampleType{


    @lazyInject('nameValue')
    public name:string;

    public constructor(@Inject('myToken') myService: MyService){

    }

    @get('/')
    public run(@query('title') title:String):String{
        return 'hi';
    }

}
```

## Reflecting Types

```typescript

import { 

    // Apis
    getConstructor, 
    getMethod, 
    getProperty, 
    getType,
    getAnnotation

    // models
    ParameterInfo,
    ConstructorInfo,
    MethodInfo,
    PropertyInfo,
    Type
} from '@sarina/annotation';


const annotations = getAnnotation(SampleType,{
    type:'class', // optional
    name:'injectable' // optional
})
/*
[
    {
        type:'class',
        name:'injectable',
        data:{ isGlobal:true }
    }
]
*/

const constructorInfo:ConstructorInfo = getConstructor(SampleType);
/*
{
    isReflected: true,
	parameters: [
        {
            index: 0,
            type: MyService
            annotations:[
                {
                    type: 'parameter',
                    name:'inject'
                    methodName: 'constructor',
                    parameterIndex: 0
                    data:{
                        token:'myToken'
                    }
                }
            ]
        }
    ]
}
*/

const runMethodInfo:MethodInfo = getMethod(SampleType,'run');

/*
{
    name: 'run',
	isReflected: true,
	returnType: String,
	parameters: [
        {
            index:0,
            type:Stirng,
            annotations:[
                {
                    type:'parameter',
                    index:0,
                    data:{ name:'title' }
                }
            ]       
        }
    ],
    annotations: [{
        type:'method',
        name:'route',
        methodName:'run',
        data:{
            prefix:'/',
            method':'GET'
        }
    }]
}
*/

const namePropertyInfo:PropertyInfo = getProperty(SampleType,'name');
/*
{
    isReflected:true,
    name:'name',
    type: String,
    annotations:[{
        type:'property',
        name:'nameValue',
        propertyName:'name',
        data:{ token: 'nameValue' }
    }]
}
*/
const typeInfo:PropertyInfo = getType(SampleType);
/*
{
    isReflected: true;
    name: 'SampleType';
	declaringType: SampleType;
	constructor: {
        {
            isReflected: true,
            parameters: [
                {
                    index: 0,
                    type: MyService
                    annotations:[
                        {
                            type: 'parameter',
                            name:'inject'
                            methodName: 'constructor',
                            parameterIndex: 0
                            data:{
                                token:'myToken'
                            }
                        }
                    ]
                }
            ]
        }
    };
	methods: [
        {
            name: 'run',
            isReflected: true,
            returnType: String,
            parameters: [
                {
                    index:0,
                    type:Stirng,
                    annotations:[
                        {
                            type:'parameter',
                            index:0,
                            data:{ name:'title' }
                        }
                    ]       
                }
            ],
            annotations: [{
                type:'method',
                name:'route',
                methodName:'run',
                data:{
                    prefix:'/',
                    method':'GET'
                }
            }]
        }
    ];
	properties: [
        {
            isReflected:true,
            name:'name',
            type: String,
            annotations:[{
                type:'property',
                name:'nameValue',
                propertyName:'name',
                data:{ token: 'nameValue' }
            }]
        }
    ];
	annotations: [
        {
            type:'class',
            name:'injectable',
            data:{ isGlobal:true }
        }
    ];
}
*/
```

# How to contribute
Just fork the project, make your changes send us a PR.