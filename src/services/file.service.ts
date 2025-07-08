import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.value!.post<Response<string>>('/files', formData)
}

const deleteFile = (fileName: string) => {
  return api.value!.delete(`/files/${fileName}`)
}

export { uploadFile, deleteFile }
