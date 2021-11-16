const client = require('../client')

client.get({ id: '2' }, (error, note) => {
    if (!error) {
        console.log('Note feched successfully', note)
    } else {
        console.error(error)
    }
})
