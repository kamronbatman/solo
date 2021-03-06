angular.module('mmGen', [])

.factory('mmGame', function(){

  var colors = [
    'red', 'blue', 'yellow', 'orange',
    'darkgreen', 'purple', 'cyan', 'pink',
    'magenta', 'sienna', 'slategray', 'salmon',
    'lightgreen', 'teal'
  ];

  var difficulties = [
  //Holes, Total Colors, Max Colors to Use
    [4,4,3], [4,5,4], [4,6,4],
    [4,6,5], [4,6,6], [4,7,6],
    [4,7,7], [5,8,5], [5,8,6],
    [5,8,7], [5,8,8], [5,9,6],
    [5,9,7], [5,9,8], [5,10,10],
    [5,11,11], [5,12,12], [5,13,13],
    [5,14,14], [6,14,14], [7,14,14],
    [8,14,14], [9,14,14], [10,14,14]
  ];

  var taunts = [
    'Ha ha ha ha, feeble human! You will fail!',
    'Ha ha ha ha ha ha ha ha ha ha ha, give up human!',
    'You think you are close?',
    'Ha ha ha ha, failure is inevitable human!',
    'Ready to quit? There is no solution!',
    'Ha ha ha ha, ready to quit?',
    'You were close! Just kidding!'
  ]

  var gamesPerDifficulty = 2;
  var maxDifficulty = colors.length;

  var guessesAllowed = 8;

  var game = {
    newGame: newGame,
    reset: reset,
    makeGuess: makeGuess,
    taunts: taunts,

    _getGems: _getGems,
  };

  game.reset();

  return game;

  function _getGems() {
    //Get a copy of our colors.
    game.gems = colors.slice();

    //Determine level
    var level = difficulties[Math.min(game.level/gamesPerDifficulty|0,difficulties.length)];

    var gemCount = maxDifficulty - level[1];
    var usedGemCount = level[1] - level[2];

    stepRandomizer(); //Just in case.

    //Remove gems until we have only the total number of possible gems.
    while (gemCount-- > 0) {
      stepRandomizer(3); //Just in case.
      game.gems.splice(Math.random()*game.gems.length|0,1);
    }

    //Determine which gems are actually used!
    game.usedGems = game.gems.slice();

    stepRandomizer();

    //Remove gems until we have only the gems we are actually using!
    while (usedGemCount-- > 0) {
      stepRandomizer(3); //Just in case.
      game.usedGems.splice(Math.random()*game.usedGems.length|0,1)
    }
  }

  function newGame() {
    game.guessesRemaining = guessesAllowed;

    game._getGems();

    //Let's generate a code!
    var level = difficulties[Math.min(game.level/gamesPerDifficulty|0,difficulties.length)];
    var holes = level[0];

    game.code = [];

    while (holes-- > 0) {
      game.code.push(game.usedGems[Math.random()*game.usedGems.length|0])
    }

    game.holes = level[0];
  }

  function reset() {
    game.level = 0;
  }

  //Send in your gems array, and get back a pegs list.
  //Gems are sent in as an array based on the color's index in the game.gems array.
  function makeGuess(gems, pegCB) {
    var pegs = [];
    var total = 0;
    //Let's look through our code, and compare.
    for ( var i = 0; i < game.code.length; i++)
    {
      if (game.code[i] === gems[i]) pegs.push(gems[i]), total++;
      else if (game.code.indexOf(gems[i]) > -1) pegs.push('white');
      else pegs.push('none');
    }

    game.guessesRemaining--;
    if (total === game.code.length) { game.level++; }
    pegCB(pegs,total === game.code.length);
  }

  function stepRandomizer(count) {
    //Just in case.
    for (var i = Math.random() * (count || 20); i >= 0; i-- ) Math.random();
  }
})