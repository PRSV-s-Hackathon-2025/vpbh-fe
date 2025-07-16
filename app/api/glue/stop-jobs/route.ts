import { NextRequest, NextResponse } from 'next/server'
import { GlueClient, ListJobsCommand, GetJobRunsCommand, BatchStopJobRunCommand } from '@aws-sdk/client-glue'

export async function POST(request: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey, region = 'us-east-1' } = await request.json()

    const glueClient = new GlueClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })

    // Get all job names first
    const listJobsCommand = new ListJobsCommand({})
    const jobsResponse = await glueClient.send(listJobsCommand)
    
    let totalStopped = 0
    
    // Check each job for running instances
    for (const jobName of jobsResponse.JobNames || []) {
      try {
        const getRunsCommand = new GetJobRunsCommand({ JobName: jobName })
        const runsResponse = await glueClient.send(getRunsCommand)
        
        const runningJobs = runsResponse.JobRuns?.filter(run => 
          run.JobRunState === 'RUNNING' || run.JobRunState === 'STARTING'
        ) || []

        if (runningJobs.length > 0) {
          const jobRunIds = runningJobs.map(run => run.Id!).filter(Boolean)
          
          await glueClient.send(new BatchStopJobRunCommand({
            JobName: jobName,
            JobRunIds: jobRunIds
          }))
          
          totalStopped += runningJobs.length
        }
      } catch (jobError) {
        console.warn(`Failed to stop runs for job ${jobName}:`, jobError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      stoppedJobs: totalStopped,
      message: `Stopped ${totalStopped} running jobs`
    })
  } catch (error) {
    console.error('Error stopping Glue jobs:', error)
    return NextResponse.json(
      { error: `Failed to stop Glue jobs: ${error}` },
      { status: 500 }
    )
  }
}