import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import fetch, { Headers } from 'node-fetch'
import * as dotenv from 'dotenv'
import { decrypt, encrypt } from './crypto'
import type { Club, Clubs } from '~/content/clubs'

dotenv.config()

class TSession {
  private readonly headers: Headers

  constructor() {
    const PHPSESSID = process.env.PHPSESSID
    if (!PHPSESSID || !process.env.TSIMS_URL)
      throw new Error('PHPSESSID or TSIMS_URL environment variable is not set')

    this.headers = new Headers({
      Cookie: `PHPSESSID=${PHPSESSID}`,
    })
  }

  async fetchClubCategories(): Promise<any> {
    const response = await fetch(`${process.env.TSIMS_URL}/php/cas_init_category_dropdown.php`, {
      method: 'POST',
      headers: this.headers,
    })
    return await response.json()
  }

  async fetchClubsInCategory(categoryId: number): Promise<any> {
    const formData = new URLSearchParams()
    formData.append('categoryid', categoryId.toString())

    const response = await fetch(`${process.env.TSIMS_URL}/php/cas_init_groups_dropdown.php`, {
      method: 'POST',
      headers: this.headers,
      body: formData,
    })
    return await response.json()
  }

  async fetchClubDetails(clubId: number): Promise<Club> {
    const formData = new URLSearchParams()
    formData.append('groupid', clubId.toString())

    const response = await fetch(`${process.env.TSIMS_URL}/php/cas_add_group_info.php`, {
      method: 'POST',
      headers: this.headers,
      body: formData,
    })
    return await response.json()
  }
}

export default async function main(): Promise<Clubs> {
  const tSession = new TSession()
  const output: Clubs = {} as Clubs

  const clubCategories = await tSession.fetchClubCategories()
  for (const category of clubCategories) {
    const clubs = await tSession.fetchClubsInCategory(category.C_CategoryID)
    output[category.C_Category as keyof Clubs] = []
    for (const club of clubs) {
      const clubDetails = await tSession.fetchClubDetails(club.C_GroupsID)
      output[category.C_Category as keyof Clubs]!.push(clubDetails)
    }
  }

  const encrypted = await encrypt(JSON.stringify(output), 'password')

  fs.writeFileSync('content/clubs.json.encrypted', Buffer.from(encrypted.cipherText))
  fs.writeFileSync('content/clubs.json.iv', encrypted.iv)

  console.log(await decrypt(encrypted, 'password'))
  // console.log(await decrypt(await encrypt(JSON.stringify(output), 'password'), 'password'))

  return output
}
