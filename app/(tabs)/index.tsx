import AsyncStorage from "@react-native-async-storage/async-storage";
import { memo, useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
  Platform,
  BackHandler,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";
import { M3UItem, DEMO_M3U, groupM3U, parseM3U } from "@/lib/m3u";
import { M3UPlayer } from "@/components/m3u-player";
import QRCode from "qrcode";
import { SvgXml } from "react-native-svg";
import { trpc } from "@/lib/trpc";
import { getApiBaseUrl } from "@/constants/oauth";

import { ScreenContainer } from "@/components/screen-container";
import { SITE_LINKS } from "@/lib/site-link-inventory";
import { SITE_POSTERS } from "@/lib/site-poster-inventory";

const SITE = "https://cineclub2-ashy.vercel.app";
// O site deve publicar este arquivo JSON. O APK consulta a fonte em cada abertura e mantém cache local.
const CATALOG_URL = `${SITE}/catalog.json`;
const CATALOG_CACHE_KEY = "cineclub-tv-catalog-cache";
const poster = (file: string) => `${SITE}/posters/${file}`;
const localPoster = (asset: number) => asset;
const imageSource = (value: string | number) => typeof value === "string" ? { uri: value } : value;

type Title = {
  id: string;
  name: string;
  type: "Série" | "Filme" | "Anime";
  year: string;
  genre: string;
  meta: string;
  rating?: string;
  synopsis: string;
  image: string | number;
  sources?: { label: string; url: string }[];
};

const FALLBACK_TITLES: Title[] = [
  { id: "the-boys", name: "The Boys", type: "Série", year: "2019–2026", genre: "Ação", meta: "5 temporadas", rating: "8,5", synopsis: "Em um mundo onde super-heróis são celebridades, um grupo de pessoas comuns decide investigar o que existe por trás do brilho.", image: poster("the-boys_2cd5b6af.jpg") },
  { id: "supernatural", name: "Supernatural", type: "Série", year: "2005", genre: "Drama", meta: "15 temporadas", rating: "8,4", synopsis: "Dois irmãos percorrem estradas sombrias enfrentando criaturas, lendas e os fantasmas do próprio passado.", image: poster("supernatural_c1d4f0e7.jpg") },
  { id: "vincenzo", name: "Vincenzo", type: "Série", year: "2021", genre: "Drama", meta: "1 temporada", rating: "8,4", synopsis: "Um advogado ítalo-coreano usa métodos pouco convencionais para combater uma grande corporação.", image: poster("vincenzo_a3905ba1.jpg") },
  { id: "handmaid", name: "O Conto da Aia", type: "Série", year: "2017", genre: "Drama", meta: "5 temporadas", rating: "8,3", synopsis: "Em uma sociedade totalitária, mulheres lutam para recuperar sua autonomia e sua voz.", image: poster("handmaids-tale_e97259f8.jpg") },
  { id: "penny", name: "Penny Dreadful", type: "Série", year: "2014", genre: "Terror", meta: "3 temporadas", rating: "8,2", synopsis: "Monstros clássicos e personagens góticos se encontram em uma Londres envolta por mistério.", image: poster("penny-dreadful_9b35e5ec.jpg") },
  { id: "constantine", name: "Constantine", type: "Série", year: "2014", genre: "Sobrenatural", meta: "1 temporada", synopsis: "Um investigador do oculto encara demônios, anjos e os segredos que preferia esquecer.", image: poster("constantine_505e654a.jpg") },
  { id: "sandman", name: "Sandman", type: "Série", year: "2022", genre: "Fantasia", meta: "2 temporadas", synopsis: "O senhor dos sonhos volta ao seu reino e precisa reconstruir um mundo que mudou sem ele.", image: poster("sandman_929c7277.jpg") },
  { id: "witcher", name: "The Witcher: Nightmare of the Wolf", type: "Filme", year: "2021", genre: "Animação", meta: "Filme anime · 1h23", synopsis: "Antes de Geralt, outro bruxo percorreu o continente enfrentando monstros e escolhas difíceis.", image: poster("witcher-nightmare_268ee5fe.jpg") },
  { id: "ratched", name: "Ratched", type: "Série", year: "2020", genre: "Terror", meta: "1 temporada", synopsis: "Uma enfermeira ambiciosa transforma um hospital em seu próprio palco de poder e manipulação.", image: localPoster(require("../../assets/images/ratched-poster.jpg")) },
  { id: "chicago", name: "Chicago Fire: Heróis Contra o Fogo", type: "Série", year: "2012", genre: "Drama", meta: "6 temporadas", synopsis: "Bombeiros enfrentam incêndios, resgates e conflitos pessoais em uma rotina de alto risco.", image: poster("chicago-fire_91d76e9f.jpg") },
  { id: "scary", name: "Todo Mundo em Pânico", type: "Filme", year: "2026", genre: "Comédia", meta: "1h36 · filme", synopsis: "Uma comédia irreverente que brinca com as regras e os sustos do cinema de terror.", image: poster("scary-movie_2f25860f.jpg") },
  { id: "tunnel", name: "O Túnel do Tempo", type: "Série", year: "1966", genre: "Ficção científica", meta: "1 temporada · 10 episódios", synopsis: "Dois cientistas ficam presos em uma viagem pelo tempo e tentam encontrar o caminho de volta.", image: poster("time-tunnel_0a3b2280.jpg") },
  { id: "pretty-little-liars", name: "Pretty Little Liars (Maldosas)", type: "Série", year: "2010", genre: "Drama", meta: "7 temporadas · dublado · +14", rating: "7,3", synopsis: "Depois do desaparecimento de Alison, quatro adolescentes tentam desvendar mensagens anônimas que ameaçam revelar seus segredos.", image: localPoster(require("../../assets/images/pretty-little-liars-poster.jpg")), sources: [
    { label: "Temporada 1", url: "https://drive.google.com/drive/folders/1HRTnp6xxK8gGhe0jmzNdUy9Bn4sHaXUs" },
    { label: "Temporada 2", url: "https://drive.google.com/drive/folders/1mUTfA6asQztgplwT9Sls0AOwpesi9yfY" },
    { label: "Temporada 3", url: "https://drive.google.com/drive/folders/1IdE-Wn6JkUDinWq5kEcKNVHTiqp3xMow" },
    { label: "Temporada 4", url: "https://drive.google.com/drive/folders/1-VAdIjB5vRubDgiJEUBiUsyqks3vr5By" },
    { label: "Temporada 5", url: "https://drive.google.com/drive/folders/11VNoIEinnBYAf9IEvhEyxzWElpPrsFaf" },
    { label: "Temporada 6", url: "https://drive.google.com/drive/folders/1VsKazdd8NGIgSSsFqmNXQSoJoIPl3wBr" },
    { label: "Temporada 7", url: "https://drive.google.com/drive/folders/1W4edPUTYSbcG2SHbrGHfHqK2VTpxQCR0" },
  ] },
  { id: "se-as-flores-falassem", name: "Se as Flores Falassem", type: "Série", year: "2025", genre: "Drama", meta: "6 episódios · dublado · Tailandês", synopsis: "Quando seu cliente morre na véspera do casamento, uma florista decide encontrar o assassino e revela segredos da alta sociedade.", image: localPoster(require("../../assets/images/se-as-flores-falassem-poster.jpg")), sources: [{ label: "Assistir episódios · 06/06", url: "https://drive.google.com/drive/folders/1tKxK0ImYdZ6ZZgKF_lMT2hanV6Fkw0Ad" }] },
  { id: "a-ultima-casa-2026", name: "A Última Casa", type: "Filme", year: "2026", genre: "Suspense", meta: "Filme · HDCAM", synopsis: "Uma família fica isolada dentro de casa e precisa descobrir como sobreviver à ameaça que a mantém presa.", image: localPoster(require("../../assets/images/a-ultima-casa-poster.jpg")), sources: [{ label: "Assistir filme", url: "https://drive.google.com/file/d/15Dt1jRvvXBVmDGRmCvb9aW0cRXqCwKqK/view?usp=drivesdk" }] },
];

const MANUAL_ADDITION_IDS = new Set(["pretty-little-liars", "se-as-flores-falassem", "a-ultima-casa-2026"]);
const siteLinksById = new Map(SITE_LINKS.map((item) => [item.id, item]));
const sitePostersById = new Map(SITE_POSTERS.map((item) => [item.id, item.poster]));
const normalizedTitle = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const normalizeCatalogType = (item: Title): Title => {
  const title = normalizedTitle(item.name);
  if (title.includes("the witcher nightmare")) return { ...item, type: "Filme", genre: "Animação", meta: "Filme anime · 1h23" };
  if (title === "supernatural anime") return { ...item, type: "Série", genre: "Anime" };
  return item;
};
const enrichWithSiteLinks = (items: Title[]) => items.map((item) => {
  const siteItem = siteLinksById.get(item.id) ?? SITE_LINKS.find((candidate) => normalizedTitle(candidate.title) === normalizedTitle(item.name));
  const enriched = siteItem && siteItem.links.length > 0 ? { ...item, sources: siteItem.links.map((link) => ({ label: link.label, url: link.href })) } : item;
  return normalizeCatalogType(enriched);
});
const siteOnlyTitles: Title[] = SITE_LINKS.filter((siteItem) => !FALLBACK_TITLES.some((item) => item.id === siteItem.id || normalizedTitle(item.name) === normalizedTitle(siteItem.title))).map((siteItem) => ({
  id: siteItem.id,
  name: siteItem.title,
  type: siteItem.seasons ? "Série" : "Filme",
  year: siteItem.year ?? "",
  genre: "Catálogo",
  meta: siteItem.seasons ?? "Disponível no site",
  synopsis: "Título disponível no catálogo Cineclub.",
  image: poster(sitePostersById.get(siteItem.id) ?? "cineclub-dossier_3d471072.jpg"),
  sources: siteItem.links.map((link) => ({ label: link.label, url: link.href })),
}));
const INITIAL_CATALOG = enrichWithSiteLinks([...FALLBACK_TITLES, ...siteOnlyTitles]);
const genres = ["Tudo", "Sobrenatural", "Terror", "Fantasia", "Drama", "Comédia", "Anime"];

const navItems = ["Início", "Séries", "Terror", "Filmes", "Nuvem", "Acervo", "Minha lista", "Sobre"];

function PairingQr({ value }: { value: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => { QRCode.toString(value, { type: "svg", margin: 1, color: { dark: "#07191F", light: "#F5EBDD" } }).then(setSvg).catch(() => setSvg("")); }, [value]);
  return svg ? <SvgXml xml={svg} width={220} height={220} /> : <View style={styles.qrPlaceholder}><Text style={styles.qrPlaceholderText}>Gerando QR Code…</Text></View>;
}

function FocusButton({ label, onPress, primary = false, preferred = false }: { label: string; onPress: () => void; primary?: boolean; preferred?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable focusable hasTVPreferredFocus={preferred} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPress={onPress} style={({ pressed }) => [styles.action, primary && styles.actionPrimary, focused && styles.focused, pressed && styles.pressed]}>
      <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const Card = memo(function Card({ item, saved, onPress, onSave, onWatch }: { item: Title; saved: boolean; onPress: () => void; onSave: () => void; onWatch: () => void }) {
  const [focused, setFocused] = useState(false);
  const [watchFocused, setWatchFocused] = useState(false);
  return (
    <View style={styles.cardWrap}>
      <Pressable focusable hasTVPreferredFocus={item.id === "the-boys"} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPress={onPress} style={({ pressed }) => [styles.card, focused && styles.cardFocused, pressed && styles.pressed]}>
        <Image source={imageSource(item.image)} style={styles.cardImage} />
        <View style={styles.cardGradient} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardType}>{item.type.toUpperCase()} · {item.year}</Text>
          <Text numberOfLines={2} style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardGenre}>{item.genre}</Text>
          <Pressable focusable onFocus={() => setWatchFocused(true)} onBlur={() => setWatchFocused(false)} onPress={onWatch} style={({ pressed }) => [styles.cardWatch, watchFocused && styles.focused, pressed && styles.pressed]}><Text style={styles.cardWatchText}>▶ Assistir agora</Text></Pressable>
        </View>
      </Pressable>
      <Pressable focusable onPress={onSave} style={(state) => [styles.saveButton, (state as any).focused && styles.saveFocused]}>
        <Text style={styles.saveText}>{saved ? "✓" : "+"}</Text>
      </Pressable>
    </View>
    );
});
export default function HomeScreen() {
  const [activeNav, setActiveNav] = useState("Início");
  const [activeGenre, setActiveGenre] = useState("Tudo");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Title | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<Title[]>(INITIAL_CATALOG);
  const [syncState, setSyncState] = useState("Catálogo local");
  const [focusedElement, setFocusedElement] = useState("nav-Início");

  const saveM3uUrl = async (value: string) => {
    setM3uUrl(value);
    if (value.trim()) {
      if (Platform.OS === "web") localStorage.setItem("cineclub-m3u-url", value.trim());
      else await SecureStore.setItemAsync("cineclub-m3u-url", value.trim());
    }
  };

  const loadM3u = async (source: string) => {
    const url = source.trim();
    if (!url) return;
    setM3uStatus("Carregando playlist…");
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("HTTP");
      const text = await response.text();
      const parsed = parseM3U(text);
      setM3uGroups(groupM3U(parsed));
      setM3uStatus(`${parsed.length} itens em ${groupM3U(parsed).length} grupos`);
      await saveM3uUrl(url);
    } catch {
      setM3uStatus("Não foi possível carregar a playlist. Verifique a URL, CORS e autorização da fonte.");
    }
  };
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [browserLoading, setBrowserLoading] = useState(false);
  const [browserError, setBrowserError] = useState(false);
  const [m3uUrl, setM3uUrl] = useState("");
  const [m3uGroups, setM3uGroups] = useState<{ group: string; items: M3UItem[] }[]>([]);
  const [m3uStatus, setM3uStatus] = useState("Nenhuma nuvem configurada");
  const [m3uPlayerItem, setM3uPlayerItem] = useState<M3UItem | null>(null);
  const [pairingToken, setPairingToken] = useState("");
  const createPairing = trpc.cloud.createPairing.useMutation();
  const pairingStatus = trpc.cloud.status.useQuery({ token: pairingToken || "000000" }, { enabled: Boolean(pairingToken), refetchInterval: 2500 });
  const pairingUrl = pairingToken ? `${getApiBaseUrl()}/connect?token=${encodeURIComponent(pairingToken)}` : "";

  const syncCatalog = async () => {
    try {
      const response = await fetch(`${CATALOG_URL}?t=${Date.now()}`);
      if (!response.ok) throw new Error("feed unavailable");
      const remoteCatalog = (await response.json()) as Title[];
      if (Array.isArray(remoteCatalog) && remoteCatalog.length > 0) {
        const additions = INITIAL_CATALOG.filter((item) => MANUAL_ADDITION_IDS.has(item.id));
        const remoteIds = new Set(remoteCatalog.map((item) => item.id));
        const mergedCatalog = enrichWithSiteLinks([...remoteCatalog, ...additions.filter((item) => !remoteIds.has(item.id))]);
        setCatalog(mergedCatalog);
        await AsyncStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(mergedCatalog));
        setSyncState(`Site sincronizado agora · ${mergedCatalog.length} títulos`);
        return;
      }
      throw new Error("invalid feed");
    } catch {
      setSyncState("Modo offline · tentando novamente na próxima abertura");
    }
  };

  useEffect(() => {
    const onBack = () => {
      if (browserUrl) { setBrowserUrl(null); return true; }
      if (selected) { setSelected(null); return true; }
      return false;
    };
    const subscription = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => subscription.remove();
  }, [browserUrl, selected]);

  useEffect(() => {
    AsyncStorage.getItem("cineclub-tv-list").then((value) => {
      if (value) {
        try { setSavedIds(JSON.parse(value)); } catch { /* mantém lista vazia */ }
      }
    });
    (async () => {
      const storedM3u = Platform.OS === "web" ? localStorage.getItem("cineclub-m3u-url") : await SecureStore.getItemAsync("cineclub-m3u-url");
      if (storedM3u) { setM3uUrl(storedM3u); loadM3u(storedM3u); }
    })();
    AsyncStorage.getItem(CATALOG_CACHE_KEY).then((value) => {
      if (value) {
        try { setCatalog(JSON.parse(value)); setSyncState("Catálogo em cache · sincronizando"); } catch { /* mantém fallback */ }
      }
      syncCatalog();
    });
    // As funções de inicialização são estáveis para a abertura única da tela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPairing = async () => {
    const result = await createPairing.mutateAsync();
    setPairingToken(result.token);
    setM3uStatus("Aguardando configuração pelo celular…");
  };

  useEffect(() => {
    if (pairingStatus.data?.state === "ready" && pairingStatus.data.m3uUrl) {
      setM3uUrl(pairingStatus.data.m3uUrl);
      loadM3u(pairingStatus.data.m3uUrl);
      setM3uStatus("Lista recebida do celular e carregando…");
      setPairingToken("");
    }
  // loadM3u é a função de atualização da playlist e permanece estável durante esta tela.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairingStatus.data]);

  const openSource = (url: string) => {
    setBrowserError(false);
    setBrowserLoading(true);
    setBrowserUrl(url);
  };

  const handleWatch = (item: Title) => {
    const sources = item.sources ?? [];
    if (sources.length === 1) {
      openSource(sources[0].url);
    } else {
      setSelected(item);
    }
  };

  const toggleSave = (id: string) => {
    const next = savedIds.includes(id) ? savedIds.filter((item) => item !== id) : [...savedIds, id];
    setSavedIds(next);
    AsyncStorage.setItem("cineclub-tv-list", JSON.stringify(next));
  };

  const visible = useMemo(() => catalog.filter((item) => {
    const navMatches = activeNav === "Início" || activeNav === "Acervo" || (activeNav === "Minha lista" ? savedIds.includes(item.id) : activeNav === "Séries" ? ["Série", "Anime"].includes(item.type) : activeNav === "Filmes" ? item.type === "Filme" : activeNav === "Terror" ? ["Terror", "Sobrenatural"].includes(item.genre) : true);
    const genreMatches = activeGenre === "Tudo" || item.genre === activeGenre || (activeGenre === "Anime" && item.type === "Anime");
    const searchMatches = item.name.toLowerCase().includes(search.trim().toLowerCase());
    return navMatches && genreMatches && searchMatches;
  }), [activeGenre, activeNav, catalog, savedIds, search]);

  const grouped = activeNav === "Início" && !search
    ? [
        { title: "Adicionados recentemente", subtitle: "Novidades e títulos recém-atualizados no catálogo.", items: visible.filter((item) => MANUAL_ADDITION_IDS.has(item.id)) },
        { title: "Séries", subtitle: "Temporadas, episódios e histórias para maratonar.", items: visible.filter((item) => item.type === "Série" || item.type === "Anime") },
        { title: "Filmes", subtitle: "Longas para começar e terminar na mesma sessão.", items: visible.filter((item) => item.type === "Filme") },
      ]
    : [{ title: activeNav === "Séries" ? "Todas as séries" : activeNav === "Filmes" ? "Todos os filmes" : "Catálogo", subtitle: "Escolha um título e pressione Assistir agora.", items: visible }].filter((group) => group.items.length > 0);

  return (
    <ScreenContainer edges={["left", "right"]} containerClassName="bg-background">
      <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} importantForAccessibility={selected || browserUrl || m3uPlayerItem ? "no-hide-descendants" : "auto"} accessible={!selected && !browserUrl && !m3uPlayerItem}>
        <View style={styles.header}>
          <Pressable focusable onFocus={() => setFocusedElement("brand")} onPress={() => setActiveNav("Início")} style={({ pressed }) => [styles.brandButton, focusedElement === "brand" && styles.focused, pressed && styles.pressed]}>
            <Text style={styles.brand}>cine<Text style={styles.brandAccent}>club</Text></Text>
          </Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navScroll} contentContainerStyle={styles.nav}>
            {navItems.map((item) => <Pressable key={item} focusable onFocus={() => setFocusedElement(`nav-${item}`)} onPress={() => setActiveNav(item)} style={({ pressed }) => [styles.navItem, activeNav === item && styles.navActive, focusedElement === `nav-${item}` && styles.navFocused, pressed && styles.pressed]}><Text style={[styles.navText, activeNav === item && styles.navTextActive]}>{item}</Text></Pressable>)}
          </ScrollView>
          <TextInput value={search} onChangeText={setSearch} placeholder="Buscar títulos" placeholderTextColor="#7E9692" style={styles.search} returnKeyType="search" />
          <Pressable focusable onFocus={() => setFocusedElement("sync")} onPress={syncCatalog} style={({ pressed }) => [styles.syncButton, focusedElement === "sync" && styles.focused, pressed && styles.pressed]}><Text style={styles.syncText}>↻ Atualizar</Text></Pressable>
        </View>

        {activeNav === "Início" && !search && (
          <View style={styles.hero}>
            <Image source={imageSource(catalog[0].image)} style={styles.heroImage} />
            <View style={styles.heroShade} />
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>TOP 1 / RECOMENDADO PELO IMDb</Text>
              <Text style={styles.heroTitle}>The Boys</Text>
              <Text style={styles.heroSubtitle}>Uma das séries mais bem avaliadas do catálogo.</Text>
              <Text style={styles.heroDescription}>{catalog[0].synopsis}</Text>
              <Text style={styles.heroMeta}>2019–2026  ·  SÉRIE  ·  5 TEMPORADAS  ·  ★ 8,5/10 IMDb</Text>
              <View style={styles.actions}><FocusButton label="▶  Assistir agora" primary onPress={() => handleWatch(catalog[0])} /><FocusButton label={savedIds.includes("the-boys") ? "✓  Minha lista" : "+  Minha lista"} onPress={() => toggleSave("the-boys")} /></View>
            </View>
            <Text style={styles.heroRank}>TOP 1 / 05</Text>
          </View>
        )}

        {activeNav === "Nuvem" ? <View style={styles.cloudPanel}>
          <Text style={styles.sectionKicker}>BETA · ATÉ 16/09/2026</Text>
          <Text style={styles.sectionTitle}>Sua nuvem de conteúdo</Text>
          <Text style={styles.cloudText}>Cole uma URL M3U autorizada para organizar canais, filmes e séries em grupos. A playlist fica salva neste dispositivo.</Text>
          <TextInput value={m3uUrl} onChangeText={setM3uUrl} placeholder="https://exemplo.com/playlist.m3u" placeholderTextColor="#7E9692" autoCapitalize="none" autoCorrect={false} style={styles.cloudInput} />
          <View style={styles.cloudActions}>
            <FocusButton label="☁  Carregar playlist" primary onPress={() => loadM3u(m3uUrl)} />
            <FocusButton label="📱  Configurar pelo celular" onPress={startPairing} />
            <FocusButton label="▶  Testar demonstração" onPress={() => { const parsed = parseM3U(DEMO_M3U); setM3uGroups(groupM3U(parsed)); setM3uStatus(`${parsed.length} item de demonstração`); }} />
          </View>
          {pairingToken && <View style={styles.pairingCard}><View><Text style={styles.pairingTitle}>Escaneie com o celular</Text><Text style={styles.cloudText}>O QR Code contém somente um token temporário. Não compartilhe este código.</Text><Text style={styles.pairingToken}>{pairingToken}</Text><Text style={styles.cloudStatus}>{pairingStatus.data?.state === "waiting" ? "Aguardando envio…" : "Sessão ativa por alguns minutos"}</Text></View><PairingQr value={pairingUrl} /></View>}
          <Text style={styles.cloudStatus}>{m3uStatus}</Text>
          {m3uGroups.map((group) => <View key={group.group} style={styles.cloudGroup}><Text style={styles.rowTitle}>{group.group}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cloudItems}>{group.items.map((item) => <Pressable key={item.id} focusable onFocus={() => setFocusedElement(`m3u-${item.id}`)} onPress={() => setM3uPlayerItem(item)} style={({ pressed }) => [styles.cloudItem, focusedElement === `m3u-${item.id}` && styles.navFocused, pressed && styles.pressed]}><Text numberOfLines={2} style={styles.cloudItemText}>{item.name}</Text><Text style={styles.cloudItemKind}>{item.kind.toUpperCase()}</Text></Pressable>)}</ScrollView></View>)}
        </View> : <>
        <View style={styles.catalogHead}><View><Text style={styles.syncStatus}>{syncState}</Text><Text style={styles.sectionKicker}>{search ? "RESULTADOS" : activeNav.toUpperCase()}</Text><Text style={styles.sectionTitle}>{search ? `Títulos para “${search}”` : activeNav === "Minha lista" ? "Salve para assistir depois." : "Encontre algo para assistir."}</Text></View><Text style={styles.count}>{visible.length} títulos</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{genres.map((genre) => <Pressable key={genre} focusable onFocus={() => setFocusedElement(`genre-${genre}`)} onPress={() => setActiveGenre(genre)} style={({ pressed }) => [styles.filter, activeGenre === genre && styles.filterActive, focusedElement === `genre-${genre}` && styles.navFocused, pressed && styles.pressed]}><Text style={[styles.filterText, activeGenre === genre && styles.filterTextActive]}>{genre}</Text></Pressable>)}</ScrollView>

        {grouped.map((group) => <View key={group.title} style={styles.rowSection}><Text style={styles.rowTitle}>{group.title}</Text><Text style={styles.rowSubtitle}>{group.subtitle}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>{group.items.map((item) => <Card key={item.id} item={item} saved={savedIds.includes(item.id)} onPress={() => setSelected(item)} onSave={() => toggleSave(item.id)} onWatch={() => handleWatch(item)} />)}</ScrollView></View>)}
        {visible.length === 0 && <View style={styles.empty}><Text style={styles.emptyTitle}>{activeNav === "Minha lista" ? "Sua lista está vazia" : "Nada encontrado"}</Text><Text style={styles.emptyText}>{activeNav === "Minha lista" ? "Use o botão + nos cards para guardar títulos." : "Tente outro título ou gênero."}</Text></View>}
        {activeNav === "Sobre" && <View style={styles.about}><Text style={styles.sectionKicker}>CINECLUB TV</Text><Text style={styles.sectionTitle}>Histórias que deixam marcas.</Text><Text style={styles.aboutText}>Uma versão para sala de estar do catálogo Cineclub, pensada para ser explorada com calma, controle remoto e tela grande.</Text></View>}
        </>}
      </ScrollView>

      {m3uPlayerItem && <View style={styles.playerBackdrop}><M3UPlayer item={m3uPlayerItem} onClose={() => setM3uPlayerItem(null)} /></View>}
      <Modal visible={Boolean(selected)} transparent animationType="fade" onRequestClose={() => setSelected(null)} statusBarTranslucent>
        {selected && <View style={styles.modalBackdrop}><View style={styles.detail}><Image source={imageSource(selected.image)} style={styles.detailImage} /><View style={styles.detailCopy}><Text style={styles.eyebrow}>{selected.type.toUpperCase()}  ·  {selected.year}  ·  {selected.genre.toUpperCase()}</Text><Text style={styles.detailTitle}>{selected.name}</Text><Text style={styles.detailMeta}>{selected.meta}{selected.rating ? `  ·  ★ ${selected.rating}/10 IMDb` : ""}</Text><Text style={styles.detailSynopsis}>{selected.synopsis}</Text>{selected.sources && selected.sources.length > 0 && <View style={styles.sources}><Text style={styles.sourcesTitle}>FONTES DE {selected.name.toUpperCase()}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sourceRow}>{selected.sources.map((source) => <Pressable key={source.url} focusable onFocus={() => setFocusedElement(`source-${source.url}`)} onPress={() => openSource(source.url)} style={({ pressed }) => [styles.sourceButton, focusedElement === `source-${source.url}` && styles.navFocused, pressed && styles.pressed]}><Text style={styles.sourceText}>▸ {source.label}</Text></Pressable>)}</ScrollView></View>}<View style={styles.actions}><FocusButton label="▶  Assistir agora" primary preferred onPress={() => selected.sources && selected.sources.length > 0 ? handleWatch(selected) : undefined} /><FocusButton label={savedIds.includes(selected.id) ? "✓  Na minha lista" : "+  Minha lista"} onPress={() => toggleSave(selected.id)} /><FocusButton label="Fechar" onPress={() => setSelected(null)} /></View></View></View></View>}
      </Modal>
      {browserUrl && <View style={styles.browserBackdrop}><View style={styles.browserHeader}><Text style={styles.browserTitle}>Assistir: {selected?.name ?? "título"}</Text><Pressable focusable onFocus={() => setFocusedElement("browser-close")} onPress={() => { setBrowserUrl(null); setBrowserLoading(false); setBrowserError(false); }} style={({ pressed }) => [styles.browserClose, focusedElement === "browser-close" && styles.navFocused, pressed && styles.pressed]}><Text style={styles.browserCloseText}>Fechar</Text></Pressable></View>{Platform.OS === "web" ? <View style={styles.webSourcePanel}><Text style={styles.browserMessageTitle}>Fonte de reprodução</Text><Text style={styles.browserMessageText}>Este é o link específico de {selected?.name ?? "este título"}:</Text><Text selectable style={styles.sourceUrl}>{browserUrl}</Text><Pressable focusable onFocus={() => setFocusedElement("open-source")} onPress={() => Linking.openURL(browserUrl)} style={({ pressed }) => [styles.openSourceButton, focusedElement === "open-source" && styles.navFocused, pressed && styles.pressed]}><Text style={styles.openSourceText}>▶  Abrir link para assistir</Text></Pressable><Text style={styles.browserMessageText}>No APK Android TV, esta fonte será aberta no navegador interno.</Text></View> : <><WebView source={{ uri: browserUrl }} style={styles.browser} startInLoadingState javaScriptEnabled domStorageEnabled allowsBackForwardNavigationGestures onLoadStart={() => { setBrowserLoading(true); setBrowserError(false); }} onLoadEnd={() => setBrowserLoading(false)} onError={() => { setBrowserLoading(false); setBrowserError(true); }} />{browserLoading && <View style={styles.browserMessage}><Text style={styles.browserMessageTitle}>Carregando a fonte de {selected?.name ?? "título"}…</Text><Text style={styles.browserMessageText}>Aguarde o carregamento do Drive ou do serviço correspondente.</Text></View>}{browserError && <View style={styles.browserMessage}><Text style={styles.browserMessageTitle}>Não foi possível carregar esta fonte</Text><Text style={styles.browserMessageText}>Verifique a conexão ou se o link exige login. Use Fechar para voltar ao catálogo.</Text></View>}</>}</View>}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07191F" }, content: { paddingBottom: 80 }, header: { height: 76, paddingHorizontal: 28, flexDirection: "row", alignItems: "center", gap: 14, borderBottomWidth: 1, borderBottomColor: "#17363D" }, brandButton: { padding: 7, borderRadius: 8 }, brand: { color: "#F5EBDD", fontSize: 23, fontWeight: "800", letterSpacing: -1 }, brandAccent: { color: "#D86C5C" }, navScroll: { flex: 1, minWidth: 0 }, nav: { alignItems: "center", gap: 10, flexGrow: 1 }, navItem: { paddingVertical: 12, paddingHorizontal: 5, borderBottomWidth: 2, borderBottomColor: "transparent" }, navActive: { borderBottomColor: "#D86C5C" }, navFocused: { backgroundColor: "#244B53", borderRadius: 8, borderBottomColor: "#F5EBDD" }, navText: { color: "#A9B9B6", fontSize: 13, fontWeight: "700" }, navTextActive: { color: "#F5EBDD" }, search: { width: 150, height: 38, borderWidth: 1, borderColor: "#31535A", borderRadius: 5, color: "#F5EBDD", paddingHorizontal: 12, fontSize: 13 }, syncButton: { paddingHorizontal: 10, paddingVertical: 9, borderWidth: 1, borderColor: "#31535A", borderRadius: 5 }, syncText: { color: "#F5EBDD", fontSize: 12, fontWeight: "700" }, syncStatus: { color: "#7E9692", fontSize: 10, marginBottom: 8 }, hero: { height: 485, position: "relative", overflow: "hidden" }, heroImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%", resizeMode: "cover" }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(4,20,24,0.58)" }, heroCopy: { paddingLeft: 52, paddingTop: 95, width: "58%" }, eyebrow: { color: "#D8A59A", fontSize: 11, letterSpacing: 2, fontWeight: "800", marginBottom: 15 }, heroTitle: { color: "#F5EBDD", fontSize: 66, fontWeight: "900", letterSpacing: -2 }, heroSubtitle: { color: "#F5EBDD", fontSize: 18, fontWeight: "700", fontStyle: "italic", marginTop: 5 }, heroDescription: { color: "#C3D0CC", fontSize: 14, lineHeight: 22, marginTop: 18, maxWidth: 520 }, heroMeta: { color: "#9EB3AE", fontSize: 11, marginTop: 21, letterSpacing: 0.7 }, actions: { flexDirection: "row", gap: 12, marginTop: 22 }, action: { borderWidth: 1, borderColor: "#6F8D88", borderRadius: 4, paddingHorizontal: 17, paddingVertical: 11, minWidth: 128, alignItems: "center", backgroundColor: "rgba(7,25,31,0.7)" }, actionPrimary: { borderColor: "#D86C5C", backgroundColor: "#D86C5C" }, actionText: { color: "#F5EBDD", fontSize: 13, fontWeight: "800" }, actionTextPrimary: { color: "#07191F" }, focused: { borderColor: "#F5EBDD", borderWidth: 2, backgroundColor: "#244B53" }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] }, heroRank: { position: "absolute", right: 52, bottom: 30, color: "#F5EBDD", fontSize: 18, fontWeight: "800" }, catalogHead: { paddingHorizontal: 52, paddingTop: 38, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }, sectionKicker: { color: "#D8A59A", fontSize: 10, letterSpacing: 2, fontWeight: "800", marginBottom: 8 }, sectionTitle: { color: "#F5EBDD", fontSize: 28, fontWeight: "800" }, count: { color: "#7E9692", fontSize: 12, paddingBottom: 5 }, filters: { paddingHorizontal: 52, paddingTop: 22, paddingBottom: 18, gap: 8 }, filter: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#31535A" }, filterActive: { backgroundColor: "#D86C5C", borderColor: "#D86C5C" }, filterText: { color: "#A9B9B6", fontSize: 12, fontWeight: "700" }, filterTextActive: { color: "#07191F" }, rowSection: { marginTop: 18 }, rowTitle: { color: "#F5EBDD", fontSize: 22, fontWeight: "800", paddingHorizontal: 52 }, rowSubtitle: { color: "#86A09A", fontSize: 12, paddingHorizontal: 52, marginTop: 5 }, cardsRow: { paddingHorizontal: 52, gap: 15, paddingTop: 16, paddingBottom: 10 }, cardWrap: { width: 180, position: "relative" }, card: { height: 254, borderRadius: 5, overflow: "hidden", backgroundColor: "#102B33", borderWidth: 1, borderColor: "#23464D" }, cardFocused: { borderColor: "#F5EBDD", borderWidth: 3, transform: [{ scale: 1.04 }] }, cardImage: { width: "100%", height: "100%", resizeMode: "cover" }, cardGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,18,22,0.25)" }, cardInfo: { position: "absolute", left: 12, right: 12, bottom: 12 }, cardType: { color: "#D8A59A", fontSize: 9, fontWeight: "800", letterSpacing: 0.7 }, cardName: { color: "#F5EBDD", fontSize: 17, fontWeight: "800", marginTop: 5 }, cardGenre: { color: "#B6C9C4", fontSize: 11, marginTop: 5 }, cardWatch: { marginTop: 7, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 3, backgroundColor: "#D86C5C" }, cardWatchText: { color: "#07191F", fontSize: 10, fontWeight: "900" }, saveButton: { position: "absolute", right: 9, top: 9, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(7,25,31,0.8)", alignItems: "center", justifyContent: "center" }, saveFocused: { borderWidth: 2, borderColor: "#F5EBDD" }, saveText: { color: "#F5EBDD", fontSize: 22, lineHeight: 24 }, empty: { padding: 60, alignItems: "center" }, emptyTitle: { color: "#F5EBDD", fontSize: 23, fontWeight: "800" }, emptyText: { color: "#A9B9B6", fontSize: 14, marginTop: 8 }, about: { margin: 52, maxWidth: 700 }, aboutText: { color: "#B6C9C4", fontSize: 16, lineHeight: 27, marginTop: 18 }, modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(3,12,15,0.88)", justifyContent: "center", alignItems: "center", padding: 70 }, detail: { width: "88%", minHeight: 360, backgroundColor: "#102B33", borderWidth: 1, borderColor: "#4C6B6D", borderRadius: 8, overflow: "hidden", flexDirection: "row" }, detailImage: { width: 250, height: 360, resizeMode: "cover" }, detailCopy: { flex: 1, padding: 36 }, detailTitle: { color: "#F5EBDD", fontSize: 40, fontWeight: "900", marginBottom: 10 }, detailMeta: { color: "#D8A59A", fontSize: 13, fontWeight: "700" }, detailSynopsis: { color: "#B6C9C4", fontSize: 16, lineHeight: 25, marginTop: 22, maxWidth: 610 }, sources: { marginTop: 18 }, sourcesTitle: { color: "#D8A59A", fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 8 }, sourceRow: { flexDirection: "row", gap: 8 }, sourceButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 4, borderWidth: 1, borderColor: "#D86C5C", backgroundColor: "#193C43" }, sourceText: { color: "#F5EBDD", fontSize: 12, fontWeight: "800" }, browserBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "#07191F", zIndex: 20 }, browserHeader: { height: 64, paddingHorizontal: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#102B33", borderBottomWidth: 1, borderBottomColor: "#31535A" }, browserTitle: { color: "#F5EBDD", fontSize: 18, fontWeight: "800" }, browserClose: { borderWidth: 1, borderColor: "#D86C5C", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 4 }, browserCloseText: { color: "#F5EBDD", fontWeight: "800" }, browser: { flex: 1 }, browserMessage: { position: "absolute", left: 24, right: 24, top: 88, padding: 18, borderRadius: 8, backgroundColor: "rgba(16,43,51,0.96)", borderWidth: 1, borderColor: "#D86C5C", alignItems: "center" }, browserMessageTitle: { color: "#F5EBDD", fontSize: 16, fontWeight: "800", textAlign: "center" }, browserMessageText: { color: "#B6C9C4", fontSize: 13, marginTop: 8, textAlign: "center" }, webSourcePanel: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, backgroundColor: "#07191F" }, sourceUrl: { color: "#D8A59A", fontSize: 13, marginTop: 16, maxWidth: 700, textAlign: "center" },   openSourceButton: { marginTop: 24, paddingHorizontal: 20, paddingVertical: 13, borderRadius: 5, backgroundColor: "#D86C5C" }, openSourceText: { color: "#07191F", fontSize: 14, fontWeight: "900" }, cloudPanel: { marginHorizontal: 52, marginTop: 44, marginBottom: 80, padding: 30, borderRadius: 12, backgroundColor: "#102B33", borderWidth: 1, borderColor: "#31535A" }, cloudText: { color: "#B6C9C4", fontSize: 15, lineHeight: 23, maxWidth: 780, marginBottom: 22 }, cloudInput: { height: 48, borderWidth: 1, borderColor: "#4C6B6D", borderRadius: 6, color: "#F5EBDD", paddingHorizontal: 14, fontSize: 14, backgroundColor: "#07191F" }, cloudActions: { flexDirection: "row", gap: 12, marginTop: 18 }, cloudStatus: { color: "#D8A59A", marginTop: 18, fontSize: 13 }, cloudGroup: { marginTop: 28 }, cloudItems: { flexDirection: "row", gap: 12, paddingTop: 12 }, cloudItem: { width: 190, minHeight: 86, padding: 14, borderRadius: 7, borderWidth: 1, borderColor: "#31535A", backgroundColor: "#193C43" }, cloudItemText: { color: "#F5EBDD", fontSize: 14, fontWeight: "800" }, cloudItemKind: { color: "#D8A59A", fontSize: 10, fontWeight: "800", marginTop: 10 },   playerBackdrop: { ...StyleSheet.absoluteFillObject, zIndex: 30, backgroundColor: "#07191F" }, qrPlaceholder: { width: 220, height: 220, alignItems: "center", justifyContent: "center", backgroundColor: "#F5EBDD", borderRadius: 8 }, qrPlaceholderText: { color: "#07191F", fontWeight: "800" }, pairingCard: { marginTop: 24, padding: 22, borderRadius: 10, borderWidth: 1, borderColor: "#D86C5C", backgroundColor: "#193C43", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 24 }, pairingTitle: { color: "#F5EBDD", fontSize: 20, fontWeight: "900", marginBottom: 8 }, pairingToken: { color: "#D8A59A", fontSize: 30, fontWeight: "900", letterSpacing: 5, marginTop: 10 },
});
