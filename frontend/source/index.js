const
  Vue = require('vue')
;
/*USE*/
require('./use/')(Vue);
/*/USE/*/
let
  /**/
  styleRules = require('./themes/styles/')
;
/*ROOT INSTANCE*/
new Vue({
  /*COMPONENTS*/
  components: {
    ...require('./components/'),
    rootViewSpace: require('./components/Layout/root-view-space'),
  },

  /*DATA*/
  data() {
    return {
      styleRules,
    };
  },

  /*COMPUTED*/
  computed: {
    classes() {
      // this.$jss.createStyleSheet(require('./components/Theme/styles/').default);
      return this.$jss.createObservableStyleSheet(this, 'styleRules').classes;
    },
  },

  /*MOUNTED*/
  mounted: async function() {

  },

  /*RENDER*/
  render(createElement) {
    let
      classes = this.classes
    ;
    /**/
    return createElement('div', {
      class: classes.root,
    }, [
      // createElement(this.$options.components.scene, {class: classes.module3}),
      createElement(this.$options.components.rootViewSpace),
    ]);


  },
  /**/
})
.$mount((el => (document.body.append(el), el))(document.createElement('div')));
