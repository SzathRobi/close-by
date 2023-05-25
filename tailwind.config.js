/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			keyframes: {
				goDownUp: {
					'0%': { transform: 'translate(-50%, 0)' },
					'10%': { transform: 'translate(-50%, 6rem)' },
					'90%': { transform: 'translate(-50%, 6rem)' },
					'100%': { transform: 'translate(-50%, 0rem)' }
				}
			},
			animation: {
				'feedback-ease-down-up': 'goDownUp 5s ease-in-out'
			}
		}
	},
	plugins: []
};
