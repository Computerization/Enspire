export interface ClubName {
  zh: string,
  en: string
}
export interface Club {
  name: ClubName,
  id: number
}
export interface AllClubs {
  "president": Club[]
  "vice": Club[]
  "member": Club[]
}
