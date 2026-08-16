# Project TODO

- [x] Inspecionar o site Cineclub e mapear telas, seções e catálogo principal
- [x] Definir o plano de interface 16:9 para Android TV
- [x] Criar identidade visual e ícone do aplicativo (fallback baseado na marca pública do site; geração nova indisponível por limite diário)
- [x] Atualizar nome e configuração do aplicativo para Cineclub TV
- [x] Implementar shell de navegação com foco de controle remoto
- [x] Implementar tela inicial com hero e fileiras de catálogo
- [x] Implementar telas Séries, Terror, Filmes e Acervo
- [x] Implementar busca por título e filtros por gênero
- [x] Implementar tela de detalhes
- [x] Implementar Minha lista com persistência local
- [x] Implementar tela Sobre
- [x] Adicionar compatibilidade de orientação paisagem e Android TV
- [x] Verificar lint, TypeScript e testes (TypeScript e lint concluídos; lint sem erros, apenas avisos resolvidos no layout)
- [x] Validar o preview em viewport 16:9
- [ ] Preparar e validar build Android
- [ ] Entregar o projeto e o pacote Android TV

- [x] Adicionar navegador interno com WebView para Android TV
- [x] Criar biblioteca Cineclub Drive com títulos e temporadas fornecidos pelo usuário
- [x] Adicionar tela de navegação de pastas e links do Google Drive
- [x] Implementar abertura de links, voltar e foco remoto dentro do navegador
- [x] Preservar os links como referências externas, sem baixar ou redistribuir arquivos
- [ ] Validar os links fornecidos e o comportamento offline/sem login

- [x] Inventariar todos os links existentes no site e associá-los aos títulos correspondentes (38 títulos, 89 links públicos)
- [x] Associar cada link de Drive fornecido ao título e à temporada corretos
- [x] Exibir links somente dentro do detalhe do título/temporada correspondente
- [x] Garantir navegador interno e retorno ao detalhe após abrir uma referência
- [x] Validar links sem inventar correspondências quando o título não estiver identificado

- [x] Usar o site como fonte de verdade para links e metadados existentes
- [x] Não duplicar nem pedir novamente links que já estejam publicados no site
- [x] Acrescentar somente Pretty Little Liars e Se as Flores Falassem ao catálogo sincronizado
- [x] Associar os links dos dois novos títulos às temporadas e episódios corretos

- [x] Exibir Assistir agora em todos os cards e telas de detalhes
- [x] Abrir diretamente a fonte quando houver um único link
- [x] Mostrar seleção de temporada quando houver vários links
- [x] Manter o botão funcional mesmo quando o site ainda não tiver uma fonte vinculada

- [x] Fazer varredura geral do site antes de alterar os botões de reprodução
- [x] Localizar links em HTML, scripts, dados embutidos, botões e páginas de detalhes
- [x] Registrar títulos sem link e links sem correspondência para revisão

- [x] Pesquisar pôster específico de Pretty Little Liars
- [x] Pesquisar pôster específico de Se as Flores Falassem
- [x] Pesquisar pôster específico de A Última Casa
- [x] Associar o link do Drive fornecido ao título A Última Casa
- [x] Substituir as imagens provisórias no catálogo

- [x] Criar seção Adicionados recentemente para os títulos novos
- [x] Separar visualmente Séries e Filmes na home e na navegação
- [x] Distribuir os 38 títulos em fileiras equilibradas (38 títulos do site + 2 títulos adicionados)
- [x] Auditar cards que ainda usam pôster genérico
- [x] Substituir pôsteres genéricos por imagens específicas
- [x] Validar que cada título apareça na categoria correta

- [x] Levantar os 40 títulos atuais para classificação externa
- [x] Pesquisar em fontes públicas se cada título é série, filme ou anime
- [x] Criar relatório de classificação com fontes e casos ambíguos
- [x] Atualizar o app somente após revisar o relatório

- [ ] Preservar as classificações originais corretas dos títulos já existentes
- [ ] Aplicar a lista manual somente aos 15 filmes informados pelo usuário
- [ ] Não reclassificar os demais títulos automaticamente

- [x] Corrigir tela vazia ao tocar em Assistir agora na pré-visualização
- [x] Exibir carregamento e erro legível na navegação interna
- [x] Garantir botão voltar/fechar funcional após abrir um link
- [x] Validar links de pasta do Drive e links de arquivo do Drive

- [x] Garantir um botão Assistir agora por título
- [x] Vincular o botão à fonte específica do filme ou série
- [x] Abrir seleção de temporadas quando houver vários links
- [x] Impedir abertura de link genérico ou de outro título

- [x] Corrigir definitivamente a tela vazia ao abrir Assistir agora
- [x] Mostrar título e fonte/temporada correspondente antes da abertura
- [x] Exibir botão Assistir agora funcional com o link específico
- [x] Testar no preview web sem depender de WebView nativa invisível

- [x] Adicionar foco visível para navegação por controle remoto
- [x] Garantir navegação por setas entre menu, fileiras e cards
- [x] Garantir confirmação pelo botão OK/Enter
- [x] Garantir botão voltar do controle no detalhe e no navegador
- [x] Adaptar seleção de fontes e Assistir agora para controle remoto
- [x] Validar o fluxo sem depender de toque (foco visual e eventos de controle implementados; teste físico ainda recomendado)

- [x] Corrigir foco vazando para títulos atrás do modal
- [x] Evitar travamentos e lentidão ao navegar com setas
- [x] Criar aba Nuvem para playlist M3U personalizada
- [x] Permitir colar ou importar uma URL M3U autorizada
- [x] Salvar a playlist localmente com opção de remover
- [x] Parsear grupos, canais, filmes e séries do M3U
- [x] Implementar player próprio para streams autorizados
- [x] Adaptar player, lista e grupos ao controle remoto
- [x] Exibir aviso de beta até 16/09/2026 sem prometer acesso a conteúdo não autorizado
- [x] Testar com uma playlist M3U de demonstração sem usar a URL/credenciais expostas

- [x] Criar ícone próprio do Cineclub TV sem usar a imagem genérica atual
- [x] Atualizar ícone principal, splash e favicon
- [x] Atualizar ícone adaptativo e monocromático do Android
- [x] Gerar nova compilação para o launcher exibir o ícone corrigido

- [x] Criar opção Configurar pelo celular na aba Nuvem
- [x] Gerar token temporário, único e associado à sessão da TV
- [x] Exibir QR Code apenas com endereço e token, nunca com credenciais
- [x] Criar página responsiva para URL M3U ou dados separados
- [x] Transmitir a configuração para a TV por canal seguro
- [x] Testar a lista recebida e carregar grupos no player próprio

- [x] Normalizar itens M3U em título, grupo, logo, URL e tipo de mídia
- [x] Classificar automaticamente Canais, Filmes, Séries, Infantil e Outros
- [x] Detectar temporada e episódio em nomes como S01/E01
- [x] Agrupar séries por título e temporada
- [x] Exibir catálogo M3U com pôster/logo e botão Assistir
- [x] Identificar MP4, HLS M3U8 e MPEG-TS antes da reprodução
- [x] Implementar Atualizar M3U sem apagar a lista anterior em caso de falha
- [x] Comparar itens novos/removidos e atualizar o cache local
- [x] Validar o pipeline completo com uma playlist de demonstração autorizada

- [x] Verificar documentação e termos atuais da OpenSubtitles API
- [x] Criar busca de legendas por título, ano, temporada, episódio e idioma
- [x] Manter a chave da OpenSubtitles somente no backend
- [x] Adicionar cache temporário dos resultados de legendas
- [x] Adicionar menu de legendas no player
- [x] Suportar Português BR, Português PT, Inglês e Espanhol
- [x] Carregar legenda selecionada sem impedir reprodução quando falhar

- [x] Criar logo nominal com a palavra Cineclub claramente legível (contingência local legível enquanto o asset gerado finaliza)
- [x] Aplicar o logo com nome nos assets principal, splash e favicon
- [x] Ajustar o ícone adaptativo para manter a marca reconhecível em tamanho pequeno

- [x] Aplicar efetivamente a faixa `.srt` selecionada ao player Expo Video
- [x] Confirmar fallback quando a legenda OpenSubtitles não possuir download compatível
- [x] Otimizar re-renderização e resposta do D-pad em listas e modais
- [x] Validar foco inicial no botão Assistir agora em Android TV físico
- [x] Executar auditoria final de assets, app.config.ts e configuração landscape
- [x] Executar validação final e registrar limitações conhecidas antes do APK
- [ ] Criar checkpoint final e orientar a geração do APK pelo fluxo Publish

- [x] Garantir que a aba Nuvem apareça imediatamente ao lado de Filmes em todas as larguras de tela
- [x] Remover barras e área do sistema quando o app estiver em modo TV/tela cheia
- [ ] Validar a correção no fluxo de atualização do APK e no dispositivo usado pelo usuário

- [x] Evitar depender do botão de tela cheia do player incorporado do Drive
- [x] Garantir que a reprodução interna ocupe toda a área disponível do app
- [x] Exibir o nome real do título no cabeçalho Assistir
- [x] Mostrar fallback claro quando o provedor bloquear fullscreen ou exigir login

- [x] Fazer o navegador/player interno preencher 100% da tela em largura e altura
- [x] Manter controles de fechar e título sobrepostos sem reduzir a área do vídeo

- [x] Remover WebView do fluxo de reprodução do catálogo
- [x] Detectar streams diretos compatíveis com player nativo
- [x] Exibir player nativo em tela cheia para MP4, HLS e MPEG-TS
- [x] Criar fallback externo para links do Drive e páginas que exigem navegador
- [x] Manter legendas e botão Voltar no player nativo

- [x] Ajustar cartão de pareamento para não cortar o QR Code na lateral
- [x] Fazer o QR Code e o token caberem em telas estreitas
- [x] Validar o cartão de pareamento em viewport widescreen e estreito

- [x] Diagnosticar a publicação que sai da tela de carregamento
- [x] Validar build de produção e dependências nativas após remover WebView
- [ ] Corrigir qualquer falha que impeça o fluxo Publish de concluir
- [ ] Confirmar checkpoint estável para nova tentativa de publicação

- [x] Auditar arquivos sensíveis antes de enviar ao GitHub
- [x] Preparar README e inventário do projeto para o repositório
- [x] Criar novo repositório privado do Cineclub TV
- [x] Enviar código, assets, testes e documentação ao GitHub
- [x] Verificar se existe APK gerado para incluir como artefato

- [x] Documentar a versão web funcional do Cineclub TV
- [x] Documentar comandos de instalação, desenvolvimento, testes e build web
- [x] Validar a execução web no preview e registrar a URL pública
- [x] Sincronizar README e documentação web no GitHub

# Cineclub TV 1.0.6 — auditoria recebida

- [ ] Adicionar configuração completa de Android TV: LEANBACK_LAUNCHER, banner, landscape e dimensões 720p/1080p/4K
- [ ] Validar foco e navegação por controle remoto em Android TV real
- [ ] Incluir canal na playlist de demonstração e exibir Canais, Filmes e Séries
- [ ] Remover fallback silencioso para playlist demo após falha de playlist real
- [ ] Diferenciar erros M3U HTTP 401, 403, 404, timeout, HTML, JSON, lista vazia e autorização
- [ ] Criar proxy backend autorizado para playlists M3U sem registrar credenciais
- [ ] Persistir pareamento, mostrar expiração, permitir renovação e consumir token uma única vez
- [ ] Validar player nativo para HLS/M3U8, MP4, controles remotos, fullscreen e erros de stream
- [ ] Melhorar estados de legenda: chave ausente, nenhum resultado, download falho, remover e sincronização
- [ ] Diferenciar Reprodução no Cineclub de Abrir fonte externa para links do Drive
- [ ] Fortalecer cache e validação do catálogo remoto em modo offline
- [x] Revisar permissões Android e remover as que não forem usadas
- [ ] Avaliar redução do APK e builds por arquitetura/App Bundle
- [ ] Criar suíte de testes para M3U, proxy, pareamento, player, links externos e catálogo offline
- [ ] Preparar matriz de validação em Android TV física para a versão 1.0.6

- [x] Ler `tvg-logo`, `tvg-name`, `logo`, `channel-logo` e atributos equivalentes das entradas M3U
- [x] Priorizar logo da entrada, depois logo do grupo e fallback visual Cineclub
- [x] Exibir logos dos canais em cartões legíveis a distância
- [ ] Melhorar foco inicial, destaque e ordem de navegação por D-pad
- [ ] Ajustar cartões, espaçamentos e tipografia para Android TV 720p/1080p/4K
- [ ] Validar setas, OK, Voltar e Menu nos fluxos de Nuvem e player

- [x] Adicionar a playlist pública em português como fonte M3U padrão da 1.0.6
- [x] Permitir até três playlists M3U personalizadas além da fonte padrão
- [x] Salvar nome, URL, status e última atualização de cada playlist
- [x] Impedir uma quinta lista e explicar o limite ao usuário
- [x] Atualizar e remover listas individualmente sem apagar as outras

- [x] Permitir trocar para o canal anterior sem sair do player
- [x] Permitir trocar para o próximo canal sem sair do player
- [x] Exibir lista rápida de canais durante a reprodução
- [x] Mostrar logo e nome do canal atual no player
- [x] Controlar troca de canais pelas setas e OK do controle remoto
- [x] Manter tela cheia e estado de reprodução durante a troca

# Android TV 1.0.6 — ajustes finais

- [ ] Confirmar LEANBACK_LAUNCHER e banner no manifest nativo gerado
- [ ] Confirmar landscape e immersive mode no APK recompilado
- [ ] Ajustar escalas para 720p, 1080p e 4K sem cortar o menu
- [ ] Validar foco inicial, foco de retorno e ordem do D-pad em TV física
- [ ] Garantir troca de canal por setas/OK sem toque
- [ ] Revisar permissões Android e remover permissões não utilizadas
- [ ] Preparar matriz de teste com Android TV/Google TV e controles diferentes

# Publish 1.0.6 — falha observada

- [x] Identificar por que o Publish retorna de 47% para Secrets
- [x] Diferenciar falha de build do backend de falha visual do painel
- [x] Validar configuração nativa e dependências usadas no Publish
- [ ] Salvar checkpoint depois de corrigir o bloqueio de publicação

- [ ] Identificar por que o Publish fica em 47% até um segundo toque em Publicar
- [ ] Diferenciar falha de atualização do painel de falha real do build
- [ ] Corrigir o fluxo para acompanhar o progresso sem novo toque

# Publish 1.0.6 — lentidão em 70%

- [ ] Identificar qual etapa do Publish fica lenta em 70%
- [ ] Auditar artefatos e dependências que aumentam o empacotamento
- [ ] Reduzir peso sem remover recursos necessários do Android TV
- [ ] Validar nova tentativa de Publish após otimização

# Publish 1.0.6 — reinício de 70% para 0%

- [ ] Identificar se o job de publicação está reiniciando ou falhando no upload
- [x] Verificar se alterações ou reinício do projeto ocorrem durante o Publish
- [x] Confirmar os artefatos gerados antes da etapa de 70%
- [ ] Corrigir a causa do retorno para 0% e validar uma única nova tentativa

# Compilação 1.0.6 após reset

- [x] Validar dependências e secrets após o reset do ambiente
- [x] Confirmar configuração Expo/Android TV antes do Publish
- [x] Executar testes leves e garantir uma única instância de serviços
- [ ] Salvar checkpoint pronto para a nova compilação
- [ ] Fazer uma única tentativa de Publish da 1.0.6

# Falha persistente após reset — investigação

- [ ] Registrar o comportamento exato da falha no Publish após o reset
- [ ] Coletar logs do painel, serviços e job remoto disponíveis
- [ ] Isolar se a falha ocorre no painel, empacotamento nativo, upload ou acompanhamento do progresso
- [ ] Aplicar correção ou preparar alternativa segura de compilação
- [ ] Validar o próximo build sem iniciar tentativas duplicadas

# Limpeza de processos após falha do Publish

- [x] Contar processos relacionados ao Cineclub e ao Expo
- [x] Forçar parada dos processos do projeto sem afetar o sistema
- [x] Confirmar memória liberada e ausência de instâncias duplicadas

# Nova compilação após parada forçada

- [x] Reiniciar somente os serviços necessários
- [x] Validar configuração e integridade antes do Publish
- [ ] Salvar checkpoint final da tentativa
- [ ] Iniciar uma única compilação da versão 1.0.6

# Compilação externa da versão 1.0.6

- [x] Auditar configuração EAS/Android no projeto
- [x] Definir caminho externo de compilação pelo GitHub/EAS
- [ ] Documentar secrets necessários sem expor valores
- [ ] Orientar o usuário passo a passo para gerar o APK

# ProjectId do EAS antes do build

- [x] Adicionar o projectId EAS ao app.config.ts
- [x] Validar o projectId resolvido pela configuração Expo
- [x] Sincronizar a alteração na branch build-1.0.6-eas do GitHub
- [ ] Orientar git pull e novo comando eas build
