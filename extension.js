 
const { OuvrirProjetBB } = require('./src/projetBB');
const { OuvrirtTicketJira } = require('./src/ticketJira');
const { SelectEnv } = require('./src/selectEnv');

async function activate(context) {
    OuvrirtTicketJira(context)
    OuvrirProjetBB(context)
    SelectEnv(context)
}

module.exports = {
    activate
};
