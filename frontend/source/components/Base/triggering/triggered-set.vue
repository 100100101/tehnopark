<template>
  <!--v-if="show"-->
  <!-- :overflow-y="false" -->
  <scrollbar
    :class="{
      'triggers-set': true,
      [vertical ? 'vertical' : 'horizontal']: true,
    }"
    :mouse-drag-content-ability="/*возможность перетаскивать контент*/true"
    overflow-x="top"

    @resize-conetnt="allocatorSpaceComputed"
    @resize-container="allocatorSpaceComputed"
  >
    <slot/>

  </scrollbar>
</template>

<script>
// const
//   elementResizeDetectorMaker = require('element-resize-detector')({
//     /*for ultra performance*/
//     strategy: 'scroll',
//   })
// ;
export default {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*PROPS*/
  props: {

  },

  /*DATA*/
  data() {
    return {

    };
  },

  /*COMPUTED*/
  computed: {

  },

  watch: {

  },

  /*METHODS*/
  methods: {

  },

  /*CREATED*/
  created() {

  },

  /*MOUNTED*/
  mounted() {

  },

  /**/
  beforeUpdate() {

  },

  /*BEFORE DESTROY*/
  beforeDestroy() {

  },

};
</script>

<style lang="scss" scoped>
  .triggers-set {
    position: inline-flex;
  }
  /*горизонтальная модификачия панели*/
  .horizontal {

  }
  /*вертикальная модификачия панели*/
  .vertical {
    flex-direction: column;
  }
    // .tab-trigger {
    //
    // }
    /*элемент выделения активный триггеров*/
    .allocator {
      position: absolute;

      background: inherit;

      transition: transform .5s, width .5s;
    }
</style>
