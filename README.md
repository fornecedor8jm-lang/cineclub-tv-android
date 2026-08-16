# Cineclub TV

Aplicativo Android TV do Cineclub, desenvolvido com Expo SDK 54, React Native e TypeScript. O projeto oferece catálogo sincronizado, navegação por controle remoto, botão **Assistir agora**, aba **Nuvem** para playlists M3U autorizadas, pareamento temporário por QR Code, player nativo para streams compatíveis e integração de legendas OpenSubtitles com chave mantida no backend.

## Conteúdo do repositório

O código-fonte, os assets de marca, a configuração Expo, os testes, a documentação de validação, a **versão Web** e o APK Cineclub TV 1.0.5 estão versionados. A documentação web está em `docs/WEB.md`. O APK fica em `artifacts/cineclub-tv-1.0.5.apk`; sua soma SHA-256 está em `artifacts/SHA256SUMS.txt`.

## Versões disponíveis

| Versão | Descrição | Referência |
|---|---|---|
| Android TV | APK 1.0.5 com navegação por controle remoto e player nativo | `artifacts/cineclub-tv-1.0.5.apk` |
| Web | Aplicação Expo Router executada no navegador e exportável como site estático | [cineclubtv-cgkzauke.manus.space](https://cineclubtv-cgkzauke.manus.space) |

Para executar ou exportar a versão web, consulte [`docs/WEB.md`](docs/WEB.md).

## Desenvolvimento

```bash
pnpm install
pnpm check
pnpm lint
pnpm test
pnpm build
```

O fluxo oficial para gerar novas versões Android TV é o **Publish** do ambiente WebDev. Não são versionadas credenciais, arquivos `.env`, keystores ou tokens temporários. A chave OpenSubtitles deve permanecer somente no backend.

## Estado conhecido

Links do Drive e páginas externas podem exigir o navegador ou login do provedor. Streams M3U compatíveis usam o player nativo com controles de reprodução, tela cheia e legendas. O APK deve ser testado em uma Android TV física após a instalação.
