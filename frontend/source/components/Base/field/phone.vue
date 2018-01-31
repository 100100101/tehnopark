<template>
  <div class="phone">
    <!-- field
    <div
      class="placeholder"
    >

    </div> -->
    <div
      ref="input"
      class="input"
      contenteditable
    >
      root-test
      <div
        ref="part1"
        class="input__part1"
      >+7</div>
      <div
        ref="part2"
        class="input__part2"
        contenteditable
      >123</div>
      <div class="input__part3">45</div>
      <div class="input__part4">67</div>
      <div class="input__part5">89</div>
    </div>
    <button-trigger
      @click.native="setCaret(2)"
    >
      set caret
    </button-trigger>
  </div>
</template>

<script>
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

  /*WATCH*/
  watch: {

  },


  /*METHODS*/
  methods: {
    /**/
    setCaret(position) {
      console.log(this.$refs.part2);


      console.log('setCaret:', position);
      /*поместить каретку в заданную позицию*/
      let
        /*элемент*/
        elementNode = this.$refs.part2
        /*текст элемента*/
        ,textNode = elementNode.firstChild
        /**/
        ,range = document.createRange()
      ;
      elementNode.focus();
      range.setStart(textNode, position);
      range.setEnd(textNode, position);

      var
        selection = window.getSelection()
      ;
      selection.removeAllRanges();
      selection.addRange(range);
    },

    /*обработчик события старта выделения*/
    selectstart(event) {
      console.log('Selection changed.', event);
    },

    /*обработчик события любого изминения выделения*/
    selectionchange(event) {
      console.log('Selection started', event);
    },

    /*добавление обработчиков события реагирующих на текущее поле*/
    addEventListeners() {
      console.log('addEventListeners!');
      /*добавление обработчика события старта выделения*/
      document.addEventListener('selectionchange', this.selectionchange);
      /*добавление обработчика события любого изминения выделения*/
      document.addEventListener('selectstart', this.selectstart, false);
    },
    /*удаление обработчиков события реагирующих на текущее поле*/
    removeEventListeners() {
      console.log('removeEventListeners!');
      /*удаление обработчика события старта выделения*/
      document.removeEventListener('selectionchange', this.selectionchange);
      /*удаление обработчика события любого изминения выделения*/
      document.removeEventListener('selectstart', this.selectstart, false);
    },

  },


  mounted() {

    // create an observer instance
    var observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if(mutation.type === 'characterData'){
          outputTarget.innerText = mutation.target.textContent;
        }
      });
    });
    // observer.observe(watchTarget, {attributes: true, characterData: true, subtree: true});

    /*добавление обработчиков события реагирующих на текущее поле*/
    // this.addEventListeners();
    let
      input = this.$refs.input
    ;
    /*FOCUS*/
    input.addEventListener('focus', event => {
      console.log('focus');
      this.addEventListeners();
    })
    /*BLUR*/
    input.addEventListener('blur', event => {
      console.log('blur');
      this.removeEventListeners();
    })
    ;

  },

  /*BEFORE DESTROY*/
  beforeDestroy() {
    /*удаление обработчиков события реагирующих на текущее поле*/
    this.removeEventListeners();
  },

}
</script>

<style lang="scss" scoped>
  .field {
    position: relative;
    // cursor: pointer;
    border-bottom: 1px solid #000;
  }
    .input {
      display: flex;
    }
      [class*='input__part'] {
        border: 1px solid #f30;
        padding: 3px;
      }
      .input__part1 {
        background: rgb(81, 110, 94);
      }
      .input__part2 {
        background: rgb(64, 135, 200);
      }
      .input__part3 {
        background: rgb(146, 212, 38);
      }
      .input__part4 {
        background: rgb(193, 48, 200);
      }
      .input__part5 {
        background: rgb(235, 157, 25);
      }

</style>
