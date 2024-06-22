// const client = require('../databases/init.redis');

// var that = module.exports = {
//     setPromise: async({
//         key,
//         value
//     }) => {
//         try {
//             return new Promise( (isOkay, isError) => {
//                 client.set(key, value, (err, rs) => {
//                     return !err ?isOkay(rs) : isError(err)
//                 })
//             })
//         }
//         catch (error) {

//         }
//     },
//     getPromise: async(key) => {
//         try {
//             return new Promise( (isOkay, isError) => {
//                 client.set (key, value, (err, rs) => {
//                     return !err ? isOkay(rs) : isError(err)
//                 })
//             })
//         } catch (error) {

//         }
//     }
// }