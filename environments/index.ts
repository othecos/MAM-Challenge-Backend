/* eslint-disable */
import chalk from 'chalk'
import fs from 'fs'

console.log(chalk.cyan('Getting local environments'))

const environment = process.env.NODE_ENV || 'local'


try {
    const file = fs.readFileSync(`.env.${environment}`)
     
        fs.writeFile('.env', file, (err) => {
            if (err) throw err
    
            console.log(chalk.green('Environments file created successfully'))
        })
    
   
} catch (error) {
    console.log(chalk.red('An error occurred, Try again later'))
    console.error(error.status)
    console.error(error)
    // process.exit(1)
}