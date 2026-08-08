'use client'
import { BentoTile } from '@/lib/types'
import BioTile from './tiles/BioTile'
import SocialTile from './tiles/SocialTile'
import TextTile from './tiles/TextTile'
import ImageTile from './tiles/ImageTile'
import LinksTile from './tiles/LinksTile'
import LocationTile from './tiles/LocationTile'
import SkillsTile from './tiles/SkillsTile'

export default function TileRenderer({ tile }: { tile: BentoTile }) {
  switch (tile.type) {
    case 'bio': return <BioTile data={tile.data} />
    case 'social': return <SocialTile data={tile.data} />
    case 'text': return <TextTile data={tile.data} />
    case 'image': return <ImageTile data={tile.data} />
    case 'links': return <LinksTile data={tile.data} />
    case 'location': return <LocationTile data={tile.data} />
    case 'skills': return <SkillsTile data={tile.data} />
    default: return null
  }
}
