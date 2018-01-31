<template>
  <div class="nav">
    <!--AXIS-X-->
    <div
      v-if="$parent.scrollAbilityX"
      class="nav__axis-x"
    >
      <!--LEFT-->
      <div
        :class="{
          'nav__side_left': true,
          'decor': !$parent.pressureOnLeft,
        }"
      >
        <span class="decor-line1"/>
        <div
          class="nav__side-circle-wrapper"
          :style="{
            'width': circleSize,
            'height': circleSize,
          }"
        >
          <div
            class="nav__side-circle"
            v-on="
              /*привязать необходимые обработчики событий именно для данного триггера*/
              setEventListeners('left')
            "
          >
            <!-- <icon
              type="arrow"
              :options="{
                side: 'left',
                backgroundColor: 'rgba(43, 43, 43, 0.85)',
                color: 'rgba(43, 43, 43, 0.85)',
              }"
              class="nav__arrow_left"
            /> -->
          </div>
        </div>
        <span class="decor-line2"/>
      </div>

      <!--RIGHT-->
      <div
        :class="{
          'nav__side_right': true,
          'decor': !$parent.pressureOnRight,
        }"
      >
        <span class="decor-line1"/>
        <div
          class="nav__side-circle-wrapper"
          :style="{
            'width': circleSize,
            'height': circleSize,
          }"
        >
          <div
            class="nav__side-circle"
            v-on="
              /*привязать необходимые обработчики событий именно для данного триггера*/
              setEventListeners('right')
            "
          >
            <!-- <icon
              type="arrow"
              :options="{
                side: 'right',
                backgroundColor: 'rgba(43, 43, 43, 0.85)',
                color: 'rgba(43, 43, 43, 0.85)',
              }"
              class="nav__arrow_right"
            /> -->
          </div>
        </div>
        <span class="decor-line2"/>
      </div>

    </div>

    <!--AXIS Y-->
    <div
      v-if="$parent.scrollAbilityY"
      class="nav__axis-y"
    >
      <!--TOP-->
      <div
        :class="{
          'nav__side_top': true,
          'disable': $parent.pressureOnTop,
          'decor': !$parent.pressureOnTop,
        }"
      >
        <span class="decor-line1"/>
        <div
          class="nav__side-circle-wrapper"
          :style="{
            'width': circleSize,
            'height': circleSize,
          }"
        >
        <!-- v-on="
        /*привязать необходимые обработчики событий именно для данного триггера*/
        setEventListeners('top')
        " -->
          <div
            ref="circle-top"
            class="nav__side-circle"
            @click.capture="mousedown($event, 'top')"
          >
            <!-- <icon
              type="arrow"
              :options="{
                side: 'top',
                backgroundColor: 'rgba(43, 43, 43, 0.85)',
                color: 'rgba(43, 43, 43, 0.85)',
              }"
              class="nav__arrow_top"
            /> -->
          </div>
        </div>
        <span class="decor-line2"/>
      </div>

      <!--BOTTOM-->
      <div
        :class="{
          'nav__side_bottom': true,
          'disable': $parent.pressureOnBottom,
          'decor': !$parent.pressureOnBottom,
        }"
      >
        <span class="decor-line1"/>
        <div
          class="nav__side-circle-wrapper"
          :style="{
            'width': circleSize,
            'height': circleSize,
          }"
        >
          <div
            class="nav__side-circle"
            v-on="
              /*привязать необходимые обработчики событий именно для данного триггера*/
              setEventListeners('bottom')
            "
          >
            <!-- <icon
              type="arrow"
              :options="{
                side: 'bottom',
                backgroundColor: 'rgba(43, 43, 43, 0.85)',
                color: 'rgba(43, 43, 43, 0.85)',
              }"
              class="nav__arrow_bottom"
            /> -->
          </div>
        </div>
        <span class="decor-line2"/>
      </div>

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
    // name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
    name: 'navigation',

    /*PROPS*/
    props: {
      /*размер окружности триггера скролла*/
      circleSize: {
        type: String,
        default: '20px',
      },
    },

    /*COMPUTED*/
    computed: {

    },

    /**/
    data () {
      return {
        /*считать что происходит удерживание по прошествию указаных миллисекунд*/
        holdAfterTimeMs: 300,
        /*это зажатие с удержанием*/
        isHold: false,
        /**/
      };
    },

    /*METHODS*/
    methods: {

      /*установка обработчиков собитий */
      setEventListeners(side) {
        return {
          /*нажатие мыши на триггере*/
          mousedown: event => {
            console.log('mousedown | event, event.eventPhase, event.currentTarget, event.target:', event, event.eventPhase, event.currentTarget, event.target);
            /*установить соответствующий вид курсора на весь документ*/
            let
              cursor
            ;
            switch (side) {
              /*если вызывается триггер 'вверх'*/
              case 'top':
                /*контент упёрся в верхнюю границу*/
                if(this.$parent.pressureOnTop) return;
                cursor = 'n-resize';
              break;
              /*если вызывается триггер 'вправо'*/
              case 'right':
                /*контент упёрся в правую границу*/
                if(this.$parent.pressureOnRight) return;
                cursor = 'e-resize';
              break;
              /*если вызывается триггер 'вниз'*/
              case 'bottom':
                /*контент упёрся в нижнюю границу*/
                if(this.$parent.pressureOnBottom) return;
                cursor = 's-resize';
              break;
              /*если вызывается триггер 'влево'*/
              case 'left':
                /*контент упёрся в левую границу*/
                if(this.$parent.pressureOnLeft) return;
                cursor = 'w-resize';
              break;
            };

            /*предотвращение событий по умолчанию (например выделения контента)*/
            event.preventDefault();
            /*предотвратить выполнение любых других обработчиков на данном элименте, на дочерних и родительских*/
            event.stopImmediatePropagation();
            // event.stopPropagation();

            /*установка обработчика события отжатия миши глобально, для избежания пропуска снятия обработчика нажатия, при уходе указателя вне зону элимента-триггера*/
            document.addEventListener('mouseup', this.mouseup, /*true - начать захват*/true);

            /*уведомить родительский элимент онажатии на триггер, передать имя нажатой стороны*/
            this.$emit('mousedown', side);
            /*если callback таймера успеет выполниться не раньше чем через заданное время - считать что происходит удержание*/
            this.holdTimeout = setTimeout(() => {
              /*установка статуса удерживания*/
              this.isHold = true;
              /*уведомить родительский элимент об установке статуса удерживания*/
              this.$emit('hold');
            }, this.holdAfterTimeMs);

            // document.documentElement.style.cursor = /*event.target.style.cursor*/cursor;
            // document.documentElement.style.setProperty ('cursor', cursor, 'important');
            let
              overlay = this.$root.$refs.overlay
            ;
            /*показать слой наложения*/
            overlay.show();
            /*задания вида курсора наложения*/
            overlay.$el.style.cursor = cursor;

            /*передача события и имени стороны триггера обработчику*/
            // return this.mousedown(event, side);
          },
          // mouseup: this.mouseup,
        };
      },

      /*нажатие мыши на триггере (обработка на статии погружения)*/
      mousedown(event, side) {


        /*установить соответствующий вид курсора на весь документ*/
        let
          cursor
        ;
        switch (side) {
          /*если вызывается триггер 'вверх'*/
          case 'top':
            /*контент упёрся в верхнюю границу*/
            if(this.$parent.pressureOnTop) return;
            cursor = 'n-resize';
          break;
          /*если вызывается триггер 'вправо'*/
          case 'right':
            /*контент упёрся в правую границу*/
            if(this.$parent.pressureOnRight) return;
            cursor = 'e-resize';
          break;
          /*если вызывается триггер 'вниз'*/
          case 'bottom':
            /*контент упёрся в нижнюю границу*/
            if(this.$parent.pressureOnBottom) return;
            cursor = 's-resize';
          break;
          /*если вызывается триггер 'влево'*/
          case 'left':
            /*контент упёрся в левую границу*/
            if(this.$parent.pressureOnLeft) return;
            cursor = 'w-resize';
          break;
        };

        /*предотвращение событий по умолчанию (например выделения контента)*/
        event.preventDefault();
        /*предотвратить выполнение любых других обработчиков на данном элименте, на дочерних и родительских*/
        event.stopImmediatePropagation();
        // event.stopPropagation();
        // document.captureEvents(Event.MOUSEUP|Event.MOUSEDOWN);

        console.log('mousedown | event, event.eventPhase, event.currentTarget, event.target:', event, event.eventPhase, event.currentTarget, event.target);

        /*установка обработчика события отжатия миши глобально, для избежания пропуска снятия обработчика нажатия, при уходе указателя вне зону элимента-триггера*/
        document.addEventListener('mouseup', this.mouseup, /*true - начать захват*/true);

        /*уведомить родительский элимент онажатии на триггер, передать имя нажатой стороны*/
        this.$emit('mousedown', side);
        /*если callback таймера успеет выполниться не раньше чем через заданное время - считать что происходит удержание*/
        this.holdTimeout = setTimeout(() => {
          /*установка статуса удерживания*/
          this.isHold = true;
          /*уведомить родительский элимент об установке статуса удерживания*/
          this.$emit('hold');
        }, this.holdAfterTimeMs);

        // document.documentElement.style.cursor = /*event.target.style.cursor*/cursor;
        // document.documentElement.style.setProperty ('cursor', cursor, 'important');
        let
          overlay = this.$root.$refs.overlay
        ;
        /*показать слой наложения*/
        overlay.show();
        /*задания вида курсора наложения*/
        overlay.$el.style.cursor = cursor;

        /*передача события и имени стороны триггера обработчику*/
        // return this.mousedown(event, side);
      },


      /*отжатие мыши с триггера*/
      mouseup(event) {
        console.log('mouseup');
        /*удаление обработчика события отжатия миши глобально*/
        document.removeEventListener('mouseup', this.mouseup, /*true - захват*/true);

        /*снять установленный ранее вид курсора глобольно*/
        // document.documentElement.style.cursor = '';
        /*спрятать глобальное наложение*/
        let
          overlay = this.$root.$refs.overlay
        ;
        /*спрятать слой наложения*/
        overlay.hide();
        /*задания вида курсора наложения*/
        overlay.$el.style.cursor = '';

        /*уведомить родительский элимент отжатии с триггера*/
        this.$emit('mouseup');
        let
          holdTimeout = this.holdTimeout
        ;
        /*удаление таймера удерживания если существует*/
        if(holdTimeout) {
          clearTimeout(holdTimeout);
        }
        /*если был дан стасус удерживания*/
        if(this.isHold) {
          /*снятие статуса удерживания*/
          this.isHold = false;
          /*уведомить родительский элимент о снятии статуса удерживания*/
          this.$emit('unhold');
        }

      },

    },

    /*MOUNTED*/
    mounted() {

    },

    /*BEFORE DESTROY*/
    beforeDestroy() {
      /*удаление обработчика события отжатия миши глобально, пытаться для гарантированного снятия, даже если не существует*/
      document.removeEventListener('mouseup', this.mouseup, /*true - захват*/true);
    },
  };
</script>

<style lang="scss" scoped>
$transition-duration: .4s;
/**/
$nav__side--w-h: 25px;
$border-color: rgba(34, 175, 189, 0.5);
$nav__side-circle--visible-part: 45%;
$nav__side-circle--visible-part_mouseenter: 35%;
/**/
$nav-decor-line--length: 25%;
$nav-decor-line--max-length: 30px;
$nav-decor-line--fatness: 1px;
/**/
$decor-line--background-size_length: 10px;
/**/
  .nav {
    // position: absolute;
    position: fixed;
    // height: 100%;
    // width: 100%;
    visibility: hidden;
    display: flex;
    justify-content: space-between;
    top: 0;
    left: 0;
    z-index: 1;
    overflow: hidden;
    align-items: center;
  }

  /*наведение на контейнер мыши*/
  .container-mouseenter {
    .nav__side_top {
        .nav__side-circle {
          transform: translateY(-$nav__side-circle--visible-part_mouseenter);
        }
    }
    .nav__side_right {
        .nav__side-circle {
          transform: translateX($nav__side-circle--visible-part_mouseenter);
        }
    }
    .nav__side_bottom {
        .nav__side-circle {
          transform: translateY($nav__side-circle--visible-part_mouseenter);
        }
    }
    .nav__side_left {
        .nav__side-circle {
          transform: translateX(-$nav__side-circle--visible-part_mouseenter);
        }
    }
  }

    [class*='nav__axis-'] {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
    }
      /*AXIS X*/
      .nav__axis-x {
          [class*='nav__side_'] {
            height: 100%;
            flex-direction: column;
          }
          [class*='decor-line'] {
            width: $nav-decor-line--fatness;
            height: 100%;
            flex-direction: column;
              &:before {
                width: $nav-decor-line--fatness;
                height: $nav-decor-line--length;
                max-height: $nav-decor-line--max-length;
              }
              &:after {
                height: 100%;
                background-image: linear-gradient(0deg, transparent 50%, $border-color 50%);
                background-repeat: repeat-y;
                background-size: $nav-decor-line--fatness $decor-line--background-size_length;
                background-position-x: left;
              }

          }
          .decor-line1 {
              &:before {
                background: linear-gradient(0deg, $border-color -50%, transparent 100%);
              }
              &:after {
                background-position-y: top;
              }
          }

          .decor-line2 {
              &:before {
                background: linear-gradient(180deg, $border-color -50%, transparent 100%);
              }
              &:after {
                background-position-y: $decor-line--background-size_length / 2;
              }
          }
      }

      /*AXIS Y*/
      .nav__axis-y {
        flex-direction: column;
        [class*='nav__side_'] {
          width: 100%;
        }
        [class*='decor-line'] {
          width: 100%;
          height: $nav-decor-line--fatness;
            &:before,
            &:after {

            }
            &:before {
              width: $nav-decor-line--length;
              height: $nav-decor-line--fatness;
              max-width: $nav-decor-line--max-length;
            }
            &:after {
              width: 100%;
              background-image: linear-gradient(90deg, transparent 50%, $border-color 50%);
              background-repeat: repeat-x;
              background-size: $decor-line--background-size_length $nav-decor-line--fatness;
              background-position-y: top;
            }
        }
        .decor-line1 {
            &:before {
              background: linear-gradient(-90deg, $border-color -50%, transparent 100%);
            }
            &:after {
              background-position-x: $decor-line--background-size_length / 2;
            }
        }

        .decor-line2 {
            &:before {
              background: linear-gradient(90deg, $border-color -50%, transparent 100%);
            }
            &:after {
              background-position-x: right;
            }
        }

      }

        [class*='nav__side_'] {
          z-index: 1;
          position: relative;
          visibility: visible;
          // height: $nav__side--w-h;
          display: flex;
          justify-content: center;
          overflow: hidden;
          visibility: hidden;
            /*если не доступно для манипуляций*/
            &.disable {
              opacity: .5;
                .nav__side-circle {
                  cursor: not-allowed;
                }
            }
            /*если не декорируется*/
            &:not(.decor) {
                [class*='decor-line'] {
                    &:after {
                      visibility: hidden;
                    }
                }
            }
        }
          [class*='decor-line'] {
            visibility: visible;
            display: flex;
              &:before,
              &:after {
                content: '';
              }
              &:after {

              }
              &:before {
                flex-shrink: 0;
              }
          }
          .decor-line1 {
              &:before {
                order: 1;
              }
          }

          .decor-line2 {
              &:before {
              }
          }
          .nav__side-circle-wrapper {
            flex-shrink: 0;
          }
            .nav__side-circle {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 1px solid $border-color;
              visibility: visible;
              // background: rgba(255, 255, 255, 0.9);
              background: rgba(34, 175, 189, 0.5);
              transition: $transition-duration;
            }
              [class*='nav__arrow'] {

                  /deep/ [class*='arrow__el'] {

                  }
              }

        /*TOP*/
        .nav__side_top {
          cursor: n-resize;
          align-items: flex-start;
            &:before,
            &:after {

            }
            &:before {

            }
            &:after {

            }
            .nav__side-circle-wrapper {

            }
            .nav__side-circle {
              transform: translateY(-$nav__side-circle--visible-part);
            }
        }
          .nav__arrow_top {

          }

        /*RIGHT*/
        .nav__side_right {
          cursor: e-resize;
          align-items: flex-end;
            &:before,
            &:after {

            }
            &:before {

            }
            &:after {

            }
            .nav__side-circle-wrapper {

            }
            .nav__side-circle {
              transform: translateX($nav__side-circle--visible-part);
            }
        }
          .nav__arrow_right {

          }

        /*BOTTOM*/
        .nav__side_bottom {
          cursor: s-resize;
          align-items: flex-end;
            &:before,
            &:after {

            }
            &:before {

            }
            &:after {

            }
            .nav__side-circle-wrapper {

            }
            .nav__side-circle {
              transform: translateY($nav__side-circle--visible-part);
            }
        }
          .nav__arrow_bottom {

          }

        /*LEFT*/
        .nav__side_left {
          cursor: w-resize;
            &:before,
            &:after {

            }
            &:before {

            }
            &:after {

            }
            .nav__side-circle-wrapper {

            }
            .nav__side-circle {
              transform: translateX(-$nav__side-circle--visible-part);
            }
        }
          .nav__arrow_left {

          }

</style>
