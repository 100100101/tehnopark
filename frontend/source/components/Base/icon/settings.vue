<template>
  <svg
    :class="{
      'settings': true,
    }"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="5 5 20 20"
  >
    <slot name="default"/>
    <g fill-rule="evenodd">
      <path fill-rule="nonzero" d="M15.695 7.03a8.03 8.03 0 0 1 3.335 1.044l1.143-1.573 1.124.817L20.17 8.87a8.029 8.029 0 0 1 2.206 2.928l1.689-.549.43 1.322-1.673.543c.147.605.224 1.236.224 1.886 0 .65-.077 1.281-.224 1.886l1.672.543-.43 1.322-1.688-.549a8.029 8.029 0 0 1-2.206 2.928l1.127 1.552-1.124.817-1.143-1.573a8.03 8.03 0 0 1-3.335 1.045V25h-1.39v-2.03a8.03 8.03 0 0 1-3.335-1.044l-1.143 1.573-1.124-.817L9.83 21.13a8.029 8.029 0 0 1-2.206-2.928l-1.689.549-.43-1.322 1.673-.543A7.976 7.976 0 0 1 6.954 15c0-.65.077-1.281.224-1.886l-1.672-.543.43-1.322 1.688.549A8.029 8.029 0 0 1 9.83 8.87L8.703 7.318l1.124-.817 1.143 1.573a8.03 8.03 0 0 1 3.335-1.045V5h1.39v2.03zM15 21c3.333 0 6.035-2.686 6.035-6S18.333 9 15 9s-6.035 2.686-6.035 6 2.702 6 6.035 6z"/>
      <!-- <circle cx="15" cy="15" r="1"/> -->
    </g>
  </svg>
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
        hasEffect: false,
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

};
</script>

<style lang="scss" scoped>
  // .settings {
  //   width: 100%;
  //   height: 100%;
  // }
</style>
