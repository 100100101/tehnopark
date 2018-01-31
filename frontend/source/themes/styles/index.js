// import Vue from 'vue';
/*JSS global instance*/
// import {Observable} from 'rxjs/Observable';
/*JSS*/
/*{SheetsManager}*/
module.exports = {
	'@global': require('./global/'),
	/*скрывать нескомпилированные шаблоны*/
	// '[v-cloak]': {
	// 	display: 'none',
	// },
	root: {
		display: 'flex',
		flexDirection: 'column',
		// background: `url(${require('../images/1.jpeg')})`,
		height: '100%',
		width: '100%',
		position: 'relative',
		background: `url(${require('../images/bg.png')})`,
	},
};
