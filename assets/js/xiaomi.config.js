var translationsEN = {
  NO_GATEWAY: "No gateways were found",
  ERROR: "Something bad happened : Check Gladys logs for more informations.",
  NO_UNKNOWN: "No unknown devices were found",
  NO_UNCREATED: "No devices to be activated manually were found",
  GATEWAY: "Gateway",
  IDENTIFIER: "Identifier",
  IP: "IP Address",
  PASSWORD: "Password",
  MODEL: "Model",
  REFRESH: "Refresh",
  SAVE: "Save",
  GATEWAY_TEXT_1: "Using the \"Mi Home\" application, identify the password for each gateway from the \"Developer\" menu.",
  GATEWAY_TEXT_2: "Warning: the \"Login / Password\" couple is specific to each gateway!",
  GATEWAY_TEXT_3: "Enter the password in the appropriate column and save.",
  GATEWAY_TEXT_4: "If you do not see all your gateways, click on the \"refresh\" button.",
  GATEWAY_TEXT_5: "if a key is invalid, you will see it in red. After modification, save, then test an accessory and come back to check the result.",
  UNCREATED_DEVICE: "Device not created",
  UNCREATED_TEXT_1: "If you have several gateways, it may happen that a device has declared itself to be controllable by several of them.",
  UNCREATED_TEXT_2: "However, only one gateway can drive it.",
  UNCREATED_TEXT_3: "To avoid a malfunction, it was not created in Gladys and is included in this table. If it's empty, it's perfect!",
  UNCREATED_TEXT_4: "To make it appear in your devices, simply activate it using the \"Mi home\" application, or wait: in less than an hour, it will appear automatically.",
  UNKNOWN_DEVICE: "Unknown device",
  UNKNOWN_TEXT_1: "This table contains the devices discovered on your network, but not managed by this module.",
  UNKNOWN_TEXT_2: "If you wish to participate in its improvement, you can do so by following the instructions indicated on the ",
  UNKNOWN_TEXT_3: "module's web page.",
  GITHUB_README: "https://github.com/piznel/gladys-xiaomi/blob/master/README.md",
  PASSWORD_UPDATED: "registered passwords!",
  INVALID_KEY: "Invalid key!",
  UNKNOWN_FOUND: "Unknown devices have been found!",
  UNCREATED_FOUND: "Devices have not been created!",
  SELECTED: "Selected",
  SHOW_LOG: "View logs"
};

var translationsFR = {
  NO_GATEWAY: "Aucune passerelle n'a été trouvé",
  ERROR: "Une erreur inconnue est arrivée : Regardez les logs Gladys pour plus d'informations.",
  NO_UNKNOWN: "Aucun périphérique inconnu n'a été trouvé",
  NO_UNCREATED: "Aucun périphérique à activer manuellement n'a été trouvé",
  GATEWAY: "Passerelle",
  IDENTIFIER: "Identifiant",
  IP: "Adresse IP",
  PASSWORD: "Mot de passe",
  MODEL: "Modèle",
  REFRESH: "Rafraîchir",
  SAVE: "Enregistrer",
  GATEWAY_TEXT_1: "À l'aide de l'application \"Mi Home\", identifiez le mot de passe de chaque passerelle, depuis le menu \"développeur\".",
  GATEWAY_TEXT_2: "Attention : le couple \"Identifiant/mot de passe\" est propre à chaque passerelle !",
  GATEWAY_TEXT_3: "Saisissez le mot de passe dans la colonne adéquate, puis enregistrez.",
  GATEWAY_TEXT_4: "Si vous ne voyez pas toutes vos passerelles, cliquez sur le bouton \"rafraîchir\".",
  GATEWAY_TEXT_5: "si une clé est invalide, vous la verrez en rouge. Après modification, enregistrez, puis testez un accessoire et revenez contrôler le résultat.",
  UNCREATED_DEVICE: "Périphérique non créé",
  UNCREATED_TEXT_1: "Si vous avez plusieurs passerelles, il peut arriver (rarement) qu'un périphérique se soit déclaré comme étant pilotable par plusieurs d'entre elles.",
  UNCREATED_TEXT_2: "Or, une seule passerelle peut le piloter.",
  UNCREATED_TEXT_3: "Pour vous éviter un dysfonctionnement, il n'a pas été créé dans Gladys et se retrouve dans ce tableau. S'il est vide, c'est parfait !",
  UNCREATED_TEXT_4: "Pour le faire apparaître dans vos périphérique, il suffit de l'activer à l'aide de l'application \"Mi home\", ou bien d'attendre : dans moins d'une heure, il apparaîtra automatiquement.",
  UNKNOWN_DEVICE: "Périphérique inconnu",
  UNKNOWN_TEXT_1: "Ce tableau contient les périphériques découverts sur votre réseau, mais non-gérés par ce module.",
  UNKNOWN_TEXT_2: "Si vous souhaitez participer à son amélioration, vous pouvez le faire en suivant les consignes indiquées sur la ",
  UNKNOWN_TEXT_3: "page web du module.",
  GITHUB_README: "https://github.com/piznel/gladys-xiaomi/blob/master/README_FR.md",
  PASSWORD_UPDATED: "mots de passe enregistrés !",
  INVALID_KEY: "Clé invalide !",
  UNKNOWN_FOUND: "Des périphériques inconnus ont été trouvé !",
  UNCREATED_FOUND : "Des périphériques n'ont pas été créé !",
  SELECTED: "Sélectionné",
  SHOW_LOG: "Affichez les logs"
};

angular
  .module('gladys')
  .config(['$translateProvider', function($translateProvider) {
    // add translation table
    $translateProvider
      .translations('en', translationsEN)
      .translations('fr', translationsFR);
  }]);