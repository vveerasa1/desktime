# AWS Cognito Setup Guide

This guide explains how to properly configure AWS credentials for the DeskTime application to resolve the "Missing credentials in config" error.

## Problem
The error occurs because the AWS SDK is not properly configured with credentials when trying to create users in AWS Cognito.

## Solution Overview
We've updated the configuration to use proper AWS credential loading mechanisms instead of hardcoded credentials.

## Configuration Options

### Option 1: AWS CLI Configuration (Recommended for Local Development)

1. **Install AWS CLI** if not already installed:
   - Windows: Download from https://aws.amazon.com/cli/
   - macOS: `brew install awscli`
   - Linux: `sudo apt-get install awscli` or `sudo yum install awscli`

2. **Configure AWS CLI**:
   ```bash
   aws configure
   ```
   Enter your credentials when prompted:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region name: `us-east-1`
   - Default output format: `json`

3. **Verify configuration**:
   ```bash
   aws sts get-caller-identity
   ```

### Option 2: Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your credentials
```

Add your AWS credentials to `.env`:
```
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
AWS_REGION=us-east-1
```

### Option 3: IAM Roles (Recommended for Production)

When deploying to AWS services (EC2, ECS, Lambda), use IAM roles instead of hardcoded credentials:

1. **Create an IAM role** with the following permissions:
   - AmazonCognitoPowerUser
   - AmazonS3FullAccess (if using S3)
   - CloudWatchLogsFullAccess (for logging)

2. **Attach the role** to your EC2 instance, ECS task, or Lambda function

## Verification Steps

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Check the console output** for:
   ```
   AWS Region: us-east-1
   AWS SDK configured to use: IAM roles/config files
   ```

3. **Test user creation**:
   - Use the frontend application to create a new user
   - Or use the API endpoint: POST /api/users/add

## Troubleshooting

### Error: "Missing credentials in config"
- Ensure AWS CLI is configured: `aws configure`
- Check if credentials file exists: `~/.aws/credentials`
- Verify environment variables are set: `echo $AWS_ACCESS_KEY_ID`

### Error: "User pool does not exist"
- Verify the user pool ID in `config/dev.json`
- Check AWS region matches your user pool region

### Error: "Access Denied"
- Ensure your AWS credentials have the necessary permissions
- Check IAM user/role has AmazonCognitoPowerUser policy

## Security Best Practices

1. **Never commit AWS credentials** to version control
2. **Use IAM roles** for AWS services instead of access keys
3. **Rotate access keys** regularly
4. **Use least privilege** principle for IAM policies
5. **Enable MFA** on AWS accounts

## Required IAM Permissions

Your AWS user/role needs these permissions:
- `cognito-idp:AdminCreateUser`
- `cognito-idp:AdminGetUser`
- `cognito-idp:AdminUpdateUserAttributes`
- `cognito-idp:AdminDeleteUser`

## Testing AWS Configuration

Test your AWS setup with this simple script:

```javascript
// test-aws.js
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const cognito = new AWS.CognitoIdentityServiceProvider();

cognito.listUserPools({ MaxResults: 10 }, (err, data) => {
  if (err) {
    console.error('AWS Error:', err);
  } else {
    console.log('AWS Connected! User pools:', data.UserPools.length);
  }
});
```

Run the test:
```bash
node test-aws.js
