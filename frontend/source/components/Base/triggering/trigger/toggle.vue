<template>
  <component
    :is="require('./def')"
    class="toggle"
    :model="model"
    :item="item"
    :name="name"
    :is-toggle="isToggle"
    :effect-options="Object.assign({
      isCentered: true,
      appendTo: {
        refs: $refs,
        ref: 'slider',
      },
      styles: {
        'background': 'rgba(14, 169, 192, 0.1)',
        /*'opacity': '0.1',*/
      },
    }, effectOptions)"
  >
    <div class="container">
      <square
        class="box-_1"
        justify="flex-end"
      >
        <div
          ref="slider"
          class="slider"
          :style="{
            'transition': '0.4s',
          }"
        />
      </square>
      <square
        class="box-_2"
        justify="flex-end"
      >
        <div
          class="track-wrapper"
          :style="{
            'height': trackHeight,
          }"
        >
          <div
            class="track"
            :style="{
              'width': trackWidth,
            }"
          />
        </div>
      </square>
    </div>
  </component>
</template>

<script>
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*PROPS*/
  props: {
    /**/
    model: Array,
    /**/
    item: [Object, Array],
    /**/
    name: [Number, String],
    /**/
    isToggle: Boolean,
    /**/
    effectOptions: Object,
    /**/
    trackHeight: {
      type: String,
      default: '95%',
    },
    /**/
    trackWidth: {
      type: String,
      default: '65%',
    },
  },

  /*DATA*/
  data() {
    return {

    };
  },

  /*COMPUTED*/
  computed: {

  },

  methods: {

  },

  created() {
    // console.log('window.chBox = this:', window.chBox = this);
  },

};
</script>

<style lang="scss" scoped>
$color0: #98c878;
$color1: #72985a;
/*отступ выделенный для тени*/
$box-shadow-size: 3px;
  .toggle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $box-shadow-size;
      &.active {
          .slider {
            transform: translateX(100%);
          }
          .track {
            // background: $color0;
            position: relative;
            overflow: hidden;
            z-index: 0;
            background: #98c878;
            box-shadow: inset -1px 2px 5px 0px rgba(0, 0, 0, 0.3);
          }
      }
      &:not(.active) {
        .track {
          background: #d08181;
          box-shadow: inset 1px 2px 5px 0px rgba(0, 0, 0, 0.3);
        }
      }
  }
    .container {
      width: 100%;
      visibility: hidden;
      display: flex;
    }
      [class*='box-_'] {

      }

      .box-_1 {
        z-index: 1;
      }

      .box-_2 {

      }

        .track-wrapper {
          width: 200%;
          display: flex;
          justify-content: center;
          position: absolute;
        }
          .track {
            border-radius: 100vmax;
            // border: 1px solid $color1;
            visibility: visible;
          }

        .slider {
          $w-h: 100%;
          width: $w-h;
          height: $w-h;
          border-radius: 50%;
          position:  absolute;
          background: #fff;
          box-shadow: inset 0px -5px 15px -4px rgba(0, 0, 0, 0.28), 0 4px 7px 0 rgba(51, 56, 60, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.27), 0 0 2px 0 rgba(51, 54, 56, 0.4);
          visibility: visible;
          overflow: hidden;

        }


</style>
