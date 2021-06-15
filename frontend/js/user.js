const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

var cs = process.env.MONGO_CONNECTION_STRING || 'mongodb+srv://cluster0.uapdk.mongodb.net/myFirstDatabase';
mongoose.connect(cs,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true});
var db = mongoose.connection;
db.on('connected', function() {
console.log("Successfully connected to MongoDB!");
});

db.on('error',function(err){
    console.log('connect error:'+err);
})
db.on('disconnected',function(){
    console.log('disconnected');
})

const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const userModel = mongoose.model('user_data',userSchema)

module.exports = userModel