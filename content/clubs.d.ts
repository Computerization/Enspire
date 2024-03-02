export interface Clubs {
  Sports: (Club)[]
  Service: (Club)[]
  Arts: (Club)[]
  Life: (Club)[]
  Academic: (Club)[]
  Personal?: (Club)[] | null
}
type ClubCategoryKey = Exclude<keyof Clubs, 'Personal'>
export interface Groups {
  C_GroupsID: string
  C_GroupNo: string
  C_NameC: string
  C_NameE: string
  C_CategoryID: string
  C_Category: string
  C_TypeC?: string | null
  C_TypeA?: string | null
  C_TypeS?: string | null
  C_FoundTime: string
  C_DescriptionC: string
  C_DescriptionE: string
}
export interface Supervisor {
  TeacherID: string
  T_Name: string
  T_Nickname?: string | null
  T_MTel?: string | null
  T_Email?: string | null
}
export interface Clubmember {
  StudentID: string
  S_Name: string
  S_Nickname: string
  S_STel?: string | null
  S_Email?: string | null
  LeaderYes: string
  C_Secede: string
}
export interface Clubrecord {
  C_Theme: string
  C_Date: string
  C_Reflection: string
}

export interface Club {
  groups: (Groups)[]
  supervisor?: (Supervisor | null)[] | null
  gmember: (Clubmember)[]
  grecord?: (Clubrecord | null)[] | null
  projectyes: number
}
