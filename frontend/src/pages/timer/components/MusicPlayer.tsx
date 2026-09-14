import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  AlertCircle,
  Heart,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ApiTrack = {
  id?: string | number;
  track_name: string;
  track_artist: string;
  track_url: string;
};

type Track = {
  id: string;
  name: string;
  artist: string;
  url: string;
};

type TracksResponse = {
  success: boolean;
  data: ApiTrack[] | null;
};

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const formatTime = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

function MusicPlayer() {
  const [musicas, setMusicas] = useState<Track[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [recarregar, setRecarregar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoplayRef = useRef(false);

  const musicaAtual = musicas[indiceAtual];

  useEffect(() => {
    const controller = new AbortController();

    const getAllTracks = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/tracks`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as TracksResponse;

        if (!response.ok || !payload.success || !Array.isArray(payload.data)) {
          throw new Error("Falha ao carregar as músicas.");
        }

        const tracks = payload.data
          .filter(
            (track) =>
              typeof track.track_url === "string" && track.track_url.trim(),
          )
          .map((track, index) => ({
            id: String(track.id ?? `${track.track_url}-${index}`),
            name: track.track_name || "Faixa sem título",
            artist: track.track_artist || "Artista desconhecido",
            url: track.track_url,
          }));

        if (tracks.length === 0) {
          throw new Error("Nenhuma música disponível.");
        }

        setMusicas(tracks);
        setIndiceAtual(0);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar as músicas.",
        );
        setMusicas([]);
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    };

    void getAllTracks();

    return () => controller.abort();
  }, [recarregar]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !musicaAtual) return;

    setCurrentTime(0);
    setDuration(0);
    audio.load();

    if (shouldAutoplayRef.current) {
      shouldAutoplayRef.current = false;
      void audio.play().catch(() => {
        setIsPlaying(false);
        setErro("Não foi possível reproduzir esta música.");
      });
    }
  }, [musicaAtual]);

  const changeTrack = (nextIndex: number, autoplay: boolean) => {
    if (musicas.length === 0) return;

    shouldAutoplayRef.current = autoplay;
    setIndiceAtual((nextIndex + musicas.length) % musicas.length);
  };

  const playNextTrack = () => {
    changeTrack(indiceAtual + 1, isPlaying);
  };

  const playPreviousTrack = () => {
    const audio = audioRef.current;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    changeTrack(indiceAtual - 1, isPlaying);
  };

  const togglePlayback = () => {
    const audio = audioRef.current;

    if (!audio || !musicaAtual) return;

    if (audio.paused) {
      setErro(null);
      void audio.play().catch(() => {
        setIsPlaying(false);
        setErro("Não foi possível reproduzir esta música.");
      });
    } else {
      audio.pause();
    }
  };

  const seekTrack = (value: number | readonly number[]) => {
    const audio = audioRef.current;
    const nextValue = Array.isArray(value) ? value[0] : value;

    if (!audio || typeof nextValue !== "number" || duration === 0) return;

    const nextTime = (nextValue / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const hasTrack = Boolean(musicaAtual);
  const controlsDisabled = carregando || !hasTrack;

  return (
    <Card className="flex min-h-0 flex-col !gap-0 !py-3 overflow-hidden border-border bg-card px-3 shadow-md sm:!py-5 sm:px-5">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="w-8" aria-hidden="true" />
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase">
          Tocando agora
        </p>
        <span className="w-8" aria-hidden="true" />
      </div>

      {carregando ? (
        <div className="flex min-h-56 flex-1 items-center justify-center text-sm text-muted-foreground">
          Carregando músicas...
        </div>
      ) : erro ? (
        <div className="flex min-h-56 flex-1 flex-col items-center justify-center gap-3 text-center">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="max-w-56 text-sm text-muted-foreground">{erro}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRecarregar((value) => value + 1)}
          >
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="mt-1 flex min-h-0 flex-1 flex-col justify-center gap-2 sm:mt-4 sm:gap-6 lg:mt-0">
          <div className="flex min-h-0 flex-col items-center gap-3 max-lg:flex-row max-lg:items-center max-lg:justify-start max-lg:gap-3 sm:gap-5 lg:flex-1 lg:justify-center">
            <div className="flex aspect-square w-[min(24vw,11rem)] shrink-0 items-end justify-start overflow-hidden rounded-3xl bg-primary p-3 text-primary-foreground shadow-sm max-lg:w-16 max-lg:rounded-2xl max-lg:p-2 sm:w-[min(25vw,15rem)] sm:rounded-[2rem] sm:p-5 lg:w-[min(22vw,16rem)]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-80">
                  Quiet hours
                </p>
                <p className="mt-1 line-clamp-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {musicaAtual?.name ?? "Lofi"}
                </p>
              </div>
            </div>

            <div className="flex w-full min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-tight sm:text-lg">
                  {musicaAtual?.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {musicaAtual?.artist}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={
                  isFavorite ? "Remover dos favoritos" : "Favoritar faixa"
                }
                aria-pressed={isFavorite}
                onClick={() => setIsFavorite((value) => !value)}
                className={`shrink-0 rounded-full ${
                  isFavorite ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Heart className={isFavorite ? "fill-current" : ""} />
              </Button>
            </div>
          </div>

          <div className="w-full">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              disabled={controlsDisabled || duration === 0}
              onValueChange={seekTrack}
              aria-label="Progresso da música"
            />
            <div className="mt-2 flex justify-between text-[10px] tabular-nums text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={isMuted ? "Ativar som" : "Silenciar música"}
              onClick={toggleMute}
              disabled={controlsDisabled}
              className="rounded-full"
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Faixa anterior"
                onClick={playPreviousTrack}
                disabled={controlsDisabled}
                className="rounded-full"
              >
                <SkipBack className="h-5 w-5 fill-current" />
              </Button>
              <Button
                type="button"
                size="icon-lg"
                aria-label={isPlaying ? "Pausar música" : "Reproduzir música"}
                onClick={togglePlayback}
                disabled={controlsDisabled}
                className="rounded-full shadow-sm"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Próxima faixa"
                onClick={playNextTrack}
                disabled={controlsDisabled}
                className="rounded-full"
              >
                <SkipForward className="h-5 w-5 fill-current" />
              </Button>
            </div>
            <span className="w-8" aria-hidden="true" />
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={musicaAtual?.url}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => {
          if (musicas.length > 1) {
            changeTrack(indiceAtual + 1, true);
          } else {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }}
        onError={() => {
          setIsPlaying(false);
          setErro("Não foi possível carregar esta música.");
        }}
        aria-label={musicaAtual?.name ?? "Player de música"}
      />
    </Card>
  );
}

export { MusicPlayer };
