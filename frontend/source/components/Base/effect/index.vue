<template>
  <div
    :class="{
      'effect': true,
      [type]: true,
      hold,
      mousedown,
      touchstart,
      animated,
    }"
    :style="(() => {
      let
        result = {
          background: color,
          transition: (animated || hold) && `transform ${speed}s ease-out`,
          'z-index': 0,
        }
      ;
      Object.assign(result, styles);
      if(hold) {
        /*result.animation = `ripple ${speed}s ease-out`;*/
      }
      return result;
    })()"
  />
</template>

<script>
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*PROPS*/
  props: {
    type: {
      type: String,
      // validator(value) {
      //   return !!~['ripple'].indexOf(value);
      // },
      default: 'ripple',
    },

    /**/
    triggerRefs: {
      type: Object,
      // default() {
      //   return this.$parrent.$refs;
      // },
    },

    /**/
    triggerRef: {
      type: String,
    },

    /**/
    stopPropagation: {
      type: Boolean,
      default: false,
    },

    /**/
    preventDefault: {
      type: Boolean,
      default: false,
    },

    /**/
    styles: {
      type: Object,
      default() {
        return {};
      },
    },

    /**/
    color: {
      type: String,
      default: 'rgba(0,0,0,.15)'
    },

    /**/
    speed: {
      type: Number,
      default: 0.3,
    },

    /*центрирован ли элемент эффекта*/
    isCentered: {
      type: Boolean,
      default: false,
    },

    /*не подписывать триггер на события*/
    notSubscribingEvents: {
      type: Boolean,
      default: false,
    },

    /*поместить эффект заданный элемент*/
    appendTo: {
      type: Object,
    },

  },

  /*DATA*/
  data() {
    return {
      /**/
      mousedown: false,
      /**/
      touchstart: false,
      /**/
      trigger: null,
      /*походит ли ещё анимация*/
      animated: false,
      /*функция обратного вызова, после завершения эффекта*/
      doneCallback: null,
      /**/
      setCallback: callback => {
        if(callback) {
          this.doneCallback = callback;
        } else {
          this.doneCallback();
        }
      },

    };
  },

  /*COMPUTED*/
  computed: {

    /**/
    hold() {
      /*подстановка события в зависимости от типа*/
      return this.mousedown || this.touchstart;
    },

    /**/
    handler() {
      return {
        /*зажатие триггера*/
        hold: this.rippleHold,
        /*отпускание тригера*/
        leave: this.rippleLeave,
      };
    },



  },

  /*METHODS*/
  methods: {
    /*RIPPLE HOLD*/
    rippleHold(event) {
      let
        /*функция записи всех родителей элемента, в случае отсутствия нативного списка*/
        composedPath = el => {
          let path = [];

          while (el) {
            path.push(el);
            if (el.tagName === 'HTML') {
              path.push(document);
              path.push(window);
              return path;
            }
            el = el.parentElement;
          }
        }
                              /*в Mozilla*/
        ,path = event.path || (event.composedPath && event.composedPath()) || composedPath(event.target)
        /*относиться ли нажатый элемент к триггеру*/
        ,thisTargetInTrigger = path.some(item => {
          return item === this.trigger;
        })
      ;
      /*если нажатый элемент не относиться к триггеру - выход из обработчика*/
      if(!thisTargetInTrigger) {
        return;
      };

      /**/
      if(this.preventDefault) event.preventDefault();
      /**/
      if(this.stopPropagation) event.stopPropagation();
      /*выставить статус */
      if(event.type === 'mousedown') {
        this.mousedown = true;
      } else {
        this.touchstart = true;
      }
      /*выставление статуса анимирования*/
      this.animated = true;

      let
        rect = this.trigger.getBoundingClientRect()
        ,ripple = this.$el
        ,top = event.pageY - rect.top
        ,left = event.pageX - rect.left
        ,width = this.trigger.offsetWidth
        ,widthCenter = width / 2
        ,heightCenter = height / 2
        ,height = this.trigger.offsetHeight
        ,squareDiagonal = (side) => {
          return Math.sqrt(2) * side;
        }
      ;
      /**/

      // ripple.style.top = `${event.clientY - rect.top - rippleSize / 2}px`;
      // ripple.style.left = `${event.clientX - rect.left - rippleSize / 2}px`;
      // ripple.style.transform = `translate(${}px, ${}px)`;
      /*если необходимо центрировать элемент эффекта*/
      if(this.isCentered) {
        let
          size = squareDiagonal((width > height) ? width : height)
        ;
        /*размер покрытия эффекта равен диагонали квадрата*/
        ripple.style.height = ripple.style.width = `${size}px`;
        ripple.style.top = ripple.style.left = `50%`;
        ripple.style.marginTop = ripple.style.marginLeft = `-${size / 2}px`;
      } else {
        let
          rangeWidth = (widthCenter > left) ? (width - left) : left
          ,rangeHeight = (heightCenter > top) ? (height - top) : top
          ,size = squareDiagonal((width > height) ? rangeWidth : rangeHeight)
        ;
        ripple.style.height = ripple.style.width = `${size * 2}px`;
        ripple.style.top = `${event.pageY - rect.top - size}px`;
        ripple.style.left = `${event.pageX - rect.left - size}px`;
      }
      /*выдержка анимации эффекта*/
      setTimeout(() => {
        /*если не дан запрет на установку обработчиков событий триггера*/
        if(!this.notSubscribingEvents) {
          /*вызов callback функции сообщающей о завершении эффекта*/
          this.$emit('done');
          /*иначе если была переданна callback вункция - вызвать её*/
        } else if(this.doneCallback) {
          this.doneCallback();
        }
        /*снятие статуса анимарования*/
        this.animated = false;

      }, this.speed * 1000);

      /*передача функций для обратного вызова*/
      return {
        done: this.setCallback,
      };
    },

    /*RIPPLE LEAVE*/
    rippleLeave(event) {
      /*если событие отпускания мыши*/
      if(event.type === 'mouseup') {
        /*снять статус зажатия мыши*/
        this.mousedown = false;
        /*иначе это событие завершения касания*/
      } else {
        /*снять статус касания*/
        this.touchstart = false;
      }
      /*емитировать событие click, т.к. возможно существует его обработчик в родительский компонентах*/
      // this.$emit('click');
      /*передача функций для обратного вызова*/
      return {
        done: this.setCallback,
      };
    },

  },

  /**/
  mounted() {
    this.$nextTick(() => {
      let
        trigger = this.triggerRefs[this.triggerRef]
      ;
      /*если триггер не определён, от возможно был передан компонент, тогда берётся корневой элемент этого компонента*/
      if(!trigger) {
        return;
      }
      if(trigger.$el) {
        trigger = trigger.$el;
      } else if(!!~Object.prototype.toString.call(trigger).indexOf('Array')) {
        trigger = trigger[0];
      }
      /**/
      this.trigger = trigger;
      /*если не дан запрет на установку обработчиков событий триггера*/
      if(!this.notSubscribingEvents) {
        /**/
        document.addEventListener('mousedown', this.handler.hold);
        /**/
        document.addEventListener('mouseup', this.handler.leave);

        /**/
        document.addEventListener('touchstart', this.handler.hold);
        /**/
        document.addEventListener('touchend', this.handler.leave);
      }

      /*если необходимо поместить эффект в указанный элемент*/
      if(this.appendTo) {
        let
          elContainer = this.appendTo.refs[this.appendTo.ref]
        ;
        /*если найден элемент-контейнер*/
        if(elContainer) {
          /*вставить текущий эффект в контейнер*/
          elContainer.append(this.$el);
        }
      }

    });
  },

  /*BEFORE DESTROY*/
  beforeDestroy() {
    /*выполнить финальную стадию эффекта*/
    // this.handler.leave();
    /*если не дан запрет на установку обработчиков событий триггера*/
    if(!this.notSubscribingEvents) {
      /*удаление обработчиков*/
      /**/
      document.removeEventListener('mousedown', this.handler.hold);
      /**/
      document.removeEventListener('mouseup', this.handler.leave);
      /**/
      document.removeEventListener('touchstart', this.handler.hold);
      /**/
      document.removeEventListener('touchend', this.handler.leave);
    }
  },

};
</script>

<style lang="scss" scoped>
  .effect {
      &.ripple {
        position: absolute;
        border-radius: 100%;
        pointer-events: none;
        top: 0;
        left: 0;
        transform: scale(0);
        will-change: transform;
          &.hold, &.animated {
            transform: scale(1);
          }
          &.hold {
            // animation: ripple .75s ease-out;
          }
          &.animated {

          }
      }
  }
</style>
