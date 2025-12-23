import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const IPFS_API_URL = process.env.IPFS_API_URL || 'https://ipfs.glitterprotocol.dev/api/v2'
const IPFS_GATEWAY_URL = process.env.IPFS_GATEWAY_URL || 'https://ipfs.glitterprotocol.dev/ipfs'

// Max file size: 20MB for single file
const MAX_FILE_SIZE = 20 * 1024 * 1024
// Max total size: 500MB for directory
const MAX_TOTAL_SIZE = 500 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to upload files.' },
        { status: 401 }
      )
    }

    // Get form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    // Validate file sizes
    let totalSize = 0
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds maximum size of 20MB` },
          { status: 400 }
        )
      }
      totalSize += file.size
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Total upload size exceeds maximum of 500MB' },
        { status: 400 }
      )
    }

    // Generate device ID from user ID
    const deviceId = Buffer.from(user.id).toString('base64').slice(0, 16)

    // Prepare form data for IPFS API
    const ipfsFormData = new FormData()
    for (const file of files) {
      ipfsFormData.append('file', file, file.name)
    }

    // Upload to IPFS
    const response = await fetch(`${IPFS_API_URL}/add?uid=${deviceId}&cidV=1`, {
      method: 'POST',
      body: ipfsFormData,
      signal: AbortSignal.timeout(600000), // 10 minute timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('IPFS upload error:', errorText)
      return NextResponse.json(
        { success: false, error: 'Failed to upload to IPFS' },
        { status: 500 }
      )
    }

    const result = await response.json()

    // Extract CID from response
    const fileData = result.data?.data?.[0] || result.data?.[0] || result[0]
    if (!fileData || !fileData.Hash) {
      return NextResponse.json(
        { success: false, error: 'Invalid response from IPFS' },
        { status: 500 }
      )
    }

    const cid = fileData.Hash
    const url = fileData.ShortUrl || `${IPFS_GATEWAY_URL}/${cid}`

    // Save upload record to database (optional)
    try {
      await supabase.from('ipfs_uploads').insert({
        user_id: user.id,
        cid,
        filename: files.length === 1 ? files[0].name : `${files.length} files`,
        size: totalSize,
        url,
      })
    } catch (dbError) {
      // Log but don't fail the request
      console.error('Failed to save upload record:', dbError)
    }

    return NextResponse.json({
      success: true,
      cid,
      url,
      filename: files.length === 1 ? files[0].name : `${files.length} files`,
      size: totalSize,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
