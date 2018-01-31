const
  elementResizeDetectorMaker = require('element-resize-detector')({
    /*for ultra performance*/
    strategy: 'scroll',
  })
;
const Vue = require('vue');
window.Vue = Vue;
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  bind(el, binding, vnode, oldVnode) {
    console.log('bind - this, el, binding, vnode, oldVnode:', this, el, binding, vnode, el.elm);

    // new Vue({
    //   mounted() {
    //     console.log('bind - this, el, binding, vnode, oldVnode MOUNTED:', this);
    //   },
    //   render(createElement) {
    //     return vnode;
    //   },
    // }).$mount(vnode.elm);
    // let
    //   component = this.constructor.component(
    //     // `cell${index + 1}`
    //     'cell'
    //     , {
    //
    //     /**/
    //     mounted() {
    //       /**/
    //       /*подписка и слежка за изменениями размеров контейнера*/
    //       // elementResizeDetectorMaker.listenTo(this.$el, self.updateCellsSpace);
    //     },
    //     /**/
    //     beforeDestroy() {
    //       /*удаление подписки и слежки за изменениями размеров контейнера*/
    //       // elementResizeDetectorMaker.removeListener(this.$el, self.updateCellsSpace);
    //     },
    //
    //     /**/
    //     render: createElement => {
    //       return item;
    //     },
    //
    //   })
    // ;

  },
  // When the bound element is inserted into the DOM...
  inserted(el, binding, vnode, oldVnode) {

    /*1. Поиск всех дочерних элементов кроме комметраниев текста*/
    /*2. Создание компонентов основанных на найденных нодах с примешанными реактивными атрибутами (cell-order)*/

    // Focus the element
    // el.focus()

    // console.log('this, el, binding, vnode, oldVnode:', this, el, binding, vnode, .oldVnode, el.elm);

    let
      children = el.children
    ;
    for(let i = 0; i < children.length; i++) {
      console.log('children.item(i):', children.item(i));
    }
    // el.children.forEach((item, index, array) => {
    //   console.log('el, binding -- item:', item);
    // });

    // export default {
    //
    //   /*PROPS*/
    //   props: {
    //     /*состоит ли ячейка из колонок*/
    //     ofCols: {
    //       type: Boolean,
    //       default: false,
    //     },
    //
    //     /*максимальное количество колонок*/
    //     maxCols: {
    //       type: [Boolean, Number],
    //       default() {
    //         return false;
    //         // return this.$slots.default.length;
    //       },
    //     },
    //     /*минимальне количество колонок*/
    //     minCols: {
    //       type: Number,
    //       default: 1,
    //     },
    //     /*максимальная ширина колонки*/
    //     maxColWidth: {
    //       type: [Number, String],
    //       default: '100%',
    //     },
    //
    //     /*максимальное количество рядов*/
    //     /*максимальная высота ряда*/
    //
    //     /*будет ли заполняться пространство контейнера*/
    //     fillSpace: {
    //       type: Boolean,
    //       default: false,
    //     }
    //   },
    //
    //   /*DATA*/
    //   data() {
    //     return {
    //       // defaultSlots: null,
    //       /**/
    //       // wrappedItems: /*null*/[],
    //       /**/
    //       prevItem: null,
    //       /**/
    //       currItem: null,
    //     };
    //   },
    //
    //   /*COMPUTED*/
    //   computed: {
    //     /*переданные ячейки*/
    //     // miCols() {
    //     //   return this.minCols ? this.minCols : this.$slots.default.length;
    //     // },
    //   },
    //
    //   watch: {
    //
    //   },
    //
    //   /*METHODS*/
    //   methods: {
    //     /*вычисление и создание компонентов ячеек на основе микса входных параметров и установленных в текущем компоненте*/
    //     computedCells() {
    //       let
    //         self = this
    //       ;
    //       return (this.$slots.default || []).reduce((previousItem, item, index, array) => {
    //         let
    //           component = this.constructor.component(
    //             // `cell${index + 1}`
    //             'cell'
    //             , {
    //             /**/
    //             data() {
    //               return {
    //                 // wrapped: true,
    //               };
    //             },
    //
    //             /**/
    //             methods: {
    //
    //             },
    //
    //             /**/
    //             mounted() {
    //               /**/
    //               /*подписка и слежка за изменениями размеров контейнера*/
    //               elementResizeDetectorMaker.listenTo(this.$el, self.updateCellsSpace);
    //             },
    //
    //             /**/
    //             beforeUpdate() {
    //               // console.log('thiss beforeUpdate:');
    //             },
    //
    //             /**/
    //             beforeDestroy() {
    //               /*удаление подписки и слежки за изменениями размеров контейнера*/
    //               elementResizeDetectorMaker.removeListener(this.$el, self.updateCellsSpace);
    //             },
    //
    //             /**/
    //             render: createElement => {
    //               return item;
    //             },
    //
    //           })
    //         ;
    //         return previousItem ? previousItem.concat(component) : [component];
    //       }, false);
    //
    //     },
    //
    //     /**/
    //     cellOrder(item, index) {
    //       let
    //         result
    //         ,elementLength = this.defaultSlots.length
    //         ,order = result = index + 1
    //       ;
    //       /*если елемент единственный в контейнере*/
    //       if(elementLength === 1) {
    //         retult = `${result} single`;
    //       }
    //       /*если елемент первый в контейнере*/
    //       if(order === 1) {
    //         result = `${result} first`;
    //       }
    //       /*если елемент последний в контейнере*/
    //       if(order === elementLength) {
    //         result = `${result} last`;
    //       }
    //
    //       // this.currItem = item.getBoundingClientRect();
    //       // if (this.prevItem && this.prevItem.top < this.currItem.top) {
    //       //   // this.wrappedItems.push(item);
    //       //   result = `${result} wrapped`;
    //       // }
    //       // this.prevItem = this.currItem;
    //
    //
    //       // if(wrappedItems) {
    //       //   result = `${result} has`;
    //       // }
    //
    //       /*первый в ряду*/
    //       /*последний в ряду*/
    //       /*первый в колонке*/
    //       /*последний в колонке*/
    //       /*один в колонке*/
    //       /*один в ряду*/
    //
    //       /*элемент в первом ряду - */
    //       /*if()*/
    //       return result;
    //     },
    //
    //     /**/
    //     cellStyle(item, index) {
    //       let
    //         elementLength = this.defaultSlots.length
    //         ,styles = {
    //           /*'min-width': */
    //           /*'flex-shrink': 0,*/
    //           /*'border': '1px solid rgb(106, 199, 238)',*/
    //         }
    //       ;
    //       if(this.maxCols) {
    //         styles['max-width'] = `${100 / this.maxCols}%`;
    //         // styles['width'] = `100%`;
    //       }
    //       //
    //       if(this.fillSpace) {
    //         // styles['min-width'] = `${100 / elementLength}%`;
    //         // styles['width'] = `100%`;
    //       }
    //
    //       this.$nextTick(() => {
    //         this.updateCellsSpace();
    //       });
    //
    //       return styles;
    //     },
    //
    //     /**/
    //     updateCellsSpace() {
    //       console.log('updateCellsSpace');
    //       // this.$nextTick(() => {
    //         this.$slots.default.forEach((item, index, array) => {
    //           let
    //             elm = item.elm
    //             ,attrName = 'cell-order'
    //             ,attr = elm.getAttribute(attrName)
    //             ,wrapperStatusName = ' wrapped'
    //           ;
    //           this.currItem = elm.getBoundingClientRect();
    //
    //           if(this.prevItem && this.prevItem.top < this.currItem.top) {
    //             // wrappedItems.push(items[i]);
    //             /*если ещё не содержится статуса переноса*/
    //             !~attr.indexOf(wrapperStatusName) && elm.setAttribute(attrName, attr + wrapperStatusName);
    //           } else {
    //             elm.setAttribute(attrName, attr.replace(new RegExp(wrapperStatusName, 'g'), ''));
    //           }
    //           this.prevItem = this.currItem;
    //         });
    //       // });
    //     },
    //
    //   },
    //
    //   /*MOUNTED*/
    //   mounted() {
    //     console.log('window.cells = this', window.cells = this);
    //     /*подписка и слежка за изменениями размеров контейнера*/
    //     elementResizeDetectorMaker.listenTo(this.$el, this.updateCellsSpace);
    //   },
    //
    //   /*BEFORE DESTROY*/
    //   beforeDestroy() {
    //     /*удаление подписки и слежки за изменениями размеров контейнера*/
    //     elementResizeDetectorMaker.removeListener(this.$el, this.updateCellsSpace);
    //   },
    // }




  },
};
