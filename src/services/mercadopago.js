const mercadopago = require('mercadopago')

mercadopago.configure({
    access_token: process.env.acessToken
})

console.log(' ___________________________________________')
console.log('|                                           |')
console.log('| MercadoPago foi inicializado com sucesso. |')
console.log('|___________________________________________|')