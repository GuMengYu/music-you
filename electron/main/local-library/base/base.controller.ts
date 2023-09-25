import { Controller } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { FileAccess } from '../utils/io/file-access'
import { IndexingService } from '../utils/indexing/indexing.service'

@Controller('base')
export class BaseController {
  constructor(private readonly fileAccess: FileAccess, private readonly indexingService: IndexingService) {}
  @IpcHandle('get-files')
  async getFiles(path: string) {
    const res = await this.fileAccess.getFilesInDirectoryAsync(path)
    console.log(res)
  }

  @IpcHandle('indexing')
  async indexing() {
    this.indexingService.indexCollectionAlwaysAsync()
  }
}
