"use server";
import { writeFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

export async function optimizeImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file uploaded')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Optimize the image
  const optimizedImageBuffer = await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  // Generate a unique filename
  const filename = `${uuidv4()}.webp`

  // Save the file
  const path = join(process.cwd(), 'public', 'uploads', filename)
  await writeFile(path, optimizedImageBuffer)

  // Return the path to the saved file
  return `/uploads/${filename}`
}
