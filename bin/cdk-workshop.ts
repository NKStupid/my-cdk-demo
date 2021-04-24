#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CodeStack } from '../lib/code-stack';


const app = new cdk.App();
new CodeStack(app, 'CodeStack');
