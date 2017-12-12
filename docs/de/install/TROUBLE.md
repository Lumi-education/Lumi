# Bekannte Fehler

Diese Liste lebt davon, dass uns Fehler gemeldet werden. Solltest du bei der Installation auf Fehler stoßen dann [kontaktiere](../CONTACT.md) uns bitte.

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
