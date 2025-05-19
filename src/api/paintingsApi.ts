import axios from 'axios'
import type { Painting, Author, Location } from '../types'

const API_BASE = 'https://test-front.framework.team'

export const getPaintings = async (params: {
  q?: string
  _page: number
  _limit?: number
}): Promise<{ data: Painting[]; total: number }> => {
  try {
    const response = await axios.get<Painting[]>(`${API_BASE}/paintings`, {
      params: {
        ...params,
        _limit: params._limit || 6
      }
    })

    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count']) || 0
    }
  } catch (error) {
    throw new Error('Failed to load paintings. Please try again later.')
  }
}

export const getAuthors = async (): Promise<Author[]> => {
  try {
    const response = await axios.get<Author[]>(`${API_BASE}/authors`)
    return response.data
  } catch (error) {
    throw new Error('Failed to load authors. Please try again later.')
  }
}

export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await axios.get<Location[]>(`${API_BASE}/locations`)
    return response.data
  } catch (error) {
    throw new Error('Failed to load locations. Please try again later.')
  }
}
