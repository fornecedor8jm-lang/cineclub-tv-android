# Validação da correção de navegação e tela cheia

A captura widescreen de 1600x720 confirmou que a ordem do cabeçalho agora é Início, Séries, Terror, Filmes, Nuvem, Acervo, Minha lista e Sobre. A aba Nuvem aparece imediatamente ao lado de Filmes antes dos campos de busca e atualização.

A configuração Expo está em orientação landscape e inclui expo-navigation-bar. O layout raiz usa StatusBar hidden e NavigationBar.setVisibilityAsync("hidden") no Android, com comportamento inset-swipe, para remover as barras do sistema no próximo APK compilado. A captura em viewport menor encerrou o servidor de preview durante a tentativa, então o serviço foi reiniciado e a confirmação final dessa largura ainda precisa ser repetida.
