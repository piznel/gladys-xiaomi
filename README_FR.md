
# Gladys-Xiaomi : un module pour [Gladys](https://github.com/GladysProject)

Ce module vous permet de piloter les appareils Xiaomi Zigbee compatibles depuis Gladys.
Les périphériques déjà créés par le module officiel sont compatibles avec ce module et ne devraient pas être recréés. Ils devraient juste être mis-à-jour. N'hésitez pas à me le signaler si ce n'est pas le cas !

<!-- vscode-markdown-toc -->
* 1. [Prérequis](#Prrequis)
* 2. [Limitations](#Limitations)
* 3. [Installation](#Installation)
	* 3.1. [Ajouter ce module à Gladys](#AjoutercemoduleGladys)
	* 3.2. [Redémarrer Gladys](#RedmarrerGladys)
	* 3.3. [Renseigner le ou les mot(s) de passe de votre ou vos passerelle(s) Xiaomi](#RenseignerleoulesmotsdepassedevotreouvospasserellesXiaomi)
	* 3.4. [Logique de fonctionnement de ce module](#Logiquedefonctionnementdecemodule)
* 4. [Liste des appareils compatibles](#Listedesappareilscompatibles)
	* 4.1. [La gateway](#Lagateway)
	* 4.2. [Le cube](#Lecube)
	* 4.3. [Le détecteur de fuite d'eau](#Ledtecteurdefuitedeau)
	* 4.4. [Le détecteur d'ouverture de porte ou fenêtre](#Ledtecteurdouverturedeporteoufentre)
	* 4.5. [Les détecteurs de mouvement](#Lesdtecteursdemouvement)
	* 4.6. [La prise de courant](#Laprisedecourant)
	* 4.7. [Le détecteur de fumée](#Ledtecteurdefume)
	* 4.8. [Le bouton wifi à 3 état](#Leboutonwifi3tat)
	* 4.9. [La sonde de température et d'humidité](#Lasondedetempratureetdhumidit)
	* 4.10. [La sonde de température, d'humidité et de pression](#Lasondedetempraturedhumiditetdepression)
	* 4.11. [Le capteur de vibration](#Lecapteurdevibration)
	* 4.12. [Les interrupteurs muraux filaires](#Lesinterrupteursmurauxfilaires)
	* 4.13. [Les boutons poussoirs muraux sans fils](#Lesboutonspoussoirsmurauxsansfils)
* 5. [Annexe : Références des matériels compatibles](#Annexe:Rfrencesdesmatrielscompatibles)
* 6. [Annexe : mode "débugage"](#Annexe:modedbugage)
	* 6.1. [Xiaomi_debug](#Xiaomi_debug)
	* 6.2. [Xiaomi_debugDevice](#Xiaomi_debugDevice)
* 7. [Annexe : Comment demander l'ajout d'un périphérique ?](#Annexe:Commentdemanderlajoutdunpriphrique)
	* 7.1. [Plongé dans les logs de Gladys](#PlongdansleslogsdeGladys)
	* 7.2. [Analyse des logs obtenus](#Analysedeslogsobtenus)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='Prrequis'></a>Prérequis
Pour fonctionner, ce module nécessite :
 - Gladys version 3.10.0 au minimum,
 - Une passerelle Xiaomi non-compatible "HomeKit", avec mode "développeur" activé,

##  2. <a name='Limitations'></a>Limitations
Nécessite de connaître le mot de passe "développeur" et l'identifiant de chaque passerelle pour pouvoir la commander depuis Gladys, ainsi que les actionneurs, comme la prise ou l'interrupteur.

Voir https://github.com/fooxy/homeassistant-aqara/wiki/Enable-dev-mode

##  3. <a name='Installation'></a>Installation

###  3.1. <a name='AjoutercemoduleGladys'></a>Ajouter ce module à Gladys

- Installez ce module à partir de l'onglet "avancé" du menu "module", en remplissant les différents champs de la façon suivante :
    * Nom : gladys-xiaomi
    * Version : 0.1.1
    * URL : https://github.com/piznel/gladys-xiaomi.git
    * Slug : xiaomi

###  3.2. <a name='RedmarrerGladys'></a>Redémarrer Gladys
Depuis le premier onglet du menu "Paramètres", en cliquant sur le bouton "Redémarrer".

###  3.3. <a name='RenseignerleoulesmotsdepassedevotreouvospasserellesXiaomi'></a>Renseigner le ou les mot(s) de passe de votre ou vos passerelle(s) Xiaomi

Retourner dans la liste des modules, et cliquez sur le bouton 'configuration'. La page de configuration contient 3 tableaux :

* tableau de gauche :

il contient la liste des passerelles découvertes, leur adresse IP, ainsi que leur mot de passe, si vous l'avez déjà renseigné. Sinon, renseignez le.

* tableau central :

Il contient la liste des périphériques non-gérés actuellement par ce module. Vous pouvez participez au développement de ce module, en suivant les consignes de l'[annexe 7](#Annexe:Commentdemanderlajoutdunpriphrique).

* tableau de droite :

il contient la liste des matériels qui n'ont pas pu être intégré dans Gladys, car ils ont été déclaré par plusieurs passerelle. Voir le paragraphe suivant pour résoudre cette difficulté.

###  3.4. <a name='Logiquedefonctionnementdecemodule'></a>Logique de fonctionnement de ce module

A chaque démarrage de Gladys, un message est envoyé sur votre réseau, auquel seules les passerelles répondent, en nous donnant leur identifiant (= sid chez Xiaomi), ainsi que leur adresse IP. En retour, nous leur demandons alors la liste des identifiants des périphériques qu'elles ont d'enregistré.

Nous interrogeons alors chaque périphérique, qui nous répond en retour en nous donnant son nom et quelques une de ses caractéristiques.

Puis la liste des périphériques qui ont répondu est envoyés à Gladys pour être créé ou mise à jour.

**Dans le cas où vous avez plusieurs passerelles**, il arrive (rarement) qu'un périphérique apparaisse dans plusieurs listes ; il ne sera pas alors créé dans Gladys. En effet, si ce périphérique est un actionneur, il ne peut être commandé que par une seule passerelle. Et à ce stade, nous ne pouvons savoir laquelle.

Pour lever le doute, nous avons besoin de vous (ou pas !) 

*Comment connaître les périphériques coupables ?*

A la fin de l'étape de démarrage, et après la création des périphériques dans Gladys, si un tel périphérique est détecté, il apparaitra dans les logs.

Vous pouvez également comparé les périphériques dans Gladys avec ceux que vous avez physiquement.

Il vous suffit alors, à l'aide de l'application (ou du bouton d'activation du périphérique) d'actionner ce dernier ; il sera alors créé correctement dans Gladys.

Vous pouvez aussi ne rien faire :)

En effet, à interval régulier, les périphériques signalent leur présence à la passerelle, donc à Gladys. Il sera créé à ce moment là.

Cet interval est en général d'une heure pour les périphériques à pile, et de 10 mn pour ceux branché électriquement.

##  4. <a name='Listedesappareilscompatibles'></a>Liste des appareils compatibles
Ce module ne gère que des appareils fonctionnant en zigbee avec la passerelle correspondante.

*Tous les ***noms*** en gras et en italiques sont les fonctionnalités que vous retrouverez dans Gladys*

Pour tous les appareils à pile (CR2032 ), Xiaomi préconise une tension comprise entre 2.800 et 3.300 mV. La valeur de la batterie (***battery***) qui apparaît dans Gladys est donc un pourcentage par rapport à ces consignes :

    0% = 2.800 mV
    100% = 3.300 mV

###  4.1. <a name='Lagateway'></a>La gateway
**La gateway ne doit pas être celle compatible "HomeKit"**

La gateway possède :

* un capteur de luminosité
* un capteur de mouvement
* un haut-parleur
* un bandeau de led

Depuis Gladys, vous pouvez commander l'allumage (***gateway***), la couleur (***color***) est l'intensité (***intensity***) des led.

La luminosité (**illumination**) est également enregistrée dans Gladys. Perso, j'ai pas trouvé que la valeur était très fiable.

Le capteur de mouvement n'est pas à ce jour accessible par l'api de Xiaomi. Dommage.

La diffusion de vos mp3 sur le haut-parleur n'a pas été codé, bien que pouvant l'être. Lors d'une prochaine release ?

###  4.2. <a name='Lecube'></a>Le cube
Le cube présente de nombreuse ***status***, codifiés de la façons suivantes dans Gladys :

    0 = repos
    1 = Alerte (= vibration)
    2 = double tap (sur une surface dure !)
    3 = bascule sur une face latérale
    4 = bascule sur la face opposée
    5 = rotation à l'horizontale
    6 = secoué en l'air
    7 = poussé ou tiré en le glissant sur le support
    8 = chute libre

Pour la rotation horizontale, l'angle de rotation est également renvoyé dans Gladys (***rotate***), en % d'un tour complet ( 25% = 90°, 50% = 180°, ...), positif ou négatif selon le sens de rotation positif dans le sens des aiguilles d'une montre, négatif dans l'autre sens.
Quant à ***speed***, c'est la vitesse avec laquelle vous avez tourné le cube. De là à faire des concours...

Après chaque changement d'état, le cube repasse à "repos" après 1 seconde automatiquement.

###  4.3. <a name='Ledtecteurdefuitedeau'></a>Le détecteur de fuite d'eau
Fonctionnement basique, avec 2 ***status*** :

    0 = pas de fuite
    1 = fuite !

###  4.4. <a name='Ledtecteurdouverturedeporteoufentre'></a>Le détecteur d'ouverture de porte ou fenêtre
Les différents ***status*** sont codés dans Gladys de la façon suivante :

    0 = fermé
    1 = ouvert
    -1 = inconnu. Sera mis-à-jour automatiquement.

###  4.5. <a name='Lesdtecteursdemouvement'></a>Les détecteurs de mouvement
2 modèles sont compatibles :

* Le modèle Xiaomi
* le modèle Aqara

Pour ces 2 modèles, les différents ***status*** sont codés dans Gladys de la façon suivante :

    1 = mouvement
    0 = pas de mouvement

Le modèle "Aqara" renvoie également la valeur de la luminosité (***illumination***), comprise entre 0 et 1200 lux, ainsi que le temps écoulé en minute depuis le dernier mouvement (***minutes***). 
Cette info est renvoyée au bout de 2 minutes, puis 3, 5, 10, 20 et enfin 30 minutes.

###  4.6. <a name='Laprisedecourant'></a>La prise de courant
Les différents états (***plug***) sont codés dans Gladys de la façon suivante :

    1 = allumé
    0 = Eteins

Cette prise permet également de faire un suivi de la consommation :
* La puissance instantannée (***instantaneous_power***), en watt, plafonnée à 2,2 kW,
* la puissance totale (***total_power***), en Wh.

Elle possède également la fonctionnalité ***inuse***, indiquant, dans le cas où elle est sur "on", si du courant est consommé ou non. Utile pour couper automatiquement l'alimentation après la charge de vos téléphones !

###  4.7. <a name='Ledtecteurdefume'></a>Le détecteur de fumée
Ce capteur de détection de fumée peut avoir plusieurs ***status*** :

    0 = Pas de fumée
    1 = Densité de fumée supérieure à la valeur-limite.
        Déclenchement de l'alarme.
    2 = Test manuel de l'alarme
    8 = Alarme de défaut de batterie
    64 = Alarme de défaut de capteur
    32768 = Alarme de défaut de communication.

Il informe également de la densité de fumée mesurée (***density***).

###  4.8. <a name='Leboutonwifi3tat'></a>Le bouton wifi à 3 état
Les différents ***status*** sont codés dans Gladys de la façon suivante :

    0 = Pas de clic
    1 = clic simple
    2 = clic double
    3 = clic long (bouton appuyé)
    4 = clic long (bouton relâché)

Après chaque changement d'état, le bouton repasse à "pas de clic" après 1 seconde automatiquement.

###  4.9. <a name='Lasondedetempratureetdhumidit'></a>La sonde de température et d'humidité
Capteur classique, permettant d'obtenir la température (***temperature***) en °C et l'humidité (***humidity***) en % du lieu où il se trouve.

###  4.10. <a name='Lasondedetempraturedhumiditetdepression'></a>La sonde de température, d'humidité et de pression
En plus des fonctionnalités du capteur précédent, vous obtiendrez également la pression atmosphérique (***pressure***), en KPa.
"En quoi ???? c'est quoi Kpa ???"
KPa = kiloPascal, unité de mesure de la pression atmosphérique. Comme dans les bulletins météo !

###  4.11. <a name='Lecapteurdevibration'></a>Le capteur de vibration
Capteur assez complexe :

il peut prendre différents ***status***, codifiés de la façon suivante :

    0 = repos
    1 = vibration
    2 = tilt (changement d'orientation)
    3 = chute libre

Après chaque "tilt", la valeur de la rotation (***angle***) en degré est renvoyée dans Gladys. Elle est toujours positive.
**exemple :** en passant le capteur de la position horizontale à la position verticale, "***angle***" prendra une valeur aux alentours de 90°.

Ce capteur, grâce à son accéléromètre, retourne également les valeurs de l'accélération de la pesanteur selon les axes x, y et z. L'unité est en millième de g, accélération de la pesanteur (le même g que celui des pilotes, qui subissent des accélérations de plusieurs g).

Que faire de ces 3 valeurs d'accélération ? Elles peuvent servir, par exemple, à déterminer qu'elle est la face supérieure visible du capteur. Je vous ai fait le calcul : c'est la valeur "***side***" dans Gladys.
Les faces sont numérotées de la façon suivante :

"Super ton truc, mais je peux en faire quoi ???"
Ca peut servir, par exemple, à déterminer la position d'un objet pouvant être mis en rotation comme :

* une porte de garage à basculement (pour savoir si elle est ouverte ou fermée)
* un cube dans lequel vous collez le capteur : vous obtenez un bouton-poussoir à 6 positions. Bref, comme le cube, mais en moins bien ! ;)

Dernière caractéristique : l'activité !

Appelé par Xiaomi de façon étrange ***bed_activity***.

C'est prévu pour passer la nuit avec vous, et ainsi, déterminer la qualité de votre sommeil, selon si vous avez beaucoup bougé ou pas ...Pas testé pour ma part !

###  4.12. <a name='Lesinterrupteursmurauxfilaires'></a>Les interrupteurs muraux filaires

Qu'ils soient à un ou deux boutons, avec raccordement du neutre ou sans, les 4 modèles sont gérés.
Fonctionnement très simple : **on** ou **off** !

Dans Gladys, ce sont donc des boutons de type *binary*, identifié par ***Channel_0*** et ***Channel_1***, selon le nombre de boutons de l'interrupteur !

###  4.13. <a name='Lesboutonspoussoirsmurauxsansfils'></a>Les boutons poussoirs muraux sans fils

Il existe 2 types : avec 1 bouton ou avec 2 boutons.

Ils fonctionnent différemment des précédents : ils ne connaissent que le *simple click* et le *double click*. une particularité pour le modèle à 2 butons : il reconnait l'appui simultané sur les 2.

Ils sont identifiés dans Gladys par ***Channel_0***, ***Channel_1*** et ***dual_channel***, et peuvent prendre les valeurs suivantes :
    0 = repos
    1 = simple click
    2 = double click
    3 = les 2 boutons simultanément

A noter qu'ils reviennt automatiquement à l'état de repos après 1 seconde.

##  5. <a name='Annexe:Rfrencesdesmatrielscompatibles'></a>Annexe : Références des matériels compatibles

##  6. <a name='Annexe:modedbugage'></a>Annexe : mode "débugage"
2 paramètres supplémentaires peuvent être créés dans Gladys, afin de d'obtenir des logs adaptés à la situation.

###  6.1. <a name='Xiaomi_debug'></a>Xiaomi_debug 
Ce paramètre, s'il n'est pas présent, ne bloquera pas le module.
S'il est présent, et selon sa valeur, nous obtenons dans les logs les éléments suivants :

| valeur | Résultat                                                                          |
|:------:|-----------------------------------------------------------------------------------|
| 0      | Pas de log (comme "vide" ou paramètre absent)                                     |
| 1      | tous les messages envoyés par la gateway                                          |
| 2      | 1 +  la liste détaillée des périphériques, version "Xiaomi" ( = model)            |
| 3      | 2 + la liste des périphériques avec le statut de leur réponse à "qui êtes-vous ?" |
| 4      | les périphériques qui seront créés/mis à jour dans Gladys                         |
| 5      | Les états des périphériques du 4 qui seront créés dans Gladys                     |
| 6      | Le message renvoyé aux périphériques qui tardent à répondre.                      |
| 7      | La commande envoyée par la passerelle vers un actionneur                          |


###  6.2. <a name='Xiaomi_debugDevice'></a>Xiaomi_debugDevice
Ce paramètre permet de n'obtenir dans les logs uniquement les messages provenant des périphériques dont le modèle est la valeur de ce paramètre.

Le lodèle peut-être obtenu en mettant à 1 le paramètre précédent.

##  7. <a name='Annexe:Commentdemanderlajoutdunpriphrique'></a>Annexe : Comment demander l'ajout d'un périphérique ?

Excellente idée ! :)

Xiaomi fait évoluer régulièrement ces matériels, tant au niveau logiciel que physique.

Vous avez un périphérique, connecté à une passerelle mais qui n'est pas dans Gladys ?
S'il fonctionne en Zigbee, il y a de forte chance de pouvoir l'ajouter.

Au démarrage de Gladys, en cas de détection d'un tel équipement, un message apparait dans les logs, de ce type :

    Xiaomi module : impossible to create device  + 'détail du périphérique'

###  7.1. <a name='PlongdansleslogsdeGladys'></a>Plongé dans les logs de Gladys
si vous n'avez pas trouvé le message précédent dans Gladys, créer le paramètre "Xiaomi_debug" dans Gladys, et donnez lui la valeur de 1. 

Redémarrez Gladys, console ouverte : très vite, vous verrez les messages de la passerelle, sous cette forme :

    Xiaomi _onMessage.msg : { cmd: 'read_ack',
    model: 'weather.v1',
    sid: '158d00023238be',
    short_id: 22966,
    data: '{"voltage":2815}' }


Dans cet exemple, nous avons :
* le type de message que nous transmet la passerelle, venant du périphérique (*read_ack*)
* le "model"(*weather.v1*), qui est une sonde Aqara de température/humidité/pression,
* le "sid", qui est l'identifiant unique, que nous retrouverons dans Gladys
* ses "data", qui sont une partie de ses paramètres fonctionnels

Nous allons donc renseigner dans Gladys le paramètre "Xiaomi_debugDevice" avec **weather.v1**, pour ne cibler que ses messages. (n'oubliez pas de mettre à zéro le paramètre "Xiaomi_debug")

L'objectif est donc de regarder les logs défilés, et de noter tous les paramètres fonctionnels du modèle.

Nous obtenons alors des messages de type 'report' :

    Xiaomi _onMessage.msg : { cmd: 'report',
    model: 'weather.v1',
    sid: '158d0002490638',
    short_id: 50313,
    data: '{"temperature":"2105"}' }


    Xiaomi _onMessage.msg : { cmd: 'report',
    model: 'weather.v1',
    sid: '158d0002490638',
    short_id: 50313,
    data: '{"humidity":"4394"}' }


    Xiaomi _onMessage.msg : { cmd: 'report',
    model: 'weather.v1',
    sid: '158d0002490638',
    short_id: 50313,
    data: '{"pressure":"101660"}' }

*Remarque :* Si c'est une prise, un bouton poussoir, etc..., bref, quelque chose qui n'est pas passif, manipulez le, pour déclencher un maximum de log et être sûr d'avoir toutes les fonctionnalités.

Par exemple, un modèle de bouton poussoir sans fil reconnait de 1 à 4 click.

###  7.2. <a name='Analysedeslogsobtenus'></a>Analyse des logs obtenus

A ce stade, nous avons une bonne base pour pouvoir intégrer ce capteur :

* model : 'weather.v1'
    * temperature : "2105"
    * humidity : "4394"
    * pressure : "101660"


Il ne vous reste plus qu'à créer une issue sur le github du module
ou de faire la demande sur le forum, en fournissant ces infos.


