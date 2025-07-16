import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'

export async function POST(request: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey, region = 'us-east-1' } = await request.json()

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: 'Access key ID and secret access key are required' },
        { status: 400 }
      )
    }

    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    const command = new ListBucketsCommand({})
    const response = await s3Client.send(command)

    const buckets = response.Buckets?.map(bucket => ({
      name: bucket.Name,
      creationDate: bucket.CreationDate,
    })) || []

    return NextResponse.json({ buckets })
  } catch (error) {
    console.error('Error listing S3 buckets:', error)
    return NextResponse.json(
      { error: 'Failed to list S3 buckets. Please check your credentials.' },
      { status: 500 }
    )
  }
}