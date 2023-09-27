import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Track } from './track.entity'
import { TrackService } from './track.service'
import { TrackController } from './track.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  providers: [TrackService],
  exports: [TrackService],
  controllers: [TrackController],
})
export class TrackModule {}
