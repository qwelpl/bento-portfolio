export type TileType = 'bio' | 'social' | 'text' | 'image' | 'links' | 'location' | 'skills'

export interface TileData {
  name?: string
  title?: string
  bio?: string
  avatar?: string
  github?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  website?: string
  content?: string
  heading?: string
  url?: string
  caption?: string
  links?: { label: string; url: string }[]
  city?: string
  country?: string
  skills?: string[]
  bgColor?: string
}

export interface BentoTile {
  id: string
  type: TileType
  data: TileData
}

export interface GridItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

export interface Portfolio {
  id: string
  user_id: string
  username: string
  display_name: string
  tiles: BentoTile[]
  layout: GridItem[]
  theme: 'dark' | 'light'
  accent: string
  updated_at: string
}
