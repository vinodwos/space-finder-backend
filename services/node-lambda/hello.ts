async function handler(event: any, context: any){
    return {
        statusCode: 200,
        body: "Hello from Lambda! " + Math.random()
    }
}

export {handler}