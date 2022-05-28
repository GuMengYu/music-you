import log from 'electron-log'

log.transports.file.level = 'info'

log.info('hello world')

export default log
