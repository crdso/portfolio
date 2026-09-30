# Revisão das capturas — 30/09/2026

Foram recapturados e usados no portfólio: Doctor Small, Black Burguer, Brasa 77, Bucco Burger, Bodega Poços, Restaurante do Minero, Olimpo Restaurante, Umami, Goutu, MiPhone, Nexa Agency, Dra. Gabriella Cavalcante, Hospital Veterinário 24h, Nowtech, Solare, Solvex, Solaix, Guilherme Podgaietsky, Porto Glass e Let'sFly. Os arquivos aprovados estão em `assets/work/<id>/`; tentativas e páginas completas de referência permanecem em `staging/` (ignorado pelo Git).

O case mostra somente Hero e até duas imagens de seção. As capturas full-page não aparecem automaticamente. Foram geradas apenas como referência para Brasa 77, Doctor Small, Goutu, Let'sFly, Nowtech e Porto Glass. A full-page da ENTEC não foi aproveitada porque a galeria WebGL ficou incompleta.

O script dispensou full-page quando a página passou de 9.000 px ou continha elementos grandes fixos/sticky: Black Burguer, MiPhone, Nexa, Bucco, Bodega, Restaurante do Minero, Olimpo, Umami, Foodee, Helios, Hospital Veterinário, Dra. Gabriella, Solare, Solvex, Solaix e Guilherme Podgaietsky. Assim, evitamos imagens longas e capturas com scroll ou animação quebrados.

As novas tentativas de Foodee e Helios ficaram vazias durante a animação; as imagens anteriores foram mantidas. O build local da MiPhone estava antigo, então o script compilou o código atual em uma pasta temporária antes de capturar. A primeira dobra da cópia local da Solaix ainda mostra texto de um template de encanamento e um logo ausente; a abertura do case foi recortada de uma seção solar real do mesmo site, sem distorcer a proporção. As capturas intermediárias do Black Burguer repetiam o Hero ou exibiam produtos sem imagem; o case usa só o Hero e a variante Cajuí.

Best Multimarcas e Correio Elegante têm código local, mas nenhum build ou dependências instaladas. Uma instalação offline das dependências da Best falhou porque o cache não contém `@types/react`. Studio Tavares e FindMap não foram encontrados nas pastas locais consultadas. Esses quatro projetos mantêm os screenshots anteriores, exceto os recortes isolados de produto da Best, que deixaram de aparecer no case.
