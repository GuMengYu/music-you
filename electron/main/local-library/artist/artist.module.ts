import { Module } from '@nestjs/common'
import { TrackModule } from '../track/track.module'
import { ArtistService } from './artist.service'
import { ArtistController } from './artist.controller'

@Module({
  imports: [TrackModule],
  providers: [ArtistService],
  controllers: [ArtistController],
})
export class ArtistModule {}
