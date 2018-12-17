var translationsEN = {
    NO_GATEWAY:'No gateways were found',
    ERROR: 'Something bad happened :/ Check Gladys logs for more informations.',

}

var translationsFR = {
    NO_GATEWAY:'Aucune passerelle n\'a été trouvé',
    ERROR: 'Une erreur inconnue est arrivée :/ Regardez les logs Gladys pour plus d\'informations.',
    
}

angular
    .module('gladys')
    .config(['$translateProvider', function($translateProvider) {
        // add translation table
        $translateProvider
            .translations('en', translationsEN)
            .translations('fr', translationsFR);
    }]);