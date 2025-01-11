import { PrismaClient, Roles } from '@prisma/client'

const prisma = new PrismaClient()

export interface getRoleResponse {
  success: boolean
  role: string | null
  error?: string
}

export async function getRole(clerkId: string): Promise<getRoleResponse> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        clerkUserId: clerkId,
      },
    })
    return {
      success: true,
      role: user.role,
    }
  }
  catch (error) {
    return {
      success: false,
      role: null,
      error: String(error),
    }
  }
}

export function isRole(roleData: getRoleResponse | undefined, theRole: string) {
  return roleData?.success === true && roleData.role === theRole
}

export function isAdmin(roleData: getRoleResponse | undefined) {
  return isRole(roleData, Roles.ADMIN)
}
