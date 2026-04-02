/**
 * AWS Lambda Function: Deployment Logger
 * 
 * This function logs CI/CD deployment outcomes to CloudWatch.
 * It receives deployment status, branch name, commit ID, and timestamp
 * from GitHub Actions after each deployment to EC2.
 * 
 * Purpose: Monitor deployment success/failure and maintain audit trail
 */

export const handler = async (event) => {
    console.log('=== Deployment Event Received ===');
    console.log('Full Event:', JSON.stringify(event, null, 2));
    
    // Parse the incoming request
    let body;
    try {
        // Handle both direct invocation and HTTP requests
        if (event.body) {
            body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        } else {
            body = event;
        }
    } catch (error) {
        console.error('Error parsing request body:', error);
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Invalid request body',
                message: error.message 
            })
        };
    }
    
    // Extract deployment information
    const {
        status = 'unknown',
        branch = 'unknown',
        commit = 'unknown',
        commit_message = 'No commit message',
        commit_author = 'unknown',
        commit_author_email = 'unknown',
        timestamp = new Date().toISOString(),
        repository = 'unknown',
        actor = 'unknown',
        workflow = 'unknown'
    } = body;
    
    // Log deployment details to CloudWatch
    console.log('--- Deployment Details ---');
    console.log(`Status: ${status}`);
    console.log(`Repository: ${repository}`);
    console.log(`Branch: ${branch}`);
    console.log(`Commit SHA: ${commit}`);
    console.log(`Commit Message: ${commit_message}`);
    console.log(`Commit Author: ${commit_author} <${commit_author_email}>`);
    console.log(`Triggered by: ${actor}`);
    console.log(`Workflow: ${workflow}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log('-------------------------');
    
    // Determine if deployment was successful
    const isSuccess = status.toLowerCase() === 'success';
    
    if (isSuccess) {
        console.log('✅ DEPLOYMENT SUCCESSFUL');
        console.log(`Application deployed successfully to EC2 from branch: ${branch}`);
        console.log(`Deployed commit: "${commit_message}" by ${commit_author}`);
    } else {
        console.error('❌ DEPLOYMENT FAILED');
        console.error(`Deployment failed for branch: ${branch}, commit: ${commit}`);
        console.error(`Failed commit: "${commit_message}" by ${commit_author}`);
    }
    
    // Create response
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: 'Deployment event logged successfully',
            logged: {
                status,
                branch,
                commit,
                commit_message,
                commit_author,
                commit_author_email,
                timestamp,
                repository,
                actor,
                workflow
            },
            cloudWatchLogGroup: process.env.AWS_LAMBDA_LOG_GROUP_NAME,
            cloudWatchLogStream: process.env.AWS_LAMBDA_LOG_STREAM_NAME
        })
    };
    
    console.log('Lambda execution completed successfully');
    return response;
};
