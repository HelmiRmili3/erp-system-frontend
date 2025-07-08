import type { configuration } from '@/models/configuration.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'
import { deleteFile, uploadFile } from './file.service'

const getAllConfigurations = () => {
  return api.value!.get<Response<configuration[]>>('/configurations')
}

const getOneConfiguration = (key: string) => {
  return api.value!.get<Response<configuration>>(`/configurations/${key}`)
}

const updateConfig = (key: string, value: string) => {
  return api.value!.put<Response<configuration>>(`/configurations/${key}`, { key, value })
}

const updateLogo = async (oldFile: string, file: File) => {
  oldFile = encodeURI(oldFile)
  try {
    await deleteFile(oldFile)
  }
  catch (error) {
    console.error('Error deleting old file:', error)
  }
  const result = await uploadFile(file)
  const url = result.data.data
  updateConfig('logo', url)
  return url
}

export { getAllConfigurations, getOneConfiguration, updateConfig, updateLogo }
