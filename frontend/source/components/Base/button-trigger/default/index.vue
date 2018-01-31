<template>
  <div
    :class="{
      default: true,
      ['coloration_' + coloration]: true,
      _disable: disable,
    }"
  >
    <slot name="default"/>
  </div>
</template>

<script>
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*PROPS*/
  props: {

    /*расцветка*/
    coloration: {
      type: String,
      validator(value) {
        return !!~['transparent', 'primary'].indexOf(value);
      },
      default: 'transparent',
    },

    disable: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    console.log('this.disable:', this.disable);
  },
};
</script>

<style lang="scss" scoped>
$border-radius: 2px;
$transition: 0.3s;
  .button {
    // border: 1px solid #ccc;
    // box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.18);
    border-radius: $border-radius;
    cursor: pointer;
    overflow: hidden;
    padding: 5px 8px;
    font-size: 14px;
    // text-transform: uppercase;
    position: relative;
    display: inline-flex;
    word-spacing: 2px;

  }

  /*COLORATION TRANSPARENT*/
  .coloration_transparent {
      &:hover {
        &:before,
        &:after {
          width: 100%;
          height: 100%;
          border-radius: $border-radius;
        }
      }
      &:before,
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        transition: $transition;
      }
      &:before {
        box-shadow: inset -1px 0px 0px 0px #0ea9c0, inset 0px -1px 0px 0px #0ea9c0;
        bottom: 0;
        right: 0;
      }
      &:after {
        top: 0;
        left: 0;
        box-shadow: inset 1px 0px 0px 0px #0ea9c0, inset 0px 1px 0px 0px #0ea9c0;
      }
  }

  ._disable {
    background: #ccc;
    color: #fff;
    box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, .08);
      &:hover {
        cursor: not-allowed;
      }
      &:before {
        box-shadow: inset -1px 0px 0px 0px #aaa, inset 0px -1px 0px 0px #aaa;
      }
      &:after {
        box-shadow: inset 1px 0px 0px 0px #aaa, inset 0px 1px 0px 0px #aaa;
      }
  }
  /*COLORATION PRIMARY*/
  .coloration_primary {
    background: #0ea9c0;
    color: #fff;

  }
</style>
