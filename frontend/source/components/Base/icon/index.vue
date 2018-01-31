<template>
  <component
    ref="root"
    :is="$options.components[type]"
    :options="settings"
  >
    <slot name="default" slot="default"/>
    <effect
      slot="effect"
      v-if="settings.hasEffect"
      type="ripple"
      trigger-ref="root"
      :trigger-refs="$refs"
      :color="settings.effectColor"
      :is-centered="true"
      :styles="settings.effectStyle"
      @done="effectDone"
    />
  </component>
</template>

<script>
let
  componentsList = [
    require('./close'),
    require('./arrow'),
    require('./menu-burger'),
    /**/
    require('./wheel'),
    /**/
    require('./settings'),
  ]
;
// (
//   name => {
//     return name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)
//   }
//     (path.basename(__filename, path.extname(__filename))
// )

// console.log('returnComponentName(__filename):', returnComponentName(__filename));


export default {
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
    /**/
    type: {
      type: String,
      validator(value) {
        /*возможны лишь варианты из подключенных компонентов*/
        return !!~componentsList.map((item, index, array) => {
          return item.name;
        }).indexOf(value);
      }
    },

    /**/
    options: {
      type: Object,
      default() {
        return {};
      }
    },

    /**/
  },

  /*DATA*/
  data() {
    return {
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
      // this.$emit('effect-done');
      let
        effectDoneCallback = this.settings.effectDoneCallback
      ;
      effectDoneCallback && effectDoneCallback();
    },
  },


  mounted() {
    console.log('$options.components[type]', this.$options.components, this.type);
  },


}
</script>

<style lang="scss" scoped>
  .close {
    position: relative;
    cursor: pointer;
  }
</style>
