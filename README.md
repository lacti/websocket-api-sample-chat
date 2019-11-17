# WebSocketAPI Sample Chat

A simple WebSocket Chat example using [AWS WebSocket API](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html).

This is almost same with [this article from AWS blog](https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/) but this is written with [`Serverless framework`](https://serverless.com/) instead of CloudFormation.

I think this is a good start to

- test a new feature from the latest [`aws-sdk-js`](https://github.com/aws/aws-sdk-js) such as `DeleteConnection API`.
- test reliability like latency between endpoints by the simplest example.

## Prerequisites

- NodeJS@10
- yarn
- AWS account
- AWS credential with grants of CloudFormation, Lambda, ApiGateway, S3, CloudWatch and DynamoDB

## Environment variables

| Name                  | Value                                                                      |
| --------------------- | -------------------------------------------------------------------------- |
| NODE_ENV              | `development` for `inline-source-map` or `production`.                     |
| AWS_REGION            | A target of `aws region` to deploy this stack.                             |
| CONNECTION_TABLE_NAME | A DynamoDB table name to store connection ids, default is `ConnectionIds`. |

## Walkthrough

_Please check any other settings in `serverless.yml` such as `region` before deploy this system on your AWS environment._

```bash
$ AWS_REGION=ap-northeast-2 yarn deploy
Serverless: Bundling with Webpack...
Time: 4989ms
Built at: 11/17/2019 8:42:21 AM
...
Serverless: Checking Stack update progress...
Serverless: Stack update finished...
Service Information
...
endpoints:
  wss://your-backend-endpoint-url/development
...

$ yarn wscat -c "wss://your-backend-endpoint-url"
Connected (press CTRL+C to quit)
> hello
< hello
> happy coding
< happy coding
> exit
Disconnected (code: 1000, reason: "Connection Closed Normally")
```

`aws-sdk` in AWS Lambda for JavaScript runtime doesn't have `DeleteConnection` API as default, so [I use small polyfill for that](https://github.com/yingyeothon/aws-apigateway-management-api). This example would disconnect from the server-side when a client sent `exit` message.

### Test your package size

`sls package` will make a serverless bundle for deployment. If you do not have a `sls` in your global environment, use `yarn build` instead.

```bash
# Build with inline-source-map for debugging.
$ yarn build && stat .serverless/websocket-chat.zip
File: .serverless/websocket-chat.zip
Size: 43041       Blocks: 88         IO Block: 4096   regular file

# Build without source-map for reducing a package size.
$ NODE_ENV=production yarn build && stat .serverless/websocket-chat.zip
File: .serverless/websocket-chat.zip
Size: 1558        Blocks: 8          IO Block: 4096   regular file
```

### Show your deployment information

`sls info` will show your stack information. Or, use `yarn status` instead.

```bash
# Show current deployment information with correct environment variables.
$ NODE_ENV=production AWS_REGION=ap-northeast-2 yarn status
Service Information
service: websocket-chat
stage: production
region: ap-northeast-2
stack: websocket-chat-production
resources: 25
...

# Error occurred when use show command without the region option.
$ yarn status
 Serverless Warning --------------------------------------

  A valid environment variable to satisfy the declaration 'env:AWS_REGION' could not be found.


  Serverless Error ---------------------------------------

  Stack with id websocket-chat-development does not exist
...
```

If you've obviously deployed it and can't find the information, make sure your environment variable is correct.

### Print your serverless configuration

`sls print` will show your `serverless.yml` configuration. Or, use `yarn print-config`.

```bash
$ AWS_REGION=ap-northeast-2 yarn status
service:
  name: websocket-chat
plugins:
  - serverless-webpack
...
```

### Delete stack

It is very important to delete this stack after your test is end. Our wallet is precious.

`sls remove` will do that, or use `yarn delete-stack`.

```bash
# Please be careful your environment variables to delete a stack.
$ AWS_REGION=ap-northeast-2 yarn delete-stack
Serverless: Getting all objects in S3 bucket...
Serverless: Removing objects in S3 bucket...
Serverless: Removing Stack...
Serverless: Checking Stack removal progress...
...............................................
Serverless: Stack removal finished...
```

Of course, if you want to delete a proper stack, you should use correct environment variables that use at deployment time such as `NODE_ENV`, `AWS_REGION`, `CONNECTION_TABLE_NAME`. _Otherwise, you cannot delete a stack or will delete a wrong stack._

## License

MIT
