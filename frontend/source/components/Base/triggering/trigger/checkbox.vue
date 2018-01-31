<template>
  <component
    :is="require('./def')"
    :class="{
      'checkbox': true,
      'has-content': $slots.default,
    }"
    :model="model"
    :item="item"
    :name="name"
    :is-toggle="isToggle"
    :disable="disable"
    :effect-options="Object.assign({
      isCentered: true,
      styles: {
        'background': 'rgba(14, 169, 192, 0.1)',
        /*'opacity': '0.1',*/
      },
    }, effectOptions)"
    :stop-propogation="stopPropogation"
    :prevent-default="preventDefault"
    :style="(function() {
      let
        style = {

        }
      ;
      /*если не был передан контент - это стандартный чекбокс - необходимо определить его размеры*/
      if(!$slots.default) {
        style.width = containerSize || '18px';
        style['max-width'] = '25px';
      }

      return style;
    })()"
  >
    <square>
      <slot/>
      <div
        v-if="!$slots.default"
        class="mark-wrapper"
        :style="{
          width: '75%',
          height: '40%',
        }"
      >
        <span class="mark"/>
      </div>
    </square>
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
    isToggle: {
			type: Boolean,
			default: true,
		},
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
    /*размер контейнера*/
    containerSize: {
      type: String,
      default: '18px',
    },
    /**/
    disable: {
      type: Boolean,
    },
    /*нужно ли останавливать всплытие и погружение события*/
    stopPropogation: {
      type: Boolean,
      default: true,
    },
    /*нужно ли предотвращать обработку событий по умолчанию*/
    preventDefault: {
      type: Boolean,
      default: true,
    },
  },


  /*DATA*/
  data() {
    return {

    }
  },

  /*COMPUTED*/
  computed: {


  },

  methods: {

  },

  created() {
    // console.log(`window[chBox${this._uid}] = this:`, window[`chBox${this._uid}`] = this, this._uid);
    // console.log('item name:', this.item, this.name);
  },

};
</script>

<style lang="scss" scoped>
$b-radius: 2px;
$color0: rgba(14, 169, 192, 0.5);
$color0-1:rgba(14, 169, 192, 0.75);
$color1: #0ea9c0;
$color2: #f9f9f9;
$color3: rgba(185, 185, 185, 0.75);
$color4: rgba(170, 170, 170, 0.55);
$transition: 0.4s;
$fatness: 1px;
.checkbox {
  width: 100%;
  // border: 1px solid $color0;
  border: 1px solid $color1;
  border-radius: $b-radius;
  // background: $color2;
  padding: 1px;

  position: relative;
  overflow: hidden;
    &:hover {
      // border-color: $color1;
    }

    &.active {
        .mark {
          &:before,
          &:after {

          }
          &:before {

          }
          &:after {

          }
        }
    }
    &:not(.active) {
        .mark {
          &:before,
          &:after {
            opacity: 0;
          }
          &:before {
            height: 0;
          }
          &:after {
            width: 0;
          }
        }
    }

    &.disable {
      opacity: .5;
      cursor: not-allowed;
      border-color: $color3;
        &.has-content {
          border-color: $color4;
            &.active {
              background-color: $color3;
              color: inherit;
            }
        }
    }

    /**/
    &.has-content {
      transition: $transition;
        &.active {
          background-color: $color0-1;
          color: $color2;
        }
    }
    &:not(.has-content) {
      background: $color2;
    }
}
  .mark-wrapper {
    position: relative;
  }
    .mark {
      width: 100%;
      height: 100%;
      border: ($fatness / 2) solid rgba(0, 0, 0, .1);
      // border-radius: $b-radius 0px 0px $b-radius;
      transform: rotate(-45deg);
      position: absolute;
      left: $fatness / 2;
      top: calc(-50% + #{$fatness / 2});
      border-top-color: transparent;
      border-right-color: transparent;
        &:before,
        &:after {
          content: '';
          position: absolute;
          width: calc(100% + #{$fatness * 2});
          height: calc(100% + #{$fatness * 2});
          // border-radius: $b-radius 0px 0px $b-radius;
          top: -$fatness;
          left: -$fatness;
          // border: $fatness solid transparent;
          transition: $transition;
        }
        &:before {
          // border-left-color: $color1;
          box-shadow: inset $fatness 0px 0px 0px $color1;
        }
        &:after {
          // border-bottom-color: $color1;
          box-shadow: inset 0px -#{$fatness} 0px 0px $color1;
        }
    }
</style>
