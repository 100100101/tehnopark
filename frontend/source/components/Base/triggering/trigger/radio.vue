<template>
  <!--v-if="show"-->
  <div
    ref="root"
    :class="{
      'trigger': true,
      active,
      ['toggle']: isToggle,
    }"
    @mousedown="function($event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();
      /*если сказанно ожидать завершения эффекта и это либо откр/закр триггер, либо не активный открывающий приггер*/
      if(hasEffect) {
        let
          /*выполнение эффекта*/
          effectHold = $refs.effect.handler.hold($event)
        ;
        /*если необходимо дождаться окончания эффекта*/
        if(effectSettings.waitDoneEffect) {
          effectHold
          /*выполнить функцию после завершения эффекта*/
          .done(
            () => {
              return check($event);
            }
          );
        }
        /*если сказанно ожидать завершения эффекта*/


      }
      /*let
        mouseleaveHandler = function() {
          $refs.effect.handler.leave($event);
          $event.target.removeEventListener('mouseleave', mouseleaveHandler, false);
        }
      ;
      $event.target.addEventListener('mouseleave', mouseleaveHandler, false);*/
    }"


    @mouseup="function($event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();
      /*если сказанно ожидать завершения эффекта и это либо откр/закр триггер, либо не активный открывающий приггер*/
      if(hasEffect) {
        let
          /*прекращение эффекта*/
          effectHold = $refs.effect.handler.leave($event)
        ;
        /*если не сказанно ожидать завершения эффекта*/
        if(!effectSettings.waitDoneEffect) {
          check($event);
        }
      /*иначе завершения эффекта ждать не нужно*/
      } else {
        check($event);
      }
      /*$refs.effect.handler.hold($event);*/

    }"
  >
  <!-- @click="function($event) {
    /*если сказанно ожидать завершения эффекта*/
    if(effectSettings.waitDoneEffect) {
      /*если сказанно ожидать завершения эффекта*/
      $refs.effect.handler.hold($event);
      $refs.effect.handler.leave($event);
      /*иначе просто выполнить*/
    } else {
      return check($event);
    }
  }" -->
    <!---->
    <slot/>
    <!---->
    <effect
      ref="effect"
      v-if="effectOptions"
      type="ripple"
      trigger-ref="root"
      :trigger-refs="$refs"
      :append-to="effectSettings.appendTo"
      :not-subscribing-events="/*не подписывать триггер на события*/effectSettings.waitDoneEffect"
      :color="effectSettings.color"
      :style="effectSettings.style"
      :speed="effectSettings.speed"
    />
  </div>
  <!--/*callback завершения эффекта*/-->
</template>

<script>
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /**/
  // model: {
  //   prop: 'v-if',
  //   event: 'click',
  // },

  /*PROPS*/
  props: {
    /**/
    name: {
      type: Number,
      required: true,
    },

    /**/
    model: {
      type: Object,
      required: true,
    },

    /*выбрана ли пара - с индексом "position"*/
    checked: {
      type: Boolean,
      default: false,
    },

    /*может ли триггер открывать/скрывать свой контент, иначе может только открывать*/
    isToggle: {
      type: Boolean,
      default: false,
    },

    /*имеет ли триггер эффект, опции эффекта*/
    effectOptions: {
      type: Object,
    }

  },

  /*DATA*/
  data() {
    return {
      /*предустановки эффекта*/
      effectPreset: {
        waitDoneEffect: false,
      },

      // show: false,
      /*активна ли вкладка*/
      // active: false,
      /**/
    }
  },

  /*COMPUTED*/
  computed: {
    /*сделать данный триггер активным*/
    active() {
      return this.position === this.model.active;
    },

    /*объеденённые настройки эффекта*/
    effectSettings() {
      return this.effectOptions ?
      Object.assign(this.effectPreset, this.effectOptions)
      :
      null
      ;
    },

    /*нужен ли эффект в текущих условиях*/
    hasEffect() {
      /*если сказанно применять передачей настроек и (это переключаемый триггер или (это не переключаемый триггер и он не активен))*/
      return this.effectSettings && (this.isToggle || (!this.isToggle && !this.active));
    },

  },

  methods: {
    /*сделать активным / деактивировать*/
    check(event) {
      // event.stopPropagation();
      // event.preventDefault();

      /*если триггер может открывать и закрывать контнент*/
      if(this.isToggle) {
        /*если активна - деактивировать*/
        if(this.model.active === this.position) {
          /*выход*/
          return this.deactivate();
        }
      }
      /*если не активна сделать активной*/
      if(this.model.active !== this.position) {
        /*выход*/
        return this.activate();
      }
      // this.check();
    },

    /*активировать вкладку*/
    activate() {
      this.model.active = this.position;
      /**/
      // this.model.activeList.push(this.position);
    },

    /*деактивировать вкладку*/
    deactivate() {
      this.model.active = undefined;
      /**/
      // let
      //   activeAmong = this.model.activeList.indexOf(this.position)
      // ;
      // if(!~activeAmong) {
      //   this.model.activeList.splice(this.position, 1);
      // }
    },

  },

  /*CREATED*/
  created() {

  },

  /*MOUNTED*/
  mounted() {
    let
      list = this.model.list
    ;
    /*если уже существует запись в моделе о паре - имя вкладки, контент */
    if(this.position in list) {
      list[this.position].trigger = this;
    /*иначе запись создаётся*/
    } else {
      list[this.position] = {
        trigger: this
      };
    }
    this.tab = list[this.position];

    /*если в параметрах сказанно что триггер выбран*/
    if(this.checked) {
      this.model.active = this.position;
    }

    /*сообщить родительским компонентам о готовности*/

    /*добавить пару - имя вкладки, содержимое в список всех вкладок*/

    // this.$root.carLifeTabs.push({
    //   title: this,
    //   content: this.$props.refs[this.$props.containerRefName],
    // });


    /*если необходимо поместиьт элемент в указанный контейнер - вставка текущего элемента в контейнер*/
    // if(this.containerRefName) {
    //   this.$props.refs[this.containerRefName].append(this.$el);
    // }
    /*показать элемент*/
    // this.show = true;
  },
};
</script>

<style lang="scss" scoped>
  .trigger {
      &:not(.active),
      &.toggle {
        cursor: pointer;
      }
  }
    .active {
      cursor: default;
    }
</style>
