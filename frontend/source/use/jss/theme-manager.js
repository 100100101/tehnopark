import Vue from 'vue';
// import _ from 'lodash';
// import { _merge } from 'lodash/merge';

// import deepmerge from 'deepmerge';
export default (variables => new Vue({
	data() {
		return {
			variables,
		};
	},

	/*METHODS*/
	methods: {
		/*примешать к текущей теме*/
		merge(variables) {
			return this.variables = Object.assign(/*_.merge(*/this.variables, variables);
		},
		/*установить новую тему*/
		set(variables) {
			return this.variables = variables;
		},
		/*полусить текущую тему*/
		get() {
			return this.variables;
		},
	},

	/*WATCH - отслеживание изменения переменных*/
	// watch: {
	// 	variables: {
	// 		handler(newValue, oldValue) {
	// 			console.log('newValue, oldValue:', newValue, oldValue);
	// 			// return
	// 		},
	// 		/*лубокое отслеживание*/
	// 		deep: true,
	// 		/**/
	// 		immediate: true,
	// 	},
	// },
}));
