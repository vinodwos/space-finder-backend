import {DynamoDB} from "aws-sdk";
import {
    APIGatewayProxyEvent,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyResult,
    Context
} from "aws-lambda";
import AWS = require("aws-sdk");

AWS.config.update({region: 'us-east-1'});
const dbClient = new DynamoDB.DocumentClient();
// const TABLE_NAME = process.env.TABLE_NAME;
// const PRIMARY_KEY = process.env.PRIMARY_KEY;

const TABLE_NAME = 'SpacesTable';
const PRIMARY_KEY = 'spaceId';
async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DynamoDb'
    }


    try {
        if (event.queryStringParameters) {
            if (PRIMARY_KEY! in event.queryStringParameters) {
                result.body = await queryWithPrimaryPartition(event.queryStringParameters);
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters);
            }
        } else {
            result.body = await scanTable();
        }
    } catch (error) {
        // @ts-ignore
        result.body = error.message;
    }

    return result;
}

async function queryWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const keyValue = queryParams[PRIMARY_KEY!];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: '#keyName = :keyValue',
        ExpressionAttributeNames: {
            '#keyName': PRIMARY_KEY!
        },
        ExpressionAttributeValues: {
            ':keyValue': keyValue
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function queryWithSecondaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const queryKey = Object.keys(queryParams)[0];
    const queryValue = queryParams[queryKey];

    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        IndexName: queryKey,
        KeyConditionExpression: '#keyName = :keyValue',
        ExpressionAttributeNames: {
            '#keyName': queryKey
        },
        ExpressionAttributeValues: {
            ':keyValue': queryValue
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function scanTable() {
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!
    }).promise();
    return JSON.stringify(queryResponse.Items);
}


export {handler}
