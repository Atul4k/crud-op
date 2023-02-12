const express=require("express");
const mongoose=require("mongoose");
const bodyParser = require("body-parser");
const app= express();


mongoose.set('strictQuery',false);
mongoose.connect("mongodb://127.0.0.1:27017/Sample",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("connected with mongo")
}).catch((err)=>{
    console.log(err)
})
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
const productSchema= new mongoose.Schema({
    name:String,
    description:String,
    price:Number,

})
const Product =new mongoose.model("Product",productSchema)
//create product
app.post("/get", async(req,res)=>{
const product =await Product.create(req.body);

res.status(200).json({
    success:true,
    product
})
})

//read product
app.get("/getr",async(req,res)=>{
    const products=await Product.find();


    res.status(200).json({success:true,products})
})


//update product
app.put("/getu/:id",async(req,res)=>{
    let product =await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
    }

    product =await Product.findByIdAndUpdate(req.params.id,req.body,{new:false,
        useFindAndModify:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        product
    })
})
// delete product
app.delete("/getu/:id",async(req,res)=>{
    const product =await Product.findById(req.params.id);


    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"product is deleted successfully"
    })
})




app.listen(5000,()=>{
    console.log("server is running")
})