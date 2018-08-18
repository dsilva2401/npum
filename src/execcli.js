// Libs
var startUpdatesWatcher = require('.').startUpdatesWatcher;

// Vars
var action = process.argv[2];
var workingDir = process.argv[3];
var gitUrl = process.argv[4];
var gitBranch = process.argv[5];

// Validation
if (!workingDir) {
    console.log('Invalid working dir');
    return;
}
if (!gitUrl) {
    console.log('Invalid git url');
    return;
}
if (!gitBranch) {
    gitBranch = gitBranch || 'master';
}

// Start
startUpdatesWatcher(workingDir, {
    url: gitUrl,
    branch: gitBranch
});