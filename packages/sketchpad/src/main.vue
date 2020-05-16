<template>
  <div class="board-box" :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}">
    <ul class="tool-box">
      <li v-for="item in tools" :key="item.type" class="tool-con" :class="{active: toolType === item.type}" @click="changeTool(item.type)">
        <i class="iconfont" :class="item.icon"></i>
      </li>
    </ul>
    <canvas id="myCanvas" ref="myCanvas"></canvas>
  </div>
</template>

<script>
import { fabric } from 'fabric'
import FileSaver from 'file-saver'

let defaultProps = {
  canvasWidth: {
    type: Number,
    default: window.innerWidth
  },
  canvasHeight: {
    type: Number,
    default: window.innerHeight
  },
  canvasBgColor: {
    type: String,
    default: '#f6f6f6'
  },
  strokeColor: {
    type: String,
    default: '#f30'
  },
  strokeWidth: {
    type: Number,
    default: 2
  },
  showTools: {
    type: Boolean,
    default: true
  }
}

const TOOLS = [
  {
    name: '铅笔',
    type: 'pencil',
    icon: 'icon-pan_icon'
  },
  {
    name: '实线',
    type: 'line',
    icon: 'icon-xian'
  },
  {
    name: '虚线',
    type: 'dashedLine',
    icon: 'icon-xian1'
  },
  {
    name: '箭头',
    type: 'arrow',
    icon: 'icon-jiantou'
  },
  {
    name: '文字',
    type: 'text',
    icon: 'icon-wenzi'
  },
  {
    name: '矩形',
    type: 'rect',
    icon: 'icon-juxing'
  },
  {
    name: '圆形',
    type: 'cricle',
    icon: 'icon-yuanxing'
  },
  {
    name: '椭圆形',
    type: 'ellipse',
    icon: 'icon-tuoyuanxing'
  },
  {
    name: '三角形',
    type: 'equilateral',
    icon: 'icon-sanjiaoxing'
  },
  {
    name: '橡皮',
    type: 'rubber',
    icon: 'icon-xiangpi'
  },
  {
    name: '回退',
    type: 'undo',
    icon: 'icon-undo'
  },
  {
    name: '向前',
    type: 'redo',
    icon: 'icon-redo'
  },
  {
    name: '清除',
    type: 'clear',
    icon: 'icon-clear'
  },
  {
    name: '移动',
    type: 'move',
    icon: 'icon-yidong'
  },
  {
    name: '下载',
    type: 'download',
    icon: 'icon-xiazai'
  }

]

export default {
  name: 'vue-fabric-sketchpad',
  data () {
    return {
      boardObj: null, // 存储当前画布对象
      mouseFrom: {}, // 鼠标按下的位置
      mouseTo: {}, // 鼠标抬起的位置
      toolType: 'pencil', // 当前工具类型
      isDrawing: false, // 是否正在画 鼠标按下和抬起的开关控制
      drawingObj: null, // 正在绘制的对象
      history: [], // 存放历史记录
      textObj: null, // 存储文字对象
      stage: 0,
      tools: TOOLS
    }
  },
  props: defaultProps,
  mounted () {
    this.boardObj = new fabric.Canvas('myCanvas', {
      isDrawingMode: true, // 是否可以自由绘制
      selectable: true, // 控件不能被选择
      selection: true, // 画板中是否显示选中
      devicePixelRatio: true
    })
    this.boardObj.freeDrawingBrush.color = this.strokeColor // 设置自由画笔的颜色
    this.boardObj.freeDrawingBrush.width = this.strokeWidth // 自由画笔的宽度
    this.boardObj.setWidth(this.canvasWidth)
    this.boardObj.setHeight(this.canvasHeight)
    this.initEvent()
  },
  methods: {
    initEvent () {
      this.boardObj.on({
        'mouse:down': (e) => {
          console.log('down', e)
          let { x, y } = e.pointer
          this.mouseFrom = { x, y }
          // 判断是否选中了对象
          if (!this.boardObj.getActiveObject()) {
            this.isDrawing = true
          }
          if (this.toolType === 'text') {
            this.drawText()
          }
        },
        'mouse:up': (e) => {
          console.log('up', e)
          let { x, y } = e.pointer
          this.mouseTo = { x, y }
          this.isDrawing = false
          this.drawingObj = null
          this.addHistory()
        },
        'mouse:move': e => {
          if (this.isDrawing) {
            console.log('move', e)
            let { x, y } = e.pointer
            this.mouseTo = { x, y }
            this.drawing()
          }
        },
        // 移动对象时触发该事件
        'object:moving': e => {
          console.log('移动', e)
        },
        // 放大或者缩小对象时触发该事件
        'object:scaling': e => {
          console.log('放大缩小', e)
        },
        // 旋转对象时触发该事件
        'object:rotating': e => {
          console.log('旋转', e)
        },
        'selection:created': e => {
          console.log('选中了')
          if (this.toolType === 'rubber') {
            if (e.target._objects) {
              // 多选删除
              var etCount = e.target._objects.length
              for (var i = 0; i < etCount; i++) {
                this.boardObj.remove(e.target._objects[i])
              }
            } else {
              // 单选删除
              this.boardObj.remove(e.target)
            }
            this.boardObj.discardActiveObject() // 清楚选中框
          }
          this.addHistory()
        }
      })
    },
    drawing () {
      // 判断是否是同一次绘制 是的话先清楚保留最后一次
      if (this.drawingObj) {
        this.boardObj.remove(this.drawingObj)
      }
      this.boardObj.isDrawingMode = false
      this.boardObj.selectable = false
      this.boardObj.selection = false
      let drawObj = null
      switch (this.toolType) {
        case 'pencil':
          this.boardObj.isDrawingMode = true
          break
        case 'line':
          drawObj = this.drawLine()
          break
        case 'dashedLine':
          drawObj = this.drawDashedLine()
          break
        case 'arrow':
          drawObj = this.drawArrow()
          break
        case 'rect':
          drawObj = this.drawRect()
          break
        case 'cricle':
          drawObj = this.drawCricle()
          break
        case 'ellipse':
          drawObj = this.drawEllipse()
          break
        case 'equilateral':
          drawObj = this.drawEquilateral()
          break
        default:
          drawObj = null
          this.boardObj.selection = true
          this.boardObj.skipTargetFind = false
          this.boardObj.selectable = true
          break
      }
      if (drawObj) {
        console.log(drawObj)
        this.boardObj.add(drawObj)
        this.drawingObj = drawObj
      }
    },
    // 选择工具
    changeTool (type) {
      this.boardObj.isDrawingMode = false
      this.resetDrawObj()
      // 如果有选中的对象先清除选中
      if (this.boardObj.getActiveObject()) {
        this.boardObj.discardActiveObject()
        this.boardObj.renderAll()
      }
      if (type === 'clear') {
        return this.boardObj.clear()
      }
      if (type === 'undo') {
        return this.undo()
      }
      if (type === 'redo') {
        return this.redo()
      }
      if (type === 'download') {
        return this.composeImg()
      }
      this.toolType = type
      if (type === 'pencil') {
        this.boardObj.isDrawingMode = true
      }
      if (type === 'rubber' || type === 'move') {
        this.boardObj.selection = true
        this.boardObj.skipTargetFind = false
        this.boardObj.selectable = true
      }
    },
    resetDrawObj () {
      this.boardObj.selectable = true
      this.boardObj.selection = true
      this.boardObj.skipTargetFind = false
      if (this.textObj) {
        this.textObj.exitEditing()
        this.textObj = null
      }
    },
    // 画实线
    drawLine () {
      return new fabric.Line([this.mouseFrom.x, this.mouseFrom.y, this.mouseTo.x, this.mouseTo.y], {
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth
      })
    },
    // 画虚线
    drawDashedLine () {
      return new fabric.Line(
        [this.mouseFrom.x, this.mouseFrom.y, this.mouseTo.x, this.mouseTo.y],
        {
          stroke: this.strokeColor,
          strokeWidth: this.strokeWidth,
          strokeDashArray: [10, 3]
        }
      )
    },
    // 画矩形
    drawRect () {
      return new fabric.Rect({
        left: this.mouseFrom.x,
        top: this.mouseFrom.y,
        height: Math.abs(this.mouseTo.y - this.mouseFrom.y),
        width: Math.abs(this.mouseTo.x - this.mouseFrom.x),
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
        fill: 'rgba(255, 255, 255, 0)'
      })
    },
    // 画圆形
    drawCricle () {
      // 计算半径 勾股定理  a^2 + b^2 = c^2
      let a = this.mouseTo.x - this.mouseFrom.x
      let b = this.mouseTo.y - this.mouseFrom.y
      let r = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) / 2
      return new fabric.Circle({
        left: this.mouseFrom.x,
        top: this.mouseFrom.y,
        stroke: this.strokeColor,
        fill: 'rgba(255, 255, 255, 0)',
        radius: r,
        strokeWidth: this.strokeWidth
      })
    },
    // 画椭圆
    drawEllipse () {
      let left = this.mouseFrom.x
      let top = this.mouseFrom.y
      return new fabric.Ellipse({
        left: left,
        top: top,
        stroke: this.strokeColor,
        fill: 'rgba(255, 255, 255, 0)',
        originX: 'center',
        originY: 'center',
        rx: Math.abs(left - this.mouseTo.x),
        ry: Math.abs(top - this.mouseTo.y),
        strokeWidth: this.strokeWidth
      })
    },
    // 画等边三角形
    drawEquilateral () {
      let height = this.mouseTo.y - this.mouseFrom.y
      return new fabric.Triangle({
        top: this.mouseFrom.y,
        left: this.mouseFrom.x,
        width: Math.sqrt(Math.pow(height, 2) + Math.pow(height / 2, 2)),
        height: height,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
        fill: 'rgba(255,255,255,0)'
      })
    },
    // 画箭头
    drawArrow () {
      let [sx, sy] = [this.mouseFrom.x, this.mouseFrom.y]
      let [ex, ey] = [this.mouseTo.x, this.mouseTo.y]
      let disY = sy - ey
      let disX = sx - ex
      let theta = 30
      let headlen = 30
      var angle = Math.atan2(disY, disX) * 180 / Math.PI
      var angle1 = (angle + theta) * Math.PI / 180
      var angle2 = (angle - theta) * Math.PI / 180
      var topX = headlen * Math.cos(angle1)
      var topY = headlen * Math.sin(angle1)
      var botX = headlen * Math.cos(angle2)
      var botY = headlen * Math.sin(angle2)
      var arrowX = sx - topX
      var arrowY = sy - topY
      var path = ' M ' + sx + ' ' + sy
      path += ' L ' + ex + ' ' + ey
      arrowX = ex + topX
      arrowY = ey + topY
      path += ' M ' + arrowX + ' ' + arrowY
      path += ' L ' + ex + ' ' + ey
      arrowX = ex + botX
      arrowY = ey + botY
      path += ' L ' + arrowX + ' ' + arrowY
      return new fabric.Path(path, {
        stroke: this.strokeColor,
        fill: 'rgba(255,255,255,0)',
        strokeWidth: this.strokeWidth
      })
    },
    drawText () {
      let { x, y } = this.mouseFrom
      this.textObj = new fabric.Textbox('', {
        left: x,
        top: y,
        width: '',
        height: '',
        fill: this.strokeColor,
        hasControls: true
      })
      this.boardObj.add(this.textObj)
      this.textObj.enterEditing()
      this.textObj.hiddenTextarea.focus()
      this.addHistory()
    },
    // 增加历史记录
    addHistory () {
      this.history.push(JSON.stringify(this.boardObj))
    },
    undo () {
      let stack = this.history
      if (this.stage < stack.length) {
        this.boardObj.clear().renderAll()
        this.boardObj.loadFromJSON(stack[stack.length - 1 - this.stage - 1])
        this.boardObj.renderAll()
        this.stage += 1
      }
    },
    redo () {
      let stack = this.history
      if (this.stage > 0) {
        this.boardObj.clear().renderAll()
        this.boardObj.loadFromJSON(stack[stack.length - 1 - this.stage + 1])
        this.boardObj.renderAll()
        this.stage -= 1
      }
    },
    composeImg () {
      let base64Img = this.boardObj.toDataURL({
        formart: 'png',
        multiplier: 2
      })
      let bd = base64Img.split(',')
      let mime = bd[0].match(/:(.*?);/)[1]
      let bstr = atob(bd[1]); let l = bstr.length; let u8arr = new Uint8Array(l)
      while (l--) {
        u8arr[l] = bstr.charCodeAt(l)
      }
      let blobData = new Blob([u8arr], { type: mime })
      console.log('blob', blobData)
      FileSaver.saveAs(blobData, 'sketchpad.png')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../../src/assets/font/iconfont.css";
#myCanvas {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
.tool-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  z-index: 10;
  background: #d0d0d0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .tool-con {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    &.active {
      background: #333;
      color: #fff;
    }
  }
}
.board-box {
  width: 100%;
  height: 100%;
  position: relative;
  .btn {
    width: 80px;
    height: 30px;
    background: #f0f0f0;
    margin: 0 5px;
  }
}
</style>
