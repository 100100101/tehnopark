<template>
  <div>
  <!-- @resize-conetnt="allocatorSpaceComputed"
  @resize-container="allocatorSpaceComputed" -->
    <!-- <template scope="props" slot="ddd">
      {{props.text}}
    </template> -->
    <!--указать на то, что это секция скролл контента-->
    <!-- class="tab-trigger" -->
    <slot/>


    <!--элемент выделения активный триггеров-->
    <div
      v-if="/*если есть активная пара*/activeTab"
      class="allocator"
      :style="(() => {
        let
          style = {
            transform: `translate(${allocatorX}px, ${allocatorY}px)`,
            width: allocatorWidth,
            height: allocatorHeight,
          }
        ;
        Object.assign(style, this.allocatorStyle);

        return style;
      })()"
    ></div>
  </div>
</template>

<script>
const
  elementResizeDetectorMaker = require('element-resize-detector')({
    /*for ultra performance*/
    strategy: 'scroll',
  })
;
export default {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),


  /*PROPS*/
  props: {

    /*модификация компонента*/
    // modification: {
    //   type: String,
    //   validate(value) {
    //     return !~['horizontal', 'vertical'].indexOf(value);
    //   },
    //   default: 'horizontal',
    // },
    vertical: {
      type: Boolean,
    },

    /*модель*/
    refs: {
      type: Object,
      // required: true,
    },

    activeRef: {
      type: String,
    },

    /*толщина выделителя*/
    allocatorFatness: {
      type: [String, Boolean],
      default: false,
    },

    /*активная позиция по умолчанию, если не заданна на триггере*/
    defaultActiveName: {
      type: Number,
      default: 1,
    },

    /*стили выделителя*/
    allocatorStyle: {
      type: Object,
      default() {
        return {};
      }
    }

  },

  /*DATA*/
  data() {
    return {
      /*положение по оси X*/
      allocatorX: 0,
      /*положение по оси Y*/
      allocatorY: 0,
      /*ширина выделителя*/
      allocatorWidth: 0,
      /*высота выделителя*/
      allocatorHeight: 0,
    };
  },

  /*COMPUTED*/
  computed: {
    // allocatorX() {
    //   return this.model.list[this.model.active].trigger.$el.getBoundingClientRect().left;
    // },

    /*активная пара - триггер, контент*/
    activeTab() {
      // return this.model.list[this.model.active];
      let
        ref = this.refs[this.activeRef]
      ;
      if(!ref) {
        return false;
      }
      // if()
      return ref[0];
    },

  },

  watch: {
    /*отслеживание изменений активной пары в модели*/
    activeTab(value, oldValue) {
      this.allocatorSpaceComputed();
      /*вызвать callback сразу после начала наблюдения*/
      // immediate: true,
    },

  },

  /*METHODS*/
  methods: {
    /**/
    allocatorSpaceComputed() {
      /*если нет ref на активынй элемент*/
      if(!this.activeTab) {
        return;
      }
      this.$nextTick(() => {
        let
          containerBoundingClientRect = this.$el.getBoundingClientRect()
          // ,triggerBoundingClientRect = this.activeTab.trigger.$el.getBoundingClientRect()
          ,triggerBoundingClientRect = /*this.refs[this.activeRef]*/this.activeTab.getBoundingClientRect()
        ;
        /*если модификация горизонтальной ориентации*/
        if(this.vertical) {
          /*ширина выделителя*/
          this.allocatorWidth = this.allocatorFatness || `${triggerBoundingClientRect.width}px`;
          /*высота выделителя*/
          this.allocatorHeight = `${triggerBoundingClientRect.height}px`;
          /*иначе модификация вертикальной ориентации*/
        } else {
          /*ширина выделителя*/
          this.allocatorWidth = `${triggerBoundingClientRect.width}px`;
          /*высота выделителя*/
          this.allocatorHeight = this.allocatorFatness || `${triggerBoundingClientRect.height}px`;
        }
        /*изменить положение выделителя активного триггера по оси X, с учётом смещения контейнера*/
        this.allocatorX = triggerBoundingClientRect.left - containerBoundingClientRect.left;
        /*изменить положение выделителя активного триггера по оси Y, с учётом смещения контейнера*/
        this.allocatorY = triggerBoundingClientRect.top - containerBoundingClientRect.top;
      });
    },
  },

  /*CREATED*/
  created() {
    // console.log('this.refs, this.activeRef', this.refs, this.activeRef);
  },

  /*MOUNTED*/
  mounted() {
    // console.log('mounted window.tabsTrPane = this:', window.tabsTrPane = this);

    /*если активная позиция не установленна ни на одном триггере - установка по умолчанию*/
    // if(!this.activeTab) {
    //   this.model.active = this.defaultActiveName;
    // }
    /*отслеживание изменений размера обёртки*/
    // elementResizeDetectorMaker.listenTo(this.$el, this.allocatorSpaceComputed);
    /*отслеживание изменений размера блока контента*/
    // elementResizeDetectorMaker.listenTo(this.$el, this.updateContentSize);
  },

  /**/
  beforeUpdate() {
    console.log('beforeUpdate ' + this.$options.name);

    this.allocatorSpaceComputed();
    // if(!this.activeTab) {
    //   this.model.active = this.defaultActiveName;
    // }
  },

  /*BEFORE DESTROY*/
  beforeDestroy() {
    /*удаление отслеживания изменений размера обёртки*/
    // elementResizeDetectorMaker.removeListener(this.$el, this.allocatorSpaceComputed);
    /*удаление отслеживания изменений размера блока контента*/
    // elementResizeDetectorMaker.removeListener(this.$el, this.updateContentSize);
  },

};
</script>

<style lang="scss" scoped>
  .triggers-set {
    position: inline-flex;
  }
  /*горизонтальная модификачия панели*/
  .horizontal {

  }
  /*вертикальная модификачия панели*/
  .vertical {
    flex-direction: column;
  }
    // .tab-trigger {
    //
    // }
    /*элемент выделения активный триггеров*/
    .allocator {
      position: absolute;

      background: inherit;

      transition: transform .5s, width .5s;
    }
</style>
