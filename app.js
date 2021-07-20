//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);


/////////////////////Request targetting all articles ///////////////////


app.route("/articles")
  .get(
    //1.Get route to fetch all the articles

    function (req, res) {
      Article.find(function (err, foundArticles) {
        if (!err) {
          res.send(foundArticles);
        } else {
          res.send(err);
        }
      });
    })

    //1.End
  
  .post(
    //2.Send data into db
    function (req, res) {
      console.log(req.body.title);
      console.log(req.body.content);

      //3.Create db
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });
      //3.End
      newArticle.save(function (err) {
        if (!err) {
          res.send("success");
        } else {
          res.send(err);
        }
      });
      //3.End
    } )
    //2.End
 


  .delete(
    //4.Delete All articles
    function (req, res) {
      Article.deleteMany(function (err) {
        if (!err) {
          res.send("Successfully deleted all the articles");
        } else {
          res.send(err);
        }
      });
    }
    //4.End
  );


  /////////////////////Request targetting a specific articles ///////////////////

  // localhost:3000/articles/Manisha-Kumari
app.route("/articles/:articleTitle")
// req.params.articleTitle = jQuery ;

.get(function(req,res){

  Article.findOne({title:  req.params.articleTitle },function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      console.log("No matching articles found!");
    }
});
})


.put(function(req,res){

  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err,result){
      if(!err)
      {
        res.send("Successfully updated articles!");
      }
    }
    );

})
.patch(function(req,res){
 
  Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Successfully updated!");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
  {title:req.params.articleTitle},
  function(err){
    if(!err){
      res.send("Successfully deleted!");
    }else{
      res.send(err);
    }
  }
  );
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
