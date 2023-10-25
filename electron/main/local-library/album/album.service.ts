import { Injectable } from '@nestjs/common'
import { TrackService } from '../track/track.service'
import { FileAccess } from '../utils/io/file-access'
import { AlbumData } from './album.entity'
import { AlbumModel } from './album-model'

@Injectable()
export class AlbumService {
  constructor(
    private readonly trackService: TrackService,
    private fileAccess: FileAccess,
  ) {
  }

  public async getAllAlbums() {
    const albumDatas: AlbumData[] = await this.trackService.getAllAlbumData()

    return this.createAlbumsFromAlbumData(albumDatas)
  }

  private createAlbumsFromAlbumData(albumDatas: AlbumData[]) {
    if (albumDatas) {
      return albumDatas.map((x) => {
        const al = new AlbumModel(x, this.fileAccess)
        return {
          albumData: x,
          name: al.albumTitle,
          id: al.albumKey,
          ar: al.albumArtist,
          picUrl: al.artworkPath,
        }
      })
    }

    return []
  }
}
