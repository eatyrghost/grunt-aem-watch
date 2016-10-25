# grunt-aem-watch
## aem-watch task
### Usage:
```
aem-watch: {
	localAuthor: {
		server: 'author'
	},
	localPublish: {
		server: 'publish'
	},
	qaAuthor: {
		host: 'qa-author.mydomain.com',
		password: 'myqapassword',
		server: 'author',
		username: 'myqausername'
	},
	qaPublish: {
		host: 'qa-publish.mydomain.com',
		password: 'myqapassword',
		server: 'publish',
		username: 'myqausername'
	}
}
```
... then from grunt-watch...
```
watch: {
	your_task: {
		files: <your file rules>,
		tasks: ['aem-watch:localAuthor', 'aem-watch:localPublish']
	}
}
```
### Allowed Properties
host - The host (without protocol or port) to call
password - The password to use
port - The port to use
server - Optional set of default configurations, either 'author' or 'publish'
target - The target path to use if not the same as the file location
username - The username to use