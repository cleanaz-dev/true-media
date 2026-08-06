import { LambdaClient, InvokeCommand, InvocationType } from "@aws-sdk/client-lambda";

const region = process.env.AWS_REGION ?? "us-east-1";

export const lambda = new LambdaClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export function createCommand({
  functionName,
  payload,
  invocationType = "RequestResponse",
}: {
  functionName: string;
  payload?: Record<string, unknown>;
  invocationType?: InvocationType | "Event" | "RequestResponse" | "DryRun";
}) {
  return new InvokeCommand({
    FunctionName: functionName,
    InvocationType: invocationType,
    Payload: payload ? Buffer.from(JSON.stringify(payload)) : undefined,
  });
}