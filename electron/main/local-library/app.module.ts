import { Module } from '@nestjs/common'
import { ElectronModule } from '@doubleshot/nest-electron'
import { TypeOrmModule } from '@nestjs/typeorm'
import { app } from 'electron'
import { getWin } from '../index'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FolderModule } from './folder/folder.module'
import { AlbumModule } from './album/album.module'
import { ArtistModule } from './artist/artist.module'
import { Folder } from './folder/folder.entity'
import { BaseModule } from './base/base.module'
import { Track } from './track/track.entity'
import { FolderTrack } from './folderTrack/folder-track.entity'
import { TrackModule } from './track/track.module'
import { FolderTrackModule } from './folderTrack/folder-track.module'
import { RemovedTrack } from './removedTrack/removedTrack.entity'
import { RemovedTrackModule } from './removedTrack/removedTrack.module'
import { AlbumArtworkModule } from './albumArtwork/albumArtwork.module'
import { AlbumArtwork } from './albumArtwork/albumArtwork.entity'

const userDataPath = app.getPath('userData')
const OrmModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: `${userDataPath}/databases/musicYouDB.db`,
  entities: [Folder, Track, FolderTrack, RemovedTrack, AlbumArtwork],
  synchronize: true,
})
const electronModule = ElectronModule.registerAsync({
  useFactory: async () => {
    const win = getWin()
    return { win }
  },
})

@Module({
  imports: [
    electronModule,
    OrmModule,
    TrackModule,
    FolderModule,
    AlbumModule,
    ArtistModule,
    BaseModule,
    FolderTrackModule,
    RemovedTrackModule,
    AlbumArtworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

