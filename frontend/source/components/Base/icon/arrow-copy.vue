<template>
  <div
    :class="{
      'arrow': true,
      [settings.side]: true,
      [`_${settings.modification}`]: true,
    }"
  >
    <span
      :class="{
        'arrow__el1': true,
      }"
      :style="{
        'background-color': settings.backgroundColor,
        'color': settings.color,
      }"
    />
    <span
      :class="{
        'arrow__el2': true,
      }"
      :style="{
        'background-color': settings.backgroundColor,
        'color': settings.color,
      }"
    />
    <slot name="effect"/>
  </div>
</template>

<script>
export default {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
  /*PROPS*/
  props: {
    /**/
    options: {
      type: Object,
      default() {
        return {

        };
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
        /*top, bottom, left, right*/
        side: 'top',
        /**/
        color: 'inherit',
        /**/
        backgroundColor: 'inherit',
        /*single, double*/
        modification: 'single',
      },
      /**/

    };
  },

  /**/
  computed: {
    settings() {
      return Object.assign(this.preset, this.options);
    },
  },


  /*WATCH*/
  watch: {
    // options: {
    //   handler(newValue, oldValue) {
    //     this.settings = Object.assign(this.settings, this.options);
    //   },
    //   immediate: true,
    // },
  },


  /*METHODS*/
  methods: {
    effectDone() {
      // this.$emit('effect-done');
      let
        effectDoneCallback = this.settings.effectDoneCallback
      ;
      effectDoneCallback && effectDoneCallback();
    },
  }


}
</script>

<style lang="scss" scoped>
/**/
$secod-line-distance-of-main: 5px;
$arrow__el--rotate: 45deg;

/**/
@keyframes arrow__el1 {
  from {
    transform: rotate($arrow__el--rotate);
    box-shadow: $secod-line-distance-of-main 0px 0px 0px;
  }
  to {
    transform: rotate(-$arrow__el--rotate);
    box-shadow: -$secod-line-distance-of-main 0px 0px 0px;
  }
}
@keyframes arrow__el2 {
  from {
    transform: rotate(-$arrow__el--rotate);
    box-shadow: $secod-line-distance-of-main 0px 0px 0px;
  }
  to {
    transform: rotate($arrow__el--rotate);
    box-shadow: -$secod-line-distance-of-main 0px 0px 0px;
  }
}



.arrow {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
    &.left, &.right {
      flex-direction: column;
    }
}

  [class*='arrow__el'] {
    background-color: inherit;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    display: flex;
    visibility: hidden;
      &:before {
        content: '';
        position: absolute;
        height: 100vh;
        width: 1px;
        background-color: inherit;
        display: flex;
        visibility: visible;
      }
  }

  /*модификация - вверх*/
  .top {
    /*если модификация двойной стрелки*/
    &._double {
      & > [class*='arrow__el'] {
          &:before {
            box-shadow: $secod-line-distance-of-main 0px 0px 0px;
          }
      }
    }

    & > .arrow__el1 {
        &:before {
          /* применить анимацию arrow__el1 */
          /* продолжительность 3s */
          /* количество раз: бесконечное (infinite) */
          /* менять направление анимации каждый раз (alternate) */
          // animation: arrow__el1 3s infinite alternate;
          transform: rotate($arrow__el--rotate);
        }
    }

    & > .arrow__el2 {
        &:before {
          // animation: arrow__el2 3s infinite alternate;
          transform: rotate($arrow__el--rotate * 3);
        }
    }
  }
  /*модификация - вниз*/
  .bottom {
    /*если модификация двойной стрелки*/
    &._double {
      & > [class*='arrow__el'] {
          &:before {
            box-shadow: -$secod-line-distance-of-main 0px 0px 0px;
          }
      }
    }

    & > .arrow__el1 {
        &:before {
          /* применить анимацию arrow__el1 */
          /* продолжительность 3s */
          /* количество раз: бесконечное (infinite) */
          /* менять направление анимации каждый раз (alternate) */
          // animation: arrow__el1 3s infinite alternate;
          transform: rotate($arrow__el--rotate * 3);
        }
    }

    & > .arrow__el2 {
        &:before {
          // animation: arrow__el2 3s infinite alternate;
          transform: rotate($arrow__el--rotate);
        }
    }
  }
  /*модификация - влево*/
  .left {
    /*если модификация двойной стрелки*/
    &._double {
      & > [class*='arrow__el'] {
          &:before {
            box-shadow: -$secod-line-distance-of-main 0px 0px 0px;
          }
      }
    }

    & > .arrow__el1 {
        &:before {
          /* применить анимацию arrow__el1 */
          /* продолжительность 3s */
          /* количество раз: бесконечное (infinite) */
          /* менять направление анимации каждый раз (alternate) */
          // animation: arrow__el1 3s infinite alternate;
          transform: rotate($arrow__el--rotate);
        }
    }

    & > .arrow__el2 {
        &:before {
          // animation: arrow__el2 3s infinite alternate;
          transform: rotate(-$arrow__el--rotate);
        }
    }
  }


  /*модификация - вправо*/
  .right {
    /*если модификация двойной стрелки*/
    &._double {
      & > [class*='arrow__el'] {
          &:before {
            box-shadow: -$secod-line-distance-of-main 0px 0px 0px;
          }
      }
    }

    & > .arrow__el1 {
        &:before {
          /* применить анимацию arrow__el1 */
          /* продолжительность 3s */
          /* количество раз: бесконечное (infinite) */
          /* менять направление анимации каждый раз (alternate) */
          // animation: arrow__el1 3s infinite alternate;
          transform: rotate(-$arrow__el--rotate);
        }
    }

    & > .arrow__el2 {
        &:before {
          // animation: arrow__el2 3s infinite alternate;
          transform: rotate($arrow__el--rotate);
        }
    }
  }



</style>
