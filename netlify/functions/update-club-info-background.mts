import type { Config, Handler } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { schedule } from '@netlify/functions'
import { wrap } from '@netlify/integrations'

import { withSentry } from '@netlify/sentry'
import type { Clubs } from '~/types/clubs'
import updateClubInfo from '~/utils/update-club-info'

async function myHandler() {
  const store = getStore('enspire')
  const clubs: Clubs = await updateClubInfo()
  await store.setJSON('clubs', clubs)

  return new Response('Done')
}

const withIntegrations = wrap(withSentry)

const config: Config = {
  sentry: {
    cronMonitoring: {
      enable: true,
      monitorId: 'update-club-info',
    },
  },
}

const handlerWithIntegrations = withIntegrations(myHandler, config) as Handler

const handler = schedule('@hourly', handlerWithIntegrations)

export { handler }
