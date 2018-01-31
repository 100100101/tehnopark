<script>
// const
//   elementResizeDetectorMaker = require('element-resize-detector')({
//     /*for ultra performance*/
//     strategy: 'scroll',
//   })
// ;
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
  /**/
  // functional: true,
/*
  this.$vnode.context.$children[].$el
*/
  /*PROPS*/
  props: {
    item: Object,
    /*соседние элементы*/
    nearbyItems: Array,
  },

  mounted() {
    // console.log('cell mounted:', window.ce = this);
    this.$emit('mounted', this.$el);
  },
  /**/

  /**/
  render(createElement) {

    return this.item;

  },
};
</script>
