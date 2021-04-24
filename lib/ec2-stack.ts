import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');

import { Fn, Tag, Resource } from '@aws-cdk/core';
import { AmazonLinuxImage, UserData, InstanceType } from '@aws-cdk/aws-ec2';
import { Role, ServicePrincipal, ManagedPolicy, CfnInstanceProfile } from '@aws-cdk/aws-iam'

/**
 * Create my own Ec2 resource and Ec2 props as these are not yet defined in CDK
 * These classes abstract low level details from CloudFormation
 */
class Ec2InstanceProps {
  readonly image : ec2.IMachineImage;
  readonly instanceType : ec2.InstanceType;
  readonly userData : UserData;
  readonly subnet : ec2.ISubnet;
  readonly privateIP: string;
//   readonly role : Role;
}
class Ec2 extends Resource {
  constructor(scope: cdk.Construct, id: string, props? : Ec2InstanceProps) {
    super(scope, id);

    if (props) {

      // create the instance
      const instance = new ec2.CfnInstance(this, id, {
        imageId: props.image.getImage(this).imageId,
        keyName: "ecs-ec2",
        instanceType: props.instanceType.toString(),
        networkInterfaces: [
          {
            deviceIndex: "0",
            privateIpAddress: props.privateIP,
            subnetId: props.subnet.subnetId
          }
        ]
        ,userData: Fn.base64(props.userData.render())
      });

      // tag the instance
      Tag.add(instance, 'Name', `${EC2Stack.name}/${id}`);
      }
  }
}

export class EC2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const getExistingVpc = ec2.Vpc.fromLookup(this, 'LabEnv', {isDefault: false, vpcId: "vpc-03f655ce03bbd01f2" });
    
    const publicSubnet0 = getExistingVpc.publicSubnets[0];
    // define a user data script to install & launch our web server 
    const ssmaUserData = UserData.forLinux();
    ssmaUserData.addCommands('yum install -y nginx', 'chkconfig nginx on', 'service nginx start');

    for (let i = 0; i < 2; i++) {
      console.log ("Block statement execution no." + i);
        // launch an EC2 instance in the private subnet
        const instance = new Ec2(this, 'Slave-' + i, {
          image: new AmazonLinuxImage(),
          instanceType : ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
          subnet : publicSubnet0,
    //       role: role,
          userData : ssmaUserData,
          privateIP: `192.168.99.${i}0`
        }) // new instance ends.
     } // for loop ends.
  }
}
