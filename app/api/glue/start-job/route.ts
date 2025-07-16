import { NextRequest, NextResponse } from 'next/server'
import { GlueClient, StartJobRunCommand } from '@aws-sdk/client-glue'

export async function POST(request: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey, region = 'us-east-1', jobName, kafkaEndpoint } = await request.json()

    if (!jobName) {
      return NextResponse.json({ error: 'Job name is required' }, { status: 400 })
    }

    const glueClient = new GlueClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })

    const startCommand = new StartJobRunCommand({
      JobName: jobName,
      Arguments: kafkaEndpoint ? {
        '--kafka_endpoint': kafkaEndpoint,
        '--job-bookmark-option': 'job-bookmark-disable'
      } : {
        '--job-bookmark-option': 'job-bookmark-disable'
      }
    })

    const response = await glueClient.send(startCommand)

    return NextResponse.json({ 
      success: true, 
      jobRunId: response.JobRunId,
      jobName: jobName,
      message: 'Job started successfully'
    })
  } catch (error) {
    console.error('Error starting Glue job:', error)
    return NextResponse.json(
      { error: `Failed to start Glue job: ${error}` },
      { status: 500 }
    )
  }
}