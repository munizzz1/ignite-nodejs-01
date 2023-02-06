import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf8')
        .then(data => {
            this.#database = JSON.parse(data);
        })
        .catch(() => {
            this.#persist();
        });
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    create(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data];
        }

        this.#persist();
        
        return data;
    }

    select(table, search) {
        let data = this.#database[table];

        if (search.title || search.description) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value);
                });
            });
        }

        return data;
    }

    update(table, id, data) {
        const rowIdenx = this.#database[table].findIndex(row => row.id === id);

        if ( rowIdenx > -1) {
            const task = this.#database[table][rowIdenx];

            if (data.title) task.title = data.title;
            
            if (data.description) task.description = data.description;
            
            task.updated_at = new Date();

            this.#database[table][rowIdenx] = task;

            this.#persist();
        } else {
            return false;
        }

        return true;
    }

    updateStatusTask(table, id) {
        const rowIdenx = this.#database[table].findIndex(row => row.id === id);

        if ( rowIdenx > -1) {
            const task = this.#database[table][rowIdenx];

            if (task.completed_at) {
                task.completed_at = null
            } else {
                task.completed_at = true
            }
 
            task.updated_at = new Date();

            this.#database[table][rowIdenx] = task;

            this.#persist();
        } else {
            return false;
        }

        return true;
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();

            return true;
        }

        return false;
    }
}