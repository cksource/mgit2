/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );
const shellescape = require('shell-escape');

module.exports = {
	skipCounter: true,

	get helpMessage() {
		const {
			italic: i,
			gray: g,
			magenta: m,
			underline: u
		} = chalk;

		return `
    ${ u( 'Description:' ) }
        Shows changes between commits, commit and working tree, etc. Works the same as "${ i( 'git diff' ) }" command. By default a flag 
        "${ m( '--color' ) }" is adding. You can cancel it using option "${ m( '--no-color' ) }".
        
    ${ u( 'Git Options:' ) }
        All options accepted by "${ i( 'git diff' ) }" are supported by mrgit. Everything specified after "--" is passed directly to the 
        "${ i( 'git diff' ) }" command.
        
        E.g.: "${ g( 'mrgit diff -- origin/master..master' ) }" will execute "${ i( 'git diff --color origin/master..master' ) }"
		`;
	},

	beforeExecute() {
		console.log( chalk.blue( 'Collecting changes...' ) );
	},

	/**
	 * @param {CommandData} data
	 * @returns {Promise}
	 */
	execute( data ) {
		const execCommand = require( './exec' );
		const diffCommand = ( 'git diff --color ' + shellescape(data.arguments) ).trim();

		return execCommand.execute( getExecData( diffCommand ) )
			.then( execResponse => {
				if ( !execResponse.logs.info.length ) {
					return {};
				}

				return execResponse;
			} );

		function getExecData( command ) {
			return Object.assign( {}, data, {
				arguments: [ command ]
			} );
		}
	},

	afterExecute() {
		console.log( chalk.blue.italic( 'Logs are displayed from repositories which contain any change.' ) );
	}
};
