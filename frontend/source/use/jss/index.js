// import Vue from 'vue';
/*JSS global instance*/
// import {Observable} from 'rxjs/Observable';
/*JSS*/
/*{SheetsManager}*/
	import jss, {SheetsManager} from 'jss';
	import template from 'jss-template';
	import global from 'jss-global';
	import extend from 'jss-extend';
	import nested from 'jss-nested';
	import compose from 'jss-compose';
	import camelCase from 'jss-camel-case';
	import defaultUnit from 'jss-default-unit';
	import expand from 'jss-expand';
	import vendorPrefixer from 'jss-vendor-prefixer';
	import propsSort from 'jss-props-sort';
	/*переменные*/
	import themeManager from './theme-manager'
/*/JSS/*/
/*USE*/
jss
	/**/
	.use(template())
	/**/
	.use(global())
	/**/
	.use(extend())
	/**/
	.use(nested())
	/**/
	.use(compose())
	/**/
	.use(camelCase())
	/*единицы измерения для свойств по умолчанию*/
	.use(defaultUnit({
	  'line-height': 'rem',
	  'font-size': 'rem',
	}))
	/*
		example:
			container: {
		    padding: [20, 10],
		    background: {
		      color: 'green',
		      image: 'url(image.jpg)',
		      position: [0, 0],
		      repeat: 'no-repeat'
		    },
		    boxShadow: {x: 10, y: 10, blur: 5, spread: 5, color: 'black'},
		    transition: [
		      {
		        property: 'opacity',
		        duration: '200ms'
		      },
		      {
		        property: 'width',
		        duration: '300ms'
		      }
		    ]
		  }
	*/
	.use(expand())
	/**/
	.use(vendorPrefixer())
	/**/
	.use(propsSort())
	/**/
	// .use({
		/*
			1. Этот крючок вызывается при создании правила. Если этот объект возвращает объект, он должен быть экземпляром правила.
				 Если возвращается пустое значение, JSS вернется к регулярному правилу.
		*/
		// onCreateRule: (name, decl, options) => {
		// 	console.log('onCreateRule name, decl, options:', name, decl, options);
		//   // Do something here.
		//   // return newRule;
		// },

		/*
			2. Этот крючок вызывается в каждом созданном правиле с правилом в качестве аргумента.
		*/
		// onProcessRule: (rule, sheet) => {
		// 	console.log('onProcessRule rule, sheet:', rule, sheet);
		// 	// Do something here.
		// },

		/*
			3. Этот крючок вызывается для каждого созданного правила styleв качестве основного аргумента.
				 Он предназначен для styleпреобразования объектов и манипуляций с правилами.
				 По соображениям производительности вам разрешается мутировать сам styleобъект, хотя НЕ вложенные объекты.
				 Он ограничен первым уровнем, потому что styleобъект неглубоко клонирован в ядре, но вложенные объекты должны быть клонированы плагинами, если им необходимо его мутировать.
				 Используйте jss.cloneStyle()утилиту для клонирования стиля. Возвращенный объект с крючка заменит rule.style.
		*/
		// onProcessStyle: (style, rule, sheet) => {
		// 	console.log('onProcessStyle style, rule, sheet:', style, rule, sheet);
		// 	// Do something here.
		// 	// return style;
		// },

		/*
			4. Этот крючок вызывается для каждого созданного StyleSheetпосле обработки всех правил с sheetпомощью аргумента.
		*/
		// onProcessSheet: (sheet) => {
		// 	console.log('onProcessSheet sheet:', sheet);
		//   // Do something here.
		// },

		/*
			5. Этот крючок вызывается, когда rule.prop(prop, value)вызывается как сеттер (со значением).
				 Метод sheet.update()использует rule.prop()внутренне. Если этот крючок реализован плагином, возвращаемое значение будет установлено в объекте стиля и в объекте CSSOM CSSRule, если лист связан.
				 Если несколько плагинов реализуют этот крючок, возвращаемое значение из первого будет передано второму и так далее, как цепочка mapфункций.
		*/
		// onChangeValue: (value, prop, rule) => {
		// 	console.log('onChangeValue value, prop, rule:', value, prop, rule);
		// 	// Do something here.
		// 	// return newValue;
		// },
	// })
;
/*/USE/*/

export default {
  install(Vue, {variables}) {
		const
			manager = new SheetsManager()
		;
		/*сделать объект-набор переменных реактивным и наблюдаемым, для обновления всей наборов при изменении переменных*/
		let
			themeManagerInstance = themeManager(variables)
		;

		/**/
		Vue.prototype.$jss = Object.assign(jss, {
			/*менеджер темы*/
			themeManager: themeManagerInstance,
			/**/
			variables,
			/**/
			manager,


			/*функция создающая переменную удобно доступную в виде числа, или строки при необходимости*/
			strInt(number, string) {
				return new Object({
					toString() {
						return number + (string || 'px');
					},
					get int() {
						return number;
					},
				})
			},

			/*функция создаваемая наблюдаемый набор правил - при изменении переменных, или изменении самого набора, он будет перезаписан*/
			createObservableStyleSheet(arg1, arg2, arg3) {
				var
					component
					,styleSheetName
					,options
				;
				let
					argsLength = arguments.length
				;
				/*если количество аргументов === 1, значит передан объект с параметрами*/
				if(argsLength === 1) {
					var {component, styleSheetName, options} = arg1;
				}
				/*если количество аргументов >== 2, значит переданны - набор стилей и контекст компонента*/
				if(argsLength >= 2) {
					component = arg1;
					styleSheetName = arg2;
					/*если количество аргументов >== 3, значит третьим переданн объект опций*/
					if(argsLength >= 3) {
						options = arg3;
					}
				}
				let
					rules = component[styleSheetName]
				;
				/*правила не были найдены*/
				if(!rules) {
					console.error('Не найдены стилевые правила');
					return;
				}

				let
					/*правило в менеджере*/
					sheetWithId = manager.get(rules)
				;
				/*если набор уже был зарегестрирован ранее*/
				if(sheetWithId) {
					/*деактивация текущего стилевого набора*/
					// currentStyleSheet.detach();
					// jss.removeStyleSheet(currentStyleSheet);
					/*актуализачия нового стилевого набора*/
					// component.$styleSheet = newStyleSheet;
					// manager.unmanage(uid);
					return sheetWithId.update(variables);
				/*иначе набор не был зарегистрирован/найден*/
				} else {
					let
						/*идентификатор конструктора всех инстансов переданного компонента*/
						cid = component.constructor.cid
						/*создание нового стилевого набора*/
						,newStyleSheet = jss.createStyleSheet(
							component[styleSheetName],
							/*смешивание стандартных настроек с переданными*/
							Object.assign({
								/**/
								// index: 5,
								/*передача имени компонента для более лёгкой отладки*/
								meta: `cid${cid}-uid${component._uid}--${component.$options.name}`,
								/**/
								link: true,
								/*функция, которая генерирует уникальное имя класса*/
								generateClassName: (rule, sheet) => {
									// console.log('rule, sheet:', rule, sheet);
									return `_${sheet.options.classNamePrefix}--${rule.key}`;
								},
								/*строка, которая будет добавлена ​​в начале имени класса в процессе разработки*/
								classNamePrefix: cid,
							}, options)
						)
					;

					manager.add(rules, newStyleSheet);
					/*регистрирование стилевого набора в компоненте и применение к нему переменных*/
					component.$styleSheet = newStyleSheet.update(variables);

					/*отслеживание изменения переменных с последующим обновлением набора стилей*/
					themeManagerInstance.$watch('variables', (newVal, oldVal) => {
						/*удаление текущего набора, т.к. при изменении объекта набора - реактивно создаётся новый*/
						component.$styleSheet.update(newVal);
					}, {
						/*глубокое отслеживание*/
						deep: true,
						// immediate: true,
					});

					/*добавление в компонент функции удаления набора стилей при разрушении компонента*/
					/*если хук не зарегестрирован - будет добавлена первая функция хука*/
					// (component.$options.beforeDestroy || (component.$options.beforeDestroy = [])).push(() => {
					// 	console.log('step 4: beforeDestroy - component.$options.beforeDestroy:');
					// 	/*удалить набор стилей при разрушении компонента*/
					// 	// manager.unmanage(component._uid);
					// 	jss.removeStyleSheet(component.$styleSheet);
					// });

					return newStyleSheet.attach();
				}

			},

		});

	},
};
