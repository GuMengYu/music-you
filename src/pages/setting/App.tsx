import { Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Col from '@/components/Col'
import { ExitMode, useSettingStore } from '@/store/setting'
import SelectMenu from '@/components/SelectMenu'
import { SupportedLanguage } from '@/i18n/i18n'

export default function AppSetting() {
  const { exitMode, setExitMode, locale, setLocale } = useSettingStore()
  const { i18n, t } = useTranslation()

  function resetApp() {
    localStorage.clear()
  }
  async function changeLanguage(locale: SupportedLanguage) {
    await i18n.changeLanguage(locale)
    setLocale(locale)
  }
  return <div>
    <div className='mb-3'>
      <Typography variant='subtitle1'>{t`common.general`}</Typography>
    </div>
    <Col variant='caption' title={t('common.language')} more={
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
    <Col variant='caption' title='重置应用'  more={
      <Button size='small' variant='contained' onClick={resetApp}>重置应用</Button>}>
    </Col>
  </div>
}
