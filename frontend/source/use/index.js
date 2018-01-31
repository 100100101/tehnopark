module.exports = Vue => {
	/*плагин динамических наборов CSS правил описанных в JS (базируется на JSS)*/
	Vue.use(
		require('./jss/').default,
		{
			variables: require('../themes/styles/variables/theme_default/'),
		}
	);
	/**/
	Vue.use(require('vee-validate').default);
};
