const express = require("express");
const bodyParser = require("body-parser"); //with this we are using x-www-form-urlencoded in postman
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view-engine", "ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req, res) {
    Article.find({}, function(err, results) {
        if(!err) {
            res.send(results);
        } else {
            res.send(err);
        }
    });
})
.post(function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.send("Successfully added an article");
        }
    });
})
.delete(function(req, res) {
    Article.deleteMany({}, function(err) {
        if(err) {
            res.send(err);
        } else {
            res.send("Successfully deleted all articles");
        }
    });
});


app.route("/articles/:path")
.get(function(req, res) {
   Article.findOne({title: req.params.path}, function(err, result) {
	if(result) {
	    res.send(result);
	} else {
	    res.send("No article found!");
	}   
   });	
})
.put(function(req, res) {
    Article.findOneAndUpdate(
	{title: req.params.path},
	{title: req.body.title, content: req.body.content},
	{overwrite: true},
	function(err, result) {
	    if(result) {
		res.send("Successfully updated the document");
	    } else {
		res.send("There was an error");
	    }
	}
    );
})
.patch(function(req, res) {
    Article.updateOne(
	{title: req.params.path},
	{$set: req.body},
	function(err) {
	    if(!err) {
		res.send("Successfully updated the document");
	    } else {
		res.send(err);
	    }
	}
    );
})
.delete(function(req, res) {
    Article.deleteOne(
	{title: req.params.path},
	function(err) {
	    if(!err) {
		res.send("Successfully deleted the document");
	    } else {
		res.send(err);
	    }
	}
    );
});

app.listen(3000, function() {
    console.log("Listening on port 3000...");
})
