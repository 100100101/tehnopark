<template>
    <div ref="item" class="grid-layout" :style="mergedStyle">
        <slot></slot>
        <grid-item
          class="grid-placeholder"
          v-show="isDragging"
          :x="placeholder.x"
          :y="placeholder.y"
          :w="placeholder.w"
          :h="placeholder.h"
          :i="placeholder.i"
        ></grid-item>
    </div>
</template>
<style lang="scss">
  .grid-layout {
    // position: relative;
    transition: height 200ms ease;
    visibility: hidden;
      & > * {
        visibility: visible;
      }
  }
</style>

<script>
  const
    Vue = require('vue')
    ,elementResizeDetectorMaker = require('element-resize-detector')
    ,{bottom, compact, getLayoutItem, moveElement, validateLayout} = require('./utils')
  ;

  //var eventBus = require('./eventBus');
  module.exports = {
    name: 'GridLayout',
    provide: {
        eventBus: null
    },
    components: {
        GridItem: require('./GridItem.vue'),
    },
    props: {
      /*стратегия динамики элементов*/
      strategy: {
        type: String,
        validator(value) {
          /*стратегия может быть одной из*/
          return ['static-placeholder'].indexOf(value) > -1;
        },
      },
      // If true, the container height swells and contracts to fit contents
      autoSize: {
          type: Boolean,
          default: true
      },
      colNum: {
          type: Number,
          default: 12
      },
      rowHeight: {
          type: Number,
          default: 150
      },
      maxRows: {
          type: Number,
          default: Infinity
      },
      margin: {
          type: Array,
          default() {
              return [10, 10];
          }
      },
      isDraggable: {
          type: Boolean,
          default: true
      },
      isResizable: {
          type: Boolean,
          default: true
      },
      useCssTransforms: {
          type: Boolean,
          default: true
      },
      verticalCompact: {
          type: Boolean,
          default: true
      },
      layout: {
          type: Array,
          required: true,
      },
    },

    /**/
    data() {
      return {
        width: null,
        mergedStyle: {},
        lastLayoutLength: 0,
        isDragging: false,
        placeholder: {
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          i: 0
        },
      };
    },

    /**/
    created() {
      this._provided.eventBus =  new Vue();
      this.eventBus = this._provided.eventBus;
      this.eventBus.$on('resizeEvent', this.resizeEventHandler);
      this.eventBus.$on('dragEvent', this.dragEventHandler);
    },

    /**/
    beforeDestroy() {
        //Remove listeners
        this.eventBus.$off('resizeEvent', this.resizeEventHandler);
        this.eventBus.$off('dragEvent', this.dragEventHandler);
        window.removeEventListener('resize', this.onWindowResize)
    },


    mounted() {
      this.$nextTick(() => {
          validateLayout(this.layout);
          this.$nextTick(() => {
              if (this.width === null) {
                  this.onWindowResize();
                  //this.width = this.$el.offsetWidth;
                  window.addEventListener('resize', this.onWindowResize);
              }
              compact(this.layout, this.verticalCompact);

              this.updateHeight();
              this.$nextTick(() => {
                  var erd = elementResizeDetectorMaker({
                      strategy: 'scroll' //<- For ultra performance.
                  });
                  erd.listenTo(this.$refs.item, element => {
                      this.onWindowResize();
                  });
              });
          });
          window.onload = () => {
              if (this.width === null) {
                  this.onWindowResize();
                  //this.width = this.$el.offsetWidth;
                  window.addEventListener('resize', this.onWindowResize);
              }
              compact(this.layout, this.verticalCompact);

              this.updateHeight();
              this.$nextTick(() => {
                  var erd = elementResizeDetectorMaker({
                      strategy: 'scroll' //<- For ultra performance.
                  });
                  erd.listenTo(this.$refs.item, element => {
                      this.onWindowResize();
                  });
              });

          };
      });
    },


    watch: {
      /**/
      width() {
        this.$nextTick(function () {
          //this.$broadcast('updateWidth', this.width);
          this.eventBus.$emit('updateWidth', this.width);
          this.updateHeight();
        });
      },
      /**/
      layout() {
        this.layoutUpdate();
      },
      /**/
      rowHeight() {
        this.eventBus.$emit('setRowHeight', this.rowHeight);
      },
      /**/
      isDraggable() {
        this.eventBus.$emit('setDraggable', this.isDraggable);
      },
      /**/
      isResizable() {
        this.eventBus.$emit('setResizable', this.isResizable);
      }
    },

    /**/
    methods: {
      /**/
      resizeEventHandler(eventType, i, x, y, h, w) {
          this.resizeEvent(eventType, i, x, y, h, w);
      },

      /**/
      dragEventHandler(eventType, i, x, y, h, w) {
          this.dragEvent(eventType, i, x, y, h, w);
      },

      /**/
      layoutUpdate() {
          if (this.layout !== undefined && this.layout.length !== this.lastLayoutLength) {
          //  console.log('### LAYOUT UPDATE!');
              this.lastLayoutLength = this.layout.length;
              compact(this.layout, this.verticalCompact);

              //this.$broadcast('updateWidth', this.width);
              this.eventBus.$emit('updateWidth', this.width);
              this.updateHeight();
          }
      },

      /**/
      updateHeight() {
          this.mergedStyle = {
              height: this.containerHeight()
          };
      },

      /**/
      onWindowResize() {
        if (this.$refs !== null && this.$refs.item !== null && this.$refs.item !== undefined) {
          this.width = this.$refs.item.offsetWidth;
        }
      },

      /**/
      containerHeight() {
          if (!this.autoSize) return;
          return bottom(this.layout) * (this.rowHeight + this.margin[1]) + this.margin[1] + 'px';
      },

      /**/
      dragEvent(eventName, id, x, y, h, w) {
        /*если стратегия переноса - */
        if(this.strategy === 'static-placeholder') {

          var
            l = getLayoutItem(this.layout, id)
          ;


          if (eventName == 'dragmove' || eventName == 'dragstart') {
              this.isDragging = true;
              this.placeholder.i = id;
              this.placeholder.x = 0;
              this.placeholder.y = 0;
              this.placeholder.w = w;
              this.placeholder.h = h;
              //this.$broadcast('updateWidth', this.width);
              // this.eventBus.$emit('updateWidth', this.width);
          } else {
              this.isDragging = false;
          }
          /*GetLayoutItem sometimes returns null object*/
          if (l == null){
            l = {x:0, y:0}
          }
          l.x = x;
          l.y = y;
          /*Move the element to the dragged location.*/
          console.log(x, y);
          // this.layout = moveElement(this.layout, l, x, y, true);


          // compact(this.layout, this.verticalCompact);
          /*needed because vue can't detect changes on array element properties*/
          this.eventBus.$emit('compact');
          /*обновить высоту контейнера*/
          this.updateHeight();



        /*иначе стратегия переноса стандартная*/
        } else {

          if (eventName == 'dragmove' || eventName == 'dragstart') {
              this.isDragging = true;
              this.placeholder.i = id;
              this.placeholder.x = x;
              this.placeholder.y = y;
              this.placeholder.w = w;
              this.placeholder.h = h;
              //this.$broadcast('updateWidth', this.width);
              this.eventBus.$emit('updateWidth', this.width);
          } else {
              this.isDragging = false;
          }
          var l = getLayoutItem(this.layout, id);
          /*GetLayoutItem sometimes returns null object*/
          if (l == null){
              l = {x:0, y:0}
          }
          l.x = x;
          l.y = y;
          /*Move the element to the dragged location.*/
          this.layout = moveElement(this.layout, l, x, y, true);
          compact(this.layout, this.verticalCompact);
          /*needed because vue can't detect changes on array element properties*/
          this.eventBus.$emit('compact');
          this.updateHeight();

          /**/
        }

      },

      /**/
      resizeEvent(eventName, id, x, y, h, w) {
          if (eventName == 'resizestart' || eventName == 'resizemove') {
              this.isDragging = true;
              this.placeholder.i = id;
              this.placeholder.x = x;
              this.placeholder.y = y;
              this.placeholder.w = w;
              this.placeholder.h = h;
              //this.$broadcast('updateWidth', this.width);
              this.eventBus.$emit('updateWidth', this.width);

          } else {
              this.isDragging = false;
          }
          var l = getLayoutItem(this.layout, id);
          //GetLayoutItem sometimes return null object
          if (l == null){
              l = {h:0, w:0}
          }
          l.h = h;
          l.w = w;
          compact(this.layout, this.verticalCompact);
          this.eventBus.$emit('compact');
          this.updateHeight();
      },
    },
  }
</script>
