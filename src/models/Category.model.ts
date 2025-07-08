export class Category {
  id: number = 0
  logo: string = ''
  logoUrl: string = ''
  name: string = ''
  parentCategoryId: number = 0
  subCategories: Category[] = []
  parentCategory: any = null
  defaultProductFeatures: any[] = []

}

export interface CategoryAddDto {
  name?: string
  parentCategoryId?: number
  file?: File
}

export interface UpsertCategoryDto extends CategoryAddDto {
  id?: number
  logo?: string
  logoUrl?: string
}
