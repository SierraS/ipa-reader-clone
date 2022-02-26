import { App, Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import { aws_lambda as lambda } from "aws-cdk-lib";
import path = require("path");
import * as cdk from 'aws-cdk-lib';

export interface AppStackProps extends StackProps {
  customProp?: string;
}
export class AppStack extends Stack {
  constructor(scope: App, id: string, props: AppStackProps = {}) {
    super(scope, id, props);
    const { customProp } = props;
    const defaultBucketProps = {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    };
    const bucket = new s3.Bucket(this, "Bucket", {
      ...defaultBucketProps,
      versioned: true,
    });
    new CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
    });
    const fn = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("backend"),
      memorySize: 3000,
      timeout: cdk.Duration.seconds(20),
      handler: 'index.handler',
    });
  }
}
