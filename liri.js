require("dotenv").config();

// Require the key.js file 
var keys = require('./keys.js');

// Required NPMs
var Spotify = require ('node-spotify-api');
var request = require ('request');
var moment = require ('moment');

var spotify = new Spotify(keys.spotify);

var fs = require ("fs"); 
var arguments = process.argv;
var firstInput = "";
var secondInput = "";

//Names and Titles entered
for (var i = 3; i < arguments.length; i++) {
    if (i > 3 && i < arguments.length) {
        firstInput = firstInput + "%20" + arguments[i];
    }
    else {
        firstInput += arguments[i];
    }
    console.log(firstInput);
}

for (var i = 3; i < arguments.length; i++) {
    secondInput = firstInput.replace(/%20/g, " ");
}

var userCom = process.argv[2];
console.log(userCom);
console.log(process.argv);
runLiri();

function runLiri() {
    switch (userCom) {
        case "concert-this":
            fs.appendFileSync("log.txt", secondInput + "\n-----------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });

            //Search function for Bands In Town
            var queryURL = "https://rest.bandsintown.com/artists/" + firstInput + "/events?app_id=codingbootcamp"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var data = JSON.parse(body);
                    for (var i = 0; i < data.length; i++) {
                        
                        //Venue name result
                        console.log("Venue: " + data[i].venue.name);
                        fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });

                        //Venue location result
                        if (data[i].venue.region == "") {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
                            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.country + "\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });

                        } else {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
                            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country + "\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });
                        }

                        //Concert date result
                        var date = data[i].datetime;
                        date = moment(date).format("MM/DD/YYYY");
                        console.log("Date: " + date)
                        fs.appendFileSync("log.txt", "Date: " + date + "\n-----------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                        console.log("-----------")
                    }
                }
            });

            break;
        case "spotify-this-song":
        console.log("here");
            if (!firstInput) {
                firstInput = "The%20Sign";
                secondInput = firstInput.replace(/%20/g, " ");
            }

            fs.appendFileSync("log.txt", secondInput + "\n-----------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });

            console.log(spotify);
            spotify.search({

                type: "track",
                query: firstInput
            }, function (err, data) {
                if (err) {
                    console.log("Error occured: " + err)
                }

                var info = data.tracks.items

                for (var i = 0; i < info.length; i++) {
                    var albumObject = info[i].album;
                    var trackName = info[i].name
                    var preview = info[i].preview_url
                    var artistsInfo = albumObject.artists
                    for (var j = 0; j < artistsInfo.length; j++) {
                        console.log("Artist: " + artistsInfo[j].name)
                        console.log("Song Name: " + trackName)
                        console.log("Preview of Song: " + preview)
                        console.log("Album Name: " + albumObject.name)
                        console.log("-----------")
                        fs.appendFileSync("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of Song: " + preview + "\nAlbum Name: " + albumObject.name + "\n-----------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                    }
                }
            })

            break;
        case "movie-this":
            if (!firstInput) {
                firstInput = "Mr%20Nobody";
                secondInput = firstInput.replace(/%20/g, " ");
            }

            fs.appendFileSync("log.txt", secondInput + "\n-----------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });

            //Search request to OMDB
            var queryURL = "https://www.omdbapi.com/?t=" + firstInput + "&y=&plot=short&apikey=trilogy"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var info = JSON.parse(body);
                    console.log("Title: " + info.Title)
                    console.log("Release Year: " + info.Year)
                    console.log("OMDB Rating: " + info.Ratings[0].Value)
                    console.log("Rating: " + info.Ratings[1].Value)
                    console.log("Country: " + info.Country)
                    console.log("Language: " + info.Language)
                    console.log("Plot: " + info.Plot)
                    console.log("Actors: " + info.Actors)

                    fs.appendFileSync("log.txt", "Title: " + info.Title + "\nRelease Year: " + info.Year + "\nIMDB Rating: " + info.Ratings[0].Value + "\nRating: " +
                        info.Ratings[1].Value + "\nCountry: " + info.Country + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n-----------\n",
                        function (error) {
                            if (error) {
                                console.log(error);
                        };
                    });
                }
            });
        break;
    }
}

if (userCom == "do-what-it-says") {
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        var textArr = data.split(",");
        userCom = textArr[0];
        firstInput = textArr[1];
        secondInput = firstInput.replace(/%20/g, " ");
        runLiri();
    })
}