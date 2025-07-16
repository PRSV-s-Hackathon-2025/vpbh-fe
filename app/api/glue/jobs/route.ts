import { NextRequest, NextResponse } from 'next/server'
import { GlueClient, ListJobsCommand, GetJobCommand } from '@aws-sdk/client-glue'

export async function POST(request: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey, region = 'us-east-1' } = await request.json()

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: 'Access key ID and secret access key are required' },
        { status: 400 }
      )
    }

    const glueClient = new GlueClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    const listCommand = new ListJobsCommand({})
    const listResponse = await glueClient.send(listCommand)

    const streamingJobs = []
    const sparkJobs = []

    for (const jobName of listResponse.JobNames || []) {
      try {
        const getJobCommand = new GetJobCommand({ JobName: jobName })
        const jobResponse = await glueClient.send(getJobCommand)
        const job = jobResponse.Job
        
        if (job?.Command?.Name === 'gluestreaming') {
          streamingJobs.push({
            name: job.Name,
            arn: `arn:aws:glue:${region}:${job.Role?.split(':')[4] || 'account'}:job/${job.Name}`,
            type: 'streaming'
          })
        } else if (job?.Command?.Name === 'glueetl') {
          sparkJobs.push({
            name: job.Name,
            arn: `arn:aws:glue:${region}:${job.Role?.split(':')[4] || 'account'}:job/${job.Name}`,
            type: 'spark'
          })
        }
      } catch (jobError) {
        console.warn(`Failed to get details for job ${jobName}:`, jobError)
      }
    }

    return NextResponse.json({ streamingJobs, sparkJobs })
  } catch (error) {
    console.error('Error listing Glue jobs:', error)
    return NextResponse.json(
      { error: 'Failed to list Glue jobs. Please check your credentials.' },
      { status: 500 }
    )
  }
}