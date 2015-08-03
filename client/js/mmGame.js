angular.module('mm', [])

.factory('mmGame' function(){

  var colors = [
    'red', 'blue', 'yellow', 'orange',
    'white', 'green', 'purple', 'black',
    'cyan', 'pink', 'magenta', 'sienna',
    'slategray', 'salmon'
  ];

  var gamesPerDifficulty = 2;
  var minDifficulty = 4;  //Minimum number of gems used.
  var maxDifficulty = colors.length; //Maxmimum number of gems used.

  var minGemsUsed = 2;
  var maxGemsUsed = 10;

  var gamesPerHoles = 10;
  var minHoles = 4;
  var maxHoles = 5;

  var game = {
    newGame: newGame;
    reset: reset;
    makeGuess: makeGuess;
  }

  game.reset();

  return game;

  function getGems() {
    //Get a copy of our colors.
    game.gems = colors.slice();

    //Determine difficulty rating
    var diffRating = game.level/gamesPerDifficulty|0;

    //Determine the number of gems to REMOVE based on difficulty.
    var gemCount = maxDifficulty - minDifficulty + diffRating;

    stepRandomizer(); //Just in case.

    //Remove gems until we have only the total number of possible gems.
    while (gemCount-- > 0) {
      stepRandomizer(3); //Just in case.
      game.gems.splice(Math.random()*game.gems.length|0,1);
    }

    //Determine which gems are actually used!
    game.usedGems = game.gems.slice();

    var usedGems =  game.usedGems - Math.min( minGemsUsed + game.level/gamesPerDifficulty|0, maxGemsUsed );

    stepRandomizer();

    //Remove gems until we have only the gems we are actually using!
    while (usedGems-- > 0) {
      stepRandomizer(3); //Just in case.
      game.usedGems.splice(Math.random()*game.usedGems.length|0,1)
    }
  }

  function newGame() {
    //Let's generate a code!
    var holes = minHoles + ((maxHoles - minHoles) * game.level/gamesPerHoles|0);

    game.code = [];

    while (holes-- > 0) {
      game.code.push(Math.random()*game.usedGems.length|0 )
    }
  }

  function reset() {
    game.level = 0;
    game.guessesRemaining = 10;
    game.prevGames = [];
  }

  //Send in your gems array, and get back a pegs list.
  //Gems are sent in as an array based on the color's index in the game.gems array.
  function makeGuess(gems, pegs) {
    //Do gem logic
    //if (game.guessesRemaining <= 0) return statuses.lost;
  }

  function stepRandomizer(count) {
    //Just in case.
    for (var i = Math.random() * (count || 20); i >= 0; i-- ) Math.random();
  }
})