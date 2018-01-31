<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:viewBox="`0 0 ${viewBoxW} ${viewBoxH}`"
		preserveAspectRatio="none"
		class="svg"
	>
		<polyline
			points="
				0 0
				50 50
				100 0
			"
			class="svg__element1"
		/>

		<!-- <path
			d="
	      M0 50
	      C 10 20, 50 20, 50 50
	    "
			class="svg__element1"
		/> -->
	</svg>

  <!-- <div
    :class="{
      'arrow': true,
      [settings.side]: true,
      [`_${settings.modification}`]: true,
    }"
  >
    <span
      :class="{
        'arrow__el1': true,
      }"
      :style="{
        'background-color': settings.backgroundColor,
        'color': settings.color,
      }"
    />
    <span
      :class="{
        'arrow__el2': true,
      }"
      :style="{
        'background-color': settings.backgroundColor,
        'color': settings.color,
      }"
    />
    <slot name="effect"/> -->
  </div>
</template>

<script>
export default {
  name: (name => name === 'index' ? (array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),
  /*PROPS*/
  props: {
    /**/
    options: {
      type: Object,
      default() {
        return {

        };
      }
    },

    /**/
  },

  /*DATA*/
  data() {
    return {
      preset: {
        /**/
        hasEffect: true,
        /*top, bottom, left, right*/
        side: 'top',
        /**/
        color: 'inherit',
        /**/
        backgroundColor: 'inherit',
        /*single, double*/
        modification: 'single',
      },
      /**/

			viewBoxW: 100,
			viewBoxH: 100,
    };
  },

  /**/
  computed: {
    settings() {
      return Object.assign(this.preset, this.options);
    },
  },


  /*WATCH*/
  watch: {
    // options: {
    //   handler(newValue, oldValue) {
    //     this.settings = Object.assign(this.settings, this.options);
    //   },
    //   immediate: true,
    // },
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
  }


}
</script>

<style lang="scss" scoped>
	.svg {

	}
		.svg__element1 {
			fill: none;
	    stroke: #ff9e46;
	    stroke-width: 1px;
	    vector-effect: non-scaling-stroke;
			stroke-linecap: butt;
			stroke-linejoin: miter;
		}

</style>
