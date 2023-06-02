const fs = require('node:fs/promises');
const path = require('node:path');

module.exports = {
    readDB: async () => {
        const buffer = await fs.readFile(path.join(process.cwd(), 'db.json'));
        const json = buffer.toString();
        return json ? JSON.parse(json) : [];
    },
    writeDB: async (users) => {
        await fs.writeFile(path.join(process.cwd(), 'db.json'), JSON.stringify(users))
    }
}