'use client'
import { BentoTile, TileData } from '@/lib/types'
import BioTile from './tiles/BioTile'
import SocialTile from './tiles/SocialTile'
import TextTile from './tiles/TextTile'
import ImageTile from './tiles/ImageTile'
import LinksTile from './tiles/LinksTile'
import LocationTile from './tiles/LocationTile'
import SkillsTile from './tiles/SkillsTile'

interface Props {
  tile: BentoTile
  editing?: boolean
  onChange?: (data: TileData) => void
}

export default function TileRenderer({ tile, editing, onChange }: Props) {
  const props = { data: tile.data, editing, onChange }
  switch (tile.type) {
    case 'bio':      return <BioTile {...props} />
    case 'social':   return <SocialTile {...props} />
    case 'text':     return <TextTile {...props} />
    case 'image':    return <ImageTile {...props} />
    case 'links':    return <LinksTile {...props} />
    case 'location': return <LocationTile {...props} />
    case 'skills':   return <SkillsTile {...props} />
    default:         return null
  }
}
