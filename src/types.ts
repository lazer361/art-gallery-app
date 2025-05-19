// src/types.ts
export interface Painting {
  id: number
  name: string
  created: string
  authorId: number
  locationId: number
  imageUrl: string | null
  author?: string
  location?: string
}

export interface Author {
  id: number
  name: string
}

export interface Location {
  id: number
  location: string
}
