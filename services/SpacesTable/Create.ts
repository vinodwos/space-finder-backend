import {DynamoDB} from "aws-sdk";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {v4} from "uuid";
import AWS = require("aws-sdk");

AWS.config.update({region:'us-east-1'});
const dbClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DynamoDb'
    }
    console.log('Events are here');
    console.log(event);
    let item : any = {};
   item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    item.spaceId = v4();

    try {
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise();
    } catch (error) {
        // @ts-ignore
        result.body = error.message;
    }
    result.body = `Item created with spaceId: ${item.spaceId}`;
    return result;
}


export {handler}
