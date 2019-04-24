# Poke Service

The Poke Service receives poke requests from the Poke Snap Mobile Platform and forwards them to the appropriate device. It is architecturally designed to run as a Function as a Service (FaaS) on a platform such as AWS Lambda. 

An example request to the service is below:
```http
POST /
Host: <host>
Content-Type: application/json

{
    "body": {
        "username": "John Smith",
        "expo-push-token": "ExponentPushToken[yBe08sIBCL4W1T2I8kGw6Y]",
        "location": [20.00000, 21.00000]
    }
}
```

## Deployment
It is currently designed to run on AWS Lambda. The current entrypoint is:
```javascript
exports.handler = async (event, context) => {

  requestHandler(JSON.parse(event.body));

  return response;
};
```
To deploy this service on other platforms, only `requestHandler(...)` must be invoked with the appropriate JSON object.  

## Built With
- NodeJS
- AWS SDK
- Expo Server SDK