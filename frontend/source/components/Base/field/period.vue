<template>
  <div
    :class="{
      'default': true,
      /**/
      'focus': inFocus,
      /*был сделан N-шаг к переходу состояния*/
      'step_1': model.length > 0,
      'step_2': model.length > 1,
      /**/
      introducing,
      /**/
      moving,
    }"
  >
    <!-- v-if="!model" -->
    <!-- v-if="model.length < 10" -->
    <div class="row">
      <span
        :class="{
          'placeholder': true,
        }"
      >
        <slot
          v-if="$slots.placeholder"
          name="placeholder"
        />
        <template
          v-else
        >
          Введите данные
        </template>
      </span>

      <span
        ref="input"
        class="input"
        contenteditable
      >{{model}}</span>
    </div>

  </div>
</template>

<script>
export default {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*PROPS*/
  props: {
    // model: {
    //   type: String,
    //   default: '',
    // }
  },

  /*DATA*/
  data() {
    return {
      model: 'test',
      /*вводиться ли сонтент в форму*/
      introducing: false,
      /*перемещается ли коретка*/
      moving: false,
      /*время издержки статусов*/
      statusesDuration: 400,
      /*статус фокусировки*/
      inFocus: false,
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

    /*поместить каретку в заданную позицию*/
    setCaret(position) {
      let
        /*элемент*/
        input = this.$refs.input
        /*текст элемента*/
        ,textNode = input.firstChild
        /*диапозон выделения*/
        ,range = document.createRange()
        /*виделение*/
        ,selection = window.getSelection()
      ;
      /*
        Selection.getRangeAt()
        Возвращает Rangeобъект, представляющий один из выбранных диапазонов.
        Selection.collapse()
        Сбрасывает текущий выбор в одну точку.
        Selection.extend()
        Перемещает фокус выделения в указанную точку.
        Selection.modify()
        Изменяет текущий выбор.
        Selection.collapseToStart()
        Сбрасывает выбор в начало первого диапазона в выборе.
        Selection.collapseToEnd()
        Сбрасывает выделение до конца последнего диапазона выбора.
        Selection.selectAllChildren()
        Добавляет все дочерние элементы указанного узла к выбору.
        Selection.addRange()
        RangeОбъект , который будет добавлен к выбору.
        Selection.removeRange()
        Удаляет диапазон из выделения.
        Selection.removeAllRanges()
        Удаляет все диапазоны из выделения.
        Selection.deleteFromDocument()
        Удаляет содержимое выделения из документа.
        Selection.toString()
        Возвращает строку, представленную в настоящее время объектом выделения, то есть выбранным в данный момент текстом.
        Selection.containsNode()
        Указывает, является ли определенный узел частью выбора.
      */
      /**/
      range.setStart(textNode, position);
      /**/
      range.setEnd(textNode, position);
      /**/
      selection.removeAllRanges();
      /**/
      selection.addRange(range);
    },

    /**/
    getCaret() {
      return window.getSelection().anchorOffset;
    },

    /*обработчик события старта выделения*/
    selectstart(event) {
      // console.log('Selection changed.', event);
    },

    /*обработчик события любого изминения выделения*/
    selectionchange(event) {
      // console.log('Selection started', event);
      /*добавление статуса перемещения каретки*/
      // this.setStatus('moving');
    },

    /*добавление обработчиков события реагирующих на текущее поле*/
    addEventListeners() {
      // console.log('addEventListeners!');
      /*добавление обработчика события старта выделения*/
      document.addEventListener('selectionchange', this.selectionchange);
      /*добавление обработчика события любого изминения выделения*/
      document.addEventListener('selectstart', this.selectstart, false);
    },
    /*удаление обработчиков события реагирующих на текущее поле*/
    removeEventListeners() {
      // console.log('removeEventListeners!');
      /*удаление обработчика события старта выделения*/
      document.removeEventListener('selectionchange', this.selectionchange);
      /*удаление обработчика события любого изминения выделения*/
      document.removeEventListener('selectstart', this.selectstart, false);
    },

    /*input focus*/
    focus(event) {
      let
        input = this.$refs.input
      ;
      /*если на поле ещё не выставлен фокус - выставить*/
      if(!input.hasFocus) {
        input.focus();
      }
      /**/
      this.inFocus = true;
      /*добавление обработчиков события реагирующих на текущее поле*/
      this.addEventListeners();
    },

    /*input blure*/
    blure(event) {
      /**/
      this.inFocus = false;
      /*снятие обработчиков события реагирующих на текущее поле*/
      this.removeEventListeners();
    },

    /**/
    inputHandler(event) {
      /*узнать текущее положение каретки ввода*/
      let
        currentCaretPosition = this.getCaret()
      ;
      /*сохранение положения каретки глобально*/
      // this.lastCaretPosition = currentCaretPosition;
      /*изменение значения модели*/
      this.model =
      /*вставить отформатированный текст в поле, удаляя тем самым возможно созданные дочерние блоки*/
      event.target.innerText =
      /*модерация - форматирование, валидация введённого в поле*/
      this.formatting(event.target.innerText);
      /*установка какетки ввода на сохранённое ранее положение*/
      /*если текущая позиция установливаема - выход*/
      if(currentCaretPosition > 0) {
        this.$nextTick(() => {
          this.setCaret(currentCaretPosition);
        });
      }
      /*добавление обработчика события любого изминения выделения*/
      document.removeEventListener('selectstart', this.selectstart, false);
      /*добавление статуса ввода*/
      this.setStatus('introducing');

    },

    /*установить статус*/
    setStatus(name) {
      let
        status = this.status
      ;
      /*если существует статус - преждевременное удаление его для предотвращения преджевременного снятия статуса */
      if(status) {
        /*если имя текущего события отличается от предидущего*/
        if(status.name !== name) {
          /*досрочное завершение*/
          clearTimeout(status.timeout);
          status.callback();
        /*иначе отмена досрочного прекращения текущего статуса*/
        } else {
          clearTimeout(status.timeout);
        }
      }
      /*добавление статуса ввода*/
      this[name] = true;
      /*снятие статуса ввода через заданное время*/
      let
        callback = () => {
          /*убрать статус скролла через заданное опцией время*/
          this[name] = false;
        }
        /**/
        ,timeout = setTimeout(callback, this.statusesDuration)
      ;
      /*запись о текущем статусе*/
      this.status = {
        name,
        callback,
        timeout,
      };
    },

    /*форматирование введённого в поле*/
    formatting(value) {
      /*удаление переносов строки*/
      console.log('value:', value);
      return value.replace(/\n/g, '');
    },

  },

  /*CREATED*/
  created() {

  },

  /*MOUNTED*/
  mounted() {
    // console.log('window.inp = this:', window.inp = this);
    let
      input = this.$refs.input
    ;
    /*обавить обработчик FOCUS*/
    input.addEventListener('focus', this.focus);
    /*обавить обработчик BLUR*/
    input.addEventListener('blur', this.blure);
    /*обавить обработчик INPUT*/
    input.addEventListener('input', this.inputHandler);
  },

  /*BEFORE DESTROY*/
  beforeDestroy() {
    /*удаление обработчиков события реагирующих на текущее поле*/
    this.removeEventListeners();
    let
      input = this.$refs.input
    ;
    /*снять обработчик FOCUS*/
    input.removeEventListener('focus', this.fucus);
    /*снять обработчик BLUR*/
    input.removeEventListener('blur', this.blure);
    /*снять обработчик INPUT*/
    input.removeEventListener('input', this.inputHandler);
  },

}
</script>

<style lang="scss" scoped>
  .default {
    $color: #000;
    position: relative;
    // cursor: pointer;
    border-bottom: 1px solid fade-out($color, .9);
    padding: 3px 5px;
    display: flex;
    flex-direction: column;
      &.focus {
        border-color: fade-out($color, .7);
      }
      &.introducing {
        border-color: #22afbd;
      }
      &.moving {
        border-color: fade-out($color, .7);
      }
      &:not([class*='step_']) {
          .placeholder {
            left: 0px;
          }
      }
      &.step_1 {
          .placeholder {
            left: 30px;
          }
      }
      &.step_2 {
          .placeholder {
            opacity: 0;
          }
      }
  }
    .row {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

      .placeholder,
      .input {
        font-size: 14px;
      }

      .placeholder {
        color: #999;
        position: absolute;
        height: 100%;
        z-index: -1;
        transition: .3s ease-out;
      }
      .input {
        display: flex;
        // border: 1px solid #000;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
      }
</style>
