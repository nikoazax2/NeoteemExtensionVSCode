const vscode = require('vscode');
const { exec, execSync } = require('child_process');

async function getBitbucketUrl() {
    let url = await execSync('git config --get remote.origin.url', { encoding: 'utf8' });
    return url.trim();
}

async function OuvrirProjetBB(context) {
    const folderName = vscode.workspace.workspaceFolders[0].uri.path.split(`/`)[vscode.workspace.workspaceFolders[0].uri.path.split(`/`).length - 1]
    //const bitbucketUrl = `https://bitbucket.org/neofront/${folderName}/branches/?status=all`
    //const bitbucketUrlBack = `https://bitbucket.org/neot-v2/${folderName}/branches/?status=all`
    const disposable = vscode.commands.registerCommand('extension.openBitbucketRepo', async () => {
        const bitbucketUrlBack = await getBitbucketUrl()
        // Define the Chrome profile you want to use 
        let config = vscode.workspace.getConfiguration('NeoteemExtension');
        let chromeProfile = config.get('chromeProfile');
        const chromeExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        let chromeCommand

        if (['ws'].includes(folderName)) {
            chromeCommand = `"${chromeExecutablePath}" --profile-directory="${chromeProfile}" "${bitbucketUrlBack}"`;
        } else {
            chromeCommand = `"${chromeExecutablePath}" --profile-directory="${chromeProfile}" "${bitbucketUrl}"`;
        }

        // Execute the command
        exec(chromeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error opening Chrome: ${error.message}`);
            } else {
                console.log(`Chrome opened with profile: ${chromeProfile}`);
            }
        });
    });

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100000)
    statusBarItem.text = `$(github-inverted)  Bitbucket ${folderName}`
    statusBarItem.tooltip = `Ouvrir le repo Bitbucket ${folderName}`
    statusBarItem.command = 'extension.openBitbucketRepo'
    statusBarItem.show()

    context.subscriptions.push(statusBarItem, disposable)
}

module.exports = {
    OuvrirProjetBB
};