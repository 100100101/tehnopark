<template>
  <div
    :class="{
      'default': true,
      /**/
      'focus': inFocus,
      /*был сделан N-шаг к переходу состояния*/
      'step_1': currentValue.length > 0,
      'step_2': currentValue.length > 1,
      /**/
      introducing,
      /**/
      moving,
    }"
  >
    <square class="icon-wrapper">
      <img
        v-if="iconSrc"
        :src="iconSrc"
        alt=""
        class="icon"
      >
      <!-- <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        class="svg"
      >
        <path
          d="
            M 10 10
            l 40 10
            l 5 0
            l 5 10
            L 100 10
            L 100 100
            L 0 100
            z
          "
          class="svg__path"
        />
      </svg> -->
    </square>
    <!-- v-if="!currentValue" -->
    <!-- v-if="currentValue.length < 10" -->
    <div class="row">
      <div
        v-if="$slots.placeholder || placeholder"
        :class="{
          'placeholder': true,
        }"
      >
        <template
          v-if="placeholder"
        >
          {{placeholder}}
        </template>
        <slot
          v-else-if="$slots.placeholder"
          name="placeholder"
        />
      </div>
      <slot name="default"/>

      <!-- <span
        ref="input"
        class="input"
        :contenteditable="!disable"
      >{{currentValue}}</span> -->
    </div>

  </div>
</template>

<script>
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*PROPS*/
  props: {

    /*ссылка на объект содержащий значение по ключу*/
    item: {
      type: [Object, Array],
    },

    /*ключ по которому ищется редактируемое значение в объекте*/
    name: {
      type: [String, Number],
    },

    /*значение*/
    value: {
      type: String,
      default: '',
    },

    /*значение placeholder*/
    placeholder: {
      type: String,
    },

    iconSrc: {
      type: String,
    },

    /*доступно ли поле для редактирования*/
    disable: Boolean,

    /*функция форматирования*/
    formatting: {
      // type: [Function, String],
      type: Function,
      default: value => {
        /*удаление переносов строки*/
        return value.replace(/\n/g, '');
      },
    },

    /*функция модерирования (выполняется после форматирования)*/
    moderation: {
      type: Function,
      /**/
      default: value => value,
    },

  },

  /*DATA*/
  data() {
    return {
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

  /*INJECT*/
  inject: [
    /*подключение шины событий/данных*/
    // 'bus',
    // '$emit',
  ],

  /*COMPUTED*/
  computed: {
    /*существование корректного редактируемого значения по ссылке*/
    valueByLink() {
      let
        item = this.item
        ,name = this.name
      ;
      /*если существуют указатели*/
      if(item && name) {
        let
          value = item[name]
        ;
        /*значение существует или является пустой стокой*/
        if(value || value === '') {
          /*установка наблюдателя за изменением значения*/
          // this.$watch()
          return value;
        }
      }
    },

    /*текущее значение*/
    currentValue() {
      return this.value || this.valueByLink || '';
    },

    /*выявление - заполнитель переданный через слот или через свойство*/
    // placeholderNode() {
    //   return this.placeholder || this.$slots.placeholder;
    // },

  },

  /*WATCH*/
  watch: {
    /**/
    disable(newVal, oldVal) {
      console.log('newVal:', newVal);
    },

    /*отслеживание изменения значения поля для корректировки дочерних узлов*/
    // currentValue(newVal, oldVal) {
    //   /*вставить отформатированный текст в поле, удаляя тем самым возможно созданные дочерние блоки*/
    //   this.$refs.input.innerText = newVal;
    // },

  },


  /*METHODS*/
  methods: {
    /*поместить каретку в заданную позицию*/
    setCaret(position) {
      let
        input = this.$refs.input
        /*текст элемента*/
        ,textNode = input.firstChild
        /*диапозон выделения*/
        ,range = document.createRange()
        /*виделение*/
        ,selection = window.getSelection()
      ;
      // console.log('position, input, textNode, range, selection:', position, input, textNode, range, selection);
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
      let
        input = this.$refs.input
      ;
      /*установка обработчика INPUT*/
      input.addEventListener('input', this.inputHandler);
      /*установка обработчика BLUR*/
      input.addEventListener('blur', this.blur);
      /*установка обработчика события старта выделения*/
      document.addEventListener('selectionchange', this.selectionchange);
      /*установка обработчика события любого изминения выделения*/
      document.addEventListener('selectstart', this.selectstart, false);
      /*установка обработчика события нажатия мыши на любую область документа, для снатия фокуса с поля если нажатый элемент не разрешает всплытие/погружение/обрывает остальные обработчики*/
      document.addEventListener('mousedown', this.blur, /*true - начать захват*/true);
      /**/
      // document.addEventListener('touchstart', this.blur, /*true - начать захват*/true);
    },
    /*удаление обработчиков события реагирующих на текущее поле*/
    removeEventListeners() {
      let
        input = this.$refs.input
      ;
      /*снять обработчик INPUT*/
      input.removeEventListener('input', this.inputHandler);
      /*снять обработчик BLUR*/
      input.removeEventListener('blur', this.blur);
      /*удаление обработчика события старта выделения*/
      document.removeEventListener('selectionchange', this.selectionchange);
      /*удаление обработчика события любого изминения выделения*/
      document.removeEventListener('selectstart', this.selectstart, false);
      /*удаление обработчика события нажатия мыши на любую область документа, для снатия фокуса с поля если нажатый элемент не разрешает всплытие/погружение/обрывает остальные обработчики*/
      document.removeEventListener('mousedown', this.blur, true);
      /**/
      // document.removeEventListener('touchstart', this.blur, /*true - начать захват*/true);
    },

    /*input focus*/
    focus(event) {
      let
        activeElement = document.activeElement
        ,input = this.$refs.input
      ;
      /*снять обработчик FOCUS*/
      input.removeEventListener('focus', this.focus);
      /*если на поле ещё не выставлен фокус (проверка во избежание навешивания  обработчиков повторно) - выставить*/
      if(
        /*документ или не содержит активный элимент*/
        !activeElement
        ||
        /*или документ содержит активный элимент, и активным элиментом является не поле токущего компонента*/
        (activeElement && activeElement !== input)
      ) {
        input.focus();
      }
      /**/
      this.inFocus = true;
      /*добавление обработчиков события реагирующих на текущее поле*/
      // this.addEventListeners();
      /*оповестить родительские элименты о событии*/
      // console.log('this.$emit(focus)');
      // this.$bus.$emit('focus');
      this.$emit('focus');
    },

    /*input blur*/
    blur(event) {
      let
        activeElement = document.activeElement
        ,input = this.$refs.input
      ;
      /*снять обработчик BLUR*/
      input.removeEventListener('blur', this.blur);
      /*если на поле ещё не выставлен фокус (проверка во избежание навешивания  обработчиков повторно) - выставить*/
      if(
        /*документ содержит активный элимент*/
        activeElement
        &&
        /*и активным элиментом является поле токущего компонента*/
        activeElement === input
      ) {
        input.blur();
      }
      /**/
      this.inFocus = false;
      /*снятие обработчиков события реагирующих на текущее поле*/
      this.removeEventListeners();
      /*оповестить родительские элименты о событии*/
      this.$emit('blur');

      /*установка обработчика FOCUS*/
      // input.addEventListener('focus', this.focus);
    },

    /**/
    inputHandler(event) {
      /*узнать текущее положение каретки ввода*/
      let
        currentCaretPosition = this.getCaret()
        /*значение поля*/
        ,innerText = event.target.innerText
        /*длина не форматированного контента для вычисления разнецы положения каретки после формат/модер*/
        ,innerTextLength = innerText.length
        /*передаваемое значение*/
        ,valueByLink = this.valueByLink
        /*функция форматирования*/ /*если была передана функция форматирование - форматирование по ней, или по стандартной*/
        ,formatting = this.formatting(innerText)
        /*функция модерирования*/
        ,value = this.moderation(formatting)
        /*длина форм/модер результата*/
        ,valueLength = value.length
        /*подсчёт в итоге введённых (пропущенных) символов*/
        ,inputedRangeLangth = innerTextLength - valueLength
        /*вычисление актуального положения каретки*/
        // ,actualCaretPosition = currentCaretPosition - inputedRangeLangth
          /*вычесть разницу кол-ва символов контента до и после формат/модер*/

      ;

      console.log('valueLength, inputedRangeLangth, actualCaretPosition, currentCaretPosition:', valueLength, inputedRangeLangth, currentCaretPosition);
      /*сохранение положения каретки глобально*/
      // this.lastCaretPosition = currentCaretPosition;

      /*вставить отформатированный текст в поле, удаляя тем самым возможно созданные дочерние блоки*/
      this.$refs.input.innerText = value;

      /*если была передана корректная ссылка на редактируемое значение*/
      if(valueByLink || valueByLink === '') {
        /*обновить значение*/
        this.item[this.name] = value;
      }
      /*оповестить родительские компоненты о событии и передать результат*/
      this.$emit('input', value);
      /*установка какетки ввода на сохранённое ранее положение*/
      /*если текущая позиция устанавливаема - выход*/
      if((currentCaretPosition - inputedRangeLangth) > 0) {
        this.$nextTick(() => {
          /**/
          let
            toPosition
          ;
          /*если введённое превышает предел - ограничить пределом, иначе разрешить позицию*/
          if(currentCaretPosition > valueLength) {
            toPosition = valueLength;
          } else {
            toPosition = currentCaretPosition
          }
          this.setCaret(toPosition);
        });
      }
      /*снятие обработчика события любого изминения выделения*/
      // document.removeEventListener('selectstart', this.selectstart, false);
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
    // defaultFormatting(value) {
    //   /*удаление переносов строки*/
    //   return value.replace('/\n/g', '');
    // },

  },

  /*CREATED*/
  created() {

  },

  /*MOUNTED*/
  mounted() {
    console.log('mounted window.inp = this:', window.inp = this);
    /*установка обработчика FOCUS*/
    // this.$refs.input.addEventListener('focus', this.focus);
    /**/
  },

  /*BEFORE DESTROY*/
  beforeDestroy() {
    /*удаление обработчиков события реагирующих на текущее поле*/
    this.removeEventListeners();
    /*снять обработчик FOCUS*/
    this.$refs.input.removeEventListener('focus', this.focus);
  },

}
</script>

<style lang="scss" scoped>
  .default {
    $color: #000;
    position: relative;
    // cursor: pointer;
    // border: 1px solid fade-out($color, .9);
    border: 1px solid #DCDCDC;
    // padding: 3px 5px;
    display: flex;
    // flex-direction: column;
    border-radius: 2px;
    height: 30px;
      &.focus {
        border-color: fade-out($color, .7);
          .input {
            // font-size: 14px;
              &:empty {
                border: 1px solid transparent;
                // caret-color: red;
              }
          }
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
    .icon-wrapper {
      border-right: 1px solid #DCDCDC;
      max-width: 30px;
      width: 100%;
      min-width: 20px;
      background: #F6F6F6;
      z-index: 1;
        /deep/ .square-content {

          &:before,
          &:after {
            $size: 6px;
            content: '';
            width: 0;
            height: 0;
            border-top: $size solid transparent;
            border-bottom: $size solid transparent;
            border-left: $size solid;
            position: absolute;
            left: 100%;
            top: 50%;
            margin-top: -$size;
          }
          &:before {
            border-left-color: #DCDCDC;
          }
          &:after {
            margin-left: -1px;
            border-left-color: #F6F6F6;
          }

        }
    }
      .svg {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        // z-index: -1;
        position: absolute;
      }
        .svg__path {
          fill: transparent;
          stroke: #000;
          stroke-width: 1px;
          stroke-linejoin: round;
          // stroke-dasharray: 6 2;
          // stroke-opacity: .6;
          vector-effect: non-scaling-stroke;
        }
    .row {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }

      .placeholder,
      .input {
        // font-size: 14px;
        border-radius: 3px;
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
        align-items: center;
          &:empty {
            // background-color: rgba(0, 0, 0, 0.04);
          }
      }
</style>
