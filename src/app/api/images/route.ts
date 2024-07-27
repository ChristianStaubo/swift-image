import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as Blob | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const optimizedImageBuffer = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    return new NextResponse(optimizedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Content-Disposition': 'attachment; filename="optimized-image.webp"',
      },
    })
  } catch (error) {
    console.error('Error optimizing image:', error)
    return NextResponse.json({ error: 'Failed to optimize image' }, { status: 500 })
  }
}
