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

- [ ] Corrigir definitivamente a tela vazia ao abrir Assistir agora
- [ ] Mostrar título e fonte/temporada correspondente antes da abertura
- [ ] Exibir botão Assistir agora funcional com o link específico
- [ ] Testar no preview web sem depender de WebView nativa invisível

- [x] Adicionar foco visível para navegação por controle remoto
- [x] Garantir navegação por setas entre menu, fileiras e cards
- [x] Garantir confirmação pelo botão OK/Enter
- [x] Garantir botão voltar do controle no detalhe e no navegador
- [x] Adaptar seleção de fontes e Assistir agora para controle remoto
- [x] Validar o fluxo sem depender de toque (foco visual e eventos de controle implementados; teste físico ainda recomendado)
