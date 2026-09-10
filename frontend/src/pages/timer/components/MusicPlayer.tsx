import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Airplay,
  ChevronDown,
  Heart,
  MoreHorizontal,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

function MusicPlayer() {
  return (
    <Card className="flex min-h-0 flex-col !gap-0 !py-3 overflow-hidden border-border bg-card px-3 shadow-md sm:!py-5 sm:px-5">
      <div className="flex items-center justify-between text-muted-foreground">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Fechar player"
          className="rounded-full"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase">
          Tocando agora
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Mais opções"
          className="rounded-full"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-1 flex min-h-0 flex-1 flex-col justify-center gap-2 sm:mt-4 sm:gap-6 lg:mt-0">
        <div className="flex min-h-0 flex-col items-center gap-3 max-lg:flex-row max-lg:items-center max-lg:justify-start max-lg:gap-3 sm:gap-5 lg:flex-1 lg:justify-center">
          <div className="flex aspect-square w-[min(24vw,11rem)] shrink-0 items-end justify-start overflow-hidden rounded-3xl bg-primary p-3 text-primary-foreground shadow-sm max-lg:w-16 max-lg:rounded-2xl max-lg:p-2 sm:w-[min(25vw,15rem)] sm:rounded-[2rem] sm:p-5 lg:w-[min(22vw,16rem)]">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-80">
                Quiet hours
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Lofi
              </p>
            </div>
          </div>

          <div className="flex w-full min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight sm:text-lg">
                Lofi Focus Beats
              </p>
              <p className="truncate text-sm text-muted-foreground">
                Aesthetic Soundscape
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Favoritar faixa"
              className="shrink-0 rounded-full text-muted-foreground"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full">
          <Slider defaultValue={[65]} max={100} step={1} />
          <div className="mt-2 flex justify-between text-[10px] tabular-nums text-muted-foreground">
            <span>1:42</span>
            <span>3:45</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Saída de áudio"
            className="rounded-full"
          >
            <Airplay className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Faixa anterior"
              className="rounded-full"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </Button>
            <Button
              type="button"
              size="icon-lg"
              aria-label="Reproduzir ou pausar música"
              className="rounded-full shadow-sm"
            >
              <Pause className="h-5 w-5 fill-current" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Próxima faixa"
              className="rounded-full"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Volume"
            className="rounded-full"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export { MusicPlayer };
