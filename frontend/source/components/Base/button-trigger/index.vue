<template>
  <component
    ref="root"
    class="button"
    :is="$options.components[type]"
    :modification="modification"
    :coloration="coloration"
    :disable="disable"
  >
    <slot name="default" stot="default"/>
    <effect
      v-if="hasEffect"
      type="ripple"
      trigger-ref="root"
      :trigger-refs="$refs"
      :color="effectColor"
      @done="effectDone"
    />
  </component>
</template>

<script>
// let
//   variants = ((paths) => {
//     return paths.reduce((previousValue, currentValue, index, array) => {
//       let
//         type = currentValue[0]
//       ;
//       previousValue[index + 1] = currentValue[1].reduce((previousValue, currentValue, index, array) => {
//         previousValue[index + 1] = require(`./${type}/${currentValue}`);
//         return previousValue;
//       }, {});
//       return previousValue;
//
//     }, {});
//
//   })([
//     /**/
//     ['type1', ['mod1', 'mod2']],
//     /**/
//   ]);
// ;

let
  componentsList = [
    /**/
    require('./type1/'),
    /**/
    require('./default/'),
    /**/
    require('./circular/'),
  ]
;

module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*COMPONENTS*/
  components: {
    ...componentsList.reduce((previousValue, currentValue, index, array) => {
      previousValue[currentValue.name] = currentValue;
      return previousValue;
    }, {}),
  },

  /*PROPS*/
  props: {
    /*тип кнопкм*/
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

    /*модификация кнопки*/
    modification: {
      type: String,
    },

    /*расцветка*/
    coloration: {
      type: String,
      validator(value) {
        return !!~['transparent', 'primary'].indexOf(value);
      },
      default: 'transparent',
    },

    /*опции*/
    options: {
      type: Object,
      default() {
        return {};
      }
    },

    /**/
    hasEffect: {
      type: Boolean,
      default: true,
    },

    /**/
    effectColor: {
      type: String,
      default: 'rgba(14, 169, 192, 0.15)',
    },

    disable: {
      type: Boolean,
      default: false,
    },

  },

  /*DATA*/
  data() {
    return {
      /**/
      preset: {
        hasEffect: true,
        effectDoneCallback: null,
        effectStyle: {

        },
      },
      /**/
      settings: null,
    };
  },

  /*COMPUTED*/
  computed: {
    // settings() {
    //   return Object.assign(this.preset, this.options);
    // },
  },

  /*WATCH*/
  watch: {
    options: {
      handler(newValue, oldValue) {
        this.settings = Object.assign(this.preset, newValue);
        // Object.assign(this.settings, this.options);
      },
      deep: true,
      immediate: true,
    },
  },

  /*METHODS*/
  methods: {
    effectDone() {
      this.$emit('effect-done');
    },
  },

}
</script>
