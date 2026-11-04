# Native n8n-Arbeitsprobe: Anfrage → CRM-Aufgabe → E-Mail

Eigene technische Arbeitsprobe von Hassani Solutions, keine produktive Kundenreferenz.

Formular → Validierung und Normalisierung → Duplikatprüfung → simulierte CRM-Aufgabe → echte automatische Resend-Mail.

Der Workflow wird tatsächlich in n8n ausgeführt. CRM-Aufgaben sind ausdrücklich simuliert. Der Resend-Versand wurde zusätzlich zum synthetischen Testlauf über das Formular geprüft: vom Anbieter angenommen, Inbox-Zustellung nicht behauptet.

## Dateien

- [Importierbarer Workflow](workflow.json)
- [Lokaler HTTP-Adapter](adapter.mjs)
- [Sechs native n8n-Testfälle](test-results.json)

## Lokal ausprobieren

1. Workflow in eine lokale n8n-Instanz importieren (getestet n8n 1.110.1, Node 22.23.4).
2. Adapter mit `node adapter.mjs` starten. Bindet ausschließlich 127.0.0.1:5689.
3. Für echte Formular-Mails serverseitig `G3_DEMO_RESEND_API_KEY` und `G3_DEMO_EMAIL_FROM` mit eigenem verifizierten Absender konfigurieren. Alternativ `HASSANI_RESEND_ENV_FILE` auf eine geschützte Datei mit diesen Werten setzen. Keine Credentials in den Workflow einfügen.
4. Für synthetische Fälle Execute workflow verwenden. Sie verschicken keine echten Nachrichten. Adapter vor erneutem Komplett-Test neu starten, um den Duplikatspeicher zu leeren.
5. Für eigene Eingaben den Form-Trigger öffnen und dessen Test-URL nutzen. Nur eigene Testdaten verwenden; Einwilligung bestätigt den gewünschten Mailversand.
6. Unter Executions die Eingaben und Ausgaben jedes Schritts prüfen. Formular-Empfang ist keine Versandbestätigung. `mail_accepted` mit Resend-ID belegt Anbieterannahme.

Bei Docker müssen die beiden HTTP-Zieladressen auf einen vom n8n-Container erreichbaren lokalen Adapter geändert werden.

## Grenzen

Lokale Demo, kein öffentlicher n8n-Dienst. CRM und Duplikatspeicher sind nur pro Adapterprozess im Arbeitsspeicher. Maximal 30 echte Versandversuche pro Stunde je Prozess. Bei CRM-Fehlern keine Mail; bei Mailfehlern keine behauptete Zustellung. Keine automatische Wiederaufnahme fehlgeschlagener Versandvorgänge. Produktionsbetrieb benötigt unterstützte aktuelle n8n-Version, geschützte Bereitstellung, persistente Idempotenz, Wiederaufnahme und verteilte Versandlimits.

## Ergänzende Browser-Demo

[Website und ausführbarer Anfrageprozess](https://g3-wodify-automation.vercel.app/demo/probetraining): eigene G3-Webseiten-Arbeitsprobe mit echter Resend-Mail und simuliertem CRM. Dieser öffentliche Prozess läuft als individuelle Webanwendung, **nicht in n8n**.
