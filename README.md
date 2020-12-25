### element-ui-dialogDrag
element-ui可拖拽对话框

基于：
https://segmentfault.com/a/1190000016040327

https://www.jb51.net/article/145807.htm

### 解决了如下问题
1. 鼠标松开之后，有时对话框还会跟随鼠标移动。
2. 不能将对话框移动到屏幕可视区之外。

### 使用方法
在main.js中引入：
import './dialogDrag.js';

vue文件中使用：
在el-dialog标签中加入v-dialogDrag属性：
<el-dialog v-dialogDrag></el-dialog>
