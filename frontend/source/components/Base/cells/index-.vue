<template>
  <div
    :class="{
      'cells-container': true,
    }"
  >
    <component
      v-for="(item, index) in $slots.default"
      :key="index"
      :is="require('./cell')"
      :item="item"
      @mounted="cellMounted"
      
    />
  </div>
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
    /*состоит ли ячейка из колонок*/
    ofCols: {
      type: Boolean,
      default: false,
    },

    /*максимальное количество колонок*/
    maxCols: {
      type: [Boolean, Number],
      default() {
        return false;
        // return this.$slots.default.length;
      },
    },
    /*минимальне количество колонок*/
    minCols: {
      type: Number,
      default: 1,
    },
    /*максимальная ширина колонки*/
    maxColWidth: {
      type: [Number, String],
      default: '100%',
    },

    /*максимальное количество рядов*/
    /*максимальная высота ряда*/

    /*будет ли заполняться пространство контейнера*/
    fillSpace: {
      type: Boolean,
      default: false,
    }
  },

  /*METHODS*/
  methods: {
    cellMounted(el) {
      console.log('cellMounted el:', el);
    },

  },

  /*MOUNTED*/
  mounted() {

  },



}
</script>
