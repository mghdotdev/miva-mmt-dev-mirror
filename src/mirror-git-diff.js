const {execSync} = require('child_process');
const {resolve} = require('path');
const {readFileSync, writeFileSync} = require('fs');

/**
 * Get a list of modified `miva-templates` files
 * @returns {string[]}
 */
const getChangedMmtFiles = (rootBranch = 'origin/main') => {
	try {
		const results = (execSync(`git diff --name-only --diff-filter d ${rootBranch} HEAD | grep "miva-templates"`, {encoding: 'utf-8'}) || [])
			.split('\n')
			.filter(filePath => filePath !== '')
			.map(filePath => resolve(process.cwd(), filePath));

		if (results) {
			return results;
		}
	}
	catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}

	return [];
};

const modifyChangedGitFiles = (rootBranch = 'origin/main') => {
	const filePaths = getChangedMmtFiles(rootBranch);

	if (filePaths.length > 0) {
		for (let filePath of filePaths) {
			const contents = readFileSync(filePath, {encoding: 'utf-8'});
			writeFileSync(filePath, contents, {encoding: 'utf-8'});
		}
	}
};


module.exports = {
	modifyChangedGitFiles
};
