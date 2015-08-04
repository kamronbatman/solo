var mm = angular.module('mmApp', ['filearts.dragDrop', 'mmGen']);

mm.config(["$locationProvider", function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);

mm.controller('mmCtrl', ['$scope', 'mmGame', function($scope, mmGame){
  $scope.submitGuess = function(){
    var gems = $scope.guess.reduce(function(memo, guess){
      memo.push(guess.value);
      return memo;
    }, []);

    $scope.game.makeGuess(gems, function(pegs,won){
      if (won) {
        $scope.results = 'You won!';
      } else {
        $scope.setGuess(gems, pegs);

        if ($scope.game.guessesRemaining === 0) {
          $scope.results = "You lost!";
          $scope.cantGuess = true;
        }
      }
    });
  }

  $scope.setGuess = function(gems, pegs){
    var prevGuess = [];
    gems.forEach(function(gem, index){
      prevGuess.push({ value: gem, peg: pegs[index] });
    });

    $scope.prevGuesses.push(prevGuess);

    if ($scope.game.guessesRemaining > 0) {
      $scope.prepGuess();
    } else { $scope.guess = []; }
  }

  $scope.prepGuess = function() {
    $scope.guess = [];
    for (var i = 0; i < $scope.game.holes; i++) {
      $scope.guess.push({ value: 'transparent' });
    }
  }

  $scope.dropped = function(event, slot, data) {
    slot.value = data;
    angular.element(event.srcElement).css('background-color', data);

    $scope.cantGuess = $scope.guessDisabled();
  }

  $scope.guessDisabled = function() {
    return $scope.guess.reduce(function(memo, guess){
      return guess.value === 'transparent' || memo;
    }, false);
  }

  $scope.game = mmGame;
  window.game = mmGame;

  $scope.game.newGame();
  $scope.prevGuesses = [];
  $scope.cantGuess = true;

  console.log('gems possible', mmGame.gems);
  console.log('gems used', mmGame.usedGems);
  console.log('code', mmGame.code);

  $scope.prepGuess();
}]);