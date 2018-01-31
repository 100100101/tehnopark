/* LIBS/MODULES */
const
  Vue = require('vue')
;
/*/LIBS/MODULES/*/

/*компоненты базового слоя*/
[
  // require('./Base/native/button/index.vue'),
  // require('./Base/native/collapse/index.vue'),
  // require('./Base/native/collapse-item/index.vue'),
  /*LAYOUT*/
  // require('./Base/grid-layout/GridItem.vue'),
  // require('./Base/grid-layout/GridLayout.vue'),
  // require('./Base/grid-layout/ResponsiveGridLayout.vue'),
  /*/LAYOUT/*/

  /*SPINNERS*/
  // require('./Base/spinners/PulseLoader.vue'),
  // require('./Base/spinners/GridLoader.vue'),
  // require('./Base/spinners/ClipLoader.vue'),
  // require('./Base/spinners/RiseLoader.vue'),
  // require('./Base/spinners/BeatLoader.vue'),
  // require('./Base/spinners/SyncLoader.vue'),
  // require('./Base/spinners/RotateLoader.vue'),
  // require('./Base/spinners/FadeLoader.vue'),
  // require('./Base/spinners/PacmanLoader.vue'),
  // require('./Base/spinners/SquareLoader.vue'),
  // require('./Base/spinners/ScaleLoader.vue'),
  // require('./Base/spinners/SkewLoader.vue'),
  // require('./Base/spinners/MoonLoader.vue'),
  // require('./Base/spinners/RingLoader.vue'),
  // require('./Base/spinners/BounceLoader.vue'),
  // require('./Base/spinners/DotLoader.vue'),
  /*/SPINNERS/*/

  /*Vue-Awesome-Swiper*/
  // require('./Base/vue-awesome-swiper/slide.vue'),
  // require('./Base/vue-awesome-swiper/swiper.vue'),

  /*SCROLLBAR*/
  require('./Base/scrollbar/'),
  // require('./Base/scrollbar/scrollbar-root'),
  /*WINDOW*/
  require('./Base/window/'),
  /*CELL*/
  // require('./Base/cells/'),
  /*PORTAL*/
  require('./Base/portal/portal-enter'),
  require('./Base/portal/portal-exit'),

  /*BUTTON TRIGGER*/
  require('./Base/button-trigger/'),

  /*TRIGGERING*/
  require('./Base/triggering/trigger/'),
  // require('./Base/triggering/triggered'),
  // require('./Base/triggering/triggers-set'),
  /*///*/
  // require('./Base/triggering/triggers-set2'),
  /**/

  /*EFFECT*/
  require('./Base/effect/'),

  /*ICON*/
  require('./Base/icon/'),

  /*SLIDER*/
  // require('./Base/slider/'),

  /*SQUARE*/
  require('./Base/square/'),

  /*FIELD*/
  require('./Base/field/'),

  /*POPOVER*/
  // require('./Base/popover/'),

  /**/
  // require('./Base/overlay/'),

  /*SQUARE*/
  require('./Base/ref/'),

].map(component => {
  Vue.component(component.name, component);
});

/*ДИРЕКТИВЫ*/
// [
//   /*EFFECT*/
//   // require('./Base/effect/'),
//   /*CELLS*/
//   require('./Base/cells/index-.js'),
//
// ].map(directive => {
//   Vue.directive(/*directive.name*/'cells', directive);
// });



/*PROGRESSBAR*/
// Vue.component(/*component.name*/'progress-bar', require('./Base/native/progressbar/src/vue-progressbar.es5.js'));
// Vue.use(require('./Base/progressbar/vue-progressbar.es5.js').default, {
//   debug: true,
//   color: '#bffaf3',
//   failedColor: '#874b4b',
//   thickness: '5px',
//   transition: {
//     time: '0.7s',
//     opacity: '1.6s'
//   },
//   trail: '-1px',
//   autoRevert: true,
//   location: 'right',
//   inverse: true,
//   gradient: {
//     use: true,
//     gradient: 'predefined'
//   },
//   init: true,
//   bounce: true
// })
/*//*/

// import 'zrender/lib/vml/vml';

module.exports = {
  /*компоненты слоя разметки*/
  /*модуль карты - может встраиваться в различные компоненты*/
  // mapsView: () => import('./Module/maps-view/'),
  /*основной логотип компании*/
  // mainLogotype: require('./Theme/images/main-logotype.vue'),
};
