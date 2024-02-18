import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async(event) => {
  const prisma = new PrismaClient()
  const posts = await prisma.phrase.findMany({})
  return posts
})