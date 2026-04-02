# AWS Lambda Setup Guide - Deployment Logger

This guide walks you through setting up an AWS Lambda function that logs deployment events from your GitHub Actions CI/CD pipeline.

## Overview

The Lambda function receives deployment information (status, branch, commit, timestamp) from GitHub Actions and logs it to CloudWatch for monitoring and audit purposes.

## Part 1: Create the Lambda Function

### Step 1: Navigate to AWS Lambda

1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Search for **Lambda** in the services search bar
3. Click **Create function**

### Step 2: Configure Basic Settings

**Function Configuration:**
- **Function name:** `deployment-logger`
- **Runtime:** Node.js 18.x
- **Architecture:** x86_64

**Permissions:**
- **Execution role:** Use an existing role
- **Existing role:** Select `labRole` (or your lab's execution role)

Click **Create function**

### Step 3: Add the Function Code

1. In the Lambda console, scroll to the **Code source** section
2. Delete the default code in `index.mjs`
3. Copy the code from `lambda/deployment-logger.js` in your repository
4. Paste it into the Lambda editor
5. Click **Deploy** to save the changes

**Important:** Make sure the file is named `index.mjs` and uses the ES module syntax (export const handler).

### Step 4: Enable Function URL

1. In the Lambda function page, click on the **Configuration** tab
2. Select **Function URL** from the left sidebar
3. Click **Create function URL**
4. Configure:
   - **Auth type:** NONE (for simplicity in this lab)
   - **Invoke mode:** BUFFERED
   - **Configure cross-origin resource sharing (CORS):** ✓ Check this
5. Click **Save**
6. **Copy the Function URL** - you'll need this for GitHub Secrets

Example URL: `https://abc123xyz.lambda-url.us-east-1.on.aws/`

### Step 5: Test the Lambda Function

1. Click on the **Test** tab
2. Create a new test event:
   - **Event name:** `test-deployment`
   - **Event JSON:**
   ```json
   {
     "body": "{\"status\":\"success\",\"branch\":\"main\",\"commit\":\"abc123\",\"timestamp\":\"2026-04-01T19:00:00Z\",\"repository\":\"username/docker-3.1\",\"actor\":\"testuser\",\"workflow\":\"Build and Deploy\"}"
   }
   ```
3. Click **Test**
4. Verify the execution succeeds and check the logs

## Part 2: Configure GitHub Secrets

### Add Lambda URL to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name:** `LAMBDA_URL`
   - **Secret:** Paste your Lambda Function URL
5. Click **Add secret**

## Part 3: Verify the Integration

### Trigger a Deployment

1. Make a small change to your code:
   ```bash
   echo "# Test Lambda integration" >> README.md
   git add README.md
   git commit -m "Test Lambda integration"
   git push origin main
   ```

2. Go to **Actions** tab in GitHub
3. Watch the workflow run
4. Verify all three jobs complete:
   - ✅ build-and-push
   - ✅ deploy-to-ec2
   - ✅ notify-lambda

### Check CloudWatch Logs

1. Go to AWS Console → **CloudWatch**
2. In the left sidebar, click **Logs** → **Log groups**
3. Find `/aws/lambda/deployment-logger`
4. Click on the log group
5. Click on the most recent **Log stream**
6. You should see logs like:

```
=== Deployment Event Received ===
Full Event: {
  "status": "success",
  "branch": "main",
  "commit": "abc123def456...",
  "timestamp": "2026-04-01T19:00:00Z",
  "repository": "username/docker-3.1",
  "actor": "username",
  "workflow": "Build, Push to GHCR, and Deploy to EC2"
}
--- Deployment Details ---
Status: success
Repository: username/docker-3.1
Branch: main
Commit SHA: abc123def456...
Triggered by: username
Workflow: Build, Push to GHCR, and Deploy to EC2
Timestamp: 2026-04-01T19:00:00Z
-------------------------
✅ DEPLOYMENT SUCCESSFUL
Application deployed successfully to EC2 from branch: main
Lambda execution completed successfully
```

## Part 4: Take Screenshots for Submission

### Screenshot 1: Lambda Function Configuration
- Show the Lambda function overview page with Function URL visible

### Screenshot 2: CloudWatch Log Entry
- Show the CloudWatch log stream with deployment details
- Make sure the log entry shows:
  - Status (success/failure)
  - Branch name
  - Commit SHA
  - Timestamp
  - Repository name
  - Actor (who triggered it)

### Screenshot 3: GitHub Actions Workflow (Optional)
- Show the successful workflow run with all three jobs completed

## Understanding the Lambda Function

### What It Logs

The Lambda function logs the following information:

1. **Status** - Whether deployment succeeded or failed
2. **Branch** - Which branch was deployed (e.g., main)
3. **Commit SHA** - The exact commit that was deployed
4. **Timestamp** - When the deployment occurred
5. **Repository** - Which repository was deployed
6. **Actor** - Who triggered the deployment
7. **Workflow** - Which GitHub Actions workflow ran

### Why It's Useful

**Real-world DevOps applications:**

1. **Audit Trail** - Track who deployed what and when
2. **Monitoring** - Detect deployment failures immediately
3. **Alerting** - Can be extended to send notifications (Slack, email, SMS)
4. **Metrics** - Analyze deployment frequency and success rates
5. **Compliance** - Maintain records for security and compliance requirements
6. **Debugging** - Quickly identify which commit caused issues

### Event-Driven Architecture

This pattern demonstrates **event-driven CI/CD**:
- GitHub Actions triggers Lambda automatically
- Lambda processes the event asynchronously
- CloudWatch stores logs for analysis
- Can be extended to trigger other services (SNS, SQS, Step Functions)

## Troubleshooting

### Lambda Not Receiving Events

**Check:**
- LAMBDA_URL secret is set correctly in GitHub
- Function URL has Auth type = NONE
- Lambda function is in the same region you're working in

**Fix:**
```bash
# Test Lambda manually with curl
curl -X POST YOUR_LAMBDA_URL \
  -H "Content-Type: application/json" \
  -d '{"status":"success","branch":"test","commit":"abc123","timestamp":"2026-04-01T19:00:00Z","repository":"test/repo","actor":"testuser","workflow":"Test"}'
```

### No Logs in CloudWatch

**Check:**
- Lambda execution role has CloudWatch Logs permissions
- Wait a few seconds for logs to appear (they're not instant)
- Refresh the CloudWatch page

**Fix:**
- Verify `labRole` has `CloudWatchLogsFullAccess` or similar policy

### GitHub Actions Fails at notify-lambda Step

**Check:**
- LAMBDA_URL secret exists and is correct
- Lambda Function URL is publicly accessible
- Check the Actions log for curl error messages

**Fix:**
```yaml
# Add error handling to the workflow step
- name: Trigger Lambda Function
  continue-on-error: true  # Don't fail the workflow if Lambda fails
  run: |
    curl -X POST ${{ secrets.LAMBDA_URL }} \
      -H "Content-Type: application/json" \
      -d '{"status":"${{ needs.deploy-to-ec2.result }}",...}'
```

## Advanced: Extending the Lambda

### Add Slack Notifications

```javascript
// Add to Lambda function
const axios = require('axios');

if (status === 'failure') {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: `🚨 Deployment failed for ${repository} on branch ${branch}`
  });
}
```

### Add Metrics to CloudWatch

```javascript
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

await cloudwatch.putMetricData({
  Namespace: 'Deployments',
  MetricData: [{
    MetricName: 'DeploymentSuccess',
    Value: status === 'success' ? 1 : 0,
    Unit: 'Count'
  }]
}).promise();
```

### Store in DynamoDB

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

await dynamodb.put({
  TableName: 'DeploymentHistory',
  Item: {
    id: commit,
    timestamp,
    status,
    branch,
    repository
  }
}).promise();
```

## Summary

You've successfully implemented an event-driven deployment monitoring system using:
- ✅ AWS Lambda for serverless event processing
- ✅ GitHub Actions for CI/CD automation
- ✅ CloudWatch for centralized logging
- ✅ Function URLs for HTTP integration

This pattern is used by companies like Netflix, Airbnb, and Amazon for production deployments!

---

**Next:** Fill out the submission template with your Lambda URL and CloudWatch screenshots.
