# Update

<!-- ### Automatische Updates

Lumi wird [demnächst](https://github.com/Lumi-education/Lumi/issues/120) mit einer Auto-Update-Funktion ausgestattet, die automatisch alle 10 Minuten nach Updates sucht, solange die Lumi mit dem Internet verbunden ist. -->

### Manuelles Update

1. Per ssh mit dem Raspberry Pi verbinden.
2. Update-Script ausführen

```bash
$ sudo curl update.lumi.education | sh
```

3. Am besten startet man den Raspberry Pi mit `$ sudo reboot` noch einmal neu.
