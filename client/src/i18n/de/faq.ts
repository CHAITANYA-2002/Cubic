import type { Dict } from "..";

export const faq: Dict["faq"] = {
  metaTitle: "FAQ – Fragen zu Preisen, Ablauf, Eigentum & KI | CubicTech",
  metaDescription: "Antworten zu Preisen, Zahlungsbedingungen, Zeitrahmen, Code-Eigentum, NDAs, internationalen Kunden, KI-Datensicherheit, Hosting und Support bei CubicTech.",
  eyebrow: "FAQ",
  title: "Fragen, die uns vor jedem Projekt gestellt werden.",
  subtitle: "Klare Antworten zu Preis, Ablauf, Eigentum und Risiko. Ist Ihre Frage nicht dabei, fragen Sie uns – wir antworten innerhalb eines Werktags.",
  stillTitle: "Noch Fragen?",
  stillText: "Schicken Sie uns Ihre Frage. Sie erhalten eine klare Antwort von der Person, die Ihr Projekt umsetzen würde.",
  categories: [
    {
      id: "pricing",
      title: "Preise & Zahlung",
      items: [
        {
          q: "Was kostet ein Projekt?",
          a: "Für jede Leistung gibt es auf unserer Preisseite eine veröffentlichte Spanne in INR, USD, EUR oder AED. Wo Ihr Projekt darin liegt, hängt von der Anzahl der Seiten oder Funktionen, den Integrationen, den Inhalten und davon ab, wie viel der Arbeit neu entsteht und wie viel angepasst wird. Nach einem kostenlosen Gespräch erhalten Sie ein schriftliches Angebot mit einem Festpreis – keine Schätzung, die mitwächst.",
        },
        {
          q: "Warum Festpreis statt Stundensatz?",
          a: "Bei Abrechnung nach Stunden tragen Sie das Risiko unserer Schätzung. Mit einem Festpreis kennen Sie die Gesamtsumme, bevor Sie sich festlegen, und es ist unsere Aufgabe, in diesem Rahmen zu liefern. Im Gegenzug wird der Umfang vorab präzise vereinbart, und alles Neue wird vor der Umsetzung separat angeboten.",
        },
        {
          q: "Wie sind die Zahlungsbedingungen?",
          a: "Projekte werden in drei Meilensteinen bezahlt: 40 % zum Start, 30 % zur vereinbarten Projektmitte und 30 % bei Lieferung. Rechnungen sind innerhalb von 7 Tagen zahlbar. Monatliche Leistungen wie Wartungspakete und Marketing werden zu Beginn jedes Monats im Voraus berechnet. Sie testen jeden Meilenstein, bevor Sie den nächsten bezahlen.",
        },
        {
          q: "Warum unterscheiden sich internationale Preise von den Preisen in Indien?",
          a: "Wir veröffentlichen eine Preisliste für den indischen Markt in INR und eine separate Preisliste für internationale Kunden in USD, aus der die Preise in EUR und AED abgeleitet werden. Umfang, Qualität und Ablauf sind identisch; der Unterschied spiegelt wider, wie professionelle Softwareentwicklung im jeweiligen Markt bepreist wird. Ihr Angebot lautet immer auf eine Währung, die vor der Unterzeichnung vereinbart wird.",
        },
        {
          q: "Was ist die Projektdiagnose, und brauche ich sie?",
          a: "Die Projektdiagnose ist ein einwöchiges, bezahltes Audit für Vorhaben, bei denen die richtige Lösung noch nicht auf der Hand liegt – komplexe Webanwendungen, KI-Automatisierung oder die Übernahme bestehender Software. Sie erhalten einen schriftlichen Plan mit bepreisten Optionen, Risiken und einem realistischen Zeitplan. Er gehört Ihnen, und die volle Gebühr wird angerechnet, wenn Sie innerhalb von 30 Tagen ein Projekt mit uns starten. Einfache Websites brauchen sie in der Regel nicht.",
        },
        {
          q: "Was ist nicht im Preis enthalten?",
          a: "Kosten von Drittanbietern werden zum Selbstkostenpreis weiterberechnet oder direkt von Ihnen bezahlt: Hosting, Domains, E-Mail-Dienste, KI-Modellnutzung, kostenpflichtige Plugins, Stockmedien und Werbebudgets. Ihr Angebot führt alle erwarteten Drittkosten auf, damit es keine Überraschungen gibt.",
        },
      ],
    },
    {
      id: "process",
      title: "Ablauf & Zeitrahmen",
      items: [
        {
          q: "Wie lange dauert ein Projekt?",
          a: "Eine Landingpage dauert etwa zwei Wochen, eine Unternehmenswebsite drei bis sechs Wochen, KI-Agenten und Automatisierung drei bis zehn Wochen, Webanwendungen sechs bis sechzehn Wochen. Ihr Angebot enthält datierte Meilensteine. Der größte Faktor, den wir nicht beeinflussen können, ist, wie schnell Inhalte, Zugänge und Freigaben zurückkommen – deshalb hält der Zeitplan fest, was wir wann von Ihnen benötigen.",
        },
        {
          q: "Wie erfahre ich, wie das Projekt läuft?",
          a: "Jeder Kunde erhält ein privates Projektportal mit Meilensteinen, schriftlichen Wochenberichten, Angeboten und Rechnungen. Den aktuellen Arbeitsstand sehen Sie zudem über einen Staging-Link und können direkt Feedback geben. Sie müssen nie nach dem Status fragen.",
        },
        {
          q: "Wer arbeitet tatsächlich an meinem Projekt?",
          a: "Der Gründer plant, gestaltet und entwickelt Ihr Projekt und ist während der gesamten Zeit Ihr Ansprechpartner. Braucht ein Projekt Spezialwissen, das wir intern nicht haben, holen wir einen geprüften Freelancer hinzu und nennen ihn in Ihrem Angebot.",
        },
        {
          q: "Was benötigen Sie von uns für den Start?",
          a: "Ein unterzeichnetes Angebot, die erste Meilensteinzahlung und ein kurzes Kickoff-Gespräch. Während der Umsetzung benötigen wir Inhalte (oder Input, damit wir sie schreiben können), Zugang zu bestehenden Systemen und jemanden, der Entscheidungen innerhalb weniger Werktage freigeben kann.",
        },
        {
          q: "Was, wenn wir während des Projekts etwas ändern möchten?",
          a: "Kleine Anpassungen innerhalb des vereinbarten Umfangs gehören zur Arbeit. Alles Neue wird schriftlich angeboten, einschließlich der Auswirkung auf den Zeitplan, und Sie entscheiden, ob Sie es jetzt, später oder gar nicht hinzufügen. Nichts wird ohne Ihre schriftliche Zustimmung berechnet.",
        },
        {
          q: "Wie viele Projekte übernehmen Sie gleichzeitig?",
          a: "Bewusst nur wenige – damit jedes Projekt echte Aufmerksamkeit bekommt. Können wir nicht in angemessener Zeit beginnen, nennen wir Ihnen ehrlich den frühestmöglichen Starttermin, statt uns zu überbuchen.",
        },
      ],
    },
    {
      id: "ownership",
      title: "Eigentum, Verträge & Sicherheit",
      items: [
        {
          q: "Wem gehören Code und Designs?",
          a: "Ihnen. Mit Eingang der vollständigen Zahlung gehören Ihnen alle Arbeitsergebnisse und der für Ihr Projekt erstellte Quellcode. Unsere bereits bestehenden Tools und Bibliotheken bleiben unser Eigentum; Sie erhalten eine Lizenz, sie als Teil Ihres Projekts zu nutzen. Alles wird mit Dokumentation und sämtlichen Zugangsdaten übergeben.",
        },
        {
          q: "Unterzeichnen Sie ein NDA?",
          a: "Ja. Senden Sie uns Ihr NDA, und wir unterzeichnen es, bevor Sie Details teilen. Unser Standardvertrag enthält zudem eine Vertraulichkeitsregelung: Beide Seiten behandeln die nicht öffentlichen Informationen der jeweils anderen Seite während des Projekts und zwei Jahre danach vertraulich.",
        },
        {
          q: "Was passiert nach dem Launch, wenn etwas nicht funktioniert?",
          a: "Mängel an der gelieferten Arbeit beheben wir 30 Tage nach Lieferung kostenlos. Danach können Sie ein monatliches Wartungspaket für Monitoring, Updates und Verbesserungen wählen oder Korrekturen als separate kleine Aufträge anfragen.",
        },
        {
          q: "Können wir den Vertrag vorzeitig beenden?",
          a: "Ja. Beide Seiten können die Vereinbarung mit einer Frist von 14 Tagen schriftlich kündigen. Sie zahlen für die bis dahin erbrachte Arbeit, und wir übergeben alles bisher Erstellte in nutzbarem Zustand.",
        },
        {
          q: "Wo wird unsere Anwendung gehostet, und wer hat die Kontrolle?",
          a: "In Cloud-Konten auf Ihren Namen – oder von uns eingerichtet und an Sie übertragen. Sie behalten die Schlüssel zu Hosting, Domain und Daten, sodass Sie nie an uns gebunden sind.",
        },
        {
          q: "Wie gehen Sie mit Sicherheit und personenbezogenen Daten um?",
          a: "Wir folgen gängigen Praktiken der sicheren Softwareentwicklung: verschlüsselte Verbindungen, gehashte Zugangsdaten, rollenbasierte Zugriffe, Updates von Abhängigkeiten und Backups. Wir erheben nur die Daten, die Ihr Projekt benötigt, und können innerhalb Ihrer Datenschutzanforderungen arbeiten – einschließlich des indischen DPDP Act und der DSGVO (GDPR) für Nutzer in Europa.",
        },
      ],
    },
    {
      id: "international",
      title: "Zusammenarbeit mit internationalen Kunden",
      items: [
        {
          q: "Arbeiten Sie mit Kunden außerhalb Indiens?",
          a: "Ja. Wir arbeiten remote und übernehmen Projekte aus Indien, den USA, Europa und dem Nahen Osten. Alles – Gespräche, Dokumente, Updates und das Projektportal – ist auf die Zusammenarbeit über Zeitzonen hinweg ausgelegt.",
        },
        {
          q: "Wie funktioniert die Zusammenarbeit über Zeitzonen?",
          a: "Wir arbeiten nach India Standard Time (UTC+5:30), Montag bis Samstag. Das ergibt eine Überschneidung über den vollen Arbeitstag mit der Golfregion, vormittags mit Europa und Großbritannien sowie Gespräche frühmorgens oder abends mit den USA. Dank schriftlicher Wochenberichte hängt nichts davon ab, gleichzeitig online zu sein.",
        },
        {
          q: "In welchen Währungen können wir bezahlen?",
          a: "Wir rechnen für Kunden in Indien in INR und für internationale Kunden in USD, EUR oder AED ab. Die Währung wird vor der Unterzeichnung in Ihrem Angebot festgelegt.",
        },
        {
          q: "Können Sie mehrsprachige Websites oder Websites mit Rechts-nach-links-Schrift bauen?",
          a: "Ja – einschließlich arabischer Layouts von rechts nach links, Hindi, Deutsch und Französisch. Diese Website ist ein Beispiel: Wechseln Sie die Sprache über das Menü.",
        },
      ],
    },
    {
      id: "ai",
      title: "KI & Automatisierung",
      items: [
        {
          q: "Wird KI meine Mitarbeitenden ersetzen?",
          a: "Das ist selten das richtige Ziel. Gute Automatisierung übernimmt den repetitiven Teil einer Aufgabe – dieselbe Frage beantworten, Daten abtippen, Routine-E-Mails entwerfen –, damit Ihre Mitarbeitenden Zeit für Arbeit haben, die Urteilsvermögen erfordert. Jeden Agenten gestalten wir mit einer klaren Übergabe an einen Menschen.",
        },
        {
          q: "Werden unsere Daten zum Training von KI-Modellen verwendet?",
          a: "Wir nutzen KI-Anbieter, deren Geschäftsbedingungen kein Training mit Ihren Daten vorsehen, senden nur, was die jeweilige Aufgabe erfordert, und dokumentieren genau, wohin Ihre Daten gehen. Sensible Schritte bleiben hinter einer menschlichen Freigabe.",
        },
        {
          q: "Wie verhindern Sie, dass die KI Fehler macht?",
          a: "Wir beschränken Agenten auf Aufgaben, die sie zuverlässig erledigen, testen sie vor dem Launch mit echten Beispielen, begrenzen, was sie tun dürfen, und verlangen eine menschliche Freigabe für alles mit Konsequenzen – Senden, Bezahlen, Zusagen. Jede Aktion wird protokolliert.",
        },
        {
          q: "Was kostet der monatliche Betrieb eines KI-Agenten?",
          a: "Die Modellnutzung kostet in der Regel nur einen kleinen Bruchteil dessen, was die eingesparte Zeit wert ist. Wir schätzen die laufenden Kosten bei der Festlegung des Umfangs, weisen sie in Ihrem Angebot aus und richten Warnungen ein, damit die Nutzung Sie nie überrascht.",
        },
      ],
    },
  ],
};
