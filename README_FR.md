### [English version](README.md)


# Gladys-Xiaomi : un module pour [Gladys](https://github.com/GladysProject)

Ce module vous permet de piloter les appareils Xiaomi Zigbee compatibles depuis Gladys.
Les périphériques déjà créés par le module officiel sont compatibles avec ce module et ne devraientt pas être recréés. Ils devraient juste être mis-à-jour. N'hésitez pas à me le signaler si ce n'est pas le cas !

## Prérequis
Pour fonctionner, ce module nécessite :
 - Gladys version 3.10.0 au minimum
 - Une passerelle Xiaomi non-compatible "HomeKit"

## Limitations
Nécessite de connaître les mots de passe "développeur" pour commander la passerelle et les actionneurs, comme la prise ou l'interrupteur.

Voir https://github.com/fooxy/homeassistant-aqara/wiki/Enable-dev-mode

## Installation

### 1. Ajouter ce module à Gladys

- Installez ce module à partir de l'onglet "avancé" du menu "module", en remplissant les différents champs de la façon suivante :
    * Nom : gladys-xiaomi
    * Version : 0.1.1
    * URL : https://github.com/piznel/gladys-xiaomi.git
    * Slug : xiaomi

### 2. Redémarrer Gladys
Depuis le premier onglet du menu "Paramètres", en cliquant sur le bouton "Redémarrer".

### 3. Renseigner le ou les mot(s) de passe de votre ou vos  passerelle(s) Xiaomi
Si vous ne possédez qu'une passerelle, enregistrez son mot de passe dans le paramètre "Xiaomi_password", sans guillemets ni espace.

Si vous possédez plusieurs passerelles, vous avez donc plusieurs mots de passe, qu'il faut donc relier à chaque passerelle.

Pour cela, procédez de la façon suivante :
* Après avoir installé le module et redémarré Gladys, identifiez chaque passerelle dans l'ordre de création dans Gladys
* Identifiez la même passerelle depuis l'application "Mi Home", notez son mot de passe
* enregistrez les mots de passe les uns après les autres, séparés par une virgule (**et sans espace**), dans l'ordre où les passerelles ont été créées.

## Liste des appareils compatibles
Ce module ne gère que des appareils fonctionnant en zigbee avec la passerelle correspondante.

*Tous les ***noms*** en gras et en italiques sont les fonctionnalités que vous retrouverez dans Gladys*

Pour tous les appareils à pile (CR2032 ), Xiaomi préconise une tension comprise entre 2.800 et 3.300 mV. La valeur de la batterie (***battery***) qui apparaît dans Gladys est donc un pourcentage par rapport à ces consignes :

    0% = 2.800 mV
    100% = 3.300 mV

### La gateway
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

### Le cube
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

### Le détecteur de fuite d'eau
Fonctionnement basique, avec 2 ***status*** :

    0 = pas de fuite
    1 = fuite !

### Le détecteur d'ouverture de porte ou fenêtre
Les différents ***status*** sont codés dans Gladys de la façon suivante :

    0 = fermé
    1 = ouvert
    -1 = inconnu. Sera mis-à-jour automatiquement.

### Le détecteur de mouvement
2 modèles sont compatibles :

* Le modèle Xiaomi
* le modèle Aqara

Pour ces 2 modèles, les différents ***status*** sont codés dans Gladys de la façon suivante :

    1 = mouvement
    0 = pas de mouvement

Le modèle "Aqara" renvoie également la valeur de la luminosité (***illumination***), comprise entre 0 et 1200 lux, ainsi que le temps écoulé en minute depuis le dernier mouvement (***minutes***). 
Cette info est renvoyée au bout de 2 minutes, puis 3, 5, 10, 20 et enfin 30 minutes.

### La prise
Les différents états (***plug***) sont codés dans Gladys de la façon suivante :

    1 = allumé
    0 = Eteins

Cette prise permet également de faire un suivi de la consommation :
* La puissance instantannée (***instantaneous_power***), en watt, plafonnée à 2,2 kW,
* la puissance totale (***total_power***), en Wh.

Elle possède également la fonctionnalité ***inuse***, indiquant, dans le cas où elle est sur "on", si du courant est consommé ou non. Utile pour couper automatiquement l'alimentation après la charge de vos téléphones !

### Le détecteur de fumée
Ce capteur de détection de fumée peut avoir plusieurs ***status*** :

    0 = Pas de fumée
    1 = Densité de fumée supérieure à la valeur-limite. Déclenchement de l'alarme.
    2 = Test manuel de l'alarme
    8 = Alarme de défaut de batterie
    64 = Alarme de défaut de capteur
    32768 = Alarme de défaut de communication.

Il informe également de la densité de fumée mesurée (***density***).

### Le bouton wifi à 3 état
Les différents ***status*** sont codés dans Gladys de la façon suivante :

    0 = Pas de clic
    1 = clic simple
    2 = clic double
    3 = clic long (bouton appuyé)
    4 = clic long (bouton relâché)

Après chaque changement d'état, le bouton repasse à "pas de clic" après 1 seconde automatiquement.

### La sonde de température et d'humidité
Capteur classique, permettant d'obtenir la température (***temperature***) en °C et l'humidité (***humidity***) en % du lieu où il se trouve.

### La sonde de température, d'humidité et de pression
En plus des fonctionnalités du capteur précédent, vous obtiendrez également la pression atmosphérique (***pressure***), en KPa.
"En quoi ???? c'est quoi Kpa ???"
KPa = kiloPascal, unité de mesure de la pression atmosphérique. Comme dans les bulletins météo !

### Le capteur de vibration
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

### Les boutons poussoirs muraux filaires

Qu'ils soient à un ou deux boutons, avec raccordement du neutre ou sans, les 4 boutons sont gérés.
Fonctionnement très simple : **on** ou **off** !

Dans Gladys, ce sont donc des boutons de type *binary*, identifié par ***Channel_0*** et ***Channel_1***, selon le nombre de boutons du ... bouton !
