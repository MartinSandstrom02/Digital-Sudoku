//Load boards 
const easy = [
    "6-53--174---4-5-2--34--1---362-7--81--96-8---71-29-4-5-2--4651--978----345--3-2-8",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-7-5---4--8-6-758-31----15--4-36--2-5--4-8----9---2-9-7----63--8--7-1--2--38--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  //Create variables
  var timer;
  var timeRemaining=0;
  var lives;
  var selectedNum;
  var selectedTile;
  var disableSelect;    


  window.onload= function (){
    //Run startgame function when button is clicked
    id("start-btn").addEventListener("click", startGame); 

    //Add event listner to each number in number container
    for(let i=0; i<id("number-container").children.length; i++){
      id("number-container").children[i].addEventListener("click", function(){
        
        //If selecting is not disabled (enabled)
        if(!disableSelect){

          //If number is already selected 
          if(this.classList.contains("selected"))
          {
            //Then remove selection
            this.classList.remove("selected");
            selectedNum = null;
          }
          else{
            //Deselect all other numbers
            for(let i=0; i<9; i++){
              id("number-container").children[i].classList.remove("selected");
            }
            //Select it and update selectedNum Variable
            this.classList.add("selected");
            selectedNum = this;
            updateMove();
          }
        }
      });
    }
  }

  function startGame() {
      //Choose board difficulty
      let board;
      if (id("diff-1").checked) board = easy [0];
      else if (id("diff-2").checked) board = medium [0];
      else board = hard [0];
 
      //Remove the previous win/lose styling
      qs("p#lives").classList.remove("lost");
      qs("p#lives").classList.remove("won");
      
      lives = 3;  
      disableSelect = false;
      id("lives").textContent = "Lives Remaining: 3";

      //Geneate board based on difficulty
      generateBoard(board);

      //Starts the timer
      startTimer();

      //Show number container
      id("number-container").classList.remove("hidden");
  
  }
  
  //Om pausknappen trycks pausas tiden
  id("pause-btn").addEventListener("click", pauseTimer); 

  function startTimer(){
    id("pause-btn").addEventListener("click", pauseTimer); 

    //While timer is going, only display the pause button
    id("pause-btn").classList.remove("hidden"); 
    id("resume-btn").classList.add("hidden"); 
    //Sets timer for first second
    id("timer").textContent = timeConversion(timeRemaining);
    
    //Sets timer to update every second (1000ms)
      timer = setInterval(function(){
      timeRemaining ++;
      id("timer").textContent = timeConversion(timeRemaining);
    },1000)
  }


  function pauseTimer(){
    //Pause the timer and remove the play button
    id("pause-btn").classList.add("hidden"); 
    clearTimeout(timer);

    //Display the start button
    id("resume-btn").classList.remove("hidden"); 
    id("resume-btn").addEventListener("click", startTimer); 
  
  }


  function timeConversion(time){
    //Converts seconds into string of MM:SS format
    let minutes =Math.floor(time/60);
    if(minutes< 10) minutes="0" + minutes;

    let seconds = time % 60; 
    if(seconds <10) seconds ="0" + seconds;
    return minutes + ":" + seconds;
  }


  function generateBoard(board) {
    //Clear previous boards
    clearPrevious();

    //Let used to increment tile ids
    let idCount = 0;
 
    //Create 81 tiles
    for(let i=0; i<81;i++){
      //Create a new paragraph elemen
      let tile = document.createElement("p");

      //If the tile is not blank
      if(board.charAt(i) !="-"){
        //Set tile text to correct number
        tile.textContent = board.charAt(i);
      }
      else{
        //Add click event listner to tile
        tile.addEventListener("click", function(){
          //If selecting is not disabled
          if(!disableSelect){
            //If the tile is already selected
            if(tile.classList.contains("selected")){
              //Then remove selecting
              tile.classList.remove("selected");
              selectedTile = null;
            }
            else{
              //Deselect all other tiles
              for(let i=0; i<81; i++){
                qsa(".tile")[i].classList.remove("selected");
              }
              //Add selection and update variable
              tile.classList.add("selected");
              selectedTile = tile;
              updateMove(); 
            }
          }
        });
      }
      //Assign tile id
      tile.id = idCount;
      //Increment for the next tile
       idCount ++;

       //Add tile class to all tiles
       tile.classList.add("tile"); 
      
       //Creates a thicker border to distinguish the 3x3 squares
       if((tile.id >17 && tile.id< 27) || (tile.id >44 && tile.id <54)) {
         tile.classList.add("bottomBorder");
       }

       if((tile.id +1 ) % 9 == 3 || (tile.id +1) % 9 == 6){
         tile.classList.add("rightBorder");
       }

       //Add tile to board  
       id("board").appendChild(tile);  
    }
  }


  function updateMove(){
      //If a tile and a number is selected (both)
      if(selectedTile && selectedNum){
        
      //Set the tile to the correct number
      selectedTile.textContent= selectedNum.textContent;

      //If the number matches the correspending number in the solution key
      if(checkCorrect(selectedTile)){
         //Deselect the tiles and the numbers
         selectedTile.classList.remove("selected");
         selectedNum.classList.remove("selected");
         
         //Makes the correct tile blue
           selectedTile.classList.add("correct");
           qs("p.correct").classList.remove("dark");
       
         //Clear the selected varaibles
         selectedNum = null;
         selectedTile = null;

         //Check if board is completed
         if (checkDone()){
           endGame();
         } 
        }

      //If the number does not match the solution key
      else{
        //Disable selecting new  for one second
        disableSelect = true;
        //Make the tile turn red
        selectedTile.classList.add("incorrect");

        //Run for 2 seconds
        setTimeout(function()
        {
          //Subtract lives by one
          lives --;

          //If no lives left end the game
          if(lives === 0) {endGame(); }
        
          else{
            //If lives is not equal to zero
            //Update lives text
            id("lives").textContent = "Lives Remaining: " + lives;
            //Renable selecting numbers and tiles
            disableSelect = false;
            }

            //Restore tile color and remove selected from both
            selectedTile.classList.remove("incorrect");
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");

            //Clear the tiles text and clear selected variables
            selectedTile.textContent = "";
            
            //Prevents user from making the same mistake twice (deselecting)
            selectedTile = null;
            selectedNum = null;
        },2000);
      }
    }
  }

  function checkDone(){
    let tiles = qsa(".tile");

    //Checks if there are any blank tiles left
    for(let i = 0; i < tiles.length; i++){
      if(tiles[i].textContent === "") return false;
    }
    //Otherwise it is a win
    return true;
  }


  function endGame(){
    //Disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);
    timeRemaining= 0;

    //Display win or loss message
    if(lives === 0){
      id("lives").textContent = "You Lost!";
      qs("p#lives").classList.add("lost");
    } 
    else{
      id("lives").textContent = "You Made It!";
      qs("p#lives").classList.add("won");
    }
  }

  function checkCorrect(tile){
    //Set solution based on difficulty selection
    let solution;
    if(id("diff-1").checked) solution= easy[1];
    else if(id("diff-2").checked) solution= medium[1];
    else solution = hard[1];

    //If tile's number is equal to solution's number 
    if(solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
  }
   
  function clearPrevious() {

    timeRemaining=0;
    //Access all of the tiles
    let tiles = qsa(".tile");
    
    //Remove each tile
    for(let i=0; i <tiles.length;i++) {
      tiles[i].remove();
    }

    //If there is a timer clear it
    if(timer) clearTimeout(timer);

    //Deselect any number
    for(let i=0; i< id("number-container").children.length;i++){
      id("number-container").children[i].classList.remove("selected");
    }
    //Clear selected variables
    selectedTile =null;
    selectedNum =null;
  }

  //Helper functions
  function id(id){
      return document.getElementById(id);
  }
  
  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) 
  {
    return document.querySelectorAll(selector);
  }