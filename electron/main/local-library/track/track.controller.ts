import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { TrackService } from './track.service'

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
  ) {
  }

  @IpcHandle('all-tracks')
  async getAllTracks() {
    const tracks = await this.trackService.getAllTracks()
    return {
      data: tracks,
    }
  }
}
