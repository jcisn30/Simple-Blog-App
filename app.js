var express             = require("express"), //adds express package
    app                 = express(), //runs express package to app variable
    bodyParser          = require("body-parser"), //adds body-parser package
    mongoose            = require("mongoose"), //adds mongoose package, let use of javaScript to talk to mongo DB
    methodOverride      = require("method-override"), //adds method override npm, to use put/delete override
    expressSanitizer    = require("express-sanitizer"); //adds express sanitizer
    
    

mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true}); //connects to mongo DB
app.use(bodyParser.urlencoded({extended: true})); //grabs data for http for database use
app.set("view engine", "ejs"); //used ejs for all file extension
app.use(express.static("public")); //access to custom CSS file
app.use(methodOverride("_method"));
app.use(expressSanitizer()); //use for create and update

//DB collection schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,  //could do {type: String, default: "input default image link"}
    body: String,
    created: {type: Date, default: Date.now} //puts a default time of now
});

//mongoose model
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Web Devolpment",
//     image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=750&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//     body: "This is a blog post about Web Development"
// });

//RESTful Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!!!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
    
});

//NEW route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE route
app.post("/blogs", function(req, res){
    //create blog
    // console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // console.log("++++++++++");
    // console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } 
        //redirect
        else {
            res.redirect("/blogs");
        }
    });
    
});

//SHOW route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
});

//EDIT route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog}); 
        }
    });
   
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DESTROY route
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
            res.redirect("/blogs");
       }
   });
   //redirect
});

//starts mongo DB server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("restfulBlogApp server has started");
});