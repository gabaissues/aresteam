const firebase = require('firebase')

var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain, 
    databaseURL: "https://aresteam-database-default-rtdb.firebaseio.com",
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database()

console.log(' ________________________________')
console.log('|                                |')
console.log('| Firebase iniciada com sucesso. |')
console.log('|________________________________|')

module.exports = { database }