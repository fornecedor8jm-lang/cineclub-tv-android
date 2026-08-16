# Plano técnico — Cineclub TV 1.0.6

A versão 1.0.6 será tratada como uma evolução do APK 1.0.5, sem misturar os artefatos antigos. O objetivo principal é transformar o protótipo em uma experiência mais previsível na Android TV: aparecer corretamente no launcher, explicar falhas de playlist, não apagar dados válidos, diferenciar reprodução nativa de fontes externas e permitir testes objetivos.

## Prioridade P0 — necessária antes de chamar a versão de pronta

| Área | Entrega | Critério de aceite |
|---|---|---|
| Android TV | LEANBACK_LAUNCHER, banner e landscape | O APK aparece no launcher da TV e abre horizontalmente |
| Foco remoto | Foco inicial, destaque visível e retorno | Setas, OK, Voltar e Menu não selecionam o fundo |
| M3U | Categorias Canais, Filmes e Séries | A interface mostra as três categorias quando existem itens |
| Erros M3U | Mensagens para HTTP, timeout, HTML, JSON e lista vazia | O usuário entende o motivo e a demo não substitui uma fonte real que falhou |
| Player | HLS/M3U8, MP4, carregamento, erro e Voltar | O player informa o estado e retorna ao catálogo sem travar |
| Segurança | Proxy sem logs de credenciais | Usuário e senha não aparecem em logs nem no QR Code |
| Pareamento | Expiração, renovação e consumo único | O código expira claramente e não pode ser reutilizado |

## Prioridade P1 — necessária para uma experiência consistente

A versão deve manter o último catálogo válido quando a sincronização falhar, validar o formato remoto, remover duplicidades e indicar o modo offline. Links do Google Drive devem usar o texto **Abrir fonte externa**, com orientação para login quando necessário, sem serem tratados como streams do player nativo. OpenSubtitles deve informar chave ausente, nenhum resultado e falha de download, permitir remover a legenda e nunca interromper o vídeo.

## Prioridade P2 — otimização e distribuição

Será feita uma revisão das permissões Android, removendo microfone, overlay, inicialização automática e armazenamento quando não houver uso real. O tamanho será medido depois do build; quando possível, serão preferidos App Bundle ou artefatos por arquitetura. A decisão final deve considerar compatibilidade com o fluxo Publish e a instalação em Android TV.

## Testes obrigatórios

A suíte automatizada cobrirá parser M3U, classificação de categorias, respostas HTTP 401/403/404, timeout, HTML/JSON inválido, proxy sem exposição de credenciais, expiração e consumo único de pareamento, cache offline, seleção/remoção de legenda e classificação de link externo. A validação manual exigirá uma Android TV física para HLS ao vivo, MP4, controle remoto, fullscreen, Voltar, resolução 720p/1080p/4K e instalação/atualização.

## Ordem de execução

Primeiro serão corrigidos Android TV, foco, M3U e mensagens de erro. Em seguida serão implementados proxy, pareamento persistente, catálogo offline, player e legendas. Por último serão revisadas permissões, tamanho do APK, documentação, testes e o artefato 1.0.6 gerado pelo fluxo Publish.


## Fonte pública M3U verificada

A fonte padrão configurada para a 1.0.6 é [`https://iptv-org.github.io/iptv/languages/por.m3u`](https://iptv-org.github.io/iptv/languages/por.m3u). Na verificação de 16 de agosto de 2026, ela respondeu com aproximadamente 106 KB, 467 entradas `#EXTINF`, logos em todas as 467 entradas examinadas e 43 grupos distintos. A aplicação não embute o conteúdo da lista: ela guarda apenas a URL e faz a leitura em tempo de execução, permitindo que a fonte seja atualizada sem nova versão do APK.
