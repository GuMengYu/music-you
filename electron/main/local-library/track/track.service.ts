import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AlbumData } from '../album/album.entity'
import { AlbumArtwork } from '../albumArtwork/albumArtwork.entity'
import { FolderTrack } from '../folderTrack/folder-track.entity'
import { Folder } from '../folder/folder.entity'
import { Track } from './track.entity'

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepo: Repository<Track>) {
  }

  async getNumberOfTracksThatDoNotBelongFolders() {
    return await this.trackRepo.createQueryBuilder()
      .where((qb) => {
        const subQuery = qb.subQuery()
          .select('trackId')
          .from('folder_track', 'FolderTrack')
          .where('FolderTrack.folderId NOT IN (SELECT folderId FROM folder)')
          .getQuery()
        return `Track.trackId IN ${subQuery}`
      }).getCount()
  }

  public async deleteTracksThatDoNotBelongFolders() {
    const subQuery = this.trackRepo.createQueryBuilder()
      .select('FolderTrack.trackId', 'TrackID')
      .from('folder_track', 'FolderTrack')
      .where('FolderTrack.FolderID NOT IN (SELECT folderId FROM folder)')
      .getQuery()
    const res = await this.trackRepo.createQueryBuilder()
      .delete()
      .where(`Track.trackId IN (${subQuery})`).execute()

    return res.affected
  }

  async getAllTracks() {
    return await this.trackRepo.find()
  }

  public async deleteTrack(trackId: number) {
    try {
      const deleteResult = await this.trackRepo
        .createQueryBuilder()
        .delete()
        .where('trackId = :trackId', { trackId })
        .execute()
      console.log(deleteResult)
    }
    catch (e) {
      console.error('Error during bulk deletion:', e)
    }

  }

  public async getTrackByPath(path: string) {
    try {
      return await this.trackRepo.findOneBy({ path })
    }
    catch (e) {
      console.error('Error during bulk deletion:', e)
    }
  }

  public async deleteTracks(trackIds: number[]) {
    try {
      const deleteResult = await this.trackRepo
        .createQueryBuilder()
        .delete()
        .where('trackId IN (:...trackIds)', { trackIds })
        .execute()
      console.log(deleteResult)
    }
    catch (e) {
      console.error('Error during bulk deletion:', e)
    }
  }

  public async updateTrack(track: Track) {
    await this.trackRepo.save(track)
  }

  public async addTrack(track: Track) {
    await this.trackRepo.save(track)
  }

  public async getAllAlbumData() {

    const subquery = this.trackRepo
      .createQueryBuilder('t_sub')
      .select('t_sub.albumKey')
      .innerJoin(FolderTrack, 'ft_sub', 'ft_sub.trackId = t_sub.trackId')
      .innerJoin(Folder, 'f_sub', 'ft_sub.folderId = f_sub.folderId')
      // .where('f_sub.showInCollection = 1')
      .andWhere('t_sub.indexingSuccess = 1')
      .andWhere('t_sub.needsIndexing = 0')

    const result = await this.trackRepo
      .createQueryBuilder('t')
      .select([
        't.albumTitle as albumTitle',
        't.albumArtists as albumArtists',
        't.albumKey as AlbumKey',
        'a.artworkId as artworkId',
        'MAX(t.artists) as artists',
        'MAX(t.year) as year',
        'MAX(t.dateFileCreated) as dateFileCreated',
        'MAX(t.dateAdded) as dateAdded',
        'MAX(t.dateLastPlayed) as dateLastPlayed',
      ])
      .leftJoin(AlbumArtwork, 'a', 't.albumKey = a.albumKey')
      .innerJoin(FolderTrack, 'ft', 'ft.trackID = t.trackId')
      .innerJoin(Folder, 'f', 'ft.folderId = f.folderId')
      .where(`(${subquery.getQuery()})`)
      .groupBy('t.albumKey')
      .getRawMany()

    return result as AlbumData[]
  }

  public async getAlbumDataThatNeedsIndexing() {
    const albumData = await this.trackRepo.createQueryBuilder('t').select([
      't.albumTitle as albumTitle',
      't.albumArtists as albumArtists',
      't.albumKey as albumKey',
      'a.artworkId as artworkId',
      'MAX(t.artists) as artists',
      'MAX(t.year)            as year',
      'MAX(t.dateFileCreated) as dateFileCreated',
      'MAX(t.dateAdded)       as dateAdded',
      'MAX(t.dateLastPlayed)  as dateLastPlayed'])
      .leftJoin(AlbumArtwork, 'a', 't.albumKey = a.albumKey')
      .where('(t.albumKey IS NOT NULL AND t.albumKey <> \'\')')
      .andWhere('(t.albumKey NOT IN (SELECT albumKey FROM album_artwork) OR t.needsAlbumArtworkIndexing = 1)')
      .groupBy('t.albumKey')
      .getRawMany()
    return albumData as AlbumData[]
  }

  public getLastModifiedTrackForAlbumKeyAsync(albumKey: string) {
    return this.trackRepo.findOneBy({ albumKey })
  }

  public disableNeedsAlbumArtworkIndexingAsync(albumKey: string) {
    return this.trackRepo
      .createQueryBuilder()
      .update()
      .set({ needsAlbumArtworkIndexing: 0 })
      .where('albumKey = :albumKey', { albumKey })
      .execute()
  }
}
