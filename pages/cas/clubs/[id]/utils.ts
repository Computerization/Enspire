import type { AllClubs } from '~/types/api/user/all_clubs'

export async function getEditableClub(clubId: number) {
  const { data: allClubs } = await useAsyncData<AllClubs>('allRequests', () => {
    return $fetch('/api/user/all_clubs', {
      headers: useRequestHeaders(),
      method: 'GET',
    })
  })

  return allClubs.value?.president.find(club => club.id === clubId)
}
