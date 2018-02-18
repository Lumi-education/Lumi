# Installation auf dem Raspberry Pi 3

Lumi befindet sich noch in einer sehr frühen Entwicklungsphase. Diese Anleitung
kann sich daher noch häufig ändern. ​Sollten bei der Installation Fehler auftreten, so kannst du [hier](TROUBLE.md) nachlesen oder uns [kontaktieren](../CONTACT.md).

## Hardware & Betriebssystem

Lumi ist für den Einsatz auf einem
[Raspberry Pi 3 Model B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/)
mit dem Betriebssystem
[Raspbian Stretch](https://www.raspberrypi.org/downloads/raspbian/) konzipiert.
Solltest du das Betriebssystem erst noch installieren müssen so gibt es
[hier](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)
eine Anleitung. ​

## Lumi-Installation

Im ersten Schritt muss sich per ssh mit dem Raspberry Pi verbunden werden. Dazu
muss sich der Raspberry Pi im selben Netzwerk befinden. Anschließend kannst du
dich mit dem Befehl

```
ssh pi@<ip des pi>
```

![lumi_ssh](./img/lumi_ssh.gif)

mit dem Raspberry Pi verbinden. Wenn du mit dem Raspberry Pi über ssh verbunden bist, musst du nur noch

```
sudo curl get.lumi.education | sh
```

eingeben und Lumi wird installiert.
[Hier](../lumi/FIRST-STEPS.md) geht es weiter zu den ersten Schritten.
