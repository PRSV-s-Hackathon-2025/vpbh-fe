import { NextRequest, NextResponse } from 'next/server'
import { GlueClient, GetJobRunCommand } from '@aws-sdk/client-glue'

export async function POST(request: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey, region = 'us-east-1', jobName, jobRunId } = await request.json()

    const glueClient = new GlueClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })

    const command = new GetJobRunCommand({
      JobName: jobName,
      RunId: jobRunId
    })

    const response = await glueClient.send(command)

    return NextResponse.json({ 
      success: true, 
      jobRun: response.JobRun,
      arguments: response.JobRun?.Arguments,
      state: response.JobRun?.JobRunState
    })
  } catch (error) {
    console.error('Error getting job run details:', error)
    return NextResponse.json(
      { error: `Failed to get job run details: ${error}` },
      { status: 500 }
    )
  }
}