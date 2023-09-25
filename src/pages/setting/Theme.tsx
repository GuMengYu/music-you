import LightModeIcon from '@mui/icons-material/LightMode'
import Group from '@/components/Group'
import { APPEARANCE, THEME_COLOR, useSettingStore } from '@/store/setting'
import Col from '@/components/Col'

export default function ThemeSetting() {
  const { appearance, setAppearance, themeColor, setThemeColor } = useSettingStore()
  return <div>
    <Col variant='body2' title='显示模式' className='mb-4'>
    <Group exclusive items={[{
      icon: <LightModeIcon fontSize='small'/>,
      title: '浅色',
      value: APPEARANCE.LIGHT,
    },
    {
      icon: <LightModeIcon fontSize='small' />,
      title: '深色',
      value: APPEARANCE.DARK,
    },
    {
      icon: <LightModeIcon fontSize='small' />,
      title: '跟随系统',
      value: APPEARANCE.SYSTEM,
    },
    ]} value={appearance} onChange={setAppearance}></Group>
    </Col>
    <Col title='主体色' variant='body2'>
      <Group exclusive items={[
        {
          icon: <LightModeIcon fontSize='small' />,
          value: THEME_COLOR.GreenRockyMountains,
          title: '绿色岩石',
        },
        {
          icon: <LightModeIcon fontSize='small' />,
          value: THEME_COLOR.PurpleDress,
          title: '紫色裙摆',
        },
        {
          icon: <LightModeIcon fontSize='small' />,
          value: THEME_COLOR.OrangeDesert,
          title: '橘色沙漠',
        },
        {
          icon: <LightModeIcon fontSize='small' />,
          value: THEME_COLOR.BlueMountains,
          title: '蓝色山脉',
        },
        {
          icon: <LightModeIcon fontSize='small' />,
          value: THEME_COLOR.GreenMountainTop,
          title: '绿色峰顶',
        },
        {
          icon: <LightModeIcon fontSize='small' />,
          value: THEME_COLOR.RedSandDunes,
          title: '红色沙丘',
        },
      ]} value={themeColor} onChange={setThemeColor}></Group>
    </Col>
  </div>
}
