<template>
  <a class="root-link">
    <span class="content">
      <slot name="default"/>
    </span>
  </a>
</template>

<script>
  export default {
    name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
  };
</script>

<style lang="scss" scoped>
  .root-link {
    display: inline;
    position: relative;
    text-align: left;
  }
    .content {
      display: inline;
      background-repeat: no-repeat;
      background-position: 0 100%;
        &:hover {
          animation-name: link-hover;
          animation-duration: .3s;
          animation-timing-function: linear;
          animation-iteration-count: 1;
          animation-paly-state: running;
          animation-fill-mode: forwards;
          background-size: 0 1px;
          background-image: linear-gradient(to left, #72985a 0, #72985a 100%);
        }
    }

  @keyframes link-hover {
    0% {
      background-size: 0 1px;
    }
    100% {
      background-size: 100% 1px;
    }
  }
</style>
