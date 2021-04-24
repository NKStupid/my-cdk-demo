#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { EC2Stack } from '../lib/ec2-stack';


const app = new cdk.App();
new EC2Stack(app, 'EC2Stack');
