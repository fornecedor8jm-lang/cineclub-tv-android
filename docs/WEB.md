# Versão Web do Cineclub TV

O mesmo projeto Expo/React Native possui uma saída web estática baseada em Expo Router e Metro. A versão web compartilha o catálogo, a identidade visual, a busca, os filtros, os detalhes, a aba Nuvem, o pareamento e o fluxo de reprodução compatível com navegador.

## Executar localmente

Na raiz do projeto:

```bash
pnpm install
pnpm dev
```

O comando `pnpm dev` inicia o servidor de API e o Metro Web. O endereço local normalmente é `http://localhost:8081`.

Para iniciar somente a saída web do Expo:

```bash
pnpm dev:metro
```

## Build web estático

A configuração em `app.config.ts` usa `bundler: "metro"` e `output: "static"`. Para gerar a versão web estática, execute:

```bash
npx expo export --platform web
```

Os arquivos gerados ficam em `dist/` e não são versionados, porque são artefatos regeneráveis. O favicon usa `assets/images/favicon.png`.

## Validação

Antes de publicar uma alteração web, execute:

```bash
pnpm check
pnpm lint
pnpm test
npx expo export --platform web
```

A versão pública de referência deste projeto está disponível em [cineclubtv-cgkzauke.manus.space](https://cineclubtv-cgkzauke.manus.space). O preview de desenvolvimento é temporário e pode mudar conforme a sessão.

## Limitações conhecidas

A versão web pode não reproduzir APIs nativas específicas do Android TV da mesma maneira que o APK. Streams M3U compatíveis funcionam pelo player nativo/web disponível; links de Drive ou páginas que exigem login continuam sendo tratados como fontes externas. Credenciais e chaves privadas não fazem parte da versão web publicada.
