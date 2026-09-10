import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  Eye,
  Moon,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sofa,
  Sun,
} from "lucide-react";
import { MusicPlayer } from "./components/MusicPlayer";

function TimerUi() {
  const [fullSessions, setFullSessions] = useState(Number);
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">(
    "focus",
  );
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("pomodoro-theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  const setBreaks = (mode: "focus" | "shortBreak" | "longBreak") => {
    switch (mode) {
      case "focus":
        setIsActive(false);
        setMode("focus");
        setSeconds(1500);
        break;

      case "shortBreak":
        setIsActive(false);
        setMode("shortBreak");
        setSeconds(300);
        break;

      case "longBreak":
        setIsActive(false);
        setMode("longBreak");
        setSeconds(900);
        break;
    }
  };

  const focusEnd = () => {
    setFullSessions(() => fullSessions + 1);

    if (fullSessions % 4 === 0) {
      setBreaks("longBreak");
    } else {
      setBreaks("shortBreak");
    }
  };

  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(() => seconds - 1);
        } else {
          clearInterval(interval);
          focusEnd();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [seconds, isActive]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("pomodoro-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const addMinutes = () => {
    setIsActive(false);
    setSeconds(() => seconds + 60);
  };

  const removeMinutes = () => {
    if (seconds < 0) return;

    setIsActive(false);
    setSeconds(() => seconds - 60);
  };

  const toggleTimer = () => {
    if (isActive) {
      return setIsActive(false);
    }
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setBreaks(mode);
  };

  const formatNumber = (number: number): string => {
    return String(number).padStart(2, "0");
  };

  const minutos = Math.floor(seconds / 60);
  const segundos = seconds % 60;
  const modeDuration =
    mode === "focus" ? 1500 : mode === "shortBreak" ? 300 : 900;
  const progress = Math.min(seconds / modeDuration, 1);
  const circumference = 2 * Math.PI * 88;
  const strokeDashoffset = circumference * (1 - progress);
  const modeLabel =
    mode === "focus"
      ? "Tempo de foco"
      : mode === "shortBreak"
        ? "Pausa curta"
        : "Pausa longa";

  return (
    <main className="h-[100svh] bg-background text-foreground transition-colors duration-500">
      <div className="mx-auto grid h-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                PomoChill
              </p>
              <p className="header-subtitle hidden truncate text-xs text-muted-foreground sm:block">
                Um pequeno espaço para fazer uma coisa de cada vez.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            onClick={() => setIsDark((current) => !current)}
            className="shrink-0 rounded-full border-border bg-card shadow-sm"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </header>

        <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 sm:gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,23rem)] md:grid-rows-1">
          <Card className="timer-card relative flex min-h-0 flex-col !gap-0 !py-3 overflow-hidden border-border bg-card px-3 shadow-md sm:!py-5 sm:px-5">

            <div className="relative flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Ciclo atual
                </p>
                <p className="mt-1 text-sm text-foreground/80">
                  Sessão {fullSessions + 1} de 4
                </p>
              </div>
              <div className="rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                {isActive ? "Em andamento" : "Em espera"}
              </div>
            </div>

            <div className="timer-mode-selector mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setBreaks("focus")}
                className={`h-auto min-w-0 flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all sm:p-4 ${
                  mode === "focus"
                    ? "border-primary/50 bg-primary/10 text-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">FOCO</span>
                  <span className="sm:hidden">25m</span>
                </span>
                <span className="text-lg font-semibold tabular-nums sm:text-xl">
                  25:00
                </span>
                <span className="h-1 w-full rounded-full bg-primary/70" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setBreaks("shortBreak")}
                className={`h-auto min-w-0 flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all sm:p-4 ${
                  mode === "shortBreak"
                    ? "border-chart-2/50 bg-chart-2/10 text-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                  <Coffee className="h-4 w-4" />
                  <span className="hidden sm:inline">PAUSA</span>
                  <span className="sm:hidden">5m</span>
                </span>
                <span className="text-lg font-semibold tabular-nums sm:text-xl">
                  05:00
                </span>
                <span className="h-1 w-full rounded-full bg-chart-2/70" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setBreaks("longBreak")}
                className={`h-auto min-w-0 flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all sm:p-4 ${
                  mode === "longBreak"
                    ? "border-chart-4/50 bg-chart-4/10 text-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                  <Sofa className="h-4 w-4" />
                  <span className="hidden sm:inline">DESCANSO</span>
                  <span className="sm:hidden">15m</span>
                </span>
                <span className="text-lg font-semibold tabular-nums sm:text-xl">
                  15:00
                </span>
                <span className="h-1 w-full rounded-full bg-chart-4/70" />
              </Button>
            </div>

            <div className="timer-area flex min-h-0 flex-1 flex-col items-center py-2 sm:py-4">
              <div className="timer-face-wrap flex min-h-0 w-full flex-1 items-center justify-center">
                <div className="timer-face relative">
                  <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                    <circle
                      cx="100"
                      cy="100"
                      r="88"
                      fill="none"
                      className="stroke-border/50"
                      strokeWidth="5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="88"
                      fill="none"
                      className="stroke-primary"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="timer-value w-[84%] text-center font-semibold leading-none tracking-tight text-primary tabular-nums">
                      {formatNumber(minutos)}:{formatNumber(segundos)}
                    </span>
                    <span className="mt-3 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                      {modeLabel}
                    </span>
                    <span className="timer-helper mt-1 text-xs text-muted-foreground/70">
                      Respire. O próximo minuto é seu.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remover um minuto"
                  onClick={removeMinutes}
                  className="rounded-full text-muted-foreground hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-24 text-center text-xs text-muted-foreground">
                  Ajustar tempo
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Adicionar um minuto"
                  onClick={addMinutes}
                  className="rounded-full text-muted-foreground hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-2 flex items-center gap-2 sm:mt-4">
                <Button
                  type="button"
                  onClick={toggleTimer}
                  size="lg"
                  className="min-w-32 rounded-full px-6 shadow-sm"
                >
                  {isActive ? (
                    <Pause className="mr-2 h-4 w-4 fill-current" />
                  ) : (
                    <Play className="mr-2 h-4 w-4 fill-current" />
                  )}
                  {isActive ? "Pausar" : "Iniciar"}
                </Button>
                <Button
                  type="button"
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border bg-background"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reiniciar
                </Button>
              </div>
            </div>
          </Card>

          <div className="min-h-0 md:grid md:grid-rows-1">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </main>
  );
}

export { TimerUi };
