import nodeid3 from 'node-id3'

export default function restoreTrackMetaInfo(path, info) {
  nodeid3.write(path, info)
}
