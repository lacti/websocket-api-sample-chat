import ApiGatewayManagementApi25630 from "./type";

// 2.563.0
const model = {
  metadata: {
    apiVersion: "2018-11-29",
    endpointPrefix: "execute-api",
    signingName: "execute-api",
    serviceFullName: "AmazonApiGatewayManagementApi",
    serviceId: "ApiGatewayManagementApi",
    protocol: "rest-json",
    jsonVersion: "1.1",
    uid: "apigatewaymanagementapi-2018-11-29",
    signatureVersion: "v4"
  },
  operations: {
    DeleteConnection: {
      http: {
        method: "DELETE",
        requestUri: "/@connections/{connectionId}",
        responseCode: 204
      },
      input: {
        type: "structure",
        members: {
          ConnectionId: {
            location: "uri",
            locationName: "connectionId"
          }
        },
        required: ["ConnectionId"]
      }
    },
    GetConnection: {
      http: {
        method: "GET",
        requestUri: "/@connections/{connectionId}",
        responseCode: 200
      },
      input: {
        type: "structure",
        members: {
          ConnectionId: {
            location: "uri",
            locationName: "connectionId"
          }
        },
        required: ["ConnectionId"]
      },
      output: {
        type: "structure",
        members: {
          ConnectedAt: {
            shape: "S5",
            locationName: "connectedAt"
          },
          Identity: {
            locationName: "identity",
            type: "structure",
            members: {
              SourceIp: {
                locationName: "sourceIp"
              },
              UserAgent: {
                locationName: "userAgent"
              }
            },
            required: ["SourceIp", "UserAgent"]
          },
          LastActiveAt: {
            shape: "S5",
            locationName: "lastActiveAt"
          }
        }
      }
    },
    PostToConnection: {
      http: {
        requestUri: "/@connections/{connectionId}",
        responseCode: 200
      },
      input: {
        type: "structure",
        members: {
          Data: {
            type: "blob"
          },
          ConnectionId: {
            location: "uri",
            locationName: "connectionId"
          }
        },
        required: ["ConnectionId", "Data"],
        payload: "Data"
      }
    }
  },
  shapes: {
    S5: {
      type: "timestamp",
      timestampFormat: "iso8601"
    }
  },
  paginators: {}
};

// Patch ApiGatewayManagementApi to 2.563.0
const AWS = require("aws-sdk");
const LatestApiGatewayManagementApi = (() => {
  const NewApi = AWS.Service.defineService("apigatewaymanagementapi", [
    "2018-11-29"
  ]);
  Object.defineProperty(
    AWS.apiLoader.services["apigatewaymanagementapi"],
    "2018-11-29",
    {
      get: () => model,
      enumerable: true,
      configurable: true
    }
  );
  return NewApi;
})();

export const newApiGatewayManagementApi = (
  options?: ApiGatewayManagementApi25630.Types.ClientConfiguration
): ApiGatewayManagementApi25630 => {
  return new LatestApiGatewayManagementApi(options);
};
