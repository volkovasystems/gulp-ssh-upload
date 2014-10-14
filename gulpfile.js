/*:
	@command-parameter-list:
		{
			"projectDirectory": "string|Path|Directory",
			"mainFile": "string|Path|File",
			"localFile": "string|Path|File"
		}
	@end-command-parameter-list
*/

var argv = require( "yargs" ).argv;
var async = require( "async" );
var gulp = require( "gulp" );
var ssh = require( "gulp-ssh" );




gulp.task( "initialize",
	function initializeTask( ){

	} );