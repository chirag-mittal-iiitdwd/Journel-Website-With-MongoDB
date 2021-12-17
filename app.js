const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const ejs = require("ejs");
const mongoose = require('mongoose');
const { add } = require("lodash");

mongoose.connect("mongodb+srv://admin-chirag:watch123@cluster0.wx7b9.mongodb.net/Journel");
const postSchema={
	name:String,
	content:String
};

const Post=mongoose.model("Post",postSchema);

const homeStartingContent="Hi, guys this page is made by Chirag Mittal, Btech Student Indian Institute Of Information Technology, Dharwad ( 2020 - 2024 ), Here you can record your views like in a Diary. Go to /compose to add a new entry";
const aboutContent = "Hi, guys this page is made by Chirag Mittal, Btech Student Indian Institute Of Information Technology, Dharwad ( 2020 - 2024 ), I am a Web Developer and Competetive Programmer @Codechef";
const contactContent = "";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/',function(req,res){
	Post.find({},function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			res.render('home',{homestarting:homeStartingContent,posts:docs});
		}
	});
});

app.get('/about',function(req,res){
  res.render('about',{aboutStarting:aboutContent});
});

app.get('/contact',function(req,res){
  res.render('contact',{contactStarting:contactContent}); 
});

app.get('/compose',function(req,res){
  res.render('compose');
});

app.post('/compose',function(req,res){
	const newTitle=req.body.postTitle;
	const newPost=req.body.postBody;
	const newEntry=new Post({
		name:newTitle,
		content:newPost
	});
	newEntry.save();
	res.redirect('/');
});

app.get("/posts/:postName",function(req,res){
	const requestedTitle=_.lowerCase(req.params.postName);
	Post.find({},function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			docs.forEach(function(post){
				const storedTitle=_.lowerCase(post.name);
				if(storedTitle===requestedTitle){
					res.render('post',{redirectPost:post});
				}
			})
		}
	});
});

app.post("/delete",function(req,res){
	const deleteID=req.body.button;
	Post.findByIdAndDelete(deleteID,function(err){
		if(!err){
			console.log("Post Deleted Successfully");
            res.redirect("/");
		}
	})
});

app.listen(3000, function() {
  console.log("Server started on port 3000 : http://localhost:3000");
});