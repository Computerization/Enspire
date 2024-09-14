import type { Config } from '@netlify/functions'
import updateClubInfo from '~/utils/update-club-info'

export default async () => {
  await updateClubInfo()
}

export const config: Config = {
  schedule: '0 */12 * * *',
}
