# vue-fabric-sketchpad

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
