# Installation

Lumi befindet sich noch in einer sehr frühen Entwicklungsphase. Diese Anleitung
kann sich daher noch häufig ändern. ​

## Hardware & Betriebssystem

Lumi ist für den Einsatz auf einem
[Raspberry Pi 3 Model B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
mit dem Betriebssystem
[Raspbian Stretch](https://www.raspberrypi.org/downloads/raspbian/) konzipiert.
Solltest du das Betriebssystem erst noch installieren müssen so gibt es
[hier](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)
eine Anleitung. ​

## Lumi-Installation

### 1. ssh

Im ersten Schritt muss sich per ssh mit dem Raspberry Pi verbunden werden. Dazu
muss sich der Raspberry Pi im selben Netzwerk befinden. Anschließend kannst du
dich mit dem Befehl `ssh pi@<ip des pi>` mit dem Raspberry Pi verbinden. ​

### Bekannte Fehler

1. Solltest du eine Fehlermeldung wie `ssh: connect to host 192.168.1.248 port
   22: Connection refused` erhalten so musst du eine leere Datei mit dem namen
   `ssh` auf der
   [sd-Karte speichern.](https://raspberrypi.stackexchange.com/questions/58478/ssh-not-working-with-fresh-install)
   ​ ​
   ## Installation über Kommandozeile
   Wenn du mit dem Raspberry Pi über ssh verbunden bist, musst du nur noch `sudo
   curl get.lumi.education | sh` eingeben. ​
   ### Was macht der Befehl?
   ​ Der Befehl lädt ein Script von http://get.Lumi.education runter und führt
   dieses aus. Das Script installiert [Docker](http://docker.com), legt eine
   "Environment"-Datei an und lädt eine docker-compose.yml. Anschließend wird
   der Befehl `sudo docker-compose up -d` ausgeführt, der Lumi und seine Dienste
   startet.
