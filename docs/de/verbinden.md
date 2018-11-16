# Verbindung aufbauen

## WLAN

Wenn du das Netzwerk unter macOS, Windows oder Linux geöffnet hast, dann müssen sich die Schüler mit diesem Netzwerk und deinem gewählten Passwort verbinden.

Falls du einen Raspberry Pi benutzt, erreichst du Lumi nach dem Neustarten des Raspberry Pis über das WLAN mit dem Namen "Lumi X". Das Passwort ist standardmäßig "lumilumi". Einstell-Optionen folgen in späteren Versionen.

-   WLAN: Lumi X
-   Passwort: lumilumi

Falls du Lumi unter macOS, Windows oder Linux betreibst, dann müssen sich die Benutzer mit dem von dir geöffneten [Netzwek](./netzwerk/macOS.md) verbinden.

## Adresse

Lumi ist als Webseite programmiert und mit jedem Browser aufrufbar. Dazu müssen die Benutzer die IP-Adresse der Maschine eingeben, auf der Lumi läuft.

-   Raspberry Pi: http://10.0.0.1
-   macOS, Windows, Linux: Die IP-Adresse wird im Dashboard angezeigt:
    ![Dashboard](../../img/lumi_dashboard.png)

In Zukunft wird Lumi über http://Lumi erreichbar sein. Siehe [https://github.com/Lumieducation/Lumi/issues/247](https://github.com/Lumieducation/Lumi/issues/247)

## Netzwerkverbindung

Lumi hat bis jetzt auf über 200 Smartphones funktioniert. Eine typische Aussage von Schülern beim ersten Benutzen von Lumi ist allerdings: "Bei mir funktioniert das nicht."
Hier ein paar Tipps um Lumi zum Laufen zu bekommen:

1. Mit dem WLAN verbunden? - Lumi funktioniert nur, wenn das Handy im WLAN ist.
2. Adresse richtig eingegeben? - Schüler geben gerne folgende Sachen ein: http.//10.0.0.1 oder https://10.0.0.1 Es ist wichtig, dass die Adresse genau http://10.0.0.1 bzw. wie die Adresse aus dem Dashboard geschrieben ist.
3. Anderen Browser ausprobieren. Mit Google Chrome oder der Google App hat Lumi jedes mal funktioniert.
4. Incognito-Modus deaktivieren.
5. Mobile Daten deaktivieren
