# grunt-aem-watch
## aem-watch task
### Usage
```
aem-watch: {
	localAuthor: {
		options: {
			server: 'author'
		},
		src: [
			'your/js/path/**/*.js',
			'your/css/path/**/*.css',
		]
	},
	localPublish: {
		options: {
			server: 'publish'
		},
		src: [
			'your/js/path/**/*.js',
			'your/css/path/**/*.css',
		]
	},
	qaAuthor: {
		options: {
			host: 'qa-author.mydomain.com',
			password: 'myqapassword',
			server: 'author',
			username: 'myqausername'
		},
		src: [
			'your/js/path/**/*.js',
			'your/css/path/**/*.css',
		]
	},
	qaPublish: {
		options: {
			host: 'qa-publish.mydomain.com',
			password: 'myqapassword',
			server: 'publish',
			username: 'myqausername'
		},
		src: [
			'your/js/path/**/*.js',
			'your/css/path/**/*.css',
		]
	}
}
```
... then your Grunt Watch configuration...
```
watch: {
	your_task: {
		files: <your file rules>,
		tasks: ['aem-watch:localAuthor', 'aem-watch:localPublish']
	}
}
```
### Allowed Options
* host - The host (without protocol or port) to call, defaults to 'localhost'
* password - The password to use, defaults to 'admin'
* port - The port to use, defaults to '4502' for 'author' and '4503' for 'publish'
* server - Optional set of default configurations, either 'author' or 'publish'
* target - The target path to use if not the same as the file location, e.g. if you need to prefix with '/etc/designs/your-design/' you would define that as your target
* updateWindow - this allows you to specify, in seconds, how recently a file was updated to be eligible, defaults to 15
* username - The username to use, defaults to 'admin'