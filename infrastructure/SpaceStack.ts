import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Code, Function as LambdaFunction, Runtime} from "aws-cdk-lib/aws-lambda";

import {join} from 'path';
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {GenericTable} from "./GenericTable";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceFinderApi');
    private spaceTable = new GenericTable(this, {
        tableName: 'SpacesTable',
        primaryKey: 'spaceId',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        secondaryIndexes: ['location']
    });

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        });

        const helloLambdaWebpack = new LambdaFunction(this, 'helloLambdaWebpack', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'build', 'nodeHelloLambda')),
            handler: 'nodeHelloLambda.handler'
        });

        const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
            entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
            handler: 'handler'
        })


        //Lambda integration
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);


        //Spaces API integrations
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST', this.spaceTable.createLambdaIntegration);
        spaceResource.addMethod('GET', this.spaceTable.readLambdaIntegration);


    }
}