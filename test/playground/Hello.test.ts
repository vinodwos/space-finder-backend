import { handler as createHandler } from '../../services/SpacesTable/Create';
import { handler as readHandler } from '../../services/SpacesTable/Read';

import AWS = require("aws-sdk");
import {GenericTable} from "../../infrastructure/GenericTable";
import {APIGatewayProxyEvent} from "aws-lambda";

AWS.config.update({region:'us-east-1'});


//uncomment later for testing
// const eventCreate = {
//     body : {
//         "location": "London",
//         "name": "Best location"
//     }
// }
// createHandler(eventCreate as any, {} as any);

//to read all data
// readHandler({} as any, {} as any).then(r => {
//     let s = JSON.stringify(r);
//     console.log(s);
// });

//uncomment later for testing
// const eventRead : APIGatewayProxyEvent = {
//     queryStringParameters : {
//         spaceId: '30227bbd-0d57-4ebc-baee-418eee893d76'
//     }
// } as any;
//
// readHandler(eventRead as any, {} as any).then(r => {
//     let s = JSON.stringify(r);
//     console.log(s);
// });



const eventReadWithSecondaryKey : APIGatewayProxyEvent = {
    queryStringParameters : {
        location: 'London'
    }
} as any;

readHandler(eventReadWithSecondaryKey as any, {} as any).then(r => {
    let s = JSON.stringify(r);
    console.log(s);
});

