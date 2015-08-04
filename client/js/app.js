var mm = angular.module('mmApp', ['filearts.dragDrop', 'mmGen']);

mm.config(["$locationProvider", function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  //Gather all of the voices!
  window.speechSynthesis.getVoices();
}]);

mm.controller('mmCtrl', ['$scope', '$window', 'mmGame', function($scope, $window, mmGame){

  $scope.playVoice = function(msg, rate, pitch, voice) {
    var vm = new SpeechSynthesisUtterance(msg);
    vm.voice = speechSynthesis.getVoices()[voice || 19];

    vm.pitch = pitch || 0.5;
    vm.rate = rate || 0.5;
    speechSynthesis.speak(vm);
  }

  $scope.newGame = function(reset) {
    $scope.gameInProgress = true;
    $scope.results = '';
    $scope.cantGuess = true;
    $scope.canPlayNext = false;
    if (reset) { $scope.game.reset(); }

    $scope.prevGuesses = [];

    $scope.game.newGame();
    $scope.level = $scope.game.level;
    $scope.prepGuess();

    $scope.playVoice('Level ' + ($scope.level + 1));

    console.log('gems possible', mmGame.gems);
    console.log('gems used', mmGame.usedGems);
    console.log('code', mmGame.code);
  }

  $scope.submitGuess = function(){
    var gems = $scope.guess.reduce(function(memo, guess){
      memo.push(guess.value);
      return memo;
    }, []);

    $scope.game.makeGuess(gems, function(pegs,won){
      if (won) {
        $scope.results = 'You win!';
        $scope.playVoice('You win!');
        $scope.canPlayNext = true;
      } else {
        $scope.setGuess(gems, pegs);

        if ($scope.game.guessesRemaining === 0) {
          $scope.results = "You lost!";
          $scope.playVoice('You lost!');
          $scope.cantGuess = true;
          $scope.canPlayNext = false;
        } else {
          $scope.playVoice('Ha ha ha ha, feeble human! You will fail!', 1, 0.25, 71);
        }
      }
    });
  }

  $scope.setGuess = function(gems, pegs){
    var prevGuess = [];
    gems.forEach(function(gem, index){
      prevGuess.push({ value: gem, peg: pegs[index] });
    });

    $scope.prevGuesses.unshift(prevGuess);

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

  //$scope.newGame(true);
}]);