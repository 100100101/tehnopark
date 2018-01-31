/**
 * @Author: Sergey <iadmin>
 * @Date:   2017-09-22T11:32:57+03:00
 * @Filename: y.js
 * @Last modified by:   iadmin
 * @Last modified time: 2017-10-10T11:35:44+03:00
 */
module.exports = {
  /*PROPS*/
  props: {
    /*скролл по оси X*/
    overflowX: {
      type: [String, Boolean],
      // validator(value) {
      //   if (typeof value === 'string') {
      //     return !~['top', 'bottom'].indexOf(value);
      //   } else {
      //     return true;
      //   }
      // },
      default: 'bottom',
    },
    /*коэфициент торможения скроллинга контента по оси X*/
    touchAnchorX: {
      type: Number,
      default: 0.2,
      validator(value) {
        return (value < 1) && (value > 0);
      }
    },
    /*может ли скролл оси X скрываться, или всегда держать его на виду*/
    hidingX: {
      type: Boolean,
      default: true,
    },
    /*поместить скролл-панель оси X в*/
    xAppendTo: {
      type: Object,
    },

    /*стили скролл-панели оси X высшей специфичности*/
    xScrollpaneStyle: {
      type: Object,
      default() {
        return {};
      },
    },

  },

  /*COMPUTED*/
  computed: {
    /*контент переполняет (или равен) контейнер по оси X*/
    overcrowdedX() {
      return this.contentBoundingClientRect.width > this.containerBoundingClientRect.width;
      // let
      //   contentWidth = this.contentBoundingClientRect.width
      //   ,containerWidth = this.containerBoundingClientRect.width
      // ;
      // return contentWidth > containerWidth || (contentWidth <= containerWidth);
    },
    /*функцианальность скролирования по оси X*/
    scrollAbilityX() {
      /*если сказанно включить скроллирование по оси X и ширина контента больше (переполняет) размера контейнера, или сказанно всегда показывать скролл-панель*/
      return this.overflowX && this.overcrowdedX;
    },
    /*скролируется ли контент по оси X любым из способов*/
    scrollingX() {
      return this.draggingX || this.mousewheelX;
    },

    /*стили скролл-панели оси X*/
    scrollpaneXStyle() {
      let
        conputedStyle = {
          width: `${this.containerBoundingClientRect.width}px`,
          left: `${this.movementX}%`,
        },
        transferredStyle = this.xScrollpaneStyle
      ;
      /*если есть переданные стили*/
      if(transferredStyle) {
        /*слияние переданных свойств с вычисляемыми*/
        return Object.assign(conputedStyle, transferredStyle);
      /*иначе*/
      } else {
        return conputedStyle;
      }
    },

    /**/
    sliderXStyle() {
      return {
        width: `${this.sliderXWidth}%`,
        left: `${this.movementX}%`,
        /*transform: `translateX(${movementX}%)`,*/
      };
    },

    /*давление контентом на левую границу контейнера*/
    pressureOnLeft() {
      return this.movementX <= 0;
    },

    /*давление контентом на правую границу контейнера*/
    pressureOnRight() {
      return -this.contentX >= this.rightEnd;
    },

  },

  /*METHODS*/
  methods: {
    /*начало перетаскивания ползунка оси X*/
    sliderXTouchstart (event) {
      /*если скролирование по оси X невозможно*/
      if(!this.scrollAbilityX) {return}
      this.sliderTouchstart({
        event,
        draggingAxisKey: 'draggingX',
        startAxisKey: 'startX',
        clientAxisKey: 'clientX',
        /**/
        sliderAxisTouchmove: this.sliderXTouchmove,
        sliderAxisTouchend: this.sliderXTouchend,
      });
    },

    /*процесс перетаскивания ползунка оси X*/
    sliderXTouchmove(event) {
      /*если не происходит скроллирования, то и расчёты не будут произведены*/
      if(!this.dragging) {return}
      event.preventDefault();
      event.stopImmediatePropagation();

      /*если это touch событие, выбрать события первого касания*/
      event.changedTouches && (event = event.changedTouches[0]);
      /**/
      this.scrollContentStepX(
        /**/
        (event.clientX - this.startX)
        /**/
        / this.containerBoundingClientRect.width * 100,
        'draggingX'
      );
      /*обновление последнего event.clientX*/
      this.startX = event.clientX;
    },

    /*окончание перетаскивания ползунка оси X*/
    sliderXTouchend(event) {
      this.sliderTouchend({
        draggingAxisKey: 'draggingX',
        sliderAxisTouchmove: this.sliderXTouchmove,
        sliderAxisTouchend: this.sliderXTouchend,
      });
    },

    /*переместить ползунок скролл-панели оси X в заданную позицию*/
    scrollpaneXJump(event) {
      /**/
      this.scrollContentStepX(
        /**/
        (event.clientX - this.$refs.sliderX.getBoundingClientRect().left)
        /*разделить на*/
        / this.containerBoundingClientRect.width * 100
        /*вычесть половину ширины ползунка*/
        - (this.sliderXWidth / 2),
        'draggingX'
      );
      /*обновление последнего event.clientX*/
      this.startX = event.clientX;
    },

    /*скроллирование по оси X*/
    scrollContentStepX(/*шаг*/x, /*имя свойства говорящее о способе прокрутки*/way) {
      this.scrollContentStep({
        step: x,
        movementKey : 'movementX',
        contentSize : this.contentBoundingClientRect.width,
        endPoint: this.rightEnd,
        contentAxisKey: 'contentX',
        way,
      });
    },

    /*вычисление размеров ползунка X*/
    calculateSliderXWidth() {
      let
        sliderXWidth = this.containerBoundingClientRect.width / this.contentBoundingClientRect.width * 100
      ;
      this.sliderXWidth = sliderXWidth > 100 ? 100 : sliderXWidth;
      /*конечная граница справа*/
      this.rightEnd = Math.round(this.contentBoundingClientRect.width - this.containerBoundingClientRect.width);
      /*обновление положения скролл-панели и слайдера при изменении размеров контента или контейнера*/
      // this.scrollContentStepY(0, 'resizingX');
    },
  }


};
