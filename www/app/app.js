
var app = angular.module('app', ['ngRoute']);


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
        templateUrl: '/gdev/grind/proto1/www/app/templates/main.html',
        controller: 'gameController'
      }).
      otherwise({
        redirectTo: '/main'
      });
  }]);


/*  
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
*/

app.filter('iif', function () {
   return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
   };
});
  
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}




Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};