<template>
  <div
    v-show="exist"
    class="overlay"
  >
    <slot name="default"/>
  </div>
</template>

<script>
module.exports = {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /*PROPS*/
  props: {

  },

  /*DATA*/
  data() {
    return {
      /*существует (отрисован) ли компонент в DOM*/
      exist: false,
      /**/
    };
  },

  /*COMPUTED*/
  computed: {

  },

  /*METHODS*/
  methods: {
    /*показать компонент*/
    show() {
      // console.log('show this:', this);
      /**/
      this.exist = true;
    },

    /*спрятать компонент*/
    hide() {
      // console.log('hide this:', this);
      /**/
      this.exist = false;
    },

  },

  /**/
  created() {

  },

};
</script>

<style lang="scss" scoped>
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 3;
    // visibility: hidden;
  }
</style>
