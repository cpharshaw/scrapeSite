$(document).ready(function () {
  // window.onload = function () {




  $(document).on("click", ".delete-job", function (event) {
    event.preventDefault();

    var linkedinID = $(this).attr("data-linkedinID");

    console.log(linkedinID);

    $.ajax({
      method: "DELETE",
      url: "/api/delete/one",
      data: {
        linkedinID: linkedinID
      }
    })
      .done(function (results) {
        if (results.status === "Success") {
          return window.location = results.redirect;
        } else {
          console.log("failure");
          console.log(results);
        }
      });

  });

  $(document).on("click", ".delete-alljobs", function (event) {
    event.preventDefault();

    $.ajax({
      method: "DELETE",
      url: "/api/delete/all"
    })
      .done(function (results) {
        if (results.status === "Success") {
          return window.location = results.redirect;
        } else {
          console.log("failure");
          console.log(results);
        }
      });

  });



  $(document).on("click", ".update-save-job", function (event) {
    event.preventDefault();

    var linkedinID = $(this).attr("data-linkedinID");

    console.log(linkedinID);

    $.ajax({
      method: "PUT",
      url: "/api/update/save",
      data: {
        linkedinID: linkedinID
      }
    })
      .done(function (results) {
        if (results.status === "Success") {
          return window.location = results.redirect;
        } else {
          console.log("failure");
          console.log(results);
        }
      });

  });



  $(document).on("click", ".update-unsave-job", function (event) {
    event.preventDefault();

    var linkedinID = $(this).attr("data-linkedinID");

    console.log(linkedinID);

    $.ajax({
      method: "PUT",
      url: "/api/update/unsave",
      data: {
        linkedinID: linkedinID
      }
    })
      .done(function (results) {
        if (results.status === "Success") {
          return window.location = results.redirect;
        } else {
          console.log("failure");
          console.log(results);
        }
      });

  });



  $(document).on("click", ".scrape-jobs", function (event) {
    event.preventDefault();

    $.ajax({
      method: "POST",
      url: "/api/scrape",
    })
      .done(function (results) {
        if (results.status === "Success") {
          console.log("success");
          return window.location = results.redirect;
        } else {
          console.log("failure");
          console.log(results);
        }
      });

  });







  $(document).on("click", ".job-notes", function (event) {
    event.preventDefault();

    var _id = $(this).attr("data-id");

    $(".modal-title").text("Notes for: " + _id);
    $(".modal-form").attr("data-id", _id);
    // $(".modal-title").text("Notes for: " + id);
    // $(".modal-title").text("Notes for: " + id);

    console.log(_id);


    $.ajax({
      url: "/notes/" + _id,      
      method: "GET"
    })
      .done(function (results) {
        if (results.status === "Success") {
          
          var notesList = $("#notesList");

          notesList.empty();
      

          results.notes.forEach(note => {
            notesList.append(`
              <li class="row">
                ${note.body}
                <button class="btn btn-danger float-right align-baseline">&times;</button>
              </li>
            `);
          });
          
          return;
        } else {
          console.log("failure");
          console.log(results);
        }
      });

  });



  $("#modal-form-id").on("submit", function (event) {
    event.preventDefault();

    var note = $(".modal-input").val().trim();
    var _id = $(".modal-form").attr("data-id");


    console.log(note);

    if (!note) {
      return;
    }

    $.ajax({
      method: "POST",
      url: "/api/create/note/" + _id,
      data: {
        body: note
      }
    })
      .done(function (results) {
        if (results.status === "Success") {
          console.log("success");
          return window.location = results.redirect;
        } else {
          console.log("failure");
          console.log(results);
        }
      });

      $(".modal-input").val("");
      $('#myModal').modal('toggle');

  });





















});

