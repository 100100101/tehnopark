<template>
  <!--v-if="show"-->
  <div
    ref="root"
    :class="{
      'trigger': true,
      active,
      'toggle': isToggle,
      disable,
    }"
    @mousedown="mousedown"
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
      v-if="effectOptions && !disable"
      type="ripple"
      trigger-ref="root"
      :trigger-refs="$refs"
      :append-to="effectSettings.appendTo"
      :not-subscribing-events="/*не подписывать триггер на события*/effectSettings.waitDoneEffect"
      :color="effectSettings.color"
      :styles="effectSettings.styles"
      :speed="effectSettings.speed"
      :is-centered="effectSettings.isCentred"
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
    /*модель состоящая из множества (массива) объектов данных есдиницы триггера*/
    model: {
      type: [Object, Array],
      // required: true,
    },

    /*объект данных единицы триггера, либо множество значений*/
    item: {
      type: [Object, Array],
      // required: true,
    },

    /*имя свойства/индекс элемента массива объекта данных триггера*/
    name: {
      type: [Number, String],
      // required: true,
    },

    /*выбрана ли пара - с индексом "name"*/
    checked: {
      type: Boolean,
      default: false,
    },

    /*может ли триггер открывать/скрывать свой контент, иначе может только открывать*/
    isToggle: {
      type: Boolean,
      default: false,
    },

    /*запрещёны ли нажатия на приггер*/
    disable: {
      type: Boolean,
      default: false,
    },

    /*нужно ли предотвращать обработку событий по умолчанию*/
    preventDefault: {
      type: Boolean,
      /*false - необходимо для отзывчивости внутренних компонентов, например, focus/blure поля*/
      default: true,
    },

    /*нужно ли останавливать всплытие и погружение события*/
    stopPropogation: {
      type: Boolean,
      /*false - необходимо для отзывчивости внутренних компонентов, например, focus/blure поля*/
      default: true,
    },

    /*имеет ли триггер эффект, опции эффекта*/
    effectOptions: {
      type: Object,
    },

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
      /**/
      set: this.item || this.model,
    }
  },

  /*COMPUTED*/
  computed: {
    /*компонент является функциональным*/
    isFunctional() {
      /*не задано ни модели ни имени*/
      return (!this.set && (typeof this.name !== 'number' && !this.name));
    },
    /*активен ли триггер*/
    active() {
      if(this.set && (typeof this.name === 'number' || this.name)) {
        return this.set[this.name];
      }
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

	/*WATCH*/
	watch: {
		// model: {
		// 	handler(newVal, odlVal) {
		// 		console.log('set(newVal, odlVal):', newVal, odlVal);
		// 	},
		// 	deep: true,
		// },
		item(newVal, odlVal) {
			console.log('set(newVal, odlVal):', newVal, odlVal);
		},
	},


  methods: {

		/*MOUSEDOWN*/
		mousedown($event) {
			console.log('mousedown');
			/*если работа триггера запрещена*/
      if(this.disable) return;
			/*привязка события снятия мыши*/
			document.addEventListener('mouseup', this.mouseup, /*захват на стадии погружения*/true);

      this.preventDefault && $event.preventDefault();
      this.stopPropogation && $event.stopImmediatePropagation();
      /*если сказанно ожидать завершения эффекта и это либо откр/закр триггер, либо не активный открывающий приггер*/
      if(this.hasEffect) {
        let
          /*выполнение эффекта*/
          effectHold = this.$refs.effect.handler.hold($event)
        ;
        /*если необходимо дождаться окончания эффекта*/
        if(this.effectSettings.waitDoneEffect) {
          effectHold
          /*выполнить функцию после завершения эффекта*/
          .done(
            () => {
              return this.check($event);
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

		},

		/*MOUSEUP*/
		mouseup($event) {
			console.log('mouseup');
			/*снятие обработчика события снятия мыши*/
			document.removeEventListener('mouseup', this.mouseup, true);
			/*если работа триггера запрещена*/
			if(this.disable) return;
			this.preventDefault && $event.preventDefault();
			this.stopPropogation && $event.stopImmediatePropagation();
			/*если сказанно ожидать завершения эффекта и это либо откр/закр триггер, либо не активный открывающий приггер*/
			if(this.hasEffect) {
				let
					/*прекращение эффекта*/
					effectHold = this.$refs.effect.handler.leave($event)
				;
				/*если не сказанно ожидать завершения эффекта*/
				if(!this.effectSettings.waitDoneEffect) {
					this.check($event);
				}
			/*иначе завершения эффекта ждать не нужно*/
			} else {
				this.check($event);
			}
			/*$refs.effect.handler.hold($event);*/
		},

    /*сделать активным / деактивировать*/
    check(event) {
			console.log('this.effectSettings:', this.effectSettings);
			// /*если это радио модель*/
			// if(!this.isToggle) {
			// 	/*найти в моделе активные пункты*/
			// 	/*имя свойства модели === число*/
			// 	if(typeof this.name === 'number') {
			// 		console.log("typeof this.name === 'number'");
			// 		/*если модель === массив*/
			// 		// if(!!~Object.prototype.toString.call(this.model).indexOf('Aray')) {
			// 		// 	this.model.filter((item, index) => {
			// 		//
			// 		// 	});
			// 		// }
			//
			// 		if(!!~Object.prototype.toString.call(this.model).indexOf('Array')) {
			// 			console.log("!!~Object.prototype.toString.call(this.model).indexOf('Aray')");
			// 			this.model.forEach((item, index, array) => {
			// 				console.log('item:', item);
			// 				let
			// 					value = item[this.name]
			// 				;
			// 				if(value) {
			// 					item[this.name] = false;
			// 				}
			// 			});
			// 		}
			//
			// 	}
			//
			// }
			//
			//
			// this.item[this.name] = true;
			//
			//
			// return;

			// event.stopPropagation();
      // event.preventDefault();

      /*если триггер может открывать и закрывать контнент*/
      // if(this.isToggle) {
      //   /*если активна - деактивировать*/
      //   if(this.model.active === this.name) {
      //     /*выход*/
      //     return this.deactivate();
      //   }
      // }
      // /*если не активна сделать активной*/
      // if(this.model.active !== this.name) {
      //   /*выход*/
      //   return this.activate();
      // }


			/*////*/

      /*если элемент только выполняет роль обёртки*/
      if(this.isFunctional) {return}
      this.active
      ?
      this.deactivate()
      :
      this.activate()
      ;
    },

    /*активировать вкладку*/
    activate() {
      /*если был передан ключ объекта*/
      if(typeof this.name === 'string') {
        this.set[this.name] = true;
      /*иначе был передан индекс элемента массива*/
      } else {
        this.set.splice(this.name, 1, true);
      }
      // let
      //   model = this.model
      //   ,name = this.name
      //   ,value = model[name]
      // ;
      // if(value !== undefined) {
      //   this.model[this.name] = true;
      // }
    },

    /*деактивировать вкладку*/
    deactivate() {
      /*если был передан ключ объекта*/
      if(typeof this.name === 'string') {
        this.set[this.name] = false;
      /*иначе был передан индекс элемента массива*/
      } else {
        this.set.splice(this.name, 1, false);
      }
    },

  },

  /*CREATED*/
  created() {

  },

  /*MOUNTED*/
  mounted() {
    // console.log(`window[chBox${this._uid}] = this:`, window[`chBox${this._uid}`] = this, this._uid);
    // let
    //   list = this.model.list
    // ;
    // /*если уже существует запись в моделе о паре - имя вкладки, контент */
    // if(this.name in list) {
    //   list[this.name].trigger = this;
    // /*иначе запись создаётся*/
    // } else {
    //   list[this.name] = {
    //     trigger: this
    //   };
    // }
    // this.tab = list[this.name];
    //
    // /*если в параметрах сказанно что триггер выбран*/
    // if(this.checked) {
    //   this.model.active = this.name;
    // }

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



		// this.$watch('item', () => {
		// 	console.log('change');
		// }, {
		//   deep: true
		// });

  },

	/*BEFORE DESTROY*/
	beforeDestroy() {
		/*снятие обработчика события снятия мыши*/
		document.removeEventListener('mouseup', this.mouseup, true);
	},
};
</script>

<style lang="scss" scoped>
  .trigger {
      &:not(.active):not(.disable),
      &.toggle:not(.disable) {
        cursor: pointer;
      }

      &.active:not(.disable):not(.toggle) {
        cursor: default;
      }
  }
</style>
