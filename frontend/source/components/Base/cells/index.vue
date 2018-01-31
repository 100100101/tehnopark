<template>
  <div
    :class="{
      'cells-container': true,
    }"
  >
    <component
      v-for="(item, index) in (defaultSlots = this.$slots.default.filter(item => !item.isComment))"
      :key="index"
      :is="require('./cell')"
      :item="item"
      :cell-order="cellOrder(item, index)"
      :style="cellStyle(item, index)"
    />
    <!-- :ref="`cell${index}`" -->
    <!-- @mounted="updateCellsSpace" -->
  </div>
</template>

<script>
const
  elementResizeDetectorMaker = require('element-resize-detector')({
    /*for ultra performance*/
    strategy: 'scroll',
  })
;
module.exports = {
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

  /*DATA*/
  data() {
    return {
      // defaultSlots: null,
      /**/
      // wrappedItems: /*null*/[],
      /**/
      prevItemRect: null,
      /**/
      currItemRect: null,
    };
  },

  /*COMPUTED*/
  computed: {
    /*переданные ячейки*/
    // miCols() {
    //   return this.minCols ? this.minCols : this.$slots.default.length;
    // },
    /*фильтрование от комментариев*/
    // cellsNotComments() {
    //   return this.$slots.default.filter((item) => {
    //     /*да - если VNode не коммертарий*/
    //     return !item.isComment;
    //   });
    // },
  },

  watch: {

  },

  /*METHODS*/
  methods: {
    /*вычисление и создание компонентов ячеек на основе микса входных параметров и установленных в текущем компоненте*/
    /**/
    cellOrder(item, index, ref) {
      let
        result = ''
        ,elementLength = this.defaultSlots.length
        ,order = result = index + 1
      ;
      /*если елемент единственный в контейнере*/
      if(elementLength === 1) {
        result = `${result} single`;
      }
      /*если елемент первый в контейнере*/
      if(order === 1) {
        result = `${result} first`;
      }
      /*если елемент последний в контейнере*/
      if(order === elementLength) {
        result = `${result} last`;
      }

      // this.currItemRect = item.getBoundingClientRect();
      // if (this.prevItemRect && this.prevItemRect.top < this.currItemRect.top) {
      //   // this.wrappedItems.push(item);
      //   result = `${result} wrapped`;
      // }
      // this.prevItemRect = this.currItemRect;


      // if(wrappedItems) {
      //   result = `${result} has`;
      // }

      /*первый в ряду*/
      /*последний в ряду*/
      /*первый в колонке*/
      /*последний в колонке*/
      /*один в колонке*/
      /*один в ряду*/

      /*элемент в первом ряду - */
      /*if()*/
      return result;
    },

    /**/
    cellStyle(item, index) {
      let
        elementLength = this.defaultSlots.length
        ,styles = {
          /*'min-width': */
          /*'flex-shrink': 0,*/
          /*'border': '1px solid rgb(106, 199, 238)',*/
        }
      ;
      if(this.maxCols) {
        styles['max-width'] = `${100 / this.maxCols}%`;
        // styles['width'] = `100%`;
      }
      /*если*/
      if(this.fillSpace) {
        // styles['min-width'] = `${100 / elementLength}%`;
        // styles['width'] = `100%`;
      }

      // this.$nextTick(function() {
        // /*return*/ this.updateCellsSpace();
      // });

      return styles;
    },

    /**/
    updateCellsSpace() {
      let
        prevItem = null
        ,prevItemAttr
      ;
      this.defaultSlots.forEach((item, index, array) => {
        let
          elm = item.elm
          ,prevItemRect = this.prevItemRect
          ,attrName = 'cell-order'
          ,attr = elm.getAttribute(attrName)
          // ,wrapperStatusName = ' wrapped'
          ,preWrapperStatusName = ' pre-wrapped'
        ;
        this.currItemRect = elm.getBoundingClientRect();
        /*если существует предидещий элемент и его положение по Y меньше последующего*/
        if(prevItemRect && prevItemRect.top < this.currItemRect.top) {

          // wrappedItems.push(items[i]);
          /*если ещё не содержится статуса переноса*/
          // if(!~attr.indexOf(wrapperStatusName)) {
          //   console.log('wrapped elm:', elm);
          //   elm.setAttribute(attrName, attr + wrapperStatusName);
          // }
          /*если существует элемент перед переносом и он ещё не получал соответствующего статуса - задать статус пре-переноса*/
          if(prevItem) {
            prevItemAttr = prevItem.getAttribute(attrName);
            !~prevItemAttr.indexOf(preWrapperStatusName) && prevItem.setAttribute(attrName, prevItemAttr + preWrapperStatusName);
          }
        /*иначе удалить статус переноса с текущего элемента*/
        } else {
          // console.log('replace wrapped elm:', elm);
          // elm.setAttribute(attrName, attr.replace(new RegExp(wrapperStatusName, 'g'), ''));
          /*если есть предшедствующий элемент - удалить статус пред-переноса с него*/
          if(prevItem && prevItemAttr) {
            prevItem.setAttribute(attrName, prevItemAttr.replace(new RegExp(preWrapperStatusName, 'g'), ''));
          }
        }
        prevItem = elm;
        this.prevItemRect = this.currItemRect;
      });
    },

  },

  /*MOUNTED*/
  mounted() {
    // console.log('window.cells = this', window.cells = this);
    /*подписка и слежка за изменениями размеров контейнера*/
    elementResizeDetectorMaker.listenTo(this.$el, this.updateCellsSpace);
    // this.updateCellsSpace()
    /**/
    // setInterval(() => {
    //   this.$nextTick(function() {
    //     return this.updateCellsSpace();
    //   });
    //
    // }, 2000)
  },

  /*BEFORE DESTROY*/
  beforeDestroy() {
    /*удаление подписки и слежки за изменениями размеров контейнера*/
    elementResizeDetectorMaker.removeListener(this.$el, this.updateCellsSpace);
  },

  // render(createElement) {
  //   return this.computedCells();
  // },

}
</script>
