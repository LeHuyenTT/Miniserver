const mongoose = require('mongoose')

const DBconnection = async() => {
    const conn = await mongoose
        .connect("mongodb+srv://admin:admin@hybridclass.iemw7ln.mongodb.net/HSM?retryWrites=true&w=majority", {
        //    useNewUrlParser: true,
        //    useUnifiedTopology: false, // if using cloud => true
        })
        .catch(err => {
            console.log(`Can't connect to the DB`.red, err)
        })
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = DBconnection