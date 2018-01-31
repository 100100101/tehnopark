<template>
  <div
    :class="{
      [$options.name]: true,
      '_fixed': position === 'fixed',
      [column ? '_column' : '_row']: true,
    }"
    :style="{
      /*zIndex,*/
      visibility: overlayVisibility ? 'visible' : 'hidden',
    }"
  >
    <div class="panel-controls">
      <button-trigger
        type="circular"
        class="panel-control__close"
        @effect-done="$emit('close')"
      >
        <!-- <icon
          type="close"
          :options="{
            /* effectDoneCallback: closeEffectDoneCallback, */
            /**/
            size: '10px',
            /**/
            backgroundColor: '#fff',
            }"
            class="header__close"
          /> -->
          ×
      </button-trigger>
      <!-- <square class="panel-control_test">
        _
      </square>
      <square class="panel-control_close">
        x
      </square> -->
    </div>



    <template v-if="$slots.cell1 || $slots.cell2">
      <div class="cell1">
        <slot name="cell1"/>
      </div>
      <div class="cell2">
        <div class="cell2__wrapper">
          <slot name="cell2"/>
        </div>
      </div>
    </template>
    <slot v-else name="default"/>

  </div>
</template>

<script>
export default {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*PROPS*/
  props: {

    /*открыто ли окно изначально*/
    isOpen: {
      type: Boolean,
      default: false,
    },

    /**/
    // zIndex: {
    //   type: Number,
    //   default: 1,
    // },

    /*существует ли перекрытие нижних слоёв*/
    overlayVisibility: {
      type: Boolean,
      default: true,
    },

    /*позиция окна*/
    position: {
      type: String,
      default: 'relative',
      validate(value) {
        return !~['fixed', 'absolute', 'relative'].indexOf(value);
      }
    },

    /*куда порталить окно*/
    portalTo: {
      type: String,
    },

    /*находиться ли окно в портале*/
    inPortal: {
      type: Boolean,
      default: false,
    },

    /**/
    column: {
      type: Boolean,
      default: true,
    },

  },

  /*DATA*/
  data() {
    return {
      // parentComponent: null,
      /**/
      parentElement: null,
      /*текущее состояние видимости окна*/
      show: this.isOpen,
      /*//////*/
      tabs: {
        /*выбранная пара - триггер, контент*/
        active: NaN,
        list: {},
      },
      /*//////*/

    };
  },

  /*COMPUTED*/
  computed: {
    /*вычислить необходимость показа окна*/
    // show() {
    //   /*если сказанно от родителя */
    //   return this.isOpen || this.currentStateIsOpen;
    // },

    /*будуший родительский компонент окна. Если не указан - родительским компонентом является родительский инстанс*/
    component() {
      return /*this.parent.component ||*/ this;
    },

    container() {
      return this.$nextTick(() => {
        let
          ref = this.parent.ref
          ,element = this.parent.element
        ;
        if(ref) {
          return this.component[ref]
        }

        if(element) {
          return element;
        }

        /**/
        return this.component.$el.parentElement;
      });
    }

  },

  /*WATCH*/
  watch: {

  },

  /*METHODS*/
  methods: {

    /*открыть*/
    open() {
      this.show = true;
    },

    /*закрыть*/
    close() {
      this.show = false;
    },

    /*открыть закрытое / закрыть открытое*/
    toggle() {
      this.show = !this.show;
    },

    /*сменить родительский компонент*/
    // changeParentComponent(element) {
    //   console.log(element);
    //   element.append(this.$el);
    // },

  },

  /**/
  beforeUpdate() {
    console.log('beforeUpdate ' + this.$options.name);
  },

  /*CREATED*/
  created() {

  },

  /*MOUNTED*/
  mounted() {
    /*NOTE: delete*/
    window.wind = this;
    /*/NOTE: delete/*/
    let
      /*указанный родительский элемент окна*/
      element = this.inElement
    ;
  },

};
</script>

<style lang="scss" scoped>
    /*окно*/
    .window {
      // background: #fff;
      // visibility: visible;
      // max-width: 100%;
      // background: rgba(97, 129, 167, 0.57);
      display: flex;
      justify-content: center;
      align-items: center;
      // border: 1px solid #000;
      padding: 10px;
        /*модификация фиксированного окна*/
        &._fixed {
          position: fixed;
          width: 100vw;
          height: 100vh;
        }
        /*модификация не фиксированного окна*/
        &:not(._fixed) {
          // width: 100%;
          // height: 100%;
        }
        &._relative {
          position: relative;
        }
        &._column {
          flex-direction: column;
        }
    }
      .panel-controls {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }
        [class*='panel-control__'] {
          max-width: 15px;
          background: #ccc;
          // width: 10px;
            &:not(:first-child) {
              margin-left: 5px;
            }
        }
        .panel-control__close {
          color: #fff;
          text-indent: 1px;
          margin-top: 1px;
          /deep/ .square-content {
            margin-top: 1px;
          }
        }

      .cell1 {
        flex-shrink: 0;
      }
      .cell2 {

      }
        .cell2__wrapper {

        }
</style>
