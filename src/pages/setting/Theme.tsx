import Brightness4Icon from '@mui/icons-material/Brightness4'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'
import LandscapeIcon from '@mui/icons-material/Landscape'
import { useTranslation } from 'react-i18next'
import Group from '@/components/Group'
import { APPEARANCE, THEME_COLOR, useSettingStore } from '@/store/setting'
import Col from '@/components/Col'

export default function ThemeSetting() {
  const { appearance, setAppearance, themeColor, setThemeColor } = useSettingStore()
  const { t } = useTranslation()
  return <div>
    <Col variant='body2' title={t`common.appearance`} className='mb-4'>
    <Group exclusive items={[{
      icon: <BrightnessHighIcon fontSize='small'/>,
      title: t`common.light`,
      value: APPEARANCE.LIGHT,
    },
    {
      icon: <Brightness4Icon fontSize='small' />,
      title: t`common.dark`,
      value: APPEARANCE.DARK,
    },
    {
      icon: <BrightnessAutoIcon fontSize='small' />,
      title: t`common.auto`,
      value: APPEARANCE.SYSTEM,
    },
    ]} value={appearance} onChange={setAppearance}></Group>
    </Col>
    <Col title={t`common.theme_color`} variant='body2'>
      <Group exclusive items={[
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.GreenRockyMountains,
          title: t`theme.GreenRockyMountains`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.PurpleDress,
          title: t`theme.PurpleDress`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.OrangeDesert,
          title: t`theme.OrangeDesert`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.BlueMountains,
          title: t`theme.BlueMountains`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.GreenMountainTop,
          title: t`theme.GreenMountainTop`,
        },
        {
          icon: <LandscapeIcon fontSize='small' />,
          value: THEME_COLOR.RedSandDunes,
          title: t`theme.RedSandDunes`,
        },
      ]} value={themeColor} onChange={setThemeColor}></Group>
    </Col>
  </div>
}
