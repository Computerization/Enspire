import { getRole } from '~~/utils/user-roles'

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null) {
    setResponseStatus(event, 403)
    return
  }

  return getRole(auth.userId)
})
