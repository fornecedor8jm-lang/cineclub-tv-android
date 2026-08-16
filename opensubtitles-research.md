# Pesquisa OpenSubtitles — Cineclub TV

A documentação oficial consultada informa que a API REST atual usa uma chave estática de aplicação no cabeçalho `Api-Key` e, para operações que exigem conta, um JWT no cabeçalho `Authorization`. A chave deve ser uma chave da aplicação e não deve ser solicitada ou embutida no APK; ela deve permanecer no backend. A documentação também exige um `User-Agent` identificando o aplicativo e a versão em todas as requisições.[1]

A busca de legendas não possui limite indicado na página de introdução, enquanto o download possui limites por IP/conta e regras próprias. A documentação recomenda contato com a OpenSubtitles para oferecer downloads sem solicitar login individual ao usuário. Portanto, o Cineclub deve começar com pesquisa de resultados e só habilitar download/carregamento conforme a autorização e os limites da conta da aplicação.[1]

A API retorna legendas em SRT UTF-8 por padrão, e a documentação menciona a busca por `imdb_id`, além de parâmetros de título, ano, temporada, episódio e idioma nas operações de legendas. O player deve tratar falha de legenda como não bloqueante: o vídeo continua disponível mesmo quando a pesquisa ou o download falhar.[1] [2]

## Decisões para o Cineclub

A chave OpenSubtitles ficará no backend, em variável de ambiente. O APK chamará uma rota própria do Cineclub para pesquisar resultados. O backend poderá aplicar cache temporário por título/ano/temporada/episódio/idioma e deverá omitir credenciais e a chave da resposta ao aplicativo. O menu do player terá Desativadas, Português BR (`pt-br`), Português PT (`pt-pt`), Inglês (`en`) e Espanhol (`es`).

## Referências

[1]: https://opensubtitles.stoplight.io/docs/opensubtitles-api/e3750fd63a100-getting-started — OpenSubtitles REST API, Getting started.
[2]: https://ai.opensubtitles.com/docs — OpenSubtitles API endpoints e idiomas.
