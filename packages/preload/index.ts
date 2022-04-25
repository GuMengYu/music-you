import { useLoading } from './loading'
import { domReady } from './utils'

const { appendLoading, removeLoading } = useLoading()
window.removeLoading = removeLoading

domReady().then(appendLoading)
