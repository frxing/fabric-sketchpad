import Sketchpad from './sketchpad'

const install = function (Vue) {
  if (install.installed) return
  Vue.components(Sketchpad.name, Sketchpad)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Sketchpad
}
