import type { Config, Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import type { Clubs } from '~/types/clubs'
import updateClubInfo from '~/utils/update-club-info'

export default async (context: Context) => {
  const store = getStore('enspire')
  const clubs: Clubs = await updateClubInfo()
  await store.setJSON('clubs', clubs)

  return new Response('Done')
}

export const config: Config = {
  schedule: '0 */12 * * *',
}
