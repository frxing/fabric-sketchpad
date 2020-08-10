# vue-fabric-sketchpad

本项目是用fabric开发的vue画板组件
预览地址：http://sketchpad.frxing.cn

## 项目运行

```javascript
   git clone git@github.com:frxing/fabric-sketchpad.git
   cd fabric-sketchpad
   npm install 
   npm run serve
```

## 支持vue组件形式安转使用

1. 安装
   
   ```javascript
   npm i vue-fabric-sketchpad -S
   ```

2. 引入---在项目src目录下的main.js文件中
   
   ```javascript
   import vueFabricSketchpad from 'vue-fabric-sketchpad'
   import 'vue-fabric-sketchpad/lib/vue-fabric-sketchpad.css'
   Vue.use(vueFabricSketchpad)
   ```

3. 使用
   
   ```javascript
    <template>
        <vue-fabric-sketchpad />
    </template>
   
    <script>
    export default {
        name: 'XXX',
        components: {}
    }
    </script>
   ```
   
   ## Attributes
   
   | 参数            | 说明      | 类型      | 可选值                   | 默认值                |
   | ------------- | ------- | ------- | --------------------- | ------------------ |
   | canvasWidth   | 画布的宽度   | number  | --                    | window.innerWidth  |
   | canvasHeight  | 画布的高度   | number  | --                    | window.innerHeight |
   | strokeColor   | 画笔颜色    | string  | --                    | #f30               |
   | strokeWidth   | 画笔宽度    | number  | --                    | 2                  |
   | showTools     | 是否显示工具栏 | boolean | --                    | true               |
   | placement     | 工具栏位置   | string  | top/left/right/bottom | left               |
