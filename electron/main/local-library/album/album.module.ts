import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrackModule } from '../track/track.module'
import { IoModule } from '../utils/io/io.module'
import { Track } from '../track/track.entity'
import { AlbumService } from './album.service'

@Module({
  imports: [TrackModule, IoModule, TypeOrmModule.forFeature([Track])],
  providers: [AlbumService],
})
export class AlbumModule {}
