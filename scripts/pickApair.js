/*
 Name: Sunhye Kwon
 Assignment: Assignment 4
 Date: Jun 10 2017

Description: This is the application for Pick-A-Pair game.
 Files: index.html - The main html page for Pick-A-Pair game
 main.css - The main styles css file
 */


/** !!!  READ ME !!!
 *  For the purpose of clarity, "image" will refer to an image element,
 *  (e.g <img>) and "picture" will refer to a picture (e.g. a cow, or a .gif or
 *  .png) that is shown on the UI.
 *
 *  Make sure you read all the docs.  Most of them contain explanations to
 *  help you understand how to complete other parts of the code.
 *  You shouldn't need to add any other variables or other objects/elements.
 *
 *  YOU DO NOT HAVE TO DO THE TODO TASKS IN ORDER
 *
 *  LEAVE ALL COMMENTS IN SO I CAN FIND THE PARTS TO MARK QUICKLY!!!!!
 */

/** TODO 1: Write the statement that executes the init() function when the
 * document loads.  (2 marks)
 */

document.addEventListener("DOMContentLoaded", init);


// The pictureMap array maps the pictures to each cell on the board: 
// The value of the elements is an index# for a picture file e.g. image1.png,
// image2.png, image3.png, etc.  So, for example, the element of index 0
// would default to a 1, meaning that cell's <img> would reference image1.png.
// By default, the pictures are laid out 1 1 2 2 3 3 4 4 etc...
// When the game starts, these indexes will be scrambled so that each
// cell is assigned a random index.  E.g. if pictureMap[0] is assigned the
// index 4, that means that cell is "hiding" images/image4.png, so when
// the user clicks on that image, it will reveal image4.png.
// Initialize the imgMap array:
var pictureMap = new Array(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
    10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18);

// matchedImgs keeps track of which image elements have been matched so that 
// the user can't flip an image that has already been matched. This one 
// stores a boolean true if the image has been matched and false if it hasn't
// been matched, yet.
var matchedImgs = new Array();
var numMatches = 0;  // keeps track of # of matched pairs (18 max)

// the pair of image elements that was clicked: index 0 contains the first 
// image element that was clicked and index 1 contains the second image 
// element that was clicked
var clickedImgs = new Array(null, null);

var okToClick = false;  // keep track of when it's ok to click during timer
var clickNum = 0; // first image click (0) or second image click (1)?
var flipTimer; // flips cards back after 2 seconds if no match
var gameTimer; // counts mins/seconds user is taking to finish
var gameTicker = 0;  // seconds counter for gameTimer


// start a new game
function init() {

    // scramble the images
    scramble();

    // it's ok to click an image
    okToClick = true;

    // reset all images to unmatched
    for ( i = 0; i < 36; i++) {
        matchedImgs[i] = false;
    }

    /** TODO 2: Add the images to the board:
     * There are 6 rows.
     * Each row has 6 table cells.
     * Each cell has an image that shows the "back" of the game cards.
     * The image's id should be set to "imgX" where X is an index
     *  from 0 to 35 (1st row/1st col is 0, 1st row/2nd col is 1, 1st
     *   row/3rd col is 2... 2nd row/1st col is 6, 2nd row/2nd col is 7,
     *   etc.)
     * The image's source should be image0.png, which is the "back" of each image.
     * Each image should be registered to execute the showPicture() function when
     *   clicked (the clicked image is passed into the showPicture() function).
     * (10 marks)
     */

   //get element "board"
    var board = document.getElementById("board");

    //for create 6 columns
    for(var i=0; i<6; i++){

        // create tr
        var tr=document.createElement("tr");

        //for create 6 rows
        for(var j=0 ; j<6 ; j++) {

            //create td
            var td = document.createElement("td");

            //append td as tr's child
            tr.appendChild(td);

            //create img
            var imgs = document.createElement("img");

            //append img as td's child
            td.appendChild(imgs);

            //put the default image
            imgs.src = "images/image0.png";

            //assign the id for each image
            imgs.id = "img" + ((i * 6) + j);

            //pass parameter to showPicture function
            imgs.addEventListener('click', function(){
                showPicture(this);
            });
        }

        //append tr as board's child
        board.appendChild(tr);

    }







    /** TODO 3: Start the game timer:  every second, the timeGame() function
     *  should execute, which causes the ticker on the page to increase.
     * (2.5 marks)
     */
    gameTimer= setInterval(timeGame,1000);


    /** TODO 4: Register the "message" dialog with a click event handler: when
     *  clicked, the showDialog(false) function should execute.
     *  (3.5 marks)
     */

    //pass the parameter to showDialog function
    document.getElementById('message').addEventListener("click", function() {
            showDialog(false);
        }
    );
}

// Flips over an image when it's clicked: swaps the source of
// the image to its hidden picture.  The img param is the
// actual image that the user clicked on
function showPicture(img) {

    // get the picture# from this image's id (always "imgX" so
    // substring(3) starts at pos 3 and gives us the rest of the string)
    var index = img.id.substring(3);

    // if it's ok to click right now and this image is not already
    // matched
    if (okToClick && !matchedImgs[index]) {

        /** TODO 5: Change the image's source to the hidden picture associated
         *  with it (use the pictureMap() array)
         * (2 marks)
         */
        img.src = "images/image" + pictureMap[index] + ".png";


        // The first click just reveals a hidden picture, and the 
        // second click determines if the first picture and second
        // picture match.

        // if this is the first image click
        if (clickNum === 0) {

            /**
             * TODO 6: Mark this image as having been clicked: we need to add it to
             * the clickedImgs array.  Also, set clickNum to 1 so that we
             * are ready when the user clicks the second image in the pair.
             * (2 marks)
             */
            clickedImgs[0] = img;
            clickNum=1;


        } else { // this is the second image click

            /**
             * TODO 7: Mark this image as also having been clicked (add it to the
             *     clickedImgs array).
             * (1 mark)
             */
            clickedImgs[1] = img;

            /** TODO 8: If the two clickedImgs are referencing the same picture
             *  file, they are a match:
             *   - mark these images as matched by updating their boolean value
             *     to true in the matchedImgs array.
             *   - increment the number of matches made so far
             *   - set a timer to invoke the flip() method in 100 milliseconds
             *     (a one-time event, not a recurring timer event)
             * Otherwise, if the images are not a match, execute the flip()
             * method in 2 seconds (a one-time event, not a recurring timer event)
             *
             * (Tip: there's more than one way to check if they are the same
             * picture: you could check the source file or you could check the
             * pictureMap[] elements, or perhaps you might think of something else.
             * (8 marks)
             */

            //if the images are matched, change false to true in matchedImgs array
            if(clickedImgs[0].src === clickedImgs[1].src){
                matchedImgs[clickedImgs[0].id.substring(3)] = true;
                matchedImgs[clickedImgs[1].id.substring(3)] = true;

                //track how much matched
                numMatches++;

                //timeout 100 millisecond if images are matched
                flipTimer = setTimeout(flip,100);

            }else {

                //timeout 2000 millisecond if images are not matched
                flipTimer = setTimeout(flip,2000);
            }



            // reset clickNum so that we can start over with
            // a new pair of picturese
            clickNum = 0;
            // don't allow clicking until flip() is done
            okToClick = false;

        } // end of if/else 1st/2nd image click
    } // end of if it's ok to click and the image isn't a matched one
} // function showPicture()

// Flips the images back over if there's no match and check to 
// see if the game is finished.
function flip() {

    /** TODO 9: If the clickedImages aren't the same,
     *  show the image0.png card back.
     * (3 marks)
     */

    //if the images are not matched, put default image
    if(clickedImgs[0].src !== clickedImgs[1].src){
        clickedImgs[0].src = "images/image0.png";
        clickedImgs[1].src = "images/image0.png";
    }


    // it's ok to click again
    okToClick = true;

    /** TODO 10: If we've reached 18 matches, the game is finished.
     *  - display "Good Game! You finished in " followed by the elapsed time
     *      - this should all go in the "winner" heading on the message dialog
     *      - (tip: use the contents of the "ticker" element on the page
     *        to get the elapsed time in mm:ss)
     *
     *  - invoke the showDialog(true) function to show the message dialog
     *  - stop the game timer
     *  - since the game is done, the user should not be allowed to click
     *    anymore images
     * (6 marks)
     */

    // after matching 18pairs, show the dialog
    if(numMatches === 18){
        showDialog(true);
        var finish = document.createTextNode("Good Game! You finished in");
        document.getElementById("winner").appendChild(finish+document.
                getElementById("ticker").innerHTML);

        //stop the time processing
        clearInterval(gameTimer);
        okToClick =false;

    }
}


/*
 * Possible enhancements:
 * - keep track of # of moves (clicking 2 images is one move) it took to finish
 * - add a Restart button that appears at the end of the game (it should
 *     not appear while game is being played) so the user can play again
 *     without reloading the page
 * - allow the user to choose a board size (e.g. 4x4, 6x6, 8x8, 10x10, etc)
 */

// Executes once per second: updates the ticker on the page
// with the current time elapsed.
function timeGame() {

    // increment the ticker
    gameTicker++;

    // get the minutes and seconds and display
    // in the ticker element
    var minutes = Math.floor(gameTicker/60);
    var seconds = gameTicker % 60;
    var output = minutes + ":";
    output += (seconds <= 9) ? "0" + seconds : seconds;
    document.getElementById("ticker").innerHTML = output;
}

// Scambles/shuffles the pictures in the pictureMap by swapping each
// picture with another picture chosen at random.  Repeats the process
// to sufficiently scramble the pictures.
function scramble() {

    // do this 5 times for good measure
    for (n = 0; n < 5; n++) {

        // swap each cell's img# with a random one
        for (i = 0; i < 36; i++) {

            // choose a picture at random
            var random = Math.floor(Math.random() * 36);
            var picNum = pictureMap[random];

            // swap the current picture with the random one
            var temp = pictureMap[i];
            pictureMap[i] = picNum;
            pictureMap[random] = temp;

        }
    }
}

// Shows or hides the message box.
function showDialog(show) {
    if (show) {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("message").style.display = "block";
    } else {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("message").style.display = "none";
    }
}