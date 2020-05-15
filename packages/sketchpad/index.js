// 导入组件，组件必须声明 name
import Sketchpad from './src/main'
// 为组件提供 install 安装方法，供按需引入
Sketchpad.install = function (Vue) {
  Vue.component(Sketchpad.name, Sketchpad)
}
// 导出组件
export default Sketchpad
