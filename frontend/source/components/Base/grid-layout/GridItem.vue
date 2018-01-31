<template>
  <div
      ref="item"
      class="grid-item"
      :style="style"
      :class="{
        'resizable' : resizable,
        'resizing' : isResizing,
        'draggable-dragging' : isDragging,
        'cssTransforms' : useCssTransforms
      }"
  >
    <div class="grid-item__content">
      <slot></slot>
      <span
          class="dragabble-handle"
          v-if="draggable && trigger"
      />
    </div>

    <span
      v-if="resizable && trigger"
      class="resizable-handle"
    />
  </div>
</template>
<style lang="scss" scoped>
  .grid-item {
    transition: all 200ms ease;
    transition-property: left, top, right;
      &.cssTransforms {
          transition-property: transform;
      }
      &.resizing {
        opacity: 0.6;
        z-index: 3;
      }
      &.draggable-dragging {
        /*transition:none;*/
        z-index: 3;
      }
      &.grid-placeholder {
        background: #34a3ae;
        opacity: 0.2;
        transition-duration: 100ms;
        z-index: 2;
        user-select: none;
        border-radius: 4px;
      }
  }

    .resizable-handle {
      z-index: 2;
      position: absolute;
      width: 20px;
      height: 20px;
      bottom: 0;
      right: 0;
      background: #ccc;
      background-position: bottom right;
      padding: 0 3px 3px 0;
      background-repeat: no-repeat;
      background-origin: content-box;
      box-sizing: border-box;
      cursor: se-resize;
    }
    /**/
    .dragabble-handle {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      top: 0;
      left: 0;
      cursor: all-scroll;
    }
    .grid-item__content {
      width: 100%;
      height: 100%;
    }
</style>

<script>
  const
    // eventBus = require('./eventBus')
    {setTopLeft, setTopRight, /*setTransformRtl,*/ setTransform, createMarkup, getLayoutItem} = require('./utils')
    ,{getControlPosition, offsetXYFromParentOf, createCoreData} = require('./draggableUtils')
    ,interact = require('interact.js')
  ;

  module.exports = {
    name: 'GridItem',
    props: {
      /*стратегия динамики элементов*/
      strategy: {
        type: String,
        validator(value) {
          /*стратегия может быть одной из*/
          return ['static-placeholder'].indexOf(value) > -1;
        },
      },
      /*контексты селектора*/
      // context: {
      //   type: [Object, HTMLDivElement, HTMLDocument],
      //   default: document,
      // },
      /*состояние триггера из единого хранилища*/
      trigger: {
        type: Object,
        // required: true,
        default: null,
      },
      /*cols: {
          type: Number,
          required: true
      },*/
      /*containerWidth: {
          type: Number,
          required: true

      },
      rowHeight: {
          type: Number,
          required: true
      },
      margin: {
          type: Array,
          required: true
      },
      maxRows: {
          type: Number,
          required: true
      },*/
      isDraggable: {
          type: Boolean,
          required: false,
          default: null
      },
      isResizable: {
          type: Boolean,
          required: false,
          default: null
      },
      /*useCssTransforms: {
          type: Boolean,
          required: true
      },
      static: {
          type: Boolean,
          required: false,
          default: false
      },
      */
      minH: {
          type: Number,
          required: false,
          default: 1
      },
      minW: {
          type: Number,
          required: false,
          default: 1
      },
      maxH: {
          type: Number,
          required: false,
          default: Infinity
      },
      maxW: {
          type: Number,
          required: false,
          default: Infinity
      },
      x: {
          type: Number,
          required: true
      },
      y: {
          type: Number,
          required: true
      },
      w: {
          type: Number,
          required: true
      },
      h: {
          type: Number,
          required: true
      },
      i: {
          required: true
      },
      dragIgnoreFrom: {
          type: String,
          required: false,
          default: 'a, button',
      },
      resizeIgnoreFrom: {
          type: String,
          required: false,
          default: 'a, button',
      },
    },

    inject: [
      'eventBus'
    ],

    data() {
      return {
        cols: 1,
        containerWidth: 100,
        rowHeight: 30,
        margin: [10, 10],
        maxRows: Infinity,
        draggable: null,
        resizable: null,
        useCssTransforms: true,

        isDragging: false,
        dragging: null,
        isResizing: false,
        resizing: null,
        lastX: NaN,
        lastY: NaN,
        lastW: NaN,
        lastH: NaN,
        style: {},
        rtl: false,

        dragEventSet: false,
        resizeEventSet: false,

        previousW: null,
        previousH: null,
        previousX: null,
        previousY: null,
      }
    },

    /**/
    created() {
      this.eventBus.$on('updateWidth', this.updateWidthHandler);
      this.eventBus.$on('compact', this.compactHandler);
      this.eventBus.$on('setDraggable', this.setDraggableHandler);
      this.eventBus.$on('setResizable', this.setResizableHandler);
      this.eventBus.$on('setRowHeight', this.setRowHeightHandler);
      /*this.eventBus.$on('setColNum', (colNum) => {
          this.cols = colNum;
      });*/
    },

    /**/
    beforeDestroy() {
      //Remove listeners
      this.eventBus.$off('updateWidth', this.updateWidthHandler);
      this.eventBus.$off('compact', this.compactHandler);
      this.eventBus.$off('setDraggable', this.setDraggableHandler);
      this.eventBus.$off('setResizable', this.setResizableHandler);
      this.eventBus.$off('setRowHeight', this.setRowHeightHandler);
    },

    /**/
    mounted() {
      this.cols = this.$parent.colNum;
      this.rowHeight = this.$parent.rowHeight;
      this.containerWidth = this.$parent.width !== null ? this.$parent.width : 100;
      this.margin = this.$parent.margin !== undefined ? this.$parent.margin : [10, 10];
      this.maxRows = this.$parent.maxRows;
      if (this.isDraggable === null) {
          this.draggable = this.$parent.isDraggable;
      } else {
          this.draggable = this.isDraggable;
      }
      if (this.isResizable === null) {
          this.resizable = this.$parent.isResizable;
      } else {
          this.resizable = this.isResizable;
      }
      this.useCssTransforms = this.$parent.useCssTransforms;
      this.createStyle();
    },

    /**/
    watch: {
      /**/
      isDraggable() {
        this.draggable = this.isDraggable;
      },

      /*DRAGGABLE*/
      draggable() {
        /*если не установлена интерактивность на элементе*/
        if (this.interactObj == null) {
          this.addInteractToEl();
        }
        /**/
        if (this.draggable) {
          this.interactObj.draggable({});
          if (!this.dragEventSet) {
            this.dragEventSet = true;
            this.interactObj.on('dragstart dragmove dragend', event => {
                this.handleDrag(event);
            });
          }
        } else {
          this.interactObj.draggable({
            enabled: false,
          });
        }
      },

      /**/
      isResizable() {
        this.resizable = this.isResizable;
      },

      /*RESIZABLE*/
      resizable() {
        /*если не установлена интерактивность на элементе*/
        if (this.interactObj == null) {
          this.addInteractToEl();
        }
        /**/
        if (this.resizable) {
            this.interactObj
            .resizable({
                preserveAspectRatio: false,
                edges: {
                  left: false,
                  right: true,
                  bottom: true,
                  top: false
                }
            });
            /**/
            if (!this.resizeEventSet) {
                this.resizeEventSet = true;
                this.interactObj
                    .on('resizestart resizemove resizeend', event => {
                        this.handleResize(event);
                    });
            }
        } else {
          this.interactObj.resizable({
              enabled: false,
          });
        }
      },

      /**/
      rowHeight() {
        this.createStyle();
      },

      /**/
      cols() {
        this.createStyle();
      },

      /**/
      containerWidth() {
        this.createStyle();
      },

      /**/
      x() {
        this.createStyle();
      },

      /**/
      y() {
        this.createStyle();
      },

      /**/
      h() {
        this.createStyle();
      },

      /**/
      w() {
        this.createStyle();
      },
    },

    computed: {

    },

    methods: {
      /*добавить интерактивность элементу*/
      addInteractToEl() {
        this.interactObj = interact(this.$refs.item, {
          /**/
          // context: this.context.$el,
          // ignoreFrom: this.dragIgnoreFrom + ', .grid-item__content > *:not(.dragabble-handle)'
          /*чувствительные элементы*/
          allowFrom: '.resizable-handle, .dragabble-handle',
        });
      },

      updateWidthHandler(width) {
        this.updateWidth(width);
      },

      compactHandler(layout) {
        this.compact(layout);
      },

      setDraggableHandler(isDraggable) {
          if (this.isDraggable === null) {
              this.draggable = isDraggable;
          }
      },

      setResizableHandler(isResizable) {
          if (this.isResizable === null) {
              this.resizable = isResizable;
          }
      },

      setRowHeightHandler(rowHeight) {
          this.rowHeight = rowHeight;
      },

      createStyle() {
        if (this.x + this.w > this.cols) {
            this.x = 0;
            this.w = this.cols;
        }

        var pos = this.calcPosition(this.x, this.y, this.w, this.h);

        if (this.isDragging) {
            pos.top = this.dragging.top;
            pos.left = this.dragging.left;
        }
        if (this.isResizing) {
            pos.width = this.resizing.width;
            pos.height = this.resizing.height;
        }

        this.style = (this.useCssTransforms ? setTransform : setTopLeft)(pos.top, pos.left, pos.width, pos.height);
      },

      /*HANDLE RESIZE*/
      handleResize(event) {
        event.stopPropagation();
        
        if(this.isDragging) return;

        const position = getControlPosition(event);
        // Get the current drag point from the event. This is used as the offset.
        if (position == null) return; // not possible but satisfies flow
        const {x, y} = position;

        const newSize = {width: 0, height: 0};
        switch (event.type) {
            case 'resizestart':
                this.previousW = this.w;
                this.previousH = this.h;
                var pos = this.calcPosition(this.x, this.y, this.w, this.h);
                newSize.width = pos.width;
                newSize.height = pos.height;
                this.resizing = newSize;
                this.isResizing = true;
                break;
            case 'resizemove':
//                        console.log('### resize => ' + event.type + ', lastW=' + this.lastW + ', lastH=' + this.lastH);
                const coreEvent = createCoreData(this.lastW, this.lastH, x, y);
                newSize.width = this.resizing.width + coreEvent.deltaX;
                newSize.height = this.resizing.height + coreEvent.deltaY;

                ///console.log('### resize => ' + event.type + ', deltaX=' + coreEvent.deltaX + ', deltaY=' + coreEvent.deltaY);
                this.resizing = newSize;
                break;
            case 'resizeend':
                //console.log('### resize end => x=' +this.x + ' y=' + this.y + ' w=' + this.w + ' h=' + this.h);
                var pos = this.calcPosition(this.x, this.y, this.w, this.h);
                newSize.width = pos.width;
                newSize.height = pos.height;
//                        console.log('### resize end => ' + JSON.stringify(newSize));
                this.resizing = null;
                this.isResizing = false;
                break;
        }

        // Get new WH
        var pos = this.calcWH(newSize.height, newSize.width);
        if (pos.w < this.minW) {
            pos.w = this.minW;
        }
        if (pos.w > this.maxW) {
            pos.w = this.maxW;
        }
        if (pos.h < this.minH) {
            pos.h = this.minH;
        }
        if (pos.h > this.maxH) {
            pos.h = this.maxH;
        }

        if (pos.h < 1) {
            pos.h = 1;
        }
        if (pos.w < 1) {
            pos.w = 1;
        }

        this.lastW = x;
        this.lastH = y;

        if (this.w !== pos.w || this.h !== pos.h) {
            this.$emit('resize', this.i, pos.h, pos.w);
        }
        if (event.type === 'resizeend' && (this.previousW !== this.w || this.previousH !== this.h)) {
            this.$emit('resized', this.i, pos.h, pos.w, newSize.width, newSize.height);
        }
        this.eventBus.$emit('resizeEvent', event.type, this.i, this.x, this.y, pos.h, pos.w);
      },

      /*HANDLE DRAG*/
      handleDrag(event) {
        event.stopPropagation();
        if (this.isResizing) return;

        /**/
        this.$emit('drevent', event, this);
        /**/

        const position = getControlPosition(event);

        // Get the current drag point from the event. This is used as the offset.
        if (position == null) return; // not possible but satisfies flow
        const {x, y} = position;

        var shouldUpdate = false;
        const newPosition = {top: 0, left: 0};
        switch (event.type) {
          case 'dragstart':
              this.previousX = this.x;
              this.previousY = this.y;

              var parentRect = event.target.offsetParent.getBoundingClientRect();
              var clientRect = event.target.getBoundingClientRect();
              newPosition.left = clientRect.left - parentRect.left;
              newPosition.top = clientRect.top - parentRect.top;
              this.dragging = newPosition;
              this.isDragging = true;
              break;
          case 'dragend':
              if (!this.isDragging) return;
              parentRect = event.target.offsetParent.getBoundingClientRect();
              clientRect = event.target.getBoundingClientRect();
              newPosition.left = clientRect.left - parentRect.left;
              newPosition.top = clientRect.top - parentRect.top;
//                        console.log('### drag end => ' + JSON.stringify(newPosition));
//                        console.log('### DROP: ' + JSON.stringify(newPosition));
              this.dragging = null;
              this.isDragging = false;
              shouldUpdate = true;
              break;
          case 'dragmove':
              const coreEvent = createCoreData(this.lastX, this.lastY, x, y);
              newPosition.left = this.dragging.left + coreEvent.deltaX;
              newPosition.top = this.dragging.top + coreEvent.deltaY;
              this.dragging = newPosition;
              break;
        }
        /**/
        var pos = this.calcXY(newPosition.top, newPosition.left);

        this.lastX = x;
        this.lastY = y;

        if(this.x !== pos.x || this.y !== pos.y) {
          this.$emit('move', this.i, pos.x, pos.y);
        }
        if(event.type === 'dragend' && (this.previousX !== this.x || this.previousY !== this.y)) {
          this.$emit('moved', event, this, pos.x, pos.y);
        }

        this.eventBus.$emit('dragEvent', event.type, this.i, pos.x, pos.y, this.h, this.w);
      },
      /*/HANDLE DRAG/*/



      calcPosition(x, y, w, h) {
        const colWidth = this.calcColWidth();
        var out = {
            left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
            top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
            // 0 * Infinity === NaN, which causes problems with resize constriants;
            // Fix this if it occurs.
            // Note we do it here rather than later because Math.round(Infinity) causes deopt
            width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
            height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
        };
        return out;
      },

      /**
       * Translate x and y coordinates from pixels to grid units.
       * @param  {Number} top  Top position (relative to parent) in pixels.
       * @param  {Number} left Left position (relative to parent) in pixels.
       * @return {Object} x and y in grid units.
       */
      // TODO check if this function needs change in order to support rtl.
      calcXY(top, left) {
          const colWidth = this.calcColWidth();

          // left = colWidth * x + margin * (x + 1)
          // l = cx + m(x+1)
          // l = cx + mx + m
          // l - m = cx + mx
          // l - m = x(c + m)
          // (l - m) / (c + m) = x
          // x = (left - margin) / (coldWidth + margin)
          let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
          let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));

          // Capping
          x = Math.max(Math.min(x, this.cols - this.w), 0);
          y = Math.max(Math.min(y, this.maxRows - this.h), 0);

          return {x, y};
      },

      // Helper for generating column width
      calcColWidth() {
          var colWidth = (this.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols;
//                console.log('### COLS=' + this.cols + ' COL WIDTH=' + colWidth);
          return colWidth;
      },

      /**
       * Given a height and width in pixel values, calculate grid units.
       * @param  {Number} height Height in pixels.
       * @param  {Number} width  Width in pixels.
       * @return {Object} w, h as grid units.
       */
      calcWH(height, width) {
          const colWidth = this.calcColWidth();

          // width = colWidth * w - (margin * (w - 1))
          // ...
          // w = (width + margin) / (colWidth + margin)
          let w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]));
          let h = Math.round((height + this.margin[1]) / (this.rowHeight + this.margin[1]));

          // Capping
          w = Math.max(Math.min(w, this.cols - this.x), 0);
          h = Math.max(Math.min(h, this.maxRows - this.y), 0);
          return {w, h};
      },
      updateWidth(width, colNum) {
          this.containerWidth = width;
          if (colNum !== undefined && colNum !== null) {
              this.cols = colNum;
          }
      },
      compact() {
          this.createStyle();
      }
    },
  }
</script>
