 
const { OuvrirProjetBB } = require('./src/projetBB');
const { OuvrirtTicketJira } = require('./src/ticketJira');
const { SelectEnv } = require('./src/selectEnv');
const { createBranch } = require('./src/createBranch');

async function activate(context) {
    OuvrirtTicketJira(context)
    OuvrirProjetBB(context)
    SelectEnv(context)
    createBranch(context)
}

module.exports = {
    activate
};
