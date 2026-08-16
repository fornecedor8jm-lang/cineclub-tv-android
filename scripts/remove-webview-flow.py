from pathlib import Path

path = Path("app/(tabs)/index.tsx")
source = path.read_text()
source = source.replace('import { WebView } from "react-native-webview";\n', '')
start = source.index('      <Modal visible={Boolean(browserUrl)}')
end_marker = '      </Modal>\n    </ScreenContainer>'
end = source.index(end_marker, start) + len('      </Modal>')
replacement = '''      <Modal visible={Boolean(browserUrl)} animationType="fade" presentationStyle="fullScreen" statusBarTranslucent onRequestClose={() => { setBrowserUrl(null); setBrowserTitle(""); setBrowserLoading(false); setBrowserError(false); }}>
        {browserUrl && <View style={styles.browserBackdrop}>
          <View style={styles.browserHeader}>
            <Text numberOfLines={1} style={styles.browserTitle}>Assistir: {browserTitle}</Text>
            <Pressable focusable onFocus={() => setFocusedElement("browser-close")} onPress={() => { setBrowserUrl(null); setBrowserTitle(""); setBrowserLoading(false); setBrowserError(false); }} style={({ pressed }) => [styles.browserClose, focusedElement === "browser-close" && styles.navFocused, pressed && styles.pressed]}>
              <Text style={styles.browserCloseText}>Fechar</Text>
            </Pressable>
          </View>
          <View style={styles.webSourcePanel}>
            <Text style={styles.browserMessageTitle}>Fonte externa</Text>
            <Text style={styles.browserMessageText}>O player nativo não pode reproduzir esta página ou pasta do Drive diretamente.</Text>
            <Text style={styles.browserMessageText}>Abra a fonte externa para assistir, ou use a aba Nuvem com uma playlist M3U autorizada para reprodução dentro do app.</Text>
            <Text selectable style={styles.sourceUrl}>{browserUrl}</Text>
            <Pressable focusable hasTVPreferredFocus onFocus={() => setFocusedElement("open-source")} onPress={() => Linking.openURL(browserUrl)} style={({ pressed }) => [styles.openSourceButton, focusedElement === "open-source" && styles.navFocused, pressed && styles.pressed]}>
              <Text style={styles.openSourceText}>Abrir fonte externa</Text>
            </Pressable>
          </View>
        </View>}
      </Modal>'''
path.write_text(source[:start] + replacement + source[end:])
