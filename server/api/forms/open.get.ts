import dayjs from 'dayjs'
import { createStorage } from 'unstorage'
import fsLiteDriver from 'unstorage/drivers/fs-lite'
import { parse } from 'yaml'
import type { Form, Forms } from '~/types/data/forms'

const storage = createStorage({
  driver: fsLiteDriver({ base: './data' }),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const yaml = await storage.getItem('forms:forms.yaml') as string

  if (!yaml) {
    setResponseStatus(event, 404)
    return
  }

  const yamlForms = parse(yaml) as Forms

  const forms: Form[] = (Object.entries(yamlForms).map(([id, entry]) => ({
    id,
    ...entry,
  })))

  return forms
    .filter(entry => dayjs().isBefore(dayjs(entry.end_date)))
})
