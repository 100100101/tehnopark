<template>
  <div
    v-if="show"
    class="popover-wrapper"
  >
    <div
      ref="popover"
      class="popover"
    >
      <slot name="default"/>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        class="svg"
      >
        <path
          d="
            M 10 10
            l 40 10
            l 5 0
            l 5 10
            L 100 10
            L 100 100
            L 0 100
            z
          "
          class="svg__path"
        />
        <!-- <polygon
          points="
            325 48.5
            288 90
            7 90
            7 7
            288 7
          "
          class="svg__polygon"
        /> -->
      </svg>
    </div>
  </div>
</template>

<script>
  /* @flow */
  // const
  //   elementResizeDetectorMaker = require('element-resize-detector')({
  //     /*for ultra performance*/
  //     strategy: 'scroll',
  //   })
  //   ,merge = require('deepmerge')
  // ;
  module.exports = {
    name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

    /*PROPS*/
    props: {
      /*разрешено ли автоматическое размещение*/
      autoPlacement: {
        type: Boolean,
        default: true,
      },

      /*начальное размещение относительно привязанного элемента в градусах*/
      placement: {
        type: [Number, String],
        default: 0,
      },

      /*показывается ли окно*/
      show: {
        type: Boolean,
        default: true,
      },

      /*прилипнуть к*/
      stickTo: {
        type: Object,
      },

    },

    /*DATA*/
    data () {
      return {

      };
    },

    /*WATCH*/
    watch: {
      show(newVal, oldVal) {
        /*если сказано показывать люпнущий блок - вычислить его положение*/
        if(newVal) {
          this.popoverComputedPosition();
        }
      },
    },

    /*COMPUTED*/
    computed: {
      stickyEl() {
        let
          refs = this.stickTo.refs,
          ref = this.stickTo.ref
        ;
        /*если были переданны указатели на липкий элемент*/
        if(refs && ref) {
          let
            stickyEl = refs[ref]
          ;
          /*если липкий элемент был найден*/
          if(stickyEl) {
            return stickyEl;
          }
        }
        /*иначе неопределено*/
      },

    },

    /*METHODS*/
    methods: {

      /*вычисление положения липнущего блока*/
      popoverComputedPosition() {
        this.$nextTick(() => {
          let
            stickyEl = this.stickyEl
          ;
          /*если был найден лепящий элемент*/
          if(stickyEl) {
            let
              /*липнущий блок*/
              popover = this.$refs.popover
              /*получение всех параметров размещения липкого элемента*/
              ,stickyElBoundingClientRect = stickyEl.getBoundingClientRect()
              /**/
              // ,stickyOffsetParent = stickyEl.offsetParent
            ;
            /*позиционирование липнущего блока*/
            // popover.style.top = `${stickyEl.offsetTop}px`;
            // popover.style.left = `${stickyEl.offsetLeft}px`;

            popover.style.top = `${stickyEl.offsetTop + stickyElBoundingClientRect.height}px`;
            popover.style.left = `${stickyEl.offsetLeft + stickyElBoundingClientRect.width}px`;
          }
        });
      },

    },

    /**/
    created() {


    },
    /*MOUNTED*/
    mounted() {
      /*если сказано показывать люпнущий блок - вычислить его положение*/
      if(this.show) {
        this.popoverComputedPosition();
      }
    },

    /*BEFORE DESTROY*/
    beforeDestroy() {

    },

    /*BEFORE UPDATE*/
    beforeUpdate() {

    },

  };
</script>

<style lang="scss" scoped>
  .popover-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    visibility: hidden;
  }
  .popover {
    background: rgba(255, 0, 0, 0.3);
    display: inline-flex;
    padding: 5px;
    // border-radius: 3px;
    // border: 1px solid #000;
    // position: relative;
    position: absolute;
    visibility: visible;
  }
    .svg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
      .svg__path {
        fill: transparent;
        stroke: #000;
        stroke-width: 1px;
        stroke-linejoin: round;
        stroke-dasharray: 6 2;
        // stroke-dashoffset: 90%;
        stroke-opacity: 0.6;
        vector-effect: non-scaling-stroke;
      }

      // .svg__polygon {
      //   stroke-linejoin: round;
      //   stroke-width: 4;
      // }
</style>
