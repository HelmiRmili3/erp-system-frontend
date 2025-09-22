import type { Category, CategoryAddDto, UpsertCategoryDto } from '@/models/Category.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

export const getCategories = async () => {
  return api.get<Response<Category[]>>(`/categories`)
}

export const getCategory = async (id: string) => {
  return api.get<Response<Category>>(`/categories/${id}`)
}
export const createCategory = async (category: CategoryAddDto) => {
  const formData = new FormData()
  formData.append('name', category.name!)
  if (category.parentCategoryId) {
    formData.append('parentCategoryId', category.parentCategoryId.toString())
  }
  if (category.file) {
    formData.append('file', category.file)
  }
  return api.post<Response<Category>>(`/categories`, formData)

  // return api.post<Response<Category>>(`/categories`, category)
}
export const updateCategory = async (category: UpsertCategoryDto) => {
  const formData = new FormData()
  formData.append('id', category.id!.toString())
  formData.append('name', category.name!)
  if (category.parentCategoryId) {
    formData.append('parentCategoryId', category.parentCategoryId.toString())
  }
  if (category.file) {
    formData.append('file', category.file)
  }

  return api.post<Response<Category>>(`/categories/${category.id}`, formData)

  // return api.put<Response<Category>>(`/categories/${category.id}`, category)
}

export const deleteCategory = async (id: string) => {
  return api.delete(`/categories/${id}`)
}
