<template>
  <div class="circular">
    <square
      class="circular__square"
    >
      <slot name="default"/>
    </square>
  </div>
</template>

<script>
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
}
</script>

<style lang="scss" scoped>
  .circular {
    width: 45px;
    border-radius: 50%;
    cursor: pointer;
  }
    .circular__square {
      // background: rgba(255, 255, 255, .8);
      border-radius: 50%;
      // box-shadow: inset 0px 0px 0px 1px #fff, 0px 0px 0px 1px rgba(0, 0, 0, 0.2);
      // border: 1px solid rgba(0, 0, 0, 0.2);
      border-left: none;
      // box-shadow: -2px -1px 0px 0px #fff, -2px -1px 0px 1px rgba(0, 0, 0, 0.2);
    }
</style>
