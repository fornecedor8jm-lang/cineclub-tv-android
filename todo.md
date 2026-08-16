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
