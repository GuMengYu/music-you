import { Button } from '@mui/material'
import { ipcRenderer } from 'electron'
import Col from '@/components/Col'
import { ExitMode, useSettingStore } from '@/store/setting'
import SelectMenu from '@/components/SelectMenu'
import is from '@/util/is'
import MdSlider from '@/components/Slider'

const notMacos = is.windows() || is.linux()

export default function AppSetting() {
  const { exitMode, setExitMode, border, setBorder } = useSettingStore()

  function resetApp() {
    ipcRenderer.invoke('reset').then((confirm) => {
      if (confirm) {
        localStorage.clear()
        ipcRenderer.invoke('relaunch-direct')
      }
    })
  }
  function handleBorderChange(value: number) {
    setBorder(value)
  }
  return <div>
    <Col className='mb-4' variant='body2' title='边框' subTitle='调整应用边框大小' more={
      <div className='w-48'>
        <MdSlider
          valueLabelDisplay='auto'
          value={border}
          size='small'
          min={0}
          max={10}
          step={1}
          onChange={(e, value) => handleBorderChange(value as number)}
        />
      </div>
    }>
    </Col>
    {
      notMacos && <Col className='mb-4' variant='body2' title='关闭窗口' subTitle='点击窗口关闭按钮的行为' more={
        <SelectMenu value={exitMode} options={[
          {
            title: '最小化',
            value: ExitMode.minimize,
          },
          {
            title: '直接退出',
            value: ExitMode.exit,
          },
          {
            title: '询问',
            value: ExitMode.prompt,
          },
        ]} onChange={setExitMode} />
      }>
        </Col>
    }
    <Col className='mb-4' variant='body2' title='重置应用' subTitle='点击窗口关闭按钮的行为' more={
      <Button size='small' variant='contained' onClick={resetApp}>重置应用</Button>}>
    </Col>
  </div>
}
