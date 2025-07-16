import { NextRequest, NextResponse } from 'next/server'
import { GlueClient, UpdateJobCommand, GetJobCommand } from '@aws-sdk/client-glue'

export async function POST(request: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey, region = 'us-east-1', jobName, kafkaEndpoint } = await request.json()

    if (!accessKeyId || !secretAccessKey || !jobName || !kafkaEndpoint) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const glueClient = new GlueClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })

    // Get current job
    const getJobCommand = new GetJobCommand({ JobName: jobName })
    const jobResponse = await glueClient.send(getJobCommand)
    const job = jobResponse.Job

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Update job with Kafka endpoint as parameter
    const updateCommand = new UpdateJobCommand({
      JobName: jobName,
      JobUpdate: {
        Role: job.Role,
        Command: job.Command,
        GlueVersion: '5.0',
        Connections: {
          Connections: ['kafka-on-ec2']
        },
        DefaultArguments: {
          ...job.DefaultArguments,
          '--kafka_endpoint': kafkaEndpoint
        }
      }
    })

    await glueClient.send(updateCommand)

    return NextResponse.json({ success: true, message: 'Job parameter updated successfully' })
  } catch (error) {
    console.error('Error updating Glue job:', error)
    return NextResponse.json(
      { error: `Failed to update Glue job: ${error}` },
      { status: 500 }
    )
  }
}