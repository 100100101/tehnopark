<template>
  <div
    class="slide-track"
    :style="{
      'background-color': '#ccc',
    }"
  >
    <!-- <div
      v-for="item in segments"
      class="segments"
      style=""
    >

    </div> -->

    <div
      v-for="(item, index) in sliders"
      :key="index"
      :ref="`slider${index}`"
      :class="`slider-_${index + 1}`"

      @touchstart.prevent.stop="sliderXTouchstart($event, item)"
      @touchmove.prevent.stop="sliderXTouchmove($event, item)"
      @touchend.prevent.stop="sliderXTouchend($event, item)"

      @mousedown.prevent.stop="sliderXTouchstart($event, item)"
      @mousemove.prevent.stop="sliderXTouchmove($event, item)"
      @mouseup.prevent.stop="sliderXTouchend($event, item)"

      :style="(() => {
        let
          style = {
            /*
              вся ширина делиться на заданное количество частей - находиться единичный отрезок,
              часть умножается на текущий индекс,
              вычитаеться половина ширины триггера
            */
            left: `-${parseFloat(item.width) / 2 + item.width.replace(/[^a-z]/g, '')}`,
            /*top: sliderTop(`slider${index}`),*/
            width: item.width,
            height: item.height,
            background: item.background,
            /*sliders['slider' + index].*/
            transform: `translateX(${movementX}px)`,
          }
        ;
        /*вычисление позиции ползунка по оси Y*/
        sliderTop(`slider${index}`);
        /*вычисление позиции ползунка по оси X*/
        return style;
      })()"
    >
    </div>

    <div
      v-for="(item, index) in triggers"
      :ref="index.toString()"
      :key="index"
      class="trigger"
      :style="(() => {
        let
          style = {
            /*
              вся ширина делиться на заданное количество частей - находиться единичный отрезок,
              часть умножается на текущий индекс,
              вычитаеться половина ширины триггера
            */
            left: `${(trackWidth / division * index) - triggerWidth / 2}px`,
            top: `-${triggerHeight / 2 - trackHeight / 2}px`,
            width: `${10}px`,
            height: `${10}px`,
          }
        ;
        return style;
      })()"
    >
      <div
        class="trigger__separator"
        :style="(() => {
          let
            style = {
              width: `${1}px`,
              height: `${100}%`,
              'background-color': '#ccc',
            }
          ;
          return style;
        })()"
      />

      <span
        class="trigger__value"
        :style="(() => {
          return {};
        })()"
      >
        <!-- весь диапозон разделить на текущий индекс и добавить начальную точку -->
        <!-- {{triggerCount / index * division}} -->
        {{index}}
      </span>

      <!-- @done="effectDone" -->
      <effect
        type="ripple"
        :trigger-ref="index.toString()"
        :trigger-refs="$refs"
        color="rgba(0, 240, 240, 0.3)"
        :is-centered="true"
      />

    </div>
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
    /*модель с настройками*/
    model: {
      type: Object,
      required: true,
    },

    /*начальная/минимальная точка слайдера*/
    start: {
      type: Number,
      default: 0
    },

    /*конечная/максимальная точка слайдера*/
    finish: {
      type: Number,
      default: 100,
    },

    /*цена деления слайдера*/
    division: {
      type: [Number, String],
      default: 10,
    },

    /*размер одного шага*/
    onestepDistance: {
      type: Number,
      default: 1,
    },
    /*стандартная ширина всех слайдеров*/
    sliderWidth: {
      type: String,
      default: '10px',
    },
    /*стандартная высота всех слайдеров*/
    sliderHeight: {
      type: String,
      default: '10px',
    },
    /**/


  },

  /*DATA*/
  data() {
    return {
      /**/
      slider: {
        '1': {
          x: 0,
        },
      },
      /**/
      movementX: 0,

      /*ширина полного трека*/
      trackWidth: 0,
      /*высота полного трека*/
      trackHeight: 0,
      /*ширина триггера*/
      triggerWidth: 10,
      /*высота триггера*/
      triggerHeight: 10,
      /*предустановки ползунка*/
      sliderPresetOptions: {
        start: this.start,
        min: this.start,
        max: this.finish,
        width: this.sliderWidth,
        height: this.sliderHeight,
        background: 'inherit',
      },
      /**/
      slidersIndication: [],

    };
  },

  /*COMPUTED*/
  computed: {
    /*триггеры*/
    triggers() {
      let
        triggers = []
      ;
      for(let i = -1; i < this.triggerCount; i++) {
        triggers.push(i);
      }
      return triggers;
    },

    /*количество триггеров*/
    triggerCount() {
      /*округлить до меньшего*/
      return Math.floor((this.finish - this.start) / this.division)
    },

    /*ползунки*/
    sliders() {
      let
        slidersList = this.model.sliders.list
        ,slidersOverall = this.model.sliders.overall
      ;
      /*если не задан массив с параметрами ползунков - создаётся один с параметрами по умолчанию*/
      return (slidersList || [{}]).reduce((previousValue, currentValue, index, array) => {
        /*заполнение массива ползунками с объеденёнными параметрами*/
        return previousValue.concat(
          Object.assign(
            this.sliderPresetOptions,
            /*повести слияние общах пользовательских настроек ползунков с единичным*/
            Object.assign(
              slidersOverall,
              currentValue
            )
          )
        );
      }, []);
    },


    /*полный диапозон*/
    fullRange() {
      return this.finish - this.start;
    },

    /**/
    segments() {
      return [1, 2, 3];
    },
  },



  /*METHODS*/
  methods: {
    /**/
    sliderTop(ref) {
      /*подождать отрисовки элемента*/
      this.$nextTick(() => {
        let
          slider = this.$refs[ref][0]
        ;
        if(!slider) {return}
        let
          sliderHeight = slider.clientHeight
        ;
        /**/
        this.$refs[ref][0].style.top = `-${sliderHeight / 2 - this.trackHeight / 2}px`;
      });
    },
    /**/
    updateContainerSize(el) {
      console.log('updateContainerSize el:', el);
      window.elmtn = el
      if(!el) {return}
      /*ширина контейнера*/
      this.trackWidth = el.clientWidth;
      /*высота контейнера*/
      this.trackHeight = el.clientHeight;
      /*ширина первого пазделителя*/
      // this.triggerWidth = this.$refs[0][0].clientWidth;
      // this.triggerWidth = 10;
      /*высота первого пазделителя*/
      // this.triggerHeight = 10;
      /*если есть слушатеьл, уведомить подительские компоненты о изменении размера контейнера*/
      this.$emit('resize');
      /**/
    },



    sliderXTouchstart (event) {
      /*если это мобильное событие*/
      if(event.changedTouches) {
        /*если это touch событие, выбрать события первого касания*/
        event = event.changedTouches[0];
      /*иначе это десктопное событие*/
      } else {
        /*добавление слушателя за движением мышы*/
        document.addEventListener('mousemove', this.sliderXTouchmove, false);
        /*добавление слушателя за mouseup*/
        document.addEventListener('mouseup', this.sliderXTouchend, false);
      }
      /*выставить статус события перетаскивания - выполняется перемещение контента*/
      this.dragging = true;
      /**/
      this.slider['1'].x = event.clientX;
    },

    /**/
    sliderXTouchmove(event) {
      /*если не происходит скроллирования, то и расчёты не будут произведены*/
      if(!this.dragging) {return}
      /*если это touch событие, выбрать события первого касания*/
      event.changedTouches && (event = event.changedTouches[0]);
      /**/
      this.scrollContentStepX(
        /**/
        (event.clientX - this.slider['1'].x)
        /**/
        / this.trackWidth * 100
      );
      /*обновление последнего event.clientX*/
      this.slider['1'].x = event.clientX;
    },

    /**/
    sliderXTouchend(event) {
      /**/
      document.removeEventListener('mousemove', this.sliderXTouchmove);
      /**/
      document.removeEventListener('mouseup', this.sliderXTouchend);
      /*выставить статус события перетаскивания - не выполняется перемещение контента*/
      this.dragging = false;
    },

    /**/
    // scrollpaneXJump(event) {
    //   /**/
    //   this.scrollContentStepX(
    //     /**/
    //     (event.clientX - this.$refs.sliderX.getBoundingClientRect().left)
    //     /*разделить на*/
    //     / this.trackWidth * 100
    //     /*вычесть половину ширины ползунка*/
    //     - (this.sliderXWidth / 2)
    //   );
    //   /*обновление последнего event.clientX*/
    //   this.start.x = event.clientX;
    // },

    /*скроллирование по оси X*/
    scrollContentStepX(x) {
      /*округлить до ближайшего целого*/
      x = Math.round(((this.movementX + x) / 100) * this.trackWidth);

      /*максимально возможная прокрутка вправо*/
      if(x > this.rightEnd) {
        x = this.rightEnd;
      /*максимально возможная прокрутка влево*/
      } else if(x < 0) {
        x = 0
      }
      /*обновление положения*/
      this.movementX = x / this.trackWidth * 100;
    },

    /**/


  },

  /*BEFORE CREATE*/
  beforeCreate() {

  },

  /*MOUNTED*/
  mounted() {
    console.log('mounted window.slider = this:', window.slider = this);
    elementResizeDetectorMaker
    /*отслеживание изменений размера блока контейнера*/
    elementResizeDetectorMaker.listenTo(this.$el, this.updateContainerSize);


  },
  /*BEFORE DESTROY*/
  beforeDestroy() {
    /*удаление отслеживания изменений размера блока контейнера*/
    elementResizeDetectorMaker.removeListener(this.$el, this.updateContainerSize);
  },

}
</script>

<style lang="scss" scoped>
  .slide-track {
    position: relative;
  }
    .trigger {
      position: absolute;
      cursor: pointer;
      visibility: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
        > * {
          visibility: visible;
        }
    }

      /*SLIDER*/
      [class*='slider-_'] {
        position: absolute;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1;
      }

      /*SEPARATOR*/
      .trigger__separator {
        border-radius: 50%;
        overflow: hidden;
          &:before, &:after {
            content: '';
            position: absolute;
          }

          &:before {

          }

          &:after {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
      }
        .trigger__value {
          font-size: 9px;
          position: absolute;
          top: 100%;
        }
</style>
