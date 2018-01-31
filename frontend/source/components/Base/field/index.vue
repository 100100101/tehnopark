<script>
const
  Vue = require('vue')
;
let
  componentsList = [
    require('./default'),
    // require('./period'),
  ]
  /*шина данных/событий между данным компонентом и дочерними любого уровня импортирующими её в себя*/
  // ,bus = new Vue({})
;
/*создать расширенный родительский инстанс со свойствами запрашиваемого типа поля*/
// let
//   instanceOptions =
// ;
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
  /*не задействовать аттрибуты не провалившиеся в свойства*/
  inheritAttrs: false,
  /**/
  // functional: true,

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
      default: 'default',
    },
  },

  /*DATA*/
  data() {
    return {

    };
  },

  /*PROVIDE*/
  provide: {
    /*шина данных/событий между данным компонентом и дочерними любого уровня импортирующими её в себя*/
    // bus,
    /**/
    // $emit() {
    //
    // },
  },

  /*COMPUTED*/
  computed: {
    /*возвращение запрошенного компонента взятого из коллекции текущего инстанса*/
    isChild() {
      return this.$options.components[this.type];
    },
  },

  /*WATCH*/
  watch: {

  },

  /*METHODS*/
  methods: {

  },

  /*BEFORE CREATED*/
  beforeCreate() {
    console.log('beforeCreate this.$refs.component:', this.$refs.component);
  },

  /*CREATED*/
  created() {
    console.log('create this.$refs.component:', this.$refs);
  },

  /*MOUNTED*/
  mounted() {
    /**/
    // const old_on = this.$on;
    // this.$on = (...args) => {
    //   console.log('123');
    //   // custom logic here like pushing to a callback array or something
    //   old_on.apply(this, args);
    // };

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

  /*RENDER*/
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
      /*фильтрование атрибутов от свойств*/
      // ,childAttrsKeys = allAttrsKeys.filter(item => {
      //   /*вернуть если текущего элимента нет в списке свойств дочернего*/
      //   return !~childPropsKeys.indexOf(item);
      // })
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
    /*создание объекта с атрибутами для передачи почернему компоненту*/
    return createElement(
      child,
      {
        /*примешивание свойств из дочернего компонента к текущему*/
        props: this.$attrs,
        /*передача атрибутов*/
        attrs: childAttrs,
        /**/
        class: {
          'field': true,
        },
        /**/
        on: {
          focus() {
            console.log('createElement on focus');
          },
        },
        /**/
        ref: 'component',
      },
      /*дочерние элименты*/
      /*массив слотов по умолчанию*/
      this.$slots.default
      // [
      //   // this.$slots.default,
      //   // this.$slots.placeholder,
      // ]
      // /*передача слотов*/
      // .concat(Object.values(this.$slots))
    );
  },
};
</script>

<style lang="scss" scoped>

</style>
