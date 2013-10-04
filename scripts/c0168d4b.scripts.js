"use strict";angular.module("giv2givApp",["ui.bootstrap","stripe","ngRoute","ngCookies","ngResource"]).config(["$routeProvider","$httpProvider",function(a,b){b.interceptors.push("sessionHttpInterceptor"),delete b.defaults.headers.common["X-Requested-With"],delete b.defaults.headers.post["Content-type"],a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/endowments",{templateUrl:"views/endowments.html",controller:"EndowmentCtrl"}).when("/endowment/create",{templateUrl:"views/create.html",controller:"CreateCtrl",requireAuth:!0}).when("/endowment/create/:id",{templateUrl:"views/add-charities.html",controller:"AddCharitiesCtrl"}).when("/endowments/:id",{templateUrl:"views/endowment-details.html",controller:"EndowmentDetailsCtrl"}).when("/charities/:id",{templateUrl:"views/charity-details.html",controller:"CharityDetailsCtrl"}).when("/donate/:group_id",{templateUrl:"views/donate.html",controller:"DonateCtrl"}).when("/account",{templateUrl:"views/account.html",controller:"AccountCtrl",requireAuth:!0}).when("/register",{templateUrl:"views/register.html",controller:"RegisterCtrl"}).when("/thankyou",{templateUrl:"views/thankyou.html",controller:"ThankyouCtrl"}).otherwise({redirectTo:"/login"})}]).run(["$rootScope","$location","$cookies",function(a,b,c){a.$on("$routeChangeStart",function(a,d){d.requireAuth&&!c.token&&b.path("login")})}]),angular.module("giv2givApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("giv2givApp").controller("LoginCtrl",["$scope","$location","sessionService",function(a,b,c){c.isLoggedIn()&&b.path("account"),a.submitLogin=function(){var b=c.auth(a.auth);a.debug=b}}]),angular.module("giv2givApp").controller("EndowmentCtrl",["$scope","$http","limitToFilter","endowment",function(a,b,c,d){a.tags=[],a.cities=function(a){return b.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK &filter=US&q="+a).then(function(a){return c(a.data,15)})},a.tags.push("Environment","Cancer Research","Education","Arts","Science","Physical Education","Disaster Assistance","Adoption","Hunger"),a.charities=d.query(function(b){a.debug=b})}]),angular.module("giv2givApp").controller("EndowmentDetailsCtrl",["$scope","$routeParams","$location","endowment",function(a,b,c,d){a.url=c.absUrl(),console.log(b.id),a.endowment=d.get({id:b.id}),a.debug=a.endowment}]),angular.module("giv2givApp").controller("CharityDetailsCtrl",["$scope","$routeParams",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("giv2givApp").controller("DonateCtrl",["$scope","$location","$routeParams","$http",function(a){a.saveCustomer=function(a,b){console.log(b),alert(b.id)}}]),angular.module("giv2givApp").controller("AccountCtrl",["$scope","donor",function(a,b){var b=new b;a.debug=b.$get()}]),angular.module("giv2givApp").controller("RegisterCtrl",["$location","$scope","sessionService","donor",function(a,b,c,d){c.isLoggedIn()&&a.path("account"),b.message="",b.submitReg=function(){var a=new d(b.donor);a.$save(function(a){b.debug=a})}}]),angular.module("giv2givApp").controller("CreateCtrl",["$scope","$location","$http","$routeParams","endowment",function(a,b,c,d,e){a.endowment={},a.endowment.name="",a.endowment.description="",a.steps={},a.privacyOptions=["public","private"],a.donationAmounts=["5.00","10.00","20.00","100.00"],a.endowment.charity_group_visibility=a.privacyOptions[0],a.endowment.minimum_donation_amount=a.donationAmounts[0],a.createEndowment=function(){var c=new e(a.endowment);c.$save(function(a){b.path("endowment/create/"+a.charity_group.id)},function(){console.log("Opps")})}}]),angular.module("giv2givApp").controller("ThankyouCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("stripe",[]).directive("stripeForm",["$window",function(a){var b={restrict:"A"};return b.link=function(b,c,d){var e=angular.element(c);e.bind("submit",function(){var c=e.find("button");c.prop("disabled",!0),a.Stripe.createToken(e[0],function(){var a=arguments;b.$apply(function(){b[d.stripeForm].apply(b,a)}),c.prop("disabled",!1)})})},b}]),angular.module("giv2givApp").factory("session",["$resource","appConfig",function(a,b){var c=b.apiUrl,d="/sessions/:action.json";return a(c+d,{action:"@action"})}]),angular.module("giv2givApp").service("sessionService",["$rootScope","$cookies","$location","session",function(a,b,c,d){this.auth=function(a,e){"undefined"==typeof e&&(e="account"),a.action="create";var f=new d(a);return f.$save(function(){(b.token=f.session.token)&&c.path(e)}),f},this.isLoggedIn=function(){return b.token?!0:!1},this.logOut=function(){var a={};a.action="destroy",b.token&&(delete b.token,d.$save(a))}}]),angular.module("giv2givApp").factory("sessionHttpInterceptor",["$q","$cookies",function(a,b){return{request:function(a){return b.token&&(a.headers.Authorization="Token token="+b.token),a}}}]),angular.module("giv2givApp").constant("appConfig",{apiUrl:"https://api.giv2giv.org/api"}),angular.module("giv2givApp").factory("donor",["$resource","appConfig",function(a,b){var c=b.apiUrl,d="/donors.json";return a(c+d)}]),angular.module("giv2givApp").factory("charity",["$resource","appConfig",function(a,b){var c=b.apiUrl,d="/charity/:id.json";return a(c+d,{id:"@id"})}]),angular.module("giv2givApp").factory("endowment",["$resource","appConfig",function(a,b){var c=b.apiUrl,d="/charity_group/:id/:action.json";return a(c+d,{id:"@id",action:"@action"})}]),angular.module("giv2givApp").factory("paymentAccounts",["$resource","appConfig",function(a,b){var c=b.apiUrl,d="/donors/payment_accounts/:id/:action.json";return a(c+d,{id:"@id",action:"@action"})}]),angular.module("giv2givApp").controller("AddCharitiesCtrl",["$scope","$routeParams","charity",function(a,b,c){a.endowment={},a.endowment.charities=[],a.charitySearch=function(a){return console.log(a),c.query({query:a},function(a){console.log(a)}),["Foo","bar","biz"]}}]);