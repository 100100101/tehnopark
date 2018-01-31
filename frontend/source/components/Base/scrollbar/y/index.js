/**
 * @Author: Sergey <iadmin>
 * @Date:   2017-09-22T11:32:57+03:00
 * @Filename: y.js
 * @Last modified by:   iadmin
 * @Last modified time: 2017-10-10T09:50:18+03:00
 */
module.exports = {
  /*PROPS*/
  props: {
    /*скролл по оси Y*/
    overflowY: {
      type: [String, Boolean],
      // validator(value) {
      //   if (typeof value === 'string') {
      //     return !~['left', 'right'].indexOf(value);
      //   } else {
      //     return true;
      //   }
      // },
      default: 'right',
    },

    /*коэфициент торможения скроллинга контента по оси Y*/
    touchAnchorY: {
      type: Number,
      default: 0.2,
      validator(value) {
        return (value < 1) && (value > 0);
      }
    },

    /*значения анимации*/
    transitionDuration: {
      type: Number,
      default: 0,
    },
    /*может ли скролл оси Y скрываться, или всегда держать его на виду*/
    hidingY: {
      type: Boolean,
      default: true,
    },

    /*поместить скролл-панель оси Y в*/
    yAppendTo: {
      type: Object,
    },

    /*стили скролл-панели оси Y высшей специфичности*/
    yScrollpaneStyle: {
      type: Object,
    },

  },

  /*COMPUTED*/
  computed: {
    /*контент переполняет (или равен) контейнер по оси Y*/
    overcrowdedY() {
      return this.contentBoundingClientRect.height > this.containerBoundingClientRect.height;
      // let
      //   contentHeight = this.contentBoundingClientRect.height
      //   ,containerHeight = this.containerBoundingClientRect.height
      // ;
      // // return contentHeight > containerHeight || (contentHeight <= containerHeight);
      //
      // let
      //   overcrowded = contentHeight > containerHeight
      //   ,notCrowded = contentHeight <= containerHeight
      // ;
      // return
    },
    /*функцианальность скролирования по оси Y*/
    scrollAbilityY() {
      /*если сказанно включить скроллирование по оси Y и высота контента больше (переполняет) размера контейнера, или сказанно всегда показывать скролл-панель*/
      return this.overflowY && this.overcrowdedY;
    },
    /*скролируется ли контент по оси Y любым из способов*/
    scrollingY() {
      return this.draggingY || this.mousewheelY;
    },

    /*стили скролл-панели оси Y*/
    scrollpaneYStyle() {
      /*слияние переданных свойств с вычисляемыми*/
      let
        conputedStyle = {
          height: `${this.containerBoundingClientRect.height}px`,
          top: `${this.movementY}%`,
        },
        transferredStyle = this.yScrollpaneStyle
      ;
      /*если есть переданные стили*/
      if(transferredStyle) {
        return Object.assign(conputedStyle, transferredStyle);
      /*иначе*/
      } else {
        return conputedStyle;
      }
    },

    /*стили слайдера оси Y*/
    sliderYStyle() {
      return {
        height: `${this.sliderYHeight}%`,
        top: `${this.movementY}%`,
        /*transform: `translateY(${movementY}%)`,*/
      };
    },

    /*давление контентом на верхнюю границу контейнера*/
    pressureOnTop() {
      return this.movementY <= 0;
    },

    /*давление контентом на нижнюю границу контейнера*/
    pressureOnBottom() {
      return -this.contentY >= this.lowerEnd;
    },

  },

  /*METHODS*/
  methods: {
    /*начало перетаскивания ползунка оси Y*/
    sliderYTouchstart(event) {
      /*если скролирование по оси Y невозможно*/
      if(!this.scrollAbilityY) {return}
      this.sliderTouchstart({
        event,
        draggingAxisKey: 'draggingY',
        startAxisKey: 'startY',
        clientAxisKey: 'clientY',
        /**/
        sliderAxisTouchmove: this.sliderYTouchmove,
        sliderAxisTouchend: this.sliderYTouchend,
      });
    },

    /*процесс перетаскивания ползунка оси Y*/
    sliderYTouchmove(event) {
      /*если не происходит скроллирования, то и расчёты не будут произведены*/
      if(!this.dragging) {return}

      event.preventDefault();
      event.stopImmediatePropagation();

      /*если это touch событие, выбрать события первого касания*/
      event.changedTouches && (event = event.changedTouches[0]);
      /**/
      this.scrollContentStepY(
        /**/
        (event.clientY - this.startY)
        /**/
        / this.containerBoundingClientRect.height * 100,
        'draggingY'
      );
      /*обновление последнего event.clientY*/
      this.startY = event.clientY;
    },

    /*окончание перетаскивания ползунка оси Y*/
    sliderYTouchend(event) {
      console.log('sliderYTouchend');
      this.sliderTouchend({
        draggingAxisKey: 'draggingY',
        sliderAxisTouchmove: this.sliderYTouchmove,
        sliderAxisTouchend: this.sliderYTouchend,
      });
    },

    /*переместить ползунок скролл-панели оси Y в заданную позицию*/
    scrollpaneYJump(event) {
      /**/
      this.scrollContentStepY(
        /**/
        (event.clientY - this.$refs.sliderY.getBoundingClientRect().top)
        /**/
        / this.containerBoundingClientRect.width * 100
        /**/
        - (this.sliderXWidth / 2),
        'draggingY'
      );
      /*обновление последнего event.clientY*/
      this.startY = event.clientY;
    },

    /*вычисление размеров ползунка Y*/
    calculateSliderYHeight() {
      let
        sliderYHeight = this.containerBoundingClientRect.height / this.contentBoundingClientRect.height * 100
      ;
      this.sliderYHeight = sliderYHeight > 100 ? 100 : sliderYHeight;
      /*конечная граница снизу*/
      this.lowerEnd = Math.round(this.contentBoundingClientRect.height - this.containerBoundingClientRect.height);
      /*обновление положения скролл-панели и слайдера при изменении размеров контента или контейнера*/
      // this.scrollContentStepY(0, 'resizingY');
    },

    /*скроллирование по оси Y пошагово*/
    scrollContentStepY(/*шаг в процентах*/y, /*имя свойства говорящее о способе прокрутки*/way) {
      this.scrollContentStep({
        step: y,
        movementKey : 'movementY',
        contentSize : this.contentBoundingClientRect.height,
        endPoint: this.lowerEnd,
        contentAxisKey: 'contentY',
        way,
      });
    },
  },

};
