const express = require("express");

const app = express();
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const db = require("../models");

const Job = db.Job;

const axios = require("axios");
const cheerio = require("cheerio");

// for scrape function and route
let scrapeCount = 0;
let resultCount = 10;
let resultBatch = 0;
// 


//end of custom variables 




// v__ routes go here __v


// GET routes
router.get("/", (req, res) => {

  console.log("home route..");

  return db.Job.find(
    { saved: false }
  )
    // .populate("notes")
    .then((jobs) => {
      console.log("..success");
      return res.render("index", { jobs });
    })
    .catch((err) => {
      console.log("..error");
      return console.log(err);
    });

});


router.get("/saved", (req, res) => {

  console.log("saved route..");

  return db.Job.find(
    { saved: true }
  )
    .populate("notes")
    .then((jobs) => {
      console.log("..success");
      return res.render("index", { jobs });
    })
    .catch((err) => {
      console.log("..error");
      return console.log(err);

    });

});


router.get("/notes/:_id", (req, res) => {

  console.log("notes route..");

  var _id = req.params._id;

  console.log(_id);

  return db.Job.find(
    { _id: _id }
  )
    .populate("notes")
    .then((data) => {
      console.log("..success");
      // return res.render("index", { jobs });

      console.log(data[0].notes);

      return res.json({ status: "Success", notes: data[0].notes });
    })
    .catch((err) => {
      console.log("..error");
      return console.log(err);

    });

});
// 

// PUT routes
router.put("/api/update/save", function (req, res) {

  console.log("save route called");

  var linkedinID = req.body.linkedinID;

  console.log("this is the linkedinID: " + linkedinID);

  db.Job.updateOne(
    { linkedinID: linkedinID },
    { $set: { "saved": true } }
  )
    .then((results) => {
      console.log(results);
      return res.json({ status: "Success", redirect: "/saved" });
    })
    .catch((error) => {
      return console.log(error);
    });

});

router.put("/api/update/unsave", function (req, res) {

  console.log("save route called");

  var linkedinID = req.body.linkedinID;

  console.log("this is the linkedinID: " + linkedinID);

  db.Job.updateOne(
    { linkedinID: linkedinID },
    { $set: { "saved": false } }
  )
    .then((results) => {
      console.log(results);
      return res.json({ status: "Success", redirect: "/saved" });
    })
    .catch((error) => {
      return console.log(error);
    });

});
// 


//DELETE ROUTES
router.delete("/api/delete/one", function (req, res) {

  console.log("delete route called");

  var linkedinID = req.body.linkedinID;

  console.log("this is the linkedinID: " + linkedinID);

  db.Job.remove(
    { linkedinID: linkedinID }
  )
    .then((results) => {
      console.log(results);

      scrapeCount = 0;
      resultCount = 10;
      resultBatch = 0;

      return res.json({ status: "Success", redirect: "/saved" });
    })
    .catch((error) => {
      return console.log(error);
    });
});

router.delete("/api/delete/all", function (req, res) {

  console.log("delete all route called");

  db.Job.remove(
    {}
  )
    .then((results) => {
      console.log(results);

      scrapeCount = 0;
      resultCount = 10;
      resultBatch = 0;


      return res.json({ status: "Success", redirect: "/saved" });
    })
    .catch((error) => {
      return console.log(error);
    });
});


router.delete("/api/delete/note/one", function (req, res) {

  console.log("delete note route called");

  var linkedinID = req.body.linkedinID;

  console.log("this is the linkedinID: " + linkedinID);

  db.Job.remove(
    { linkedinID: linkedinID }
  )
    .then((results) => {
      console.log(results);

      scrapeCount = 0;
      resultCount = 10;
      resultBatch = 0;

      return res.json({ status: "Success", redirect: "/saved" });
    })
    .catch((error) => {
      return console.log(error);
    });
});
//


// POST routes
router.post("/api/create/note/:_id", function (req, res) {

  let note = req.body;

  console.log("req.body = " + note);

  db.Note.create(note)
    .then(function (dbNote) {
      return db.Job.findOneAndUpdate({ _id: req.params._id},
        { $push: { notes: dbNote._id } },
        { new: true }
      );
    })
    .then(obj_results => {
      console.log("note created: " + obj_results);
    })
    .catch(obj_err => {
      console.log(obj_err);
    });

});



router.post("/api/scrape", (req, res) => {

  console.log("scrape initiated");

  let axiosURL = "https://www.indeed.com/jobs?q=company%3A%28-comcast+-sap+-vanguard+-lockheed%29++title%3A%28programmer+or+developer+or+engineer%29++title%3A%28javascript+or+react+or+reactjs+or+reacjt.js+or+js+or+node+or+nodejs+or+node.js+or+mern+or+web+or+%E2%80%9Cfull+stack%E2%80%9D+or+%E2%80%9Dfront+end%E2%80%9D+or+%E2%80%9Dback+end%E2%80%9D+or+%E2%80%9Cfull-stack%E2%80%9D+or+%E2%80%9Dfront-end%E2%80%9D+or+%E2%80%9Dback-end%E2%80%9D+or+software%29++title%3A%28-android+-ios+-manager+-devops+-%E2%80%9Dsr.%E2%80%9D+-sr+-%22team+lead%22+-physical+-%E2%80%9Dsenior%E2%80%9D+-sales+-%22design+intern%22+-sap+-ux+-java+-graphic+-ruby+-lead+-mid+-php+-sap+-wordpress+-java+-director+-principal+-ii+-iii+-python+-security+-network+-process+-president+-data+-scientist%29++%28+%28engineer+programmer+or+developer+or+%22entry+level%22+or+%22entry-level%22+or+junior%29++or++title%3A%28engineer+or+programmer+or+developer+or+intern+or+internship+or+pt+or+junior+or+%22entry+level%22+or+jr+or+associate%29+%29++%28es6+or+mongo+or+mongodb+or+firebase+or+postgresql+or+mysql+or+mern+or+express+or+node+or+npm+or+ajax+or+api+or+pwa+or+git+or+github+or+json+or+react+or+redux+or+jquery+or+javascript+or+html+or+html5+or+%22html+5%22+or+css+or+css3+or+%22css+3%22+or+bootstrap+or+mysql+or+vue+or+ember+or+rdbms+or+reactjs+or+react.js+or+nodejs+or+node.js+or+restful%29++%28+company%3A%28rjmetrics+or+perpay+or+deacom+or+monetate+or+delphic+or+neat+or+intuitsolutions+or+retailmenot+or+indeed+or+rei+or+%E2%80%9Dwhole+foods%E2%80%9D+or+trek+or+homeaway%29++or++%28%28engineer+or+programmer+or+developer%29+%28-flash+-gpa+-Illustrator+-diploma+-%22high+school%22+-asp+-.net+-c%23+-vb.net+-lamp+-j2ee%29%29+%29&l=19102&radius=5&sort=date";


  console.log(scrapeCount);
  console.log(resultCount);
  console.log(resultBatch);

  scrapeCount++;

  axios.get(axiosURL, {
    params: {
      limit: resultCount,
      start: resultBatch || 0
    }
  })
    .then(response => {

      resultBatch += resultCount;

      console.log(scrapeCount);
      console.log(resultCount);
      console.log(resultBatch);


      const $ = cheerio.load(response.data);

      const arr_results = [];


      $(".jobsearch-SerpJobCard").each(function (i, element) {

        const result = {};

        // console.log("inside of each loop");

        result.linkedinID = $(this).attr("id");
        result.datajk = $(this).attr("data-jk");
        result.title = $(this).children("div").children("a").attr("title");
        result.company = $(this).children(".sjcl").children("div").children(".company").text().trim();
        result.desc = $(this).children(".summary").text().trim();
        result.link = "https://www.indeed.com" + $(this).children("div").children("a").attr("href");

        arr_results.push(result);

      });

      // console.log("outside of each loop");

      arr_results.forEach(result => {
        if (result.title) {
          // console.log(result);
          // console.log("inside of loop");

          db.Job.create(result)
            .then(obj_results => {
              // console.log("record created");
            })
            .catch(obj_err => {
              console.log(obj_err);
            });

        };
      })

    })
    .then(() => {
      // return console.log(results);
      return res.json({ status: "Success", redirect: "/" });
      // res.render("index", {jobs});

    })
    .catch((error) => {
      return res.json(error);
    });

});
// 





















// no custom code below this line

// Export routes for server.js to use.
module.exports = router;
