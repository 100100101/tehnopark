<template>
  <div
    v-show="displayed ? active : true"
    v-if="displayed ? true : active"
    :class="{
      'triggered': true,
      active,
    }"
  >
    <!--<keep-alive>-->
      <slot/>
    <!--</keep-alive>-->
  </div>
</template>

<script>
export default {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

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

    /*элемент скрываемый (true) или перерендерировыемый (false)*/
    displayed: {
      type: Boolean,
      // default: true,
      default: false,
    },

  },

  /*DATA*/
  data() {
    return {
      tab: null,
      activeTab: null,
    };
  },

  /*COMPUTED*/
  computed: {
    active() {
      return this.name === this.model.active;
    }
  },



  /*CREATED*/
  created() {
    let
      list = this.model.list
    ;
    /*если уже существует запись в моделе о паре - имя вкладки, контент */
    if(this.name in list) {
      list[this.name].content = this;
    /*иначе запись создаётся*/
    } else {
      list[this.name] = {
        content: this
      };
    }
    this.tab = list[this.name];
  },
  /*MOUNTED*/


}
</script>

<style lang="scss" scoped>
  .active {

  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0
  }
</style>
