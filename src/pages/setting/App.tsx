import { Button } from '@mui/material'
import { ipcRenderer } from 'electron'
import { useTranslation } from 'react-i18next'
import Col from '@/components/Col'
import { ExitMode, useSettingStore } from '@/store/setting'
import SelectMenu from '@/components/SelectMenu'
import is from '@/util/is'
import { SupportedLanguage } from '@/i18n/i18n'

const notMacos = is.windows() || is.linux()

export default function AppSetting() {
  const { exitMode, setExitMode, locale, setLocale } = useSettingStore()
  const { i18n, t } = useTranslation()

  function resetApp() {
    ipcRenderer.invoke('reset').then((confirm) => {
      if (confirm) {
        localStorage.clear()
        ipcRenderer.invoke('relaunch-direct')
      }
    })
  }
  async function changeLanguage(locale: SupportedLanguage) {
    await i18n.changeLanguage(locale)
    setLocale(locale)
  }
  return <div>
    <Col className='mb-4' variant='body2' title={t('common.language')} more={
      <SelectMenu value={locale} options={[
        {
          title: '简体中文',
          value: 'zh-CN',
        }, {
          title: 'English',
          value: 'en-US',
        },
      ]} onChange={(locale: SupportedLanguage) => changeLanguage(locale)} />
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
