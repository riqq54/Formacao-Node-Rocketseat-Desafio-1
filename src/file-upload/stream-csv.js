import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)
  
const parser = fs.createReadStream(csvPath)
                    .pipe(parse({
                        from_line: 2
                    }));

for await (const buffer of parser) {
    
    await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({title: buffer[0], description: buffer[1]})
    })
}

console.log('Importação Concluída')
