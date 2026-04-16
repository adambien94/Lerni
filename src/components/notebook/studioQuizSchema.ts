/**
 * Kontrakt danych quizu w Studio — ten sam kształt może później pochodzić z API / generacji LLM.
 * `totalQuestions` może służyć do walidacji (powinno zgadzać się z `questions.length`).
 */
export type StudioQuizOption = {
  /** Litera lub stabilny identyfikator odpowiedzi, np. "A" … "D" */
  id: string;
  text: string;
};

export type StudioQuizQuestion = {
  /** Unikalny identyfikator pytania (string ułatwia mapowanie z backendu) */
  id: string;
  questionText: string;
  options: StudioQuizOption[];
  correctOptionId: string;
  hint: string;
};

export type StudioQuiz = {
  /** Krótka nazwa widoczna w breadcrumbzie po „Studio > …” */
  contextLabel: string;
  title: string;
  sourceCount: number;
  /** Oczekiwana liczba pytań (np. z metadanych generacji); zwykle === questions.length */
  totalQuestions: number;
  questions: StudioQuizQuestion[];
};

export const MOCK_STUDIO_QUIZ: StudioQuiz = {
  contextLabel: "Aplikacja",
  title: "WZORCE QUIZ",
  sourceCount: 7,
  totalQuestions: 10,
  questions: [
    {
      id: "q-singleton-goal",
      questionText: "Jaki jest główny cel wzorca projektowego Singleton?",
      options: [
        {
          id: "A",
          text: "Umożliwienie współpracy obiektów o niekompatybilnych interfejsach.",
        },
        {
          id: "B",
          text: "Zapewnienie, że klasa ma tylko jedną instancję i dostarczenie do niej.",
        },
        {
          id: "C",
          text: "Udostępnienie uproszczonego interfejsu do złożonego podsystemu.",
        },
        {
          id: "D",
          text: "Oddzielenie konstrukcji złożonego obiektu od jego reprezentacji.",
        },
      ],
      correctOptionId: "B",
      hint: "Pomyśl o „pojedynczym” obiekcie w całej aplikacji.",
    },
    {
      id: "q-factory-method",
      questionText: "Po co stosuje się wzorzec Factory Method?",
      options: [
        {
          id: "A",
          text: "Aby zapewnić tylko jedną instancję obiektu w całym programie.",
        },
        {
          id: "B",
          text: "Aby delegować tworzenie obiektów do podklas i oddzielić konstrukcję od użycia.",
        },
        {
          id: "C",
          text: "Aby powiadamiać wielu obserwatorów o zmianach stanu obiektu.",
        },
        {
          id: "D",
          text: "Aby dynamicznie wybierać algorytm w czasie działania programu.",
        },
      ],
      correctOptionId: "B",
      hint: "Chodzi o tworzenie obiektów bez wiązania kodu z konkretnymi klasami.",
    },
    {
      id: "q-observer",
      questionText: "Co rozwiązuje wzorzec Observer?",
      options: [
        {
          id: "A",
          text: "Tworzenie rodzin powiązanych obiektów bez specyfikowania ich klas.",
        },
        {
          id: "B",
          text: "Powiadamianie wielu obiektów o zmianie stanu jednego obiektu (publish/subscribe).",
        },
        {
          id: "C",
          text: "Dodawanie nowych operacji do struktury obiektów bez ich modyfikacji.",
        },
        {
          id: "D",
          text: "Zarządzanie cyklem życia wielu instancji tej samej klasy.",
        },
      ],
      correctOptionId: "B",
      hint: "Jedna zmiana — wiele zainteresowanych odbiorców.",
    },
    {
      id: "q-adapter",
      questionText: "Adapter służy przede wszystkim do…",
      options: [
        {
          id: "A",
          text: "Dodawania nowych algorytmów bez zmiany klas kontekstu.",
        },
        {
          id: "B",
          text: "Dopasowania istniejącego interfejsu do oczekiwanego przez klienta.",
        },
        { id: "C", text: "Tworzenia hierarchii klas równoległych." },
        { id: "D", text: "Kompresji danych przesyłanych między warstwami." },
      ],
      correctOptionId: "B",
      hint: "„Owinąć” coś, żeby pasowało do nowego API.",
    },
    {
      id: "q-facade",
      questionText: "Wzorzec Facade upraszcza…",
      options: [
        {
          id: "A",
          text: "Dostęp do wielu klas podsystemu przez jeden punkt wejścia.",
        },
        { id: "B", text: "Serializację grafu obiektów." },
        { id: "C", text: "Obsługę wielowątkowości w JVM." },
        { id: "D", text: "Walidację formularzy po stronie klienta." },
      ],
      correctOptionId: "A",
      hint: "Jedna fasada, wiele ukrytych szczegółów.",
    },
    {
      id: "q-strategy",
      questionText: "Strategy pozwala na…",
      options: [
        { id: "A", text: "Zamianę algorytmu w czasie działania programu." },
        { id: "B", text: "Gwarantowanie pojedynczej instancji usługi." },
        { id: "C", text: "Automatyczne zwalnianie pamięci." },
        { id: "D", text: "Buforowanie zapytań HTTP." },
      ],
      correctOptionId: "A",
      hint: "Rodzina wymiennych „strategii” tego samego zadania.",
    },
    {
      id: "q-decorator",
      questionText: "Decorator dodaje obiektowi…",
      options: [
        {
          id: "A",
          text: "Nowe zachowania przez opakowanie bez zmiany interfejsu klienta.",
        },
        { id: "B", text: "Trwały identyfikator UUID." },
        { id: "C", text: "Wyłącznie logowanie na poziomie DEBUG." },
        { id: "D", text: "Persystencję w relacyjnej bazie danych." },
      ],
      correctOptionId: "A",
      hint: "Warstwy jak u cebuli — każda dokłada coś od zewnątrz.",
    },
    {
      id: "q-template-method",
      questionText: "Template Method definiuje…",
      options: [
        {
          id: "A",
          text: "Szkielet algorytmu w klasie bazowej, pozostawiając kroki podklasom.",
        },
        { id: "B", text: "Szablon HTML dla widoku." },
        { id: "C", text: "Strukturę drzewa DOM." },
        { id: "D", text: "Konfigurację serwera aplikacji." },
      ],
      correctOptionId: "A",
      hint: "Kolejność kroków jest stała, detale — nadpisywalne.",
    },
    {
      id: "q-builder",
      questionText: "Builder jest szczególnie przydatny, gdy…",
      options: [
        {
          id: "A",
          text: "Konstrukcja obiektu wymaga wielu opcjonalnych parametrów.",
        },
        {
          id: "B",
          text: "Potrzebujesz dokładnie jednej instancji w całej aplikacji.",
        },
        { id: "C", text: "Komunikujesz się z mikroserwisami przez WebSocket." },
        { id: "D", text: "Chcesz zminimalizować liczbę klas w projekcie." },
      ],
      correctOptionId: "A",
      hint: "Fluent API i krok po kroku.",
    },
    {
      id: "q-prototype",
      questionText: "Prototype służy do…",
      options: [
        {
          id: "A",
          text: "Klonowania istniejących obiektów zamiast kosztownej inicjalizacji.",
        },
        { id: "B", text: "Wymuszania kolejności wywołań metod." },
        { id: "C", text: "Mapowania tabel ORM." },
        { id: "D", text: "Obsługi zdarzeń myszy w UI." },
      ],
      correctOptionId: "A",
      hint: "Kopia na żądanie.",
    },
  ],
};
