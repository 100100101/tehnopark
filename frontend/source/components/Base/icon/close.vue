<template>
  <!-- @click="click" -->
  <div
    :class="{
      'close-icon': true,
      '_state1': settings.inState1,
    }"
    :style="(() => {
      let
        style = {

        }
      ;
      /*если задан размер, иначе он составляет 100%*/
      style.width = style.height = (settings.size || '100%');
      return style;
    })()"
  >
    <span
      class="el-1"
      :style="{
        'background-color': settings.backgroundColor,
      }"
    />
    <span
      class="el-2"
      :style="{
        'background-color': settings.backgroundColor,
      }"
    />
    <slot name="effect"/>
  </div>
</template>

<script>
const
  elementResizeDetectorMaker = require('element-resize-detector')({
    /*for ultra performance*/
    strategy: 'scroll',
  })
;
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
  /*PROPS*/
  props: {
    /**/
    options: {
      type: Object,
      default() {
        return {};
      }
    },

    /**/
  },

  /*DATA*/
  data() {
    return {
      preset: {
        /**/
        hasEffect: true,
        /**/
        color: 'inherit',
        /**/
        backgroundColor: 'inherit',
        /**/
        size: NaN,
        /*находится ли иконка в состоянии 1 изначально*/
        inState1: false,
      },
      /**/
      settings: null,
    };
  },

  /*WATCH*/
  watch: {
    /*отслеживание изменений опций для компонента, при изменении - объединение предустановленных с новыми*/
    options: {
      handler(newVal, oldVal) {
        /*запись новых настроек*/
        this.settings = Object.assign(this.preset, newVal || this.options);
      },
      deep: true,
      immediate: true,
    },
  },

  /*COMPUTED*/
  computed: {
    // settings() {
    //   return Object.assign(this.preset, this.options);
    // },
  },


  /*METHODS*/
  methods: {
    click() {
      console.log('click close');
      // this.$emit('effect-done');
      let
        effectDoneCallback = this.settings.effectDoneCallback
      ;
      /*если заданна обратная функция срабатывающая после завершения эффекта*/
      effectDoneCallback && effectDoneCallback();
      /*высталить / снять состояние 1*/
      this.preset.inState1 = !this.preset.inState1;

    },

    computedSizes() {
      console.log('close icon computed sizes:');
    },

  },


  /*MOUNTED*/
  mounted() {
    elementResizeDetectorMaker.listenTo(this.$el, this.computedSizes);
  },

  /*BEFORE DESTROY*/
  beforeDestroy() {
    elementResizeDetectorMaker.removeListener(this.$el, this.computedSizes);
  },

}
</script>

<style lang="scss" scoped>
  .close-icon {
      [class*="el-"] {
        position: absolute;
        width: 100%;
        height: 100%;
        visibility: hidden;
        &:before {
          content: '';
          position: absolute;
          background-color: inherit;
          transform: rotate(45deg);
          visibility: visible;
        }
      }
      $w-h: 1px;
      .el-1 {
        &:before {
          transition: 0.3s;
          width: 100%;
          height: 1px;
          top: calc(50% - #{$w-h / 2});
          left: -($w-h / 2);
        }
      }

      .el-2 {
        &:before {
          transition: 0.3s;
          width: 1px;
          height: 100%;
          top: -($w-h / 2);
          left: calc(50% - #{$w-h / 2});
        }
      }
  }

  /*состояние 1*/
  ._state1 {
    $w-h: 5px;
    [class*="el-"] {
      &:before {
        width: $w-h;
        height: $w-h;
        border-radius: 50%;
      }
    }
    .el-1 {
      &:before {
        top: calc(50% - #{$w-h / 2});
        left: calc(50% - #{$w-h / 2});
      }
    }

    .el-2 {
      &:before {
        top: calc(50% - #{$w-h / 2});
        left: calc(50% - #{$w-h / 2});
      }
    }
  }
</style>
