import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'uncrypto'

interface Body {
  clubId: number
  collectionId: string
  fileContent: string
  rawName: string
}

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null) {
    setResponseStatus(event, 403)
  }

  return readBody(event)
    .then(async (body: Body) => {
      const { clubId, collectionId, fileContent, rawName } = body
      // TODO: this should be enabled after the ID mismatch is fixed
      // const collectionInfo = await prisma.fileCollection.findFirst({
      //   where: {
      //     id: collectionId,
      //   },
      // })
      // const clubInfo = await prisma.club.findFirst({
      //   where: {
      //     id: clubId,
      //   },
      // })
      // const naming = collectionInfo?.fileNaming
      // const fileName = naming
      //   .replaceAll('$id$', clubId)
      //   .replaceAll('$club$', clubInfo.name.zh)
      //   .replaceAll('$ext$', rawName.split('.').pop())
      // TODO: (cont.) and this should be removed
      const fileName = rawName
      try {
        // An error will be thrown if the club's record does not exist
        const existingRecord = await prisma.fileUploadRecord.findFirstOrThrow({
          where: {
            clubId,
            fileUploadId: collectionId,
          },
          select: {
            id: true,
            file: true,
          },
        })
        try {
          await prisma.fileUploadRecord.update({
            where: {
              id: existingRecord.id,
            },
            data: {
              createdAt: new Date(),
              file: {
                update: {
                  where: {
                    id: existingRecord.file.id,
                  },
                  data: {
                    name: fileName,
                    createdAt: new Date(),
                  },
                },
              },
            },
          })
          await useStorage('s3').setItemRaw(existingRecord.file.fileId, fileContent)
        }
        catch (error: any) {
          return {
            success: false,
            error: String(error),
          }
        }
        return {
          success: true,
        }
      }
      catch (__error) {
        if (__error instanceof Error) {
          // Create a new record (the record is not found)
          const fileUUID = randomUUID()
          try {
            await prisma.fileUploadRecord.create({
              data: {
                club: {
                  connect: {
                    id: clubId,
                  },
                },
                fileUpload: {
                  connect: {
                    id: collectionId,
                  },
                },
                file: {
                  create: {
                    fileId: fileUUID,
                    name: fileName,
                  },
                },
              },
            })
            await useStorage('s3').setItemRaw(fileUUID, fileContent)
            return {
              success: true,
            }
          }
          catch (error) {
            return {
              success: false,
              error: String(error),
            }
          }
        }
      }
    })
})
