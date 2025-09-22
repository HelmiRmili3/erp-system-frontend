import type { User } from './common.model'

export interface Absence {
  user: User
  id: number
  userId: string
  startDate: string
  endDate: string
  absenceType: number
  statusType: number
  reason: string
}

export interface UpdateAbsence {
  startDate: string
  endDate: string
  absenceType: number
  reason: string
  id: number
}

export interface CreateAbsence {
  startDate: string
  endDate: string
  absenceType: number
  reason: string
}
//  {
//       "user": {
//         "id": "c06c85d9-bb30-4027-8df6-61435782c788",
//         "email": "helmi@gmail.com",
//         "userName": "HelmiRmili",
//         "fileUrl": "/files/users/2e11f4f2-d369-4525-8b58-2b8643a427e5.jpg"
//       },
//       "id": 6,
//       "userId": "c06c85d9-bb30-4027-8df6-61435782c788",
//       "startDate": "2025-07-26T12:20:42.523Z",
//       "endDate": "2025-07-26T12:20:42.523Z",
//       "absenceType": 4,
//       "statusType": 0,
//       "reason": "sorry i can't tell you"
//     },
