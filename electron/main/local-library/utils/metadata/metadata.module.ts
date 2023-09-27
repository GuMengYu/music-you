import { Module } from '@nestjs/common'
import { IoModule } from '../io/io.module'
import { DateTime } from '../date-time'
import { FileMetadataFactory } from './file-metadata-factory'
import { MetadataPatcher } from './metadata-patcher'
import { MimeTypes } from './mime-types'

@Module({
  imports: [IoModule],
  providers: [FileMetadataFactory, MetadataPatcher, MimeTypes, DateTime],
  exports: [FileMetadataFactory, MetadataPatcher, MimeTypes, DateTime],
})
export class MetadataModule {}
