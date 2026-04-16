import { BookOpenText, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummarySection() {
  return (
    <Card className="flex h-full min-h-0 flex-col border-border/80 bg-card/60">
      <CardHeader className="border-b border-border/50 p-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium mb-0">
          <BookOpenText className="h-4 w-4 text-muted-foreground" />
          Podsumowanie
        </CardTitle>
        {/* <CardDescription className="text-xs">
          Tu będzie wyświetlane podsumowanie wybranych artykułów.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Podsumowanie AI
          </div>
          <div className="space-y-3 text-sm leading-7 text-muted-foreground">
            <h3 className="text-sm font-semibold text-foreground">
              Część 1: Podstawy Sieci i Protokoły
            </h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Co to jest HTTP?</strong> To protokół aplikacji
                umożliwiający przesyłanie danych, takich jak strony HTML czy
                obrazy, działający w modelu klient-serwer.
              </li>
              <li>
                <strong>Z czego składa się żądanie HTTP?</strong> Składa się z
                linii startowej, nagłówków oraz ciała wiadomości oddzielonego
                pustą linią.
              </li>
              <li>
                <strong>Jakie znasz metody żądań HTTP?</strong> GET, HEAD, POST,
                PUT, DELETE, CONNECT, OPTIONS, TRACE i PATCH.
              </li>
              <li>
                <strong>Co robi metoda GET?</strong> Służy wyłącznie do
                pobierania reprezentacji zasobu.
              </li>
              <li>
                <strong>Jaka jest różnica między POST a PUT?</strong> POST
                wysyła dane często zmieniając stan serwera, a PUT całkowicie
                zastępuje bieżący zasób danymi żądania.
              </li>
              <li>
                <strong>Czym różni się PUT od PATCH?</strong> PATCH służy do
                częściowej modyfikacji zasobu, a PUT do jego całkowitego
                zastąpienia.
              </li>
              <li>
                <strong>Co to są Websockets?</strong> Protokół zapewniający
                dwukierunkowy kanał komunikacji w czasie rzeczywistym przez
                jedno połączenie TCP.
              </li>
              <li>
                <strong>Czym różni się Websockets od HTTP?</strong> HTTP opiera
                się na modelu żądanie-odpowiedź, a Websockets pozwalają na
                przesyłanie danych przez obie strony w dowolnym momencie.
              </li>
              <li>
                <strong>Co to jest REST API?</strong> Styl architektoniczny
                definiujący zasady budowania usług internetowych w oparciu o
                metody HTTP i adresy URL.
              </li>
              <li>
                <strong>Jakie są główne zasady REST?</strong> Prostota,
                skalowalność, bezstanowość oraz jednolity interfejs.
              </li>
              <li>
                <strong>Co to jest WebRTC?</strong> Projekt open-source
                umożliwiający komunikację audio, wideo i przesyłanie danych
                bezpośrednio między przeglądarkami (P2P) bez wtyczek.
              </li>
              <li>
                <strong>Do czego używa się WebRTC?</strong> Do wideokonferencji,
                streamingu na żywo i narzędzi do współpracy w czasie
                rzeczywistym.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
