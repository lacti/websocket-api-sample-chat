import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGatewayManagementApi, DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { newApiGatewayManagementApi } from "./apigatewaymanagementapi";

export const connect: APIGatewayProxyHandler = async event => {
  await new DynamoDB()
    .putItem({
      TableName: `ConnectionIds`,
      Item: {
        connectionId: { S: event.requestContext.connectionId }
      }
    })
    .promise();
  return {
    statusCode: 200,
    body: "OK"
  };
};

export const disconnect: APIGatewayProxyHandler = async event => {
  await new DynamoDB()
    .deleteItem({
      TableName: `ConnectionIds`,
      Key: {
        connectionId: { S: event.requestContext.connectionId }
      }
    })
    .promise();
  return {
    statusCode: 200,
    body: "OK"
  };
};

export const broadcast: APIGatewayProxyHandler = async event => {
  if (event.body === "exit") {
    await newApiGatewayManagementApi({
      endpoint:
        event.requestContext.domainName + "/" + event.requestContext.stage
    })
      .deleteConnection({
        ConnectionId: event.requestContext.connectionId
      })
      .promise();
    return {
      statusCode: 200,
      body: "OK"
    };
  }

  const dbResult = await new DynamoDB()
    .scan({
      TableName: `ConnectionIds`,
      ProjectionExpression: "connectionId"
    })
    .promise();
  const api = new ApiGatewayManagementApi({
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });
  await Promise.all(
    dbResult.Items.map(async ({ connectionId }) =>
      api
        .postToConnection({
          ConnectionId: connectionId.S,
          Data: event.body
        })
        .promise()
    )
  );
  return {
    statusCode: 200,
    body: "OK"
  };
};
