/*:
	@command-parameter-list:
		{
			"projectDirectory|project": "string|Path|Directory",
			"mainFile|main": "string|Path|File",
			"localFile|local": "string|Path|File"
		}
	@end-command-parameter-list
*/

var argv = require( "yargs" ).argv;

var async = require( "async" );
var gulp = require( "gulp" );
var ssh = require( "gulp-ssh" );
var replace = require( "gulp-replace" );
var string = require( "string" );

var fs = require( "fs" );
var path = require( "path" );
var childprocess = require( "child_process" );

string.extendPrototype( );

const GIT_HTTPS_REPOSITORY_URL = "@git-repository-url";
const GIT_REPOSITORY_DIRECTORY = "@git-repository-directory";
const GIT_REPOSITORY_MAIN_BRANCH = "@git-repository-main-branch";

const NODEJS_SOURCE_URL = "@nodejs-source-url";
const NODEJS_SOURCE_FILE = "@nodejs-source-file";
const NODEJS_SOURCE_DIRECTORY = "@nodejs-source-directory";

const MONGODB_SOURCE_URL = "@mongodb-source-url";
const MONGODB_SOURCE_FILE = "@mongodb-source-file";
const MONGODB_SOURCE_DIRECTORY = "@mongodb-source-directory";

const REMOTE_HOST = "@remote-host";
const PRIVATE_KEY_FILE = "@private-key-file";
const PRIVATE_KEY_PASSPHRASE = "@private-key-passphrase";
const REMOTE_CONNECTION_TIMEOUT = "@remote-connection-timeout";
const REMOTE_DIRECTORY = "@remote-directory";

const LOCAL_DIRECTORY = "@local-directory";

const TEMPLATE_FILE_LIST = [
	"check",
	"configure",
	"teleport",
	"install",
	"reconstruct",
	"run",
	"update",
	"shutdown",
	"local.json"
];

const BUILD_DIRECTORY = "build";

gulp.task( "initialize",
	function initializeTask( done ){
		var localData = { };

		async.series( [
			function getProjectAndRemoteDirectory( done ){
				var projectDirectory = argv.projectDirectory || argv.project;

				var remoteDirectory = projectDirectory;

				if( projectDirectory.startsWith( "../" ) ){
					localData.projectDirectory = path.resolve( projectDirectory );

					localData.remoteDirectory = remoteDirectory.replace( "../", "" );

				}else if( __dirname.contains( "gulp-ssh-upload" ) ){
					localData.projectDirectory = path.resolve( "../", projectDirectory );
				}

				done( );
			},

			function getGitRepositoryUrl( done ){
				childprocess.exec( "git ls-remote --get-url", 
					{ "cwd": localData.projectDirectory },
					function onResult( error, stdout, stderr ){
						localData.gitRepositoryUrl = stdout.toString( ).trim( ).replace( /\s+/gm, "" );			
						done( error );
					} );
			},

			function getGitRepositoryDirectory( done ){
				localData.gitRepositoryDirectory = localData.remoteDirectory;
				done( );
			},

			function getGitRepositoryCurrentBranch( done ){
				childprocess.exec( "git rev-parse --abbrev-ref HEAD",
					{ "cwd": localData.projectDirectory },
					function onResult( error, stdout, stderr ){
						localData.getGitRepositoryCurrentBranch = stdout.toString( ).trim( ).replace( /\s+/gm, "" );			
						done( error );
					} );
			},


		] )

		if( fs.statSync( projectDirectory ) ){
			return gulp
				.src( TEMPLATE_FILE_LIST )
				.pipe( replace( LOCAL_DIRECTORY, projectDirectory ) )
				.pipe( replace( REMOTE_DIRECTORY, remoteDirectory ) )
				.pipe( replace(  ) )
				.pipe( gulp.dest( BUILD_DIRECTORY ) )
		}

		return null;
	} );