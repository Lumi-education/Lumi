# Installation auf dem Raspberry Pi 3

Lumi befindet sich noch in einer sehr frühen Entwicklungsphase. Diese Anleitung
kann sich daher noch häufig ändern. ​Sollten bei der Installation Fehler auftreten kannst du folgende Dinge tun:

-   Bekannte Fehler anschauen: am Ende der Seite findest du Lösungen für bekannte Fehler.
-   Ein Issue auf GitHub erstellen: [https://github.com/Lumieducation/Lumi/issues](https://github.com/Lumieducation/Lumi/issues)
-   Uns kontaktieren: [issue@Lumi.education](mailto:issue@Lumi.education)

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

![lumi_ssh](../../img/lumi_ssh.gif)

mit dem Raspberry Pi verbinden. Wenn du mit dem Raspberry Pi über ssh verbunden bist, musst du nur noch

```
sudo curl get.lumi.education | sh
```

eingeben und Lumi wird installiert.

[Hier](../erste-schritte.md) geht es weiter zu den ersten Schritten.

# Bekannte Fehler

Diese Liste lebt davon, dass uns Fehler gemeldet werden. Solltest du bei der Installation auf Fehler stoßen dann [kontaktiere](../kontakt.md) uns bitte.

## General

### ssh: 22: Connection refused

Solltest du eine Fehlermeldung wie `ssh: connect to host 192.168.1.248 port 22: Connection refused` erhalten so musst du eine leere Datei mit dem namen `ssh` auf der [sd-Karte speichern.](https://raspberrypi.stackexchange.com/questions/58478/ssh-not-working-with-fresh-install).

## Docker

### Cannot start service: cgroups: memory cgroup not supported on this system: unknown

Die Datei `/boot/cmdline.txt` muss editiert werden und die Parameter `cgroup_enable=memory cgroup_memory=1` hinzugefügt werden.
Anschließend sollte die Datei in etwa so aussehen:

```
dwc_otg.lpm_enable=0 console=serial0,115200 console=tty1 root=PARTUUID=xxxxxxxx-xx rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait cgroup_enable=memory cgroup_memory=1
```

[mehr](https://github.com/moby/moby/issues/35587)
