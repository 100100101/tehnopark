/**
 * @Author: Sergey <iadmin>
 * @Date:   2017-09-01T18:06:33+03:00
 * @Filename: index.js
 * @Last modified by:   iadmin
 * @Last modified time: 2017-09-28T12:33:13+03:00
 */
let
  componentsList = [
    /**/
    require('./default'),
    /**/
    require('./def'),
    /**/
    require('./toggle'),
    /**/
    require('./checkbox'),
    // require('./radio'),
  ]
;
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
  /*не задействовать аттрибуты не провалившиеся в свойства*/
  inheritAttrs: false,

  /*COMPONENTS*/
  components: {
    ...componentsList.reduce((previousValue, currentValue, index, array) => {
      previousValue[currentValue.name] = currentValue;
      return previousValue;
    }, {}),
  },

  /*PROPS*/
  props: {
    /**/
    type: {
      type: String,
      validator(value) {
        /*возможны лишь варианты из подключенных компонентов*/
        return !!~componentsList.map((item, index, array) => {
          return item.name;
        }).indexOf(value);
      },
      default: 'default'
    },
  },

  /*DATA*/
  data() {
    return {

    };
  },

  /*COMPUTED*/
  computed: {
    /*триггер является - */
    isChild() {
      return this.$options.components[this.type];
    },

  },

  methods: {


  },

  /*CREATED*/
  created() {

  },

  /*MOUNTED*/
  mounted() {
    /*добавление ссылок на методы дочернего компонента в текущий инстанс*/
    let
      isChild = this.isChild
      /**/
      ,component = this.$refs.component
      /**/
      ,methods = isChild.methods
    ;
    for(let methodKey in methods) {
      /*если метод не найден в текущем инстансе - установить его*/
      let
        currentProp = this[methodKey]
      ;
      if(!currentProp) {
        this[methodKey] = component[methodKey]
      }
    }

    /*проведение событий из дочернего в текущий инстанс*/
    component.$emit = (type, callback) => {
      /*проброс события вверх*/
      this.$emit(type, callback);
    };
  },

  /**/
  render(createElement) {
    let
      /*все аттрибуты и свойства переданные в корневой инстанс*/
      allAttrs = this.$attrs
      /**/
      ,allAttrsKeys = Object.keys(allAttrs)
      /**/
      ,child = this.isChild
      /*имена свойств дочернего компонента*/
      ,childPropsKeys = Object.keys(child.props)
      /*формирование объекта с атрибутами передаными в текущий инстанс, без свойств*/
      ,childAttrs = allAttrsKeys.reduce((previousValue, currentValue, index, array) => {
        /*если текущего элимента не содержится в списке имён свойств дочернего компонента - это атрибут*/
        if(!~childPropsKeys.indexOf(currentValue)) {
          /*записать в новый объект ключ-значение атрибута*/
          previousValue[currentValue] = allAttrs[currentValue];
        }
        return previousValue;
      }, {});
    ;
    return createElement(
      /*компонент типа - */
      this.isChild,
      {
        props: this.$attrs,
        /*передача атрибутов*/
        attrs: childAttrs,
        /**/
        ref: 'component',
				/**/
				scopedSlots: this.$scopedSlots,
      },
      /*массив слотов по умолчанию*/
      this.$slots.default
    );
  },
};
