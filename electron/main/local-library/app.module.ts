import { Module } from '@nestjs/common'
import { ElectronModule } from '@doubleshot/nest-electron'
import { getWin } from '../index'
import { AppController } from './app.controller'
import { AppService } from './app.service'


@Module({
  imports: [ElectronModule.registerAsync({
    useFactory: async () => {
      const win = getWin()
      return { win }
    },
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

