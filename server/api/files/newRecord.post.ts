import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null) {
    setResponseStatus(event, 403)
  }

  return readBody(event)
    .then(async (body) => {
      const { clubId, collectionId, fileContent, rawName } = body
      const collectionInfo = await prisma.fileCollection.findFirst({
        where: {
          id: collectionId,
        },
      })
      const clubInfo = await prisma.club.findFirst({
        where: {
          id: clubId,
        },
      })
      const naming = collectionInfo?.fileNaming
      const fileName = naming
        .replaceAll('$id$', clubId)
        .replaceAll('$club$', clubInfo.name.zh)
        .replaceAll('$ext$', rawName.split('.').pop())
      try {
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
                    id: existingRecord.fileId,
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
        catch (error) {
          console.log(error)
          console.log('Failed when updating')
          return {
            success: false,
            error,
          }
        }
        console.log('Updated s3 content')
        return {
          success: true,
        }
      }
      catch (error) {
        const fileUUID = uuidv4()
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
          console.log('Created s3 content')
          return {
            success: true,
          }
        }
        catch (error) {
          console.log(error)
          console.log('Failed to create')
          return {
            success: false,
            error,
          }
        }
      }
    })
})
