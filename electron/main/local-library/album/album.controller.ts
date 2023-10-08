import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { TrackService } from '../track/track.service'
import { AlbumService } from './album.service'

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,

  ) {}

  @IpcHandle('all-albums')
  async getAlbums() {
    return this.albumService.getAllAlbums()
  }

  @IpcHandle('get-track')
  async getAlbumTracks(albumKey: string) {
    const tracks = await this.trackService.getTracksForAlbums(albumKey)
    return {
      data: tracks,
    }
  }

}
