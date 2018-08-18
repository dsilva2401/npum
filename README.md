# NPUM
 
Issues updating remotely a nodejs process?

`npum` may help you, it provides a watcher daemon looking at a repository branch for updates, when it finds an update it handles the update.

## Requirements
- `git`
- `pm2`

## Project requirements

`npum` uses 2 scripts that should be defined inside the `package.json` file.

- `start` script is used to start the project
- `stop` script is used to stop the project processes

> Don't forget to add any build procedure inside the `postinstall` script

If project shouldn't be updated at an specific moment a file called `.npum-prevent-update` should be added to the root of the project

## Start updates watcher

To start the watching process use the next command:

```bash
npum start <working-dir> <git-url> [git-branch]
```

- `working-dir`: directory where the project will be cloned
- `git-url`: url from the git repository to be watched (ensure clone permissions for the url)
- `git-branch`: branch from the git repository to be watched (default: master)