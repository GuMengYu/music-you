import { Injectable } from '@nestjs/common'
import { DataDelimiter } from '../utils/data-delimiter'
import { TrackService } from '../track/track.service'
import { ArtistData } from './artist-data'
import { ArtistModel } from './artist-model'
import { ArtistType } from './artist-type'

@Injectable()
export class ArtistService {
  constructor(private trackService: TrackService) {}

  public async getArtists(artistType: ArtistType) {
    const artistDatas: ArtistData[] = []

    if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
      const trackArtistDatas: ArtistData[] = await this.trackService.getTrackArtistData()
      artistDatas.push(...trackArtistDatas)
    }

    if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
      const albumArtistDatas: ArtistData[] = await this.trackService.getAlbumArtistData()
      artistDatas.push(...albumArtistDatas)
    }

    const artistModels: ArtistModel[] = []
    let alreadyAddedArtists: string[] = []

    for (const artistData of artistDatas) {
      const artists: string[] = DataDelimiter.fromDelimitedString(artistData.artists)

      for (const artist of artists) {
        const processedArtist: string = artist.toLowerCase().trim()

        if (!alreadyAddedArtists.includes(processedArtist)) {
          alreadyAddedArtists.push(processedArtist)
          artistModels.push(new ArtistModel(artist))
        }
      }
    }

    alreadyAddedArtists = []

    return artistModels
  }
}
