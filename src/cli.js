#!/usr/bin/env node

const {program, Argument, Option} = require('commander');
const packageFile = require('../package.json');
const {mmtDev, DEFAULT_ENVIRONMENT, DEFAULT_MMT_FOLDER_NAME, DEFAULT_ROOT_BRANCH} = require('./mmt-dev');

// Output version
program.version(packageFile.version);

// Settings
program.showHelpAfterError(true);

// Process CLI arguments
program
	.createCommand('mmt-dev')
	.addOption(new Option('-b, --rootBranch <branch>', 'the base branch to use to compare the HEAD to in git').default(DEFAULT_ROOT_BRANCH))
	.addOption(new Option('-f, --mmtFolderName <folderName>', 'the name of the folder containing mmt files').default(DEFAULT_MMT_FOLDER_NAME))
	.addArgument(new Argument('[environment]', 'the name of the environment you want to copy to').default(DEFAULT_ENVIRONMENT))
	.action((environment, opts) => {
		mmtDev({
			environment: environment,
			mmtFolderName: opts.mmtFolderName,
			rootBranch: opts.rootBranch
		});
	})
	.parse(process.argv);
