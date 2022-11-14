/*["Попал", "Промахнулся", "Ты потопил мой корабль"]*/

var view = {
   displayMessage: function(msg){
       var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
   },
   displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
   },
   displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
   }
};

var controller = {
     guesses: 0,

     processGuess: function(guess){
          var location = parseGuess(guess);
          if(location){
               this.guesses++;
               var hit = model.fire(location);
               if (hit && model.shipsSunk === model.numShips){
                    view.displayMessage("Ты потопил все мои линкоры, за " + 
                    this.guesses + " попытки");
               }

          }
     }
};



var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: [0,0,0], hits:["","",""]},
            { locations: [0,0,0], hits:["","",""]},
            { locations: [0,0,0], hits:["","",""]}],

fire: function (guess){

     for (var i = 0; i < this.numShips; i++){
          var ship = this.ships[i];
          var index = ship.locations.indexOf(guess);
          if(index >= 0){
               ship.hits[index] = "hit";
               view.displayHit(guess);
               view.displayMessage("HIT!");
               if (this.isSunk(ship)){
                    view.displayMessage("Ты потопил мой линкор!");
                    this.shipsSunk++;
               }
               return true;

          }
     }
     view.displayMiss(guess);
     view.displayMessage("Ты промахнулся.");
     return false;
},
isSunk: function(ship){
     for (var i = 0; i <this.shipLength; i ++){
          if (ship.hits[i] != "hit"){
               return false;
          }
     }
     return true;
},
// Генератор позиции коробля
generateShipLocations: function(){
     var locations;
     for (var i =0; i< this.numShips; i++){
          do{
               locations = this.generateShip();
          } while (this.collision(locations));
          this.ships[i].locations = locations;
     }
     console.log("Ships array: ");
	console.log(this.ships);
},

generateShip: function (){
     var direction = Math.floor(Math.random() * 2);
     var row, col;

     if (direction === 1){
          // Сгенерировать начальную позицию для горизонтального корабля
          row = Math.floor(Math.random() * this.boardSize);
          col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
     } else {
          // Сгенерировать начальную позицию для вертикального корабля
          row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
          col = Math.floor(Math.random() * this.boardSize);     
     }

     var newShipLocations = [];
     for (var i = 0; i <this.shipLength; i++){
          if(direction === 1){
     // добавить в массив для горизонтального корабля
     newShipLocations.push(row + "" + (col + i));
          } else{
     // добавить в массив для вертикального корабля
     newShipLocations.push((row + i) + "" + col);
          }
     }
     return newShipLocations;
},

collision: function (locations){
     for (var i =0; i < this.numShips; i++){
          var ship = model.ships[i];
          for (var j = 0; j < locations.length; j++){
               if (ship.locations.indexOf(locations[j]) >= 0){
                    return true;
               }
          }
     }
     return false;
}
};

// Вспомогательная функция для разбора догадки пользователя

function parseGuess(guess) {
     var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

     if (guess === null || guess.length !== 2) {
          alert("Ой, пожалуйста, введите букву и цифру на доске.");
     } else{
          firstChar = guess.charAt(0).toUpperCase();
          var row = alphabet.indexOf(firstChar);
          var column = guess.charAt(1);

          if (isNaN(row) || isNaN(column)){
               alert("Ой, этого нет на доске.");
          } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
               alert("Ой, это вне доски!");
          } else {
               return row + column;
          }
     }
     return null;
}


// Поле ввода

function handleFireButton(){
     var guessInput = document.getElementById("guessInput");
     var guess = guessInput.value;
     controller.processGuess(guess);
     guessInput.value = "";
}
function handleKeyPress(e){
     var fireButton = document.getElementById("fireButton");
     if (e.keyCode === 13){
          fireButton.click();
          return false;
     }
}

window.onload = int;

function int(){
     var fireButton = document.getElementById("fireButton");
     fireButton.onclick = handleFireButton;
     var guessInput = document.getElementById("guessInput");
     guessInput.onkeypress = handleKeyPress;

     model.generateShipLocations();
}
