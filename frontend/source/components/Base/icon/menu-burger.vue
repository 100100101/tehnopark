<template>
  <div
    :class="{
      'menu-icon': true,
      [`variant-${settings.variant || 1}`]: true,
      'is-open': menuIconOpen,
    }"
    @click="click"
  >
    <span/>
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
        return {};
      }
    },
    /**/
  },

  /*DATA*/
  data() {
    return {
      /**/
      menuIconOpen: false,

      preset: {
        /**/
        hasEffect: true,
        /**/
        variant: 1,
        /**/
        animationDoneCallback: null,
      },
    };
  },

  /*WATCH*/
  watch: {

  },


  /*COMPUTED*/
  computed: {
    settings() {
      return Object.assign(this.preset, this.options);
    },
  },


  methods: {
    /**/
    click() {
      /**/
      this.menuIconOpen = !this.menuIconOpen;
      /**/
      let
        animationDoneCallback = this.settings.animationDoneCallback
      ;
      animationDoneCallback && animationDoneCallback();
      // /*изменение варианта иконки меню*/
      // this.menuIconVariant = ((min, max) => {
      //   return Math.floor(Math.random() * (max - min + 1)) + min;
      // })(1, 4);

    },
  },


}
</script>

<style lang="scss" scoped>
  $menu-icon-size:               16px;
  $menu-icon-dash-width:         16px; //em(4.5rem, 6rem)
  $menu-icon-dash-height:        1px; //em(0.3rem, 6rem)
  $menu-icon-dash-gutter:        5px;
  $menu-icon-dash-color:         #fff;

  // %menu-dash{
  //     display: block;
  //     position: absolute;
  //     // top: 50%;
  //     // left: (1em - $menu-icon-dash-width) / 2; // center X
  //     background-color: $menu-icon-dash-color;
  //     width: $menu-icon-dash-width;
  //     height: $menu-icon-dash-height;
  // }

  .menu-icon{
      font-size: $menu-icon-size;
      display: inline-block;
      position: relative;
      background-color: transparent;
      border: 0;
      padding: 0;
      outline: none;
      user-select: none;
      -webkit-touch-callout: none;
      touch-action: manipulation;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      // background: rgba(11, 188, 170, 0.25);
      span{
        display: block;
        position: absolute;
        // top: 50%;
        // left: (1em - $menu-icon-dash-width) / 2; // center X
        background-color: $menu-icon-dash-color;
        width: $menu-icon-dash-width;
        height: $menu-icon-dash-height;
          // margin-top: $menu-icon-dash-height/-2;
      }

      &:before{
          content: "";
          display: block;
          position: absolute;
          // top: 50%;
          // left: (1em - $menu-icon-dash-width) / 2; // center X
          background-color: $menu-icon-dash-color;
          width: $menu-icon-dash-width;
          height: $menu-icon-dash-height;
          transform: translateY(-($menu-icon-dash-gutter + $menu-icon-dash-height));
          // margin-top: -$menu-icon-dash-gutter + ($menu-icon-dash-height/-2);
      }

      &:after{
          content: "";
          display: block;
          position: absolute;
          // top: 50%;
          // left: (1em - $menu-icon-dash-width) / 2; // center X
          background-color: $menu-icon-dash-color;
          width: $menu-icon-dash-width;
          height: $menu-icon-dash-height;
          // margin-top: $menu-icon-dash-gutter + ($menu-icon-dash-height/-2);
          transform: translateY($menu-icon-dash-gutter + $menu-icon-dash-height);
          // margin-top: $menu-icon-dash-gutter + $menu-icon-dash-height;
      }
  }


  // Example 1
  // =============================================
  .variant-1{
      span{
          transition: 0.2s ease-in-out 0.2s;
      }

      &:before, &:after{
          transition: margin 0.2s ease-in-out 0.2s, transform 0.2s ease-in-out 0s;
      }

      &.is-open{
          span{
              background-color: rgba($menu-icon-dash-color, 0);
              transition-delay: 0s;
          }

          &:before, &:after{
              margin-top: 0;
              transition-delay: 0s, 0.25s, 0.25s;
          }

          &:before{
              transform: rotate(45deg);
          }

          &:after{
              transform: rotate(-45deg);
          }
      }
  }

  // Example 2
  // =============================================
  .variant-2{
      &:before, &:after{
          display: none;
      }

      span{
          transition: 0.25s ease;

          &:before, &:after{
            display: block;
            position: absolute;
            // top: 50%;
            // left: (1em - $menu-icon-dash-width) / 2; // center X
            background-color: $menu-icon-dash-color;
            width: $menu-icon-dash-width;
            height: $menu-icon-dash-height;
              content: "";
              transition: 0.25s ease;
              top: 0;
              left: 0;
          }

          &:before{
              transform: translateY(-$menu-icon-dash-gutter);
          }

          &:after{
              transform: translateY($menu-icon-dash-gutter);
          }
      }

      &.is-open{
          span{
              transform: rotate(45deg);

              &:before, &:after{
                  transform: rotate(90deg);
              }
          }
      }
  }

  // Example 3
  // =============================================
  .variant-3{
      &:before, &:after, span{
          transition: 0.25s ease-in-out;
      }

      &.is-open{
          &:before{
              transform: rotate(135deg);
              margin-top: $menu-icon-dash-height/-2;
          }

          &:after{
              transform: rotate(-135deg);
              margin-top: $menu-icon-dash-height/-2;
          }

          span{
              opacity: 0;
              transform: translateX(150%);
          }
      }
  }

  // Example 4
  // =============================================
  .variant-4{
      &:before, &:after{
          transition: 0.2s ease 0.2s;
      }

      &:after{
          left: auto;
          // right: (1em - $menu-icon-dash-width) / 2;
      }

      span{
          transition: 0.2s;

          &:before{
            display: block;
            position: absolute;
            // top: 50%;
            // left: (1em - $menu-icon-dash-width) / 2; // center X
            background-color: $menu-icon-dash-color;
            width: $menu-icon-dash-width;
            height: $menu-icon-dash-height;
              content: "";
              transition: inherit;
              left: 0;
              top: 0;
          }
      }

      &.is-open{
          &:before, &:after{
              transition: 0.2s ease;
              width: 0;
          }

          span{
              transform: rotate(45deg);
              transition: 0.2s ease 0.2s;

              &:before{
                  transform: rotate(-90deg);
              }
          }
      }
  }
</style>
