# Diagnóstico do Publish — Cineclub TV 1.0.6

## Sintoma observado

O painel de publicação chega a aproximadamente 70% e retorna para 0%. Em tentativas anteriores, também voltou para a tela de Secrets e precisou de um novo toque em Publicar.

## Evidências locais

A configuração Expo 1.0.6 foi resolvida com orientação landscape, permissões Android vazias, plugin `./plugins/with-android-tv.js`, Expo Video e plugin Android TV. TypeScript, testes e lint passaram.

Durante a investigação, foram encontrados processos duplicados do Expo/Metro e do servidor `tsx`, com consumo aproximado de 3,1 GiB de uma memória total de 3,8 GiB. O log registrou encerramentos `SIGTERM`, `ELIFECYCLE` e erros `Premature close` associados ao preview Web. Depois da limpeza e do reinício, o servidor voltou a iniciar e o TypeScript continuou sem erros.

## Interpretação

O retorno de 70% para 0% é compatível com reinício do job, perda de estado do painel ou pressão de memória durante o empacotamento/upload. Os logs locais não mostram erro de TypeScript nem uma falha funcional no código do aplicativo. O ambiente precisa permanecer com uma única execução dos serviços antes de uma nova tentativa.

## Procedimento recomendado

Não iniciar múltiplos Publish em paralelo. Reiniciar os serviços uma vez, aguardar o preview estabilizar e iniciar uma única publicação. Se o progresso voltar a 0%, registrar o horário exato e a mensagem final exibida pelo painel para comparação com o log do serviço.

## Limitação

O log local do projeto não contém o log interno do job remoto de publicação. Portanto, não é possível afirmar, apenas pelo sandbox, se a falha final ocorre no upload do artefato ou na atualização visual do painel.
