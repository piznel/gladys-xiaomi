(function() {
  'use strict';

  angular
    .module('gladys')
    .factory('xiaomiService', xiaomiService);

  xiaomiService.$inject = ['$http', 'Notification', '$translate'];

  function xiaomiService($http, Notification, $translate) {

    var service = {
      gateways: gateways,
      uncreated: uncreated,
      unknown: unknown,
      savePassword: savePassword,
      successNotificationTranslated: successNotificationTranslated,
      errorNotificationTranslated: errorNotificationTranslated
    };

    return service;

    function gateways() {
      return $http({ method: 'GET', url: '/xiaomi/gateways/' });
    }

    function uncreated() {
      return $http({ method: 'GET', url: '/xiaomi/uncreated/' });
    }

    function unknown() {
      return $http({ method: 'GET', url: '/xiaomi/unknown/' });
    }

    function savePassword(options) {
      return $http({ method: 'PATCH', url: '/xiaomi/savepassword/', data: options });
    }

    function successNotificationTranslated(key, complement) {
      return $translate(key)
        .then(function(text) {
          if (complement) text += complement;
          Notification.success(text);
        });
    }

    function errorNotificationTranslated(key, complement) {
      return $translate(key)
        .then(function(text) {
          if (complement) text += complement;
          Notification.error(text);
        });
    }
  }
})();