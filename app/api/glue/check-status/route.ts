import { NextRequest, NextResponse } from 'next/server'
import { GlueClient, ListJobsCommand, GetJobRunsCommand } from '@aws-sdk/client-glue'

export async function POST(request: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey, region = 'us-east-1' } = await request.json()

    const glueClient = new GlueClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })

    const listJobsCommand = new ListJobsCommand({})
    const jobsResponse = await glueClient.send(listJobsCommand)
    
    let runningCount = 0
    
    for (const jobName of jobsResponse.JobNames || []) {
      try {
        const getRunsCommand = new GetJobRunsCommand({ JobName: jobName })
        const runsResponse = await glueClient.send(getRunsCommand)
        
        const runningJobs = runsResponse.JobRuns?.filter(run => 
          run.JobRunState === 'RUNNING' || run.JobRunState === 'STARTING'
        ) || []

        runningCount += runningJobs.length
      } catch (jobError) {
        console.warn(`Failed to check status for job ${jobName}:`, jobError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      runningJobs: runningCount,
      allStopped: runningCount === 0
    })
  } catch (error) {
    console.error('Error checking job status:', error)
    return NextResponse.json(
      { error: `Failed to check job status: ${error}` },
      { status: 500 }
    )
  }
}