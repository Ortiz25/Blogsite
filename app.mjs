import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import lodash from "lodash";
import mongoose from "mongoose";

//////////////DB Link//////////

async function main() {
  await mongoose.connect(
    "mongodb+srv://admin-dell:m0t0m0t0@cluster0.sjzfs9g.mongodb.net/blogSiteDB"
  );
}
main().catch((err) => console.log(err));

///////////DB Schema//////////////////
const contentSchema = new mongoose.Schema({
  title: String,
  content: String,
});

///////////DB MODEL AND COLLECTION/////
const Content = mongoose.model("content", contentSchema);

///////////DEFAULT CONTENT////////////////
const homeStartingContent = new Content({
  title: "Home",
  content:
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
});
const aboutContent = new Content({
  title: "About",
  content:
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.",
});
const contactContent = new Content({
  title: "Contact",
  content:
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.",
});

const defaultContent = [homeStartingContent, aboutContent, contactContent];
///////////////////////////////////////////////////////////
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const _ = lodash();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Content.find((err, content) => {
    if (content.length === 0) {
      Content.insertMany(defaultContent, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Default items added");
        }
      });
      res.redirect("/");
    } else {
      res.render("home", {
        posts: content,
      });
    }
  });
});

app.get("/about", (req, res) => {
  Content.findOne({ name: "About" }, (err, content) => {
    res.render("about", {
      aboutContent: content.title,
      aboutContent: content.content,
    });
  });
});
app.get("/contact", (req, res) => {
  Content.findOne({ name: "Contact" }, (err, content) => {
    res.render("contact", {
      homeStartingContent: content.title,
      contactContent: content.content,
    });
  });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});
app.get("/posts/:topic", (req, res) => {
  const requestedTitle = req.params.topic.trim();

  Content.findOne({ title: requestedTitle }, (err, requested) => {
    if (requested === "About" || requested === "Contact") {
      res.redirect(`/${requested.title.toLowerCase()}`);
    } else {
      res.render("post", {
        title: requested.title,
        body: requested.content,
      });
    }
  });
});

app.post("/compose", (req, res) => {
  const newPost = new Content({
    title: req.body.titleInput,
    content: req.body.postInput,
  });
  Content.insertMany(newPost, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Post added");
    }
  });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
