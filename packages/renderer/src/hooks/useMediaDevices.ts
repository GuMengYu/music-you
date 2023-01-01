import { uniqBy } from 'lodash-es'

export default function useMediaDevices() {
  const outputDevices = ref<MediaDeviceInfo[]>([])
  async function getoutputDevices() {
    const result = await navigator.mediaDevices.enumerateDevices()
    // 过滤输出设备, 同一物理设备的groupId相同
    const uniqed = uniqBy(
      result.filter((d) => d.kind === 'audiooutput' && d.deviceId),
      'groupId'
    )
    outputDevices.value = uniqed.filter((device) => device.kind === 'audiooutput')
  }
  if (navigator.mediaDevices) {
    // on created get device list
    getoutputDevices()

    // get media output device list
    // handle device change
    navigator.mediaDevices.ondevicechange = () => {
      getoutputDevices()
    }
  }
  return {
    outputDevices,
  }
}
