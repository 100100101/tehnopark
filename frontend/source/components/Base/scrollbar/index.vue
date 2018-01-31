<template>
  <!--контент-->
  <div
    :class="{
      'scroll-content': true,

      [overflowX || `hidden-x`]: true,
      [overflowY || `hidden-y`]: true,

      'dragging-x': draggingX,
      'dragging-y': draggingY,

      'scrolling-x': scrollingX,
      'scrolling-y': scrollingY,

      'overcrowded-x': overcrowdedX,
      'overcrowded-y': overcrowdedY,
    }"

    v-on="contentAddEventListeners()"

    :style="contentStyle"
  >
    <!--DEFAULT SLOT-->
    <slot name="default"/>
    <!-- @top="navigateTop"
    @right="navigateRight"
    @bottom="navigateBottom"
    @left="navigateLeft" -->
    <component
      v-if="navigation"
      :is="require('./navigation')"

      :circle-size="navigationSettings.circleSize"

      @mousedown="navigationMousedown"
      @mouseup="navigationMouseup"
      @hold="navigationHold"
      @unhold="navigationUnhold"

      :class="{
        'container-mouseenter': containerMouseenter,
      }"
      :style="{
        width: `${containerBoundingClientRect.width}px`,
        height: `${containerBoundingClientRect.height}px`,
        top: `${movementY}%`,
        left: `${movementX}%`,
      }"
    >

      <!-- <slot slot="prev" name="prev"/> -->
      <!-- <slot slot="next" name="next"/> -->
    </component>

    <!--СКРОЛЛ ПАНЕЛЬ ОСИ X-->
    <div
      v-if="scrollAbilityX || !hidingX"
      ref="scrollpaneX"
      :class="{
        'scrollpane-x': true,
        [overflowY || `hidden`]: true,
        'overcrowded': overcrowdedX,
        'container-mouseenter': containerMouseenter,
        'dragging': draggingX,
        'scrolling': scrollingX,
        'resizing': resizingX,
      }"
      @click.prevent.stop.self="scrollpaneXJump"
      :style="scrollpaneXStyle"
    >
      <div
        ref="sliderX"
        :class="{
          'slider': true,
          /*'slider-transition': dragging || draggingFromParent,*/
        }"

        v-on="slidersAddEventListeners('x')"

        :style="sliderXStyle"
      />
    </div>

    <!--СКРОЛЛ ПАНЕЛЬ ОСИ Y-->
    <div
      v-if="scrollAbilityY || !hidingY"
      ref="scrollpaneY"
      :class="{
        'scrollpane-y': true,
        [overflowY || `hidden`]: true,
        'overcrowded': overcrowdedY,
        'container-mouseenter': containerMouseenter,
        'dragging': draggingY,
        'scrolling': scrollingY,
        'resizing': resizingY,
      }"
      @click.prevent.stop.self="scrollpaneYJump"
      :style="scrollpaneYStyle"
    >
      <!--@touchstart="touchstart"
      @mousedown="touchstart"-->
      <div
        ref="sliderY"
        :class="{
          'slider': true,
          // 'slider-transition': !(dragging || /*draggingFromParent*/false),
        }"

        v-on="slidersAddEventListeners('y')"

        :style="sliderYStyle"
      />
    </div>
  </div>
</template>

<script>
  /*
    Методы contains и compareDocumentPosition
    Если есть два элемента, то иногда бывает нужно понять, лежит ли один из них выше другого, то есть является ли его предком.

    Обычные поисковые методы здесь не дают ответа, но есть два специальных. Они используются редко, но когда подобная задача встаёт, то знание метода может сэкономить много строк кода.
  */
  /* @flow */
  const
    elementResizeDetectorMaker = require('element-resize-detector')({
      /*for ultra performance*/
      strategy: 'scroll',
    })
    ,merge = require('deepmerge').default
  ;
  module.exports = merge.all([
    {
      // name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
      name: 'scrollbar',

      /*PROPS*/
      props: {
        /*позиция скролл панелей*/
        position: {
          type: [String, Array],
          // validator(value) {
          //   let
          //     requiredValue = this.validPositionsX.concat(this.validPositionsY)
          //   ;
          //   if(typeof value === 'string') {
          //     return !~requiredValue.indexOf(value);
          //   } else {
          //     value.every((item) => {
          //       return !~requiredValue.indexOf(item);
          //     });
          //   }
          // },
          default() {
            // return /*this.defaultPosition*/;
            /*положение скролл панелей по умолчанию*/
            return ['left', 'bottom'];
            // return this.$nextTick(() => {
            //   return this.defaultPosition;
            // });

          },
        },

        /*нужно ли включить навигацию*/
        navigation: {
          /*Boolean - включить по умолчанию, Object - включить и передать опции*/
          type: [Boolean, Object],
          default: true,
        },

        /*расстояние одного шага прокрутки*/
        wheelOneStepPX: {
          type: Number,
          default: 4,
        },
        /*
          ease
          Анимация начинается медленно, затем ускоряется и к концу движения опять замедляется. Аналогично cubic-bezier(0.25,0.1,0.25,1).
          ease-in
          Анимация медленно начинается, к концу ускоряется. Аналогично cubic-bezier(0.42,0,1,1).
          ease-out
          Анимация начинается быстро, к концу замедляется. Аналогично cubic-bezier(0,0,0.58,1).
          ease-in-out
          Анимация начинается и заканчивается медленно. Аналогично cubic-bezier(0.42,0,0.58,1).
          linear
          Одинаковая скорость от начала и до конца.
          step-start
          Как таковой анимации нет. Стилевые свойства сразу же принимают конечное значение.
          step-end
          Как таковой анимации нет. Стилевые свойства находятся в начальном значении заданное время, затем сразу же принимают конечное значение.
          steps
          Ступенчатая функция, имеющая заданное число шагов.
          transition-timing-function: steps(<число>, start | end)
          Здесь: <число> — целое число больше нуля; start — задаёт полунепрерывную снизу функцию; end — задаёт полунепрерывную сверху функцию.
          cubic-bezier
          Задаёт функцию движения в виде кривой Безье.
        */
        transitionTimingFunction: {
          type: String,
          default: 'ease-out',
        },
        /**/
        transitionDelay: {
          type: Number,
          default: /*0.1*/300,
        },
        /*возможность перетаскивать контент нажатиями мыши*/
        mouseDragContentAbility: {
          type: Boolean,
          // default: false,
           default: true,
        },

        /*время за которое можно считать, что происходит удерживание*/
        contentHoldTimerDelayMs: {
          type: Number,
          default: 300,
        }
      },

      /*DATA*/
      data () {
        return merge.all([
          {
            /*имя директивы указывающей на то, что данный элемент является секцией скролл контента*/
            // isSectionDirectiveName: 'is-scroll-section',

            /*позиция контента по оси Y*/
            contentY: 0,
            /*позиция контента по оси X*/
            contentX: 0,

            /**/
            defaultPosition: ['left', 'bottom'],

            /*текущие данные о контенте*/
            contentBoundingClientRect: {
              width: 0,
              height: 0,
              left: 0,
              top: 0,
            },

            /*текущие данные о контейнере*/
            containerBoundingClientRect: {
              width: 0,
              height: 0,
              left: 0,
              top: 0,
            },

            /*статус - была ли наведена мышь на контейнер*/
            containerMouseenter: false,

            /*происходит ли удерживание контента*/
            contentHold: false,

            /*предустановленные опции навигации*/
            navigationPreset: {
              circleSize: '20px',
            },

          },
          require('./x/data'),
          require('./y/data')
        ]);
      },

      /*COMPUTED*/
      computed: {
        /*контнейнер скролл контента*/
        container() {
          return this.$el.parentElement;
        },

        /*вычисление стилей контента*/
        contentStyle() {
          let
            style = {
              transform: `translate3d(${this.contentX}px, ${this.contentY}px, 0)`,
              /*transform: `translate(${this.contentX}px, ${this.contentY}px)`,*/
              /*transition: `transform ${transitionDelay}s ${transitionTimingFunction} ${transitionDuration}s`,*/
              /*'justify-content': 'center'*/
            }
          ;
          /*если необходимо добавить навигацию*/
          if(this.navigation) {
            /*по оси X*/
            if(this.scrollAbilityX) {
              /*добавление отступов для предотвращения перекрытия контента триггерами скролла*/
              style['padding-left'] = style['padding-right'] = this.navigationSettings.circleSize;
            }
            /*по оси Y*/
            if(this.scrollAbilityY) {
              /*добавление отступов для предотвращения перекрытия контента триггерами скролла*/
              style['padding-top'] = style['padding-bottom'] = this.navigationSettings.circleSize;
            }
          }
          return style;
        },

        /*вычисление объекта настроек навигации состоящего из предустановок и опций переданных извне*/
        navigationSettings() {
          /*если переданные опции навигации - объект*/
          let
            navigationOptions = this.navigation
          ;
          if(navigationOptions) {
            /*слить предустановки и переданные опции*/
            return Object.assign(this.navigationPreset, navigationOptions);
          /*иначе настройкаи станут предустановленные опции*/
          } else {
            return this.navigationPreset;
          }
        },

        /*секции контента*/
        // sections() {
        //   return this.$slots.default.filter((item, index, array) => {
        //     /*если елемент не является комментарием*/
        //     return !~Object.prototype.toString.call(item.elm).indexOf('Comment')
        //     /*и нода содержит показатель секции*/
        //     &&
        //     (item.componentInstance.$attrs[this.isSectionDirectiveName] || item.componentInstance.$options.propsData[this.isSectionDirectiveName]);
        //   });
        // },

        /*нахолится ли контент в скроллируемом состоянии методом перетаскивания*/
        dragging() {
          return this.draggingX || this.draggingY;
        },
        /*нахолится ли контент в скроллируемом состоянии методом прокрутки*/
        mousewheel() {
          return this.mousewheelX || this.mousewheelY;
        },
        /*скролируется ли контент любым из способов*/
        scroll() {
          return this.scrollingX || this.scrollingY;
        },

      },

      /*METHODS*/
      methods: {
/*/////////NAVIGATION//////////////*/

        /*произошло нажатие на триггер навигационной панели*/
        navigationMousedown(side) {
          console.log('navigationMousedown side:', side);

          switch(side) {
            case 'top':
              /**/
              this.scrollContentStepY(-1, 'draggingY');
            break;
            case 'right':
              /**/
              this.scrollContentStepX(1, 'draggingY');
            break;
            case 'bottom':
              /**/
              this.scrollContentStepY(1, 'draggingY');
            break;
            case 'left':
              /**/
              this.scrollContentStepX(-1, 'draggingY');
            break;
          }

        },

        /*произошло отжатие на триггер навигационной панели*/
        navigationMouseup() {
          console.log('navigationMousedown');
        },

        /*произошло удерживание*/
        navigationHold() {
          console.log('navigationHold');
        },

        /*произошло снятие удерживания*/
        navigationUnhold() {
          console.log('navigationUnhold');
        },

        /**/
        // navigateTop() {
        //   console.log('navigateTop');
        // },

        /**/
        // navigateRight() {
        //   console.log('navigateRight');
        // },

        /**/
        // navigateBottom() {
        //   console.log('navigateBottom');
        // },

        /**/
        // navigateLeft() {
        //   console.log('navigateLeft');
        // },

/*/////////NAVIGATION//////////////*/

        /*добавление обработчиков событий контента*/
        contentAddEventListeners() {
          let
            handlers = {
              wheel: this.wheel,
              touchstart: this.contentTouchstart,
              touchmove: this.contentTouchmove,
              touchend: this.contentTouchend,
            }
          ;
          /*если сказанно о возможности перетаскивания контента мышью*/
          if(this.mouseDragContentAbility) {
            handlers.mousedown = this.contentTouchstart;
            handlers.mouseup = this.contentTouchend;
          }
          return handlers;
        },

        /*добавление обработчиков событий ползунков*/
        slidersAddEventListeners(axis) {
          let
            isAxisX = axis === 'x'
            /*общая обёртка для обработчиков*/
            ,ovetallEventWrapper = handler => {
              return event => {
                /**/
                event.preventDefault();
                /**/
                // event.stopPropagation();
                /*предотвратить выполнение любых других обработчиков на данном элименте, на дочерних и родительских*/
                event.stopImmediatePropagation();
                return handler(event);
              };
            }
          ;
          /**/
          return {
            touchstart: ovetallEventWrapper(isAxisX ? this.sliderXTouchstart : this.sliderYTouchstart),
            touchmove: ovetallEventWrapper(isAxisX ? this.sliderXTouchmove : this.sliderYTouchmove),
            touchend: ovetallEventWrapper(isAxisX ? this.sliderXTouchend : this.sliderYTouchend),

            mousedown: ovetallEventWrapper(isAxisX ? this.sliderXTouchstart : this.sliderYTouchstart),
            mousemove: ovetallEventWrapper(isAxisX ? this.sliderXTouchmove : this.sliderYTouchmove),
            mouseup: ovetallEventWrapper(isAxisX ? this.sliderXTouchend : this.sliderYTouchend),
          };
        },

        /*обработка события прокрутки*/
        wheel(event) {
          let
            /*шаг прокрутки определяющий её скорость*/
            oneStep = this.wheelOneStepPX
            /*был ли зажат shift*/
            ,shifted = event.shiftKey
            /*DOM events*/
            ,scrollAbilityX = event.deltaX > 0 ? oneStep : -(oneStep)
            ,scrollAbilityY = event.deltaY > 0 ? oneStep : -(oneStep)
            /*это скролл по оси X? Если контент шире обёртки и был зажат шифт, или если есть Y прокрутка, но нет X*/
            ,isScrollAlongX = (this.scrollAbilityX && shifted) || (this.scrollAbilityX && !this.scrollAbilityY)
            /*это скролл по оси Y? Если контент выше обёртки и не был зажат шифт, или если не зажат шифт, но нет X*/
            ,isScrollAlongY = this.scrollAbilityY && (!shifted || !this.scrollAbilityX)
          ;
          /*
            Fix Mozilla Shifted Wheel
            если скроллирование по оси X, но deltaX == 0
          */
          if(isScrollAlongX && event.deltaX == 0) scrollAbilityX = event.deltaY > 0 ? oneStep : -(oneStep)
          /*скролл по оси Y*/
          isScrollAlongY && this.scrollContentStepY(scrollAbilityY, 'mousewheelY');
          /*скролл по оси X**/
          isScrollAlongX && this.scrollContentStepX(scrollAbilityX, 'mousewheelX');
        },

        /*начало перетаскивания контента*/
        contentTouchstart(event) {
					console.log('scroll contentTouchstart');
          /*определить - было ли это зажатие на месте, если да - вероятно это попытка выделения*/
          /*если таймер не будет удалён раньше задонного времени, значить произошло удерживание на месте*/
          // this.contentHoldTimer = setTimeout(() => {
          //   /*выставить статус удержания контента*/
          //   this.contentHold = true;
          // }, this.contentHoldTimerDelayMs);

          // if(hold) {
          //
          // }

          // event.stopPropagation();
          /*предотвратить выполнение любых других обработчиков на данном элименте, на дочерних и родительских*/
          event.stopImmediatePropagation();
          /*остановить всплытие события IE*/
          // event.cancelBubble = true;
          /*если это мобильное событие*/
          if(event.changedTouches) {
            /*если это touch событие, выбрать события первого касания*/
            event = event.changedTouches[0];
          /*иначе это десктопное событие*/
          } else {
            /*добавление слушателя за движением мышы*/
            document.addEventListener('mousemove', this.contentTouchmove, /*true - начать погружение*/false);
            /*добавление слушателя за mouseup*/
            document.addEventListener('mouseup', this.contentTouchend, false);
          }

          /*если существует возможность скроллирования по оси X*/
          if(this.scrollAbilityX) {
            /*выставить статус события перетаскивания по оси X - выполняется перемещение контента*/
            this.draggingX = true;
            this.startX = event.pageX;
          }
          /*если существует возможность скроллирования по оси Y*/
          if(this.scrollAbilityY) {
            /*выставить статус события перетаскивания по оси Y - выполняется перемещение контента*/
            this.draggingY = true;
            this.startY = event.pageY;
          }

        },

        /*процесс перетаскивания контента*/
        contentTouchmove(event) {
          let
            contentHoldTimer = this.contentHoldTimer
          ;
          /*если был найден таймер вычисления удерживания*/
          if(contentHoldTimer) {
            /*удаление таймера*/
            clearTimeout(contentHoldTimer);
          }
          /*если не происходит удерживания контента и установленно что происходит скроллирование методом перетаскивания*/
          if(!this.contentHold && this.dragging) {
            /*начать скроллирование*/
            event.preventDefault();
            // event.stopPropagation();
            /*предотвратить выполнение любых других обработчиков на данном элименте, на дочерних и родительских*/
            event.stopImmediatePropagation();
            let
              /*вид курсора*/
              cursor
              /*глобальный слой наложения*/
              ,overlay = this.$root.$refs.overlay
            ;
            /*если скролирование возможно по двум осям одновременно*/
            if(this.scrollAbilityX && this.scrollAbilityY) {
              cursor = 'all-scroll';
            /*скроллирование возможно только по оси X*/
            } else if(this.scrollAbilityX) {
              cursor = 'col-resize';
            /*скроллирование возможно только по оси Y*/
            } else {
              cursor = 'row-resize';
            }
            /*показать глобольный слой наложения*/
            // overlay.show();
            /*задание вида купсора глобальному слою наложения*/
            // overlay.$el.style.cursor = cursor;

            /*остановить всплытие события IE*/
            // event.cancelBubble = true;
            /*если это мобильное событие*/
            event.changedTouches && (event = event.changedTouches[0]);
            /*если существует возможность скроллирования по оси X*/
            if(this.scrollAbilityX) {
              /*скролировать по оси X с учётом коэфициента торможения*/
              this.scrollContentStepX((this.startX - event.clientX) * this.touchAnchorX, 'draggingX');
              /*обновление последнего event.clientY*/
              this.startX = event.clientX;
            }
            /*если существует возможность скроллирования по оси Y*/
            if(this.scrollAbilityY) {
              /*скролировать по оси Y с учётом коэфициента торможения*/
              this.scrollContentStepY((this.startY - event.clientY) * this.touchAnchorY, 'draggingY');
              /*обновление последнего event.clientY*/
              this.startY = event.clientY;
            }
          }

        },

        /*окончание перетаскивания контента*/
        contentTouchend(event) {
          // event.stopPropagation();
          /*предотвратить выполнение любых других обработчиков на данном элименте, на дочерних и родительских*/
          event.stopImmediatePropagation();
          /*остановить всплытие события IE*/
          // event.cancelBubble = true;
          let
            /*глобальный слой наложения*/
            overlay = this.$root.$refs.overlay
          ;
          /*убрать глобольный слой наложения*/
          // overlay.hide();
          /*задание вида купсора глобальному слою наложения*/
          // overlay.$el.style.cursor = '';


          /*выставить статус события перетаскивания - не выполняется перемещение контента по оси X*/
          this.draggingX && (this.draggingX = false);
          /*выставить статус события перетаскивания - не выполняется перемещение контента по оси Y*/
          this.draggingY && (this.draggingY = false);
          /*если это мобильное событие*/
          if(event.changedTouches) {
            /*если это touch событие, выбрать события первого касания*/
            event = event.changedTouches[0];
          /*иначе это десктопное событие*/
          } else {
            /*добавление слушателя за движением мышы*/
            document.removeEventListener('mousemove', this.contentTouchmove, /*true - начать погружение*/false);
            /*добавление слушателя за mouseup*/
            document.removeEventListener('mouseup', this.contentTouchend, false);
          }
        },

        /*начало перетаскивания ползунка оси*/
        sliderTouchstart(params) {
          let
            event = params.event
          ;
          event.preventDefault();
          event.stopImmediatePropagation();

          /*установка обработчика события перемещения мыши на весь документ*/
          // document.addEventListener('mousemove');

          let
            /*глобальный слой наложения*/
            overlay = this.$root.$refs.overlay
          ;
          /*показать глобольный слой наложения*/
          // overlay.show();
          /*задание вида купсора глобальному слою наложения*/
          // overlay.$el.style.cursor = 'row-resize';

          /*если это событие касания*/
          if(event.changedTouches) {
            /*если это touch событие, выбрать события первого касания*/
            event = event.changedTouches[0];
          /*иначе это десктопное событие*/
          } else {
            /*добавление слушателя за движением мышы*/
            document.addEventListener('mousemove', this[params.sliderAxisTouchmove], false);
            /*добавление слушателя за mouseup*/
            document.addEventListener('mouseup', this[params.sliderAxisTouchend], false);
          }
          /*выставить статус события перетаскивания - выполняется перемещение контента*/
          this[params.draggingAxisKey] = true;
          /**/
          this[params.startAxisKey] = event[params.clientAxisKey];
        },


        /*окончание перетаскивания ползунка оси*/
        sliderTouchend(params) {
          /*!!!!!!!!!!!! not calling*/
          console.log('sliderTouchend');
          let
            /*глобальный слой наложения*/
            overlay = this.$root.$refs.overlay
          ;
          /*показать глобольный слой наложения*/
          // overlay.hide();
          /*задание вида купсора глобальному слою наложения*/
          // overlay.$el.style.cursor = '';
          /**/
          document.removeEventListener('mousemove', this[params.sliderAxisTouchmove], false);
          /**/
          document.removeEventListener('mouseup', this[params.sliderAxisTouchend], false);
          /*выставить статус события перетаскивания - не выполняется перемещение контента*/
          this[params.draggingAxisKey] = false;
        },

        /*выставить статус*/
        setStatus(key) {
          let
            timerKey = key + 'Timeout'
          ;
          /*если существует таймер - преждевременное удаление его для предотвращения преджевременного снятия статуса скроллинга*/
          if(this[timerKey]) {
            clearTimeout(this[timerKey]);
          }

          /*если это скролл прокруткой мыши*/
          if(this.mousewheel) {
            /*создание таймера*/
            this[timerKey] = setTimeout(() => {
              /*убрать статус скролла через заданное опцией время*/
              this[key] = false;
            }, this.transitionDelay);
          }
          /*выставить статус способа скролла - true*/
          this[key] = true;
        },

        /*шаг прокрутки для любой из осей*/
        scrollContentStep(params) {
          let
            /*округлить процентное значение положения до ближайшего целого*/
            step = Math.round(
              ((this[params.movementKey] + params.step) / 100) * params.contentSize
            )
          ;

          // console.log('step:', step, this[params.movementKey]);

          /*вычисление шага не дало достоверного результата*/
          // if(!this[params.movementKey]) {return}

          /*выставить статус*/
          this.setStatus(params.way);
          /*максимально возможная прокрутка в конец*/
          if(step > params.endPoint) {
            /*возвращение в зоне ограничения*/
            // setTimeout(() => {
            // }, 0);
            step = params.endPoint;
          }
          /*максимально возможная прокрутка в начало*/
          if(step < 0) {
            step = 0;
          }
          /*обновление положения контента*/
          this[params.contentAxisKey] = -step;
          /*обновление положения слайдера*/
          this[params.movementKey] = step / params.contentSize * 100;
        },


        /*функция срабатывающая при обновлении размеров контейнера*/
        updateContainerSize() {
          this.containerBoundingClientRect = this.container.getBoundingClientRect();
          /*если установлен скролл по оси X, обновить размеры слайдера*/
          if(this.overflowX) {
            this.calculateSliderXWidth();
          }
          /*если установлен скролл по оси Y, обновить размеры слайдера*/
          if(this.overflowY) {
            this.calculateSliderYHeight();
          }
          /*если есть слушатеьл, уведомить подительские компоненты о изменении размера контейнера*/
          this.$emit('resize-container');
        },

        /*функция срабатывающая при обновлении размеров контента*/
        updateContentSize() {
          this.contentBoundingClientRect = this.$el.getBoundingClientRect();
          /*если установлен скролл по оси X, обновить размеры слайдера*/
          if(this.overflowX) {
            this.calculateSliderXWidth();
          }
          /*если установлен скролл по оси Y, обновить размеры слайдера*/
          if(this.overflowY) {
            this.calculateSliderYHeight();
          }
          /*если есть слушатеьл, уведомить подительские компоненты о изменении размера контента*/
          this.$emit('resize-content');
        },

        /**/
        containerMouseenterHandler() {
          /*выставить статус - мышь наведена на контейнер*/
          this.containerMouseenter = true;
        },
        /**/
        containerMouseleaveHandler() {
          /*снять статус - мышь наведена на контейнер*/
          this.containerMouseenter = false;
        },
      },

      /**/
      created() {
        /*не реактивные свойства*/
        /**/
        this.startX = 0;
        /**/
        this.startY = 0;
        /**/
        // this.mousewheelYTimeout = null;
        /**/
        // this.mousewheelXTimeout = null;
      },
      /*MOUNTED*/
      mounted() {
        let
          yAppendTo = this.yAppendTo
        ;
        /**/
        if(yAppendTo) {
          let
            refs = yAppendTo.refs,
            ref = yAppendTo.ref,
            el = refs[ref]
          ;
          console.log('yAppendTo el:', el);
          el.append(this.$refs.scrollpaneY);

        }

        /*отслеживание изменений размера обёртки*/
        elementResizeDetectorMaker.listenTo(this.container, this.updateContainerSize);
        /*отслеживание изменений размера блока контента*/
        elementResizeDetectorMaker.listenTo(this.$el, this.updateContentSize);
        /*отслеживание наведения мыши на контейнер*/
        this.container.addEventListener('mouseenter', this.containerMouseenterHandler);
        /*отслеживание выхода мыши из контейнера*/
        this.container.addEventListener('mouseleave', this.containerMouseleaveHandler);
      },

      /*BEFORE DESTROY*/
      beforeDestroy() {
        /*удаление отслеживания изменений размера обёртки*/
        elementResizeDetectorMaker.removeListener(this.container, this.updateContainerSize);
        /*удаление отслеживания изменений размера блока контента*/
        elementResizeDetectorMaker.removeListener(this.$el, this.updateContentSize);
        /*удаление отслеживания наведения мыши на контейнер*/
        this.container.removeEventListener('mouseenter', this.containerMouseenterHandler);
        /*удаление отслеживания выхода мыши из контейнера*/
        this.container.removeEventListener('mouseleave', this.containerMouseleaveHandler);

        console.log('scrollbar beforeDestroy', this.$refs.scrollpaneY);
        let
          yAppendTo = this.yAppendTo
        ;
        /**/
        if(yAppendTo) {
          let
            refs = yAppendTo.refs,
            ref = yAppendTo.ref,
            el = refs[ref]
          ;
          this.$refs.scrollpaneY.remove();

        }
      },

      /*BEFORE UPDATE*/
      beforeUpdate() {

      },

    },
    /**/
    require('./x/'),
    /**/
    require('./y/')
  ]);
</script>

<style lang="scss" scoped>
  /**/
  @import "scrollpanes.scss";
  /**/
  .scroll-content {
    // display: inline-flex;
    position: relative;
    will-change: translate3d;
      &:hover {

      }
      /*только если не переполняет по оси Y*/
      &:not(.overcrowded-y) {
          .scrollpane-y {
              > .slider {

              }
          }
      }

      /**/
      &[class*='dragging-'] {

      }

      /**/
      &.hidden-y {

      }

      /**/
      &.hidden-x {

      }

      /**/
      &.top {
        > .scrollpane-x {
          top: 0;
        }
      }

      &.left {
        > .scrollpane-y {
          left: 0;
        }
      }

      &.bottom {
        > .scrollpane-x {
          bottom: 0;
        }
      }

      &.right {
        > .scrollpane-y {
          right: 1px;
        }
      }
  }
  /*в скроллируемом состоянии по любой оси*/
  [class*="scrolling-"] {
      /*только если переполняет*/
      &[class*='overcrowded-'] {
          [class*='scrollpane-'] {
            > .slider {
              background-color: rgba(34, 175, 189, 0.5);
            }
          }
      }
  }
  /*в скроллируемом состоянии по оси X*/
  .scrolling-x {
      > .scrollpane-x {
          > .slider {

          }
      }
  }
  /*в скроллируемом состоянии по оси Y*/
  .scrolling-y {
      > .scrollpane-y {
          > .slider {

          }
      }
  }
</style>
