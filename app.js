var express=require("express"),
    
    mongoose=require("mongoose"),
    bodyParser=require("body-parser"),
    methodOverride=require("method-override"),
    app =express();
    
    
    mongoose.connect("mongodb://localhost:27017/restful_app",{ useNewUrlParser: true });
    // MongoClient.connect("mongodb://localhost:27017/restful_app", { useNewUrlParser: true })
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(methodOverride("_method"));
    
    
    var blogSchema= new mongoose.Schema({
         title: String,
         image: String,
         body: String,
         created: {type: Date,default: Date.now}
    });
    
    var Blog=mongoose.model("Blog",blogSchema);
    //RESTful ROUTES
    
    //root route
    app.get("/",function(req,res){
         res.redirect("/blogs");
    });
    
    //index route
    app.get("/blogs",function(req,res){
         
         Blog.find({},function(err,blogs){
              if(err)
              console.log("error");
              else
              res.render("index",{blogs:blogs});
              
              });
         });
         
         //NEW route .....form to create a new post
         app.get("/blogs/new",function(req,res){
              res.render("new");
         });
         
         app.post("/blogs",function(req,res){
            Blog.create(req.body.blogs,function(err,blog){
                 if(err)
                 res.render("new");
                 else
                 res.redirect("/blogs")
            });
         });
         
         //show route....used to display more info about a certain post
         app.get("/blogs/:id",function(req,res){
            
            Blog.findById(req.params.id,function(err,foundBlog){
                 
                 if(err)
                 res.redirect("/blogs");
                 else
                 res.render("show",{blog:foundBlog});
            });
         });
         
         //edit route....to edit an existing blog
         app.get("/blogs/:id/edit",function(req,res){
              Blog.findById(req.params.id,function(err,foundBlog){
                   if(err)
                   res.redirect("/blogs");
                   else
                   res.render("edit",{blog:foundBlog});
              });
         });
         
         
         //update route....to add the edited info to the exixting blog
         app.put("/blogs/:id",function(req,res)
         {
            
            Blog.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,updatedBlog)
            {
                if(err)
                res.redirect("/blogs");
                else
                res.redirect("/blogs/"+req.params.id);
            });
         });

         //delete route ....to delete existing 
         app.delete("/blogs/:id",function(req,res)
         {
            Blog.findByIdAndRemove(req.params.id,function(err)
            {
                if(err)
                    res.redirect("/blogs");
                else
                    res.redirect("/blogs");
            });
         })

   app.listen(3000,'127.0.0.1',function(){
         console.log("server started");
    });
    
    
    
    