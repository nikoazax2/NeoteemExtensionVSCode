const vscode = require('vscode');
const simpleGit = require('simple-git');

function createBranch(context) {
    let disposable = vscode.commands.registerCommand('neoteem-tools.createBranch', async function () {
        const branchName = await vscode.window.showInputBox({ prompt: 'Nom de la nouvelle branche' });
        const sourceBranch = await vscode.window.showInputBox({ prompt: 'Nom de la branche source' });

        if (branchName && sourceBranch) {
            const git = simpleGit();
            try {
                await git.checkout(sourceBranch);
                await git.checkoutLocalBranch(branchName);
                vscode.window.showInformationMessage(`Branche ${branchName} créée à partir de ${sourceBranch}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Erreur lors de la création de la branche: ${error.message}`);
            }
        } else {
            vscode.window.showErrorMessage('Le nom de la branche et la branche source sont requis');
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    createBranch,
    deactivate
};