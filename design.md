# Plano de interface — Cineclub Android TV

## Direção do produto

O aplicativo será uma experiência de catálogo para televisão, inspirada no site Cineclub: escura, cinematográfica e simples de usar com controle remoto. A tela será tratada como uma composição 16:9, com textos grandes, áreas de toque/foco amplas e navegação previsível por cima, baixo, esquerda, direita, confirmar e voltar.

## Telas

| Tela | Conteúdo principal | Funcionalidade |
|---|---|---|
| Início | Hero do título em destaque, ranking IMDb e fileiras de catálogo | Navegar entre seções, abrir detalhes, iniciar reprodução externa quando houver link, adicionar à lista |
| Séries | Grade horizontal de séries do catálogo | Filtrar por gênero, abrir detalhes e adicionar à lista |
| Terror | Seleção de terror e sobrenatural | Navegar por fileiras temáticas e abrir detalhes |
| Filmes | Grade de filmes | Filtrar e abrir detalhes |
| Acervo | Todas as obras disponíveis | Busca, filtros e navegação por foco |
| Minha lista | Obras salvas localmente | Remover, abrir detalhes e continuar explorando |
| Detalhes | Pôster, título, tipo, ano, nota, sinopse e metadados | Assistir agora, adicionar/remover da lista e voltar |
| Busca | Campo de busca e resultados filtrados | Digitação por teclado da TV, limpar e abrir detalhes |
| Sobre | Identidade, proposta e créditos do Cineclub | Voltar ao início |

## Layout da tela inicial

A barra superior fixa terá a marca Cineclub à esquerda e os destinos Início, Séries, Terror, Filmes, Acervo, Minha lista e Sobre. A área hero ocupará aproximadamente a metade superior da tela, com imagem de fundo, gradiente escuro e texto do título em grande escala. Os botões principais ficarão agrupados em uma faixa horizontal com foco visível.

A metade inferior exibirá fileiras horizontais. Cada card terá pôster, rótulo de tipo/ano, gênero e título, com escala discreta ao receber foco. A fileira ativa terá contraste maior e as demais permanecerão legíveis, mas recuadas visualmente.

## Navegação por controle remoto

O primeiro foco da tela inicial ficará no item Início. As setas esquerda e direita percorrem itens da barra, fileiras e cards. As setas para cima e para baixo mudam de região. O botão central abre a tela de detalhes. O botão voltar retorna à tela anterior ou fecha o detalhe. O foco será sempre indicado por uma borda clara e uma pequena elevação do card, sem depender de hover de mouse.

## Fluxos principais

1. Usuário abre o app → foco em Início → percorre o hero ou desce para as fileiras → confirma um card → tela Detalhes.
2. Na tela Detalhes → confirma Minha lista → a obra é persistida localmente → o botão muda para Remover da lista.
3. Usuário seleciona Acervo → entra na busca → digita o título → resultados são atualizados → confirma uma obra → Detalhes.
4. Usuário seleciona um gênero → fileira correspondente é exibida → navega pelos cards → abre Detalhes.
5. Usuário pressiona voltar em Detalhes → retorna exatamente para a posição anterior no catálogo.

## Cores e tipografia

A base será azul-petróleo quase preto `#07191F`, com superfícies `#102B33` e `#153944`. O destaque de ação será coral cinematográfico `#D86C5C`; o foco remoto será marfim `#F5EBDD`; textos secundários usarão `#A9B9B6`. Gradientes escuros sobre os pôsteres manterão contraste para leitura à distância. Títulos usarão uma serifada de personalidade editorial, enquanto metadados e navegação usarão uma sans-serif limpa.

## Regras de acessibilidade de TV

Os controles terão área visual ampla, contraste elevado, tamanhos de texto adequados à distância e estados de foco persistentes. Nenhuma ação crítica dependerá de gesto, toque ou arraste. A lista será local e não exigirá login, conta ou conexão com banco de dados.
