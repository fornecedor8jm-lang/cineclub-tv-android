import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

import type { M3UItem } from "@/lib/m3u";
import { trpc } from "@/lib/trpc";

type SubtitleCue = { start: number; end: number; text: string };

function parseSrtTime(value: string) {
  const [clock, millis = "0"] = value.trim().replace(",", ".").split(".");
  const [hours, minutes, seconds] = clock.split(":").map(Number);
  return (hours * 3600) + (minutes * 60) + Number(seconds) + (Number(`0.${millis}`) || 0);
}

function parseSrt(source: string): SubtitleCue[] {
  return source.replace(/\r/g, "").split(/\n\s*\n/).map((block) => {
    const lines = block.split("\n");
    const timing = lines.find((line) => line.includes(" --> "));
    if (!timing) return null;
    const [start, end] = timing.split(" --> ");
    return { start: parseSrtTime(start), end: parseSrtTime(end), text: lines.slice(lines.indexOf(timing) + 1).join("\n").trim() };
  }).filter((cue): cue is SubtitleCue => Boolean(cue?.text));
}

export function M3UPlayer({ item, onClose, channelItems = [], onChangeItem }: { item: M3UItem; onClose: () => void; channelItems?: M3UItem[]; onChangeItem?: (item: M3UItem) => void }) {
  const player = useVideoPlayer(item.url, (instance) => {
    instance.play();
  });
  const [status, setStatus] = useState(player.status);
  const [error, setError] = useState<unknown>(null);
  const [isPlaying, setIsPlaying] = useState(player.playing);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [focused, setFocused] = useState("close");
  const [subtitleLanguage, setSubtitleLanguage] = useState<"pt-br" | "pt-pt" | "en" | "es">("pt-br");
  const [subtitlePanel, setSubtitlePanel] = useState(false);
  const [subtitleCues, setSubtitleCues] = useState<SubtitleCue[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitleLoading, setSubtitleLoading] = useState(false);
  const [subtitleError, setSubtitleError] = useState<string | null>(null);
  const [channelPanel, setChannelPanel] = useState(false);
  const channelIndex = channelItems.findIndex((channel) => channel.id === item.id);
  const isLive = item.kind === "live";
  const switchChannel = (nextIndex: number) => {
    const next = channelItems[nextIndex];
    if (next && onChangeItem) {
      setChannelPanel(false);
      onChangeItem(next);
    }
  };
  const subtitleSearch = trpc.subtitles.search.useQuery({ title: item.title || item.name, language: subtitleLanguage, season: item.season, episode: item.episode }, { enabled: false });
  const subtitleDownload = trpc.subtitles.download.useMutation();

  const searchSubtitles = () => { setSubtitlePanel(true); setSubtitleError(null); void subtitleSearch.refetch(); };
  const applySubtitle = async (fileId: string) => {
    setSubtitleLoading(true);
    setSubtitleError(null);
    try {
      const result = await subtitleDownload.mutateAsync({ fileId });
      const response = await fetch(result.link);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setSubtitleCues(parseSrt(await response.text()));
    } catch {
      setSubtitleCues([]);
      setSubtitleError("Não foi possível carregar esta legenda. A reprodução continua normalmente.");
    } finally {
      setSubtitleLoading(false);
    }
  };

  const currentSubtitle = subtitleCues.find((cue) => currentTime >= cue.start && currentTime <= cue.end);
  const seekBy = (seconds: number) => {
    player.currentTime = Math.max(0, player.currentTime + seconds);
  };
  const cycleSpeed = () => {
    const next = playbackRate >= 2 ? 1 : playbackRate + 0.5;
    player.playbackRate = next;
    setPlaybackRate(next);
  };

  useEffect(() => {
    if (!player || !item.url) return;
    player.replace(item.url);
    player.play();
  }, [item.url, player]);

  useEffect(() => {
    const timeSubscription = player.addListener("timeUpdate", ({ currentTime: nextTime }) => setCurrentTime(nextTime));
    const statusSubscription = player.addListener("statusChange", ({ status: nextStatus, error: nextError }) => {
      setStatus(nextStatus);
      setError(nextError ?? null);
    });
    const playingSubscription = player.addListener("playingChange", ({ isPlaying: nextPlaying }) => setIsPlaying(nextPlaying));
    return () => {
      timeSubscription.remove();
      statusSubscription.remove();
      playingSubscription.remove();
      player.pause();
    };
  }, [player]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>{item.logo ? <Image source={{ uri: item.logo }} style={styles.channelLogo} resizeMode="contain" /> : null}<View><Text style={styles.title} numberOfLines={1}>{item.name}</Text>{isLive && <Text style={styles.liveLabel}>AO VIVO</Text>}</View></View>
        <Pressable focusable onFocus={() => setFocused("close")} onPress={onClose} style={[styles.close, focused === "close" && styles.focused]}>
          <Text style={styles.closeText}>Fechar</Text>
        </Pressable>
      </View>
      <View style={styles.videoWrap}>
        <VideoView style={styles.video} player={player} contentFit="contain" allowsFullscreen surfaceType="textureView" />
        {currentSubtitle && <View pointerEvents="none" style={styles.subtitleOverlay}><Text style={styles.subtitleText}>{currentSubtitle.text}</Text></View>}
        {status === "loading" && <View style={styles.overlay}><ActivityIndicator color="#F5EBDD" size="large" /><Text style={styles.overlayText}>Carregando {item.name}…</Text></View>}
        {(status === "error" || Boolean(error)) && <View style={styles.overlay}><Text style={styles.errorTitle}>Não foi possível reproduzir este link</Text><Text style={styles.overlayText}>Confirme se a fonte M3U é válida e autorizada.</Text></View>}
      </View>
      <View style={styles.controls}>
        {isLive && <>
          <Pressable disabled={channelIndex <= 0} focusable={channelIndex > 0} onFocus={() => setFocused("previous-channel")} onPress={() => switchChannel(channelIndex - 1)} style={[styles.control, channelIndex <= 0 && styles.disabledControl, focused === "previous-channel" && styles.focused]}><Text style={styles.controlText}>◀ Canal anterior</Text></Pressable>
          <Pressable focusable onFocus={() => setFocused("channel-list")} onPress={() => setChannelPanel((value) => !value)} style={[styles.control, focused === "channel-list" && styles.focused]}><Text style={styles.controlText}>☰ Canais</Text></Pressable>
          <Pressable disabled={channelIndex < 0 || channelIndex >= channelItems.length - 1} focusable={channelIndex >= 0 && channelIndex < channelItems.length - 1} onFocus={() => setFocused("next-channel")} onPress={() => switchChannel(channelIndex + 1)} style={[styles.control, channelIndex < 0 || channelIndex >= channelItems.length - 1 ? styles.disabledControl : null, focused === "next-channel" && styles.focused]}><Text style={styles.controlText}>Próximo canal ▶</Text></Pressable>
        </>}
        <Pressable focusable onFocus={() => setFocused("back10")} onPress={() => seekBy(-10)} style={[styles.control, focused === "back10" && styles.focused]}>
          <Text style={styles.controlText}>↶ 10s</Text>
        </Pressable>
        <Pressable focusable onFocus={() => setFocused("play")} onPress={() => isPlaying ? player.pause() : player.play()} style={[styles.control, focused === "play" && styles.focused]}>
          <Text style={styles.controlText}>{isPlaying ? "❚❚ Pausar" : "▶ Reproduzir"}</Text>
        </Pressable>
        <Pressable focusable onFocus={() => setFocused("forward10")} onPress={() => seekBy(10)} style={[styles.control, focused === "forward10" && styles.focused]}>
          <Text style={styles.controlText}>10s ↷</Text>
        </Pressable>
        <Pressable focusable onFocus={() => setFocused("speed")} onPress={cycleSpeed} style={[styles.control, focused === "speed" && styles.focused]}>
          <Text style={styles.controlText}>{playbackRate}x</Text>
        </Pressable>
        <Pressable focusable onFocus={() => setFocused("subtitles")} onPress={searchSubtitles} style={[styles.control, focused === "subtitles" && styles.focused]}>
          <Text style={styles.controlText}>CC Legendas</Text>
        </Pressable>
        <Text style={styles.meta}>{item.group} · {item.kind}</Text>
      </View>
      {channelPanel && isLive && <View style={styles.channelPanel}><Text style={styles.subtitleTitle}>Canais</Text>{channelItems.slice(0, 80).map((channel) => <Pressable key={channel.id} focusable hasTVPreferredFocus={channel.id === item.id} onFocus={() => setFocused(`channel-${channel.id}`)} onPress={() => onChangeItem?.(channel)} style={[styles.channelRow, channel.id === item.id && styles.channelRowActive, focused === `channel-${channel.id}` && styles.focused]}>{channel.logo ? <Image source={{ uri: channel.logo }} style={styles.channelRowLogo} resizeMode="contain" /> : <View style={styles.channelRowFallback}><Text style={styles.channelRowFallbackText}>{channel.name.slice(0, 1).toUpperCase()}</Text></View>}<Text numberOfLines={1} style={styles.controlText}>{channel.name}</Text></Pressable>)}</View>}
      {subtitlePanel && <View style={styles.subtitlePanel}><Text style={styles.subtitleTitle}>Legendas</Text><View style={styles.languageRow}>{([['pt-br','Português BR'], ['pt-pt','Português PT'], ['en','English'], ['es','Español']] as const).map(([code, label]) => <Pressable key={code} focusable onFocus={() => setFocused(`lang-${code}`)} onPress={() => { setSubtitleLanguage(code); setTimeout(() => void subtitleSearch.refetch(), 0); }} style={[styles.languageButton, subtitleLanguage === code && styles.languageActive, focused === `lang-${code}` && styles.focused]}><Text style={styles.controlText}>{label}</Text></Pressable>)}</View>{subtitleSearch.isFetching && <Text style={styles.subtitleHint}>Procurando legendas…</Text>}{!subtitleSearch.isFetching && subtitleSearch.data?.length === 0 && <Text style={styles.subtitleHint}>Nenhuma legenda encontrada. O vídeo continua disponível.</Text>}{subtitleLoading && <Text style={styles.subtitleHint}>Baixando e preparando legenda…</Text>}{subtitleError && <Text style={styles.subtitleHint}>{subtitleError}</Text>}{subtitleSearch.data?.slice(0, 4).map((subtitle) => <Pressable key={String(subtitle.id)} focusable onFocus={() => setFocused(`subtitle-${subtitle.id}`)} onPress={() => subtitle.fileId && void applySubtitle(String(subtitle.fileId))} style={[styles.subtitleResult, focused === `subtitle-${subtitle.id}` && styles.focused]}><Text style={styles.controlText}>{String(subtitle.language || subtitleLanguage)} · {String(subtitle.release || "OpenSubtitles")}</Text><Text style={styles.subtitleHint}>{subtitle.fileId ? "OK para aplicar esta legenda" : "Arquivo indisponível"}</Text></Pressable>)}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07191F" },
  header: { height: 70, paddingHorizontal: 34, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#102B33", borderBottomWidth: 1, borderBottomColor: "#31535A" },
  titleWrap: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }, channelLogo: { width: 48, height: 42, backgroundColor: "#07191F", borderRadius: 4 }, title: { color: "#F5EBDD", fontSize: 20, fontWeight: "800", marginRight: 18 }, liveLabel: { color: "#D86C5C", fontSize: 10, fontWeight: "900", marginTop: 3 },
  close: { borderWidth: 1, borderColor: "#D86C5C", borderRadius: 5, paddingHorizontal: 18, paddingVertical: 10 },
  closeText: { color: "#F5EBDD", fontWeight: "800" },
  focused: { borderWidth: 3, borderColor: "#F5EBDD", backgroundColor: "#244B53" },
  videoWrap: { flex: 1, backgroundColor: "#000", position: "relative" },
  video: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.64)", padding: 24 },
  overlayText: { color: "#F5EBDD", fontSize: 15, marginTop: 10, textAlign: "center" },
  errorTitle: { color: "#F5EBDD", fontSize: 20, fontWeight: "800", textAlign: "center" },
  controls: { minHeight: 72, paddingHorizontal: 34, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#102B33", flexWrap: "wrap" },
  control: { borderWidth: 1, borderColor: "#D86C5C", borderRadius: 5, paddingHorizontal: 16, paddingVertical: 10 },
  controlText: { color: "#F5EBDD", fontWeight: "800" }, disabledControl: { opacity: 0.35 }, channelPanel: { position: "absolute", left: 24, right: 24, bottom: 82, maxHeight: 360, padding: 16, backgroundColor: "#102B33", borderWidth: 1, borderColor: "#D86C5C", borderRadius: 8, zIndex: 4 }, channelRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 5, borderWidth: 1, borderColor: "transparent" }, channelRowActive: { backgroundColor: "#193C43", borderColor: "#D86C5C" }, channelRowLogo: { width: 54, height: 32, backgroundColor: "#07191F", borderRadius: 3 }, channelRowFallback: { width: 54, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: "#244B53", borderRadius: 3 }, channelRowFallbackText: { color: "#F5EBDD", fontWeight: "900" },
  meta: { color: "#A9B9B6", fontSize: 13 }, subtitleOverlay: { position: "absolute", left: 30, right: 30, bottom: 26, alignItems: "center" }, subtitleText: { color: "#FFFFFF", backgroundColor: "rgba(0,0,0,0.78)", paddingHorizontal: 12, paddingVertical: 7, textAlign: "center", fontSize: 18, fontWeight: "700" }, subtitlePanel: { padding: 18, backgroundColor: "#193C43", borderTopWidth: 1, borderTopColor: "#31535A" }, subtitleTitle: { color: "#F5EBDD", fontSize: 18, fontWeight: "800", marginBottom: 12 }, languageRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" }, languageButton: { borderWidth: 1, borderColor: "#6F8D88", borderRadius: 5, paddingHorizontal: 12, paddingVertical: 8 }, languageActive: { backgroundColor: "#D86C5C", borderColor: "#D86C5C" }, subtitleResult: { marginTop: 10, padding: 10, borderWidth: 1, borderColor: "#31535A", borderRadius: 5 }, subtitleHint: { color: "#B6C9C4", fontSize: 12, marginTop: 7 },
});
