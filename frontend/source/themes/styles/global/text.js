export default {
	'[_text-decoration~="dashed-line__trigger_bottom"]': {
    display: 'inline',
			'&:hover': {
					'& [_text-decoration~="dashed-line__text_bottom"]': {
						// background: '#f30',
						backgroundImage: 'linear-gradient(90deg, #ddd 50%, #ddd 50%)',
					}
			},
	},
	/**/
	'[_text-decoration~="dashed-line_bottom"]': {
    display: 'inline',
	},
		/**/
		'[_text-decoration~="dashed-line__text_bottom"]': {
	    display: 'inline',
			backgroundColor: 'transparent',
			backgroundImage: 'linear-gradient(90deg, transparent 50%, #ccc 50%)',
			backgroundRepeat: 'repeat-x',
			backgroundSize: '3px 1px',
			backgroundPosition: 'bottom',
		},

};
