/*jslint browser: true*/
/*global $, jQuery, alert*/
var angular;
var app = angular.module('PreviouslyOn', ['ionic']);
var localStorage;
var navigator;
var win;
var lol;
var fail;
var console;
var logged;
var key = 'bbca71b6d1b5';
var md5;
// Simple POST request example (passing data) :

/* _______________________CONTROLLERS*/

/*__________________verif de la connexion_____________
____________________Mot de passe oublié ? ____________
*/
app.controller('ConnexionController', function ($scope, $location, $timeout) {
    "use strict";
    $scope.signIn = function () {
        md5 = $.md5($scope.password);
        $.post("https://api.betaseries.com/members/auth", {'v' : 2.4, 'key': key, 'login' : $scope.login, 'password': md5}, function (data) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('id', data.user.id);
            localStorage.setItem('login', data.user.login);
            $timeout(function () {
                $location.path('/');
            }, 0);
        });
        if (($scope.login === undefined) || ($scope.password === undefined)) {
            $scope.erreur = "login ou mot de passe wrong  !";
        }
    };
    $scope.mdp = function () {
        $.post("https://api.betaseries.com/members/lost", {'v' : 2.4, 'key': key, 'find' : $scope.login}, function () {
            $scope.erreur = "Mot de passe envoyé sur votre boite mail :) ";
        });
    };
});
//
//_________________liste des series  ___________________________
//
app.controller('HomeController', function ($scope, $location, $timeout) {
    "use strict";
    $.get("http://api.betaseries.com/members/infos", {'v' : 2.4, 'key': key, 'id' : localStorage.id}, function (data) {
        console.log(data.member.shows);
        $timeout(function () {
            $scope.shows = data.member.shows;
            $scope.$apply();
        }, 0);
    });
    $scope.fresh = function () {
        window.location.reload();
    };
    $scope.onHold = function (id) {
        $location.path('/detail/:' + id);
    };
    $scope.logout = function () {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('login');
        window.location.reload();
        $location.path('connexion');
    };
});
//
//___________________________details de la serie selectionné !_____________
//
app.controller('DetailController', function ($scope, $stateParams) {
    "use strict";
    var currentId = $stateParams.id;
    if (currentId) {
        currentId = currentId.substring(1, currentId.length);
        $.get("https://api.betaseries.com/shows/pictures", {'v' : 2.4, 'key': key, 'id' : currentId}, function (data) {
            $scope.image = data.pictures[0].url;
            $scope.$apply();
        });
        $.get("https://api.betaseries.com/shows/display", {'v' : 2.4, 'key': key, 'id' : currentId}, function (data) {
            $scope.title = data.show.title;
            $scope.season = data.show.seasons;
            $scope.episodes = data.show.episodes;
            $scope.description = data.show.description;
            $scope.genre = data.show.genres[0];
            $scope.dure = data.show.length;
            $scope.note = data.show.notes.mean;
            $scope.$apply();
        });
        $scope.del = function () {
            console.log(currentId);
            $.get("https://api.betaseries.com/shows/archive", {'v' : 2.4, 'key': key, 'id' : currentId, 'token' : localStorage.token}, function () {
                console.log('deleted');
            });
        };
    } else {
        $scope.erreur = 'Page not found';
    }
});
//
//________________________add random series _________________
//
app.controller('AddController', function ($scope) {
    "use strict";
    $.get("https://api.betaseries.com/shows/random", {'v' : 2.4, 'key': key, nb : 30}, function (data) {
        $scope.rand = data.shows;
        $scope.$apply();
    });
    $scope.add = function (id) {
        $.post("https://api.betaseries.com/shows/show", {'v' : 2.4, 'key': key, 'id' : id, 'token' : localStorage.token}, function () {
            console.log('added');
        });
        $.get("https://api.betaseries.com/shows/display", {'v' : 2.4, 'key': key, 'id' : id}, function (data) {
            $scope.title = data.show.title;
            $scope.info = $scope.title + " added !!";
            $scope.$apply();
        });
    };
});
//
//___________________________________add one serie ______________
//
app.controller('Add1Controller', function ($scope) {
    "use strict";
    $scope.recherche = function () {
        $.get("https://api.betaseries.com/shows/search", {'v' : 2.4, 'key': key, 'title' : $scope.title }, function (data) {
            $scope.liste = data.shows;
            $scope.$apply();
            console.log(data.shows);
        });
    };
    $scope.add1 = function (id) {
        $.post("https://api.betaseries.com/shows/show", {'v' : 2.4, 'key': key, 'id' : id, 'token' : localStorage.token}, function (data) {
            $scope.lol = data;
        });
        $.get("https://api.betaseries.com/shows/display", {'v' : 2.4, 'key': key, 'id' : id}, function (data) {
            $scope.title = data.show.title;
            $scope.info = $scope.title + " added !!";
            $scope.$apply();
        });
    };
});
//
//____________________________liste des amis _________________________
//
app.controller('FrndController', function ($scope, $location) {
    "use strict";
    $.get("https://api.betaseries.com/friends/list", {'v' : 2.4, 'key': key, 'id' : localStorage.id, 'token' : localStorage.token }, function (data) {
        $scope.amie = data.users;
        console.log(data.users);
    });
    $scope.home = function () {
        $location.path('/');
    };
    $scope.fresh = function () {
        window.location.reload();
    };
    $scope.hold = function (id) {
        $.post("https://api.betaseries.com/friends/block", {'v' : 2.4, 'key': key, 'id' : id, 'token' : localStorage.token }, function () {
            $scope.info = "Merci cet utilisateur est bloquer !";
        });
    };
});
//
//________________________________add one friend____________________________
//
app.controller('AddfrndController', function ($scope) {
    "use strict";
    $scope.recherche = function () {
        $.get("https://api.betaseries.com/members/search", {'v' : 2.4, 'key': key, 'login' : $scope.login }, function (data) {
            $scope.frnd = data.users[0];
            $scope.$apply();
        });
    };
    $scope.add = function (id) {
        $.post("https://api.betaseries.com/friends/friend", {'v' : 2.4, 'key': key, 'id' : id, 'token' : localStorage.token }, function () {
            $scope.info = "Merci cet utilisateur est ajouté !";
        });
    };
});
//
//_____________________liste des amis en attente ___________________________
//
app.controller('FirenddemandeController', function () {
    "use strict";
    $.get("https://api.betaseries.com/friends/requests", {'v' : 2.4, 'key': key, 'token' : localStorage.token, 'received': '' }, function (data) {
        console.log(data);
    });
});
/*_________________________ROUTE_______________________________*/
app.config(function ($stateProvider, $urlRouterProvider) {
    "use strict";
    var connect = function ($q, $location) {
        var deferred = $q.defer();
        if (localStorage.token) {
            deferred.resolve();
        } else {
            deferred.reject();
            lol = setTimeout(function () {
                $location.path('connexion');
            }, 0);
        }
        return deferred.promise;
    };
    logged = function ($q, $location) {
        var deferred = $q.defer();
        if (!localStorage.token) {
            deferred.resolve();
        } else {
            deferred.reject();
            $location.path('/');
        }
        return deferred.promise;
    };

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('connexion', {
        url: '/connexion',
        templateUrl: 'templates/connexion.html',
        controller : "ConnexionController",
        resolve: {
            connected : logged
        }
    });

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller : "HomeController",
        resolve: {
            connected : connect
        }
    });
    $stateProvider.state('add', {
        url: '/add',
        templateUrl: 'templates/add.html',
        controller : "AddController",
        resolve: {
            connected : connect
        }
    });
    $stateProvider.state('add1', {
        url: '/add1',
        templateUrl: 'templates/add1.html',
        controller : "Add1Controller",
        resolve: {
            connected : connect
        }
    });
    $stateProvider.state('frnd', {
        url: '/frnd',
        templateUrl: 'templates/frnd.html',
        controller : "FrndController",
        resolve: {
            connected : connect
        }
    });
    $stateProvider.state('addfrnd', {
        url: '/addfrnd',
        templateUrl: 'templates/addfrnd.html',
        controller : "AddfrndController",
        resolve: {
            connected : connect
        }
    });
    $stateProvider.state('firenddemande', {
        url: '/firenddemande',
        templateUrl: 'templates/firenddemande.html',
        controller : "FirenddemandeController",
        resolve: {
            connected : connect
        }
    });
    $stateProvider.state('detail', {
        url: '/detail/:id',
        templateUrl: 'templates/detail.html',
        controller : "DetailController",
        resolve: {
            connected : connect
        }
    });
});