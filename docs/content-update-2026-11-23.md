# Content update · 23 November 2026

Reviewed the new files in `~/Desktop/trias` (`Änderungen_231126.docx`, `FEEDBACK RUNDE.docx`, `GS Riffian/`, `Simi.png`) against the current checkout.

## New material

- **Feedback (Anna-Lena Liebler, VS Vereinigte Spezialmöbelfabriken, Vertriebsinnendienst Export):** added word for word. Her answer has two paragraphs (one on Simon, one on René); they appear as two letters so each fits the whiteboard's lined page without shrinking the handwriting. Italian versions are marked as translations, as for the other letters.
- **Grundschule Riffian:** collage (`Grundschule Riffian.png`) and five photos added to `src/data/collages.ts` as the sixth primary school. The reference gallery now runs six columns on desktop so all primary schools share one row.
- **Simon Brugger (`Simi.png`):** a 4:5 head-and-shoulders crop on the business cards (whiteboard and footer) and the full-length cut-out in the contact section.

## Änderungen

| Punkt | Umsetzung |
|---|---|
| Telefonnummer am Whiteboard: +39 338 9342398 | Simons direkte Nummer in `people[0].phone`; erscheint auf der Visitenkarte, im Kontaktbereich und im Footer. Die Firmennummer bleibt für Impressum und Firmendaten. |
| Statistik: Bibliotheken nicht allein | Zwei Gruppen: 211 Schulen · 23 Kindergärten, Kitas & Bibliotheken. |
| Schrift wie am Whiteboard | Alle Abschnittsüberschriften in der Handschrift des Whiteboard-Claims (Kalam). |
| Übersicht Collagen | Top, unverändert. |
| Animation: falsche Möbel (Dreieckstische) | In Reihen und U-Form standen gedrehte Tano-Tische mit dem Stuhl an der Spitze. Jetzt sitzt jedes Kind an der langen Kante und schaut zum Tisch; Reihen und U-Form bestehen aus einzeln gestellten Tischen. Ein Test prüft, dass kein Stuhl mehr an einer Tischspitze steht. |
| „So läuft ein Projekt“: andere Symbole | Statt fünfmal derselbe Tisch: Kugelschreiber (Beratung), Grundriss (Planung), VS-Stuhl (VS Möbel), Hammer (Lieferung & Montage), Telefon (Betreuung). |
| Drei Perspektiven weglassen | Entfernt. |
| Feedback ohne Datum | Datum auf den Briefen, in den strukturierten Daten und in `llms.txt` entfernt. |
| Kein Anfrageformular | Entfernt. „Projekt anfragen“ führt jetzt zu Simon: Anrufen oder E-Mail (Betreff mit dem gewählten Thema). Datenschutzhinweis angepasst. |

`src/components/whiteboard/lernraum/SmartContactForm.astro` is no longer used but kept in the tree (it has uncommitted edits from earlier work); delete it once the form is definitely not coming back.
