/* eslint-disable no-console */
const {resolve, relative} = require('path');
const mirror = require('mirror-folder');
const chalk = require('chalk');
const {modifyChangedGitFiles} = require('./mirror-git-diff');
const {watchFile} = require('fs');

// Create whitelisted console messages
const info = (...args) => console.log(chalk.blue('ℹ', ...args));
const success = (...args) => console.log(chalk.green('✔', ...args));
const error = (...args) => console.error(chalk.red('⨯', ...args));
const warning = (...args) => console.warn(chalk.hex('#ff9900')('!', ...args));
const logEvent = (eventName, logFn) => (src, dist) => logFn(`${chalk.bold(eventName)} $`, chalk.underline(`./${relative(process.cwd(), src.name)}`), dist ? `=> ${chalk.underline(`./${relative(process.cwd(), dist.name)}`)}` : '');

const DEFAULT_ENVIRONMENT = 'dev';
const DEFAULT_ROOT_BRANCH = 'origin/main';
const DEFAULT_MMT_FOLDER_NAME = 'miva-templates';

/**
 * @param {{environment?: string, rootBranch?: string, mmtFolderName?: string}} options
 */
const mmtDev = ({environment = DEFAULT_ENVIRONMENT, rootBranch = DEFAULT_ROOT_BRANCH, mmtFolderName = DEFAULT_MMT_FOLDER_NAME} = {}) => {
	// Check if options exists
	if (!environment) {
		throw new Error('Please provide an environment name.');
	}
	if (!rootBranch) {
		throw new Error('Please provide an rootBranch.');
	}
	if (!mmtFolderName) {
		throw new Error('Please provide an mmtFolderName.');
	}

	// Get watch path
	const watchPath = resolve(process.cwd(), mmtFolderName);

	// Define copy path
	const copyPathDirname = `${mmtFolderName}-${environment}`;
	const copyPath = resolve(process.cwd(), copyPathDirname);
	const localConfigPath = resolve(copyPath, '.mmt/config.json');

	// Watch for changes
	const progress = mirror(watchPath, copyPath, {
		ensureParents: true,
		ignore: (file, stats, cb) => {
			if (file.indexOf('.mmt') > -1) {
				return process.nextTick(cb, null, true);
			}
			return process.nextTick(cb, null, false);
		},
		keepExisting: true,
		watch: true
	});

	// Watch for changes to ignored .mmt/config.json, "modify" git changes
	watchFile(localConfigPath, () => modifyChangedGitFiles(rootBranch));

	// Output Message that watching is started
	info('Watching for changes from', chalk.underline(mmtFolderName), 'to', chalk.underline(copyPathDirname));
	warning('!!! WARNING !!!', `Don't forget to run \`mmt checkout\` in ${chalk.underline(copyPathDirname)} after running this command or ALL changes will be pushed.`);
	warning(`Ensure \`mmt status\` outputs as "No files modified" in ${chalk.underline(copyPathDirname)} before getting started.`);

	// Log events
	progress.on('put', logEvent('put', success));
	progress.on('del', logEvent('del', error));
	progress.on('ignore', logEvent('ignore', warning));
};

module.exports = {
	DEFAULT_ENVIRONMENT,
	DEFAULT_MMT_FOLDER_NAME,
	DEFAULT_ROOT_BRANCH,
	mmtDev
};
