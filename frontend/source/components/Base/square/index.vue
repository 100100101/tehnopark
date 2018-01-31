<template>
  <div class="square-box">
    <div
      class="square-content"
      :style="{
        'justify-content': justify,
        'align-items': align,
      }"
    >
      <slot/>
    </div>
  </div>
</template>

<script>
module.exports = {
  // name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
  name: 'square',

  /*PROPS*/
  props: {
    /**/
    justify: {
      type: String,
      default: 'center'
    },

    /**/
    align: {
      type: String,
      default: 'center',
    }
  }
};
</script>

<style lang="scss" scoped>
  .square-box {
    width: 100%;
    // float: left;
    // overflow: hidden;
    position: relative;
    &:before {
      content: '';
      display: block;
      padding-top: 100%;
    }
  }
    .square-content {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position:  absolute;
      display: flex;
    }
</style>
