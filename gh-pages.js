var ghpages = require('gh-pages');

ghpages.publish(
	'public', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'https://github.com/aridevelopment-de/myanimetab.com.git', // Update to point to your repository
		user: {
			name: 'Ari24-cb24', // update to use your name
			email: 'ari.publicmail@gmail.com' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);
