const vscode = require('vscode');
const { exec } = require('child_process');

async function OuvrirProjetBB(context) {
    const folderName = vscode.workspace.workspaceFolders[0].uri.path.split(`/`)[vscode.workspace.workspaceFolders[0].uri.path.split(`/`).length - 1]
    let config = vscode.workspace.getConfiguration('NeoteemExtension');
    const nomFront = config.get('urlBBFront');
    const nomBack = config.get('urlBBBack');

    const bitbucketUrl = `https://bitbucket.org/${nomFront}/${folderName}/branches/?status=all`
    const bitbucketUrlBack = `https://bitbucket.org/${nomBack}/${folderName}/branches/?status=all`

    const disposable = vscode.commands.registerCommand('extension.openBitbucketRepo', async () => {
        // Define the Chrome profile you want to use 
        let chromeProfile = config.get('chromeProfile');
        const chromeExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        let chromeCommand
        const projetsBack = JSON.parse(config.get('nomsBBBack'))

        if (projetsBack.includes(folderName)) {
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