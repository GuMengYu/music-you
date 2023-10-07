import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Track } from '../track/track.entity'
import { TrackService } from '../track/track.service'
import { FileAccess } from '../utils/io/file-access'
import { AlbumData } from './album.entity'
import { AlbumModel } from './album-model'

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Track)
    private readonly trackService: TrackService,
    private fileAccess: FileAccess,
  ) {
  }

  public async getAllAlbums() {
    const albumDatas: AlbumData[] = await this.trackService.getAllAlbumData()

    return this.createAlbumsFromAlbumData(albumDatas)
  }

  private createAlbumsFromAlbumData(albumDatas: AlbumData[]): AlbumModel[] {
    if (albumDatas)
      return albumDatas.map(x => new AlbumModel(x, this.fileAccess))


    return []
  }

}
