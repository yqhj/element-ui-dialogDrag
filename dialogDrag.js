// 基于：https://www.jb51.net/article/145807.htm
import Vue from 'vue';

// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogWrapperEl = el.querySelector('.el-dialog__wrapper');
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    //dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'
    dialogWrapperEl.style.overflow = 'hidden'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else{
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      const screenWidth = document.body.clientWidth; // body当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      let minDragDomLeft = -dragDom.offsetLeft;
      let maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
      const reservedDistance = 80;
      minDragDomLeft += -(dragDomWidth - reservedDistance);
      maxDragDomLeft += dragDomWidth - reservedDistance;

      let minDragDomTop = -dragDom.offsetTop;
      let maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
      maxDragDomTop += dragDomheight - reservedDistance;

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left');
      let styT = sty(dragDom, 'top');

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if(styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
      }else {
        styL = +styL.replace(/\px/g, '');
        styT = +styT.replace(/\px/g, '');
      };

      // 去掉对拖拽的响应，参考：https://blog.csdn.net/z467469274/article/details/77332830?utm_source=blogxgwz2
      let ondragstartBackup = document.ondragstart
      let ondragendBackup = document.ondragend
      document.ondragstart = function(ev) {
        ev.preventDefault();
      };
      document.ondragend = function(ev) {
        ev.preventDefault();
      };

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (left < minDragDomLeft) {
          left = minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (top < minDragDomTop) {
          top = minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
        document.ondragstart = ondragstartBackup
        document.ondragend = ondragendBackup
      };
    }
  }
})
