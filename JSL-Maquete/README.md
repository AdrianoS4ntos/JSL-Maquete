# JSL — Modelo demonstrativo de integração entre setores

Abra `index.html` no navegador (precisa de internet para carregar o Three.js da CDN). Para editar, abra a pasta no VS Code; tudo está em `index.html`.

Cores: constante `K` e `CONCRETE` (cinza concreto #B8B9B7, paredes e estruturas); pisos dos setores em `CF`. Textos: `SECT`, `STEPS`, `INTEG`, `LEGAL`.

Aviso: demonstração acadêmica; o JSL ODS não é divisão oficial confirmada; estimativas e indicadores são ilustrativos.

## v12 — revisão visual (auditoria geométrica) e integração
**Importante:** a imagem com os problemas citados no pedido não chegou (só o texto), e não há navegador com WebGL neste ambiente. Por isso a revisão foi feita por **auditoria automática da geometria** (`tests/audit2.js`, `tests/zf.js`): objetos fora do terreno, enterrados, flutuando, sobrepostos e superfícies coplanares (cintilação/z-fighting).
**Corrigido**
- Cintilação (z-fighting) onde as ruas do pátio cruzam as calçadas da avenida (faixas de calçada agora interrompidas no cruzamento).
- Grama invadindo o asfalto da avenida (canteiro da direita recuado).
- Placas dos setores deixavam de ser ocultadas por objetos só por desenho "por cima" (depthTest desligado); agora respeitam a profundidade e ficam acima do telhado/marquise.
- Caminhões estacionados: espaçamento ampliado (rodas não se encostam) e vagas/linhas/rótulos T1–T4 realinhados; asfalto do pátio ampliado.
- Caminhão de coleta: curvas arredondadas (arcos de raio 0,8) em vez de quinas; orientação segue a tangente da rota (defasagem máx ≈ 0,2 rad), sem giros bruscos.
- Iluminação reduzida (hemisférica 0,62; sol 0,78; preenchimento 0,2) para evitar superfícies estouradas.
**Integração**
- Indicador (seta vermelha) sobre o setor responsável em cada etapa (sobre o município na etapa 1 e sobre o caminhão durante a coleta).
- Personagens reagem à etapa: Administrativo (conversa/organização na etapa 3), Logística (etapa 4), ODS (acompanhamento na etapa 5), Diretoria (análise na etapa 2); funcionários que levam documentos saem pelas portas.
- Teste de distância entre personagens (mín. 0,73) e de colisão com a geometria.
**Auditoria — o que sobrou**: apenas empilhamentos intencionais (caixas sobre contêineres, anel vermelho do silo) e aproximação das rodas.
**NÃO verificado visualmente**: nenhuma captura de tela, nenhum ângulo real inspecionado; erros que só aparecem na renderização (cores, sombras, cortes) podem permanecer. Reenvie a imagem para eu conferir pontos específicos.

## v11 — câmera livre
- **Girar:** arrastar com o botão esquerdo — 360° sem limite horizontal; inclinação de vista totalmente de cima até quase ao nível do chão.
- **Mover (pan):** botão direito ou Shift+arrastar; no toque, dois dedos (também faz o zoom em pinça).
- **Zoom:** roda do mouse / pinça, de 3 a 90 (antes 8–60).
- **Teclado:** W A S D (ou setas) movem; Q/E giram; + / − (ou PageUp/PageDown) zoom; R reinicia a vista; F segue o caminhão.
- **Botões novos (Câmera livre):** Vista de cima · Seguir caminhão · Câmera automática.
- **Câmera automática:** quando ligada, a simulação reposiciona a câmera nas etapas (ex.: enquadra a coleta na etapa 4). Ao mexer na câmera manualmente ela desliga e a simulação não "puxa" mais a vista; "Visão geral", "Reiniciar visualização", escolher um setor ou o botão a reativam. O alvo da câmera fica limitado ao terreno.
- Teste: `node tests/cam.js` (eventos de mouse/teclado simulados).

## v10 — simulação única, interface limpa, supermercado refeito
**Alterado**
- Removidos os 5 cartões superiores (HTML e CSS).
- Simulação única com um só conjunto de controles: **Iniciar · Pausar · Continuar · Reiniciar** (+ "Fluxo passo a passo" manual, que usa o mesmo motor). Os botões "Simular processo", "Simular coleta externa" e "Reiniciar simulação" antigos foram eliminados.
- Sequência: 1 Solicitação municipal → 2 Diretoria → 3 Administrativo → 4 Logística e Operações (caminhão sai da base, percorre a estrada, para no ponto de coleta do supermercado, coleta as 4 categorias e retorna à base; depois triagem) → 5 JSL ODS. Etapas 1, 2, 3 e 5 ≈ 5 s; a etapa 4 dura o necessário (≈ 26 s no teste).
- Pausar congela caminhão, personagens, pacotes e cronômetros (tempo da simulação separado do relógio); Continuar retoma do ponto exato; Reiniciar restaura caminhão, objetos e personagens às posições originais e deixa a simulação pronta para Iniciar. Um único laço de animação (sem intervalos/temporizadores extras).
- Personagens usados na simulação: funcionário do Administrativo leva documentos à Diretoria (etapa 2), Diretoria muda para modo de análise/aprovação, funcionária do ODS leva documentos à Logística (etapa 4); trabalhador da coleta carrega as caixas na etapa 4.
- Supermercado refeito em coordenadas do mundo: corpo, rodapé, faixa vermelha/amarela, placa, porta de vidro, vitrines, marquise com pilares, telhado com platibanda e equipamentos, janelas laterais, porta de carga, calçada, lixeiras, postes, cercas na área de coleta, estacionamento reorganizado. (A placa e as janelas anteriores estavam fora do prédio; corrigido.)
- Rota de retorno suavizada (curva em chanfro) e caminhões estacionados afastados para o caminhão não encostar neles.
- Calçada frontal deslocada (z=5) para não colidir com os pilares das marquises.

**Testes automatizados** (`tests/`, rodam em Node, sem navegador): `node tests/test.js` e `node tests/extra.js`. Usam um Three.js simulado (sem renderização): verificam sequência e tempos das etapas, continuidade do caminhão, parada no ponto de coleta, retorno à base, colisões do caminhão com a geometria, pausa/continuar/reiniciar em todas as etapas e travessia de paredes pelos personagens. O arquivo expõe `window.__jsl` apenas para esses testes.

**Não testado / limitações**: nenhuma renderização real (sem WebGL/CDN no ambiente de desenvolvimento): aparência, cores, sombras, cliques de mouse, câmera, inspeção por vários ângulos e capturas de tela de verdade não foram feitas. `planta-maquete.png` é uma planta 2D gerada da geometria, não uma captura do 3D. Colisão é aproximada por caixas.

## v9 — prédios independentes, cores e sinalização
- **Quatro prédios separados** (Diretoria, Administrativo, JSL ODS, Logística), cada um com fachada própria, janelas de vidro azulado, porta com folhas, marquise, degraus, placa e acabamento cinza/grafite com detalhes vermelhos. Paredes do fundo e da esquerda são opacas (com janelas); frente e lado direito são envidraçados e baixos, para o interior continuar visível. Sem teto.
- **Circulação:** calçadas em cinza médio entre os prédios, com linhas amarelas e setas; funcionários saem pelas portas e caminham pelas calçadas (Administrativo → Diretoria e ODS → Logística).
- **Ruas:** asfalto grafite, setas por faixa na avenida, faixas de pedestres, ruas SAÍDA/ENTRADA ligando o pátio ao supermercado, vagas T1–T4 dos caminhões, DOCA 01–03 no galpão, marcações amarelas.
- **Cercas** metálicas no pátio operacional, na frente e atrás da área dos prédios e na lateral do galpão (com aberturas para circulação).
- **Paleta de design** (referência de projeto, NÃO códigos oficiais da JSL): cinza #858B91, grafite #555D65, grafite escuro #292F36, vermelho #E51D2A, verde #3C9859, azul #3976A8, amarelo #F2C230. Brancos de paredes, mesas e quadros substituídos por cinzas; branco mantido em detalhes e caminhões. O piso externo continua cinza concreto #B8B9B7 (pedido anterior).
- **Luz** mais suave (hemisférica .82, sol .85, preenchimento .28, sombras com raio maior).
- **Tempos:** fluxo municipal = 5 etapas de ~5 s (inalterado). Coleta externa tem ritmo próprio (caminhão a 2,0 un/s, com pausas), independente.

### Testado
- Sintaxe do JavaScript e execução da montagem da cena com Three.js simulado (sem erros).
- Verificação geométrica (script) de que os trajetos Administrativo→Diretoria e ODS→Logística atravessam as paredes só pelas portas.

### NÃO testado (sem navegador com Three.js neste ambiente)
Aparência real, cliques/seleção, animações dos 13 personagens e do caminhão, simulações em execução, controles de câmera e possíveis sobreposições de objetos. Não foi checada colisão com mobiliário além do cálculo manual dos trajetos.

## Reformulação v8 (referência visual isométrica)
- Interface escura com 5 cartões superiores e barra inferior em 3 áreas: Simulações / Câmera Livre / Integração.
- Plataforma quadrada ampliada (36×36), piso cinza concreto (#B8B9B7) e grama apenas sob as árvores.
- Placas dos setores: Diretoria, Administrativo, JSL ODS (verde), Logística.
- Novo cenário: galpão JSL com docas, logotipo "JSL", silo e caminhões vermelhos/brancos; avenida com faixa amarela e faixa de pedestres; estacionamentos com carros; fachada do supermercado com placa; lixeiras, postes, bancos e cercas vivas.
- Painel "Etapa da operação" (Planejamento, Preparação, Carregamento, Transporte, Conclusão) na simulação de coleta externa: etapa atual, setor responsável, atividade e próxima etapa. As etapas seguem as fases da simulação (não há temporizador fixo de 5 s nelas). O fluxo dos 5 passos do processo municipal continua com ~5 s por passo.
- Preservados: 4 setores, 13 personagens, caminhão de rota, coleta externa, integração.

### Testado / não testado
- Testado: sintaxe do JavaScript e execução da montagem da cena com Three.js simulado (sem erros).
- NÃO testado: renderização visual no navegador, cliques, animações e posição exata de objetos (possíveis sobreposições). Prédios setoriais ainda são os mesmos blocos 2×2 sobre a plataforma, com placas; não são edifícios totalmente separados como na imagem.
- Cores JSL: vermelho #F71B2C e cinza #7C7A7A vêm de site de terceiros, não do manual oficial.

## v13 — Correção visual verificada em renderização 3D real
Desta vez a maquete foi aberta em Chromium (Playwright, WebGL via SwiftShader) com o Three.js r128 local (`vendor/three.min.js`, interceptando a requisição do CDN) e inspecionada por capturas de tela (`screenshots/`).

**Defeitos encontrados na renderização real e corrigidos**
- Pisos, calçadas e pátios estourados em branco (superexposição: hemisfério .62 + sol .78 + preenchimento .2). Agora .5 / .6 / .14.
- Sombras pontilhadas (shadow acne, PCF com radius alto). Agora PCFSoftShadowMap, `bias -.0006`, `normalBias .04`.
- Rótulos sobrepostos na área de coleta (ÁREA DE COLETA × lixeiras). Rótulos das lixeiras alinhados e menores; rótulo da área elevado.
- Setas, textos SAÍDA/ENTRADA e faixas amarelas picotados no cruzamento da avenida com as vias do pátio: `polygonOffset` nas marcações, faixas da avenida levemente elevadas e plano próximo da câmera 0,1 → 0,5 (mais precisão de profundidade).
- Código residual da coleta independente removido: `startCol`, `colPanel`, `OPE`, `opStage`, `opBox`, handlers `colgo`/`colrst` e ramos `mode==='col'` (confirmado que só eram chamados por eles mesmos).

**Testes**: `tests/` (Node, mock) — 76 verificações + z-fighting (0). Teste real no navegador: `tests/browser/` (shots.js, sim.js).
**Limitação**: SwiftShader é lento; as capturas foram feitas em renderização por software, não em GPU. Não testado em dispositivos móveis.

## v14 — Correção de sobreposições (verificada em renderização real)
Novas auditorias: `tests/audit_dyn.js` (personagens e caminhão × sólidos estáticos em TODA a simulação) e `tests/audit2all.js` (inclui peças do mesmo grupo). Capturas antes/depois em `screenshots/sobreposicoes/`.

| Objeto | Sobreposto com | Causa | Correção | Verificação |
|---|---|---|---|---|
| Rodas/carrocerias dos caminhões T2–T3–T4 | umas com as outras | espaçamento 1,3 menor que largura de eixo + rodas (≥1,5) | espaçamento 1,55 (x 13,55/15,1/16,65), pátio alargado (7,8), faixas e placas T1–T4 realinhadas | auditoria 0 pares; captura real |
| Caminhão de coleta (retorno à base) | roda do caminhão T2 | frente do caminhão varria a curva de raio 0,8 | raio da rota 1,2 + T2 afastado | auditoria 0 pares |
| Operador que patrulha o pátio | cabines/chassis dos caminhões | trajeto em z=2 dentro da frente dos caminhões (z≥2,25) | trajeto em z=1,75 | auditoria 0 pares |
| Pés dos personagens ao entrar/sair dos prédios | laje do piso (0,1 acima do terreno) | altura mudava de forma abrupta na borda | rampa suave `flY()` de 0,3 na borda | auditoria 0 pares |
| Personagens sentados | encosto da cadeira (0,04–0,06) | encosto colado na borda do assento | assento mais fundo e encosto recuado 0,11 | penetração caiu para ≤0,02 em pose fixa; permanece só ao levantar da própria cadeira |
| Rótulo "DESTINAÇÃO ADEQUADA" | caminhão T4 | rótulo sobre o veículo | rótulo sobre o marcador no chão | captura real |
| Placa SUPERMERCADO | toldo da entrada | base da placa a 0,02 do topo do toldo | placa 0,08 mais alta | captura real |

Permanece: contato transitório (≤0,06) do personagem com a própria cadeira ao se levantar; frisos/rodapés que envolvem paredes (intencionais).

## v15 — Cruzamento avenida × vias do pátio (vista de cima, renderização real)
| Objeto | Problema | Causa | Correção |
|---|---|---|---|
| Marcadores "T" brancos na avenida (x≈12 e 22) | sobrepostos às setas reais | restos de setas antigas feitas com caixas, duplicando as setas atuais | removidos |
| Faixas amarelas da avenida | atravessavam o cruzamento | laço não pulava a largura das vias laterais | faixas omitidas entre x 9,1 e 12,2 |
| Duas vias de 1,2 separadas por "ilha" de 0,5 | cruzamento com aspecto desalinhado; faixa de retenção cruzava a ilha | duas caixas de asfalto independentes | via única de 2,9 com tracejado central; rota do caminhão (x 11,5 e 9,8) inalterada |
| Vias coplanares (mesma altura) | emenda fina visível | topo das vias = topo da avenida | vias do pátio 0,016/0,018 abaixo do topo da avenida |
Captura: `screenshots/sobreposicoes/cruzamento_topo.png`.

## v16 — 4 melhorias integradas

**Painel por setor.** Clicar no prédio (Diretoria, Administrativo, Logística e Operações, JSL ODS) abre um único painel com nome, descrição, as 4 responsabilidades, o que recebe/entrega, personagens e atividades; o setor fica destacado e a câmera segue livre. Botão "Fechar" ou clicar em outro setor.

**Indicadores (faixa compacta sobre a maquete, botão "Indicadores" recolhe).** 4 caminhões de coleta, 2 veículos de apoio, resíduos (valor **ilustrativo**, máx. 1,40 t na simulação — não é dado real da JSL), etapas concluídas n/5, situação (Aguardando / Em andamento / Pausada / Finalizada), setor responsável e etapa da triagem. Atualizam sozinhos.

**Modo apresentação** (botão em APRESENTAÇÃO; nunca inicia sozinho). 6 etapas: visão geral → Diretoria → Administrativo → Logística (caminhão sai, coleta, volta e a triagem aparece em close) → JSL ODS → integração final. Anterior / Pausar / Próxima / Encerrar; Esc encerra. Ao encerrar, a câmera volta ao usuário. É um modo separado: iniciar a simulação encerra a apresentação.

**Triagem.** Recebimento, esteira com 5 itens que seguem para contêineres identificados (Papel, Plástico, Metal, Vidro, Rejeitos — cada cor só recebe o seu material), armazenamento temporário (fardos) e encaminhamento ao anel "Destinação adequada"; operador separando e conferente com prancheta. Resíduos perigosos (óleo, químicos, inflamáveis) **não são representados**; o painel da Logística informa isso.

### Testes (v16)
- Node (`tests/*.js`): test 40, extra 12, cam 19, motion 5, features 35 (setores, indicadores, triagem, apresentação), z-fighting 0; auditoria dinâmica só com os 2 contatos conhecidos de cadeira.
- Navegador real (Chromium + SwiftShader, `tests/browser/`): cliques nos setores, HUD em linha única, triagem em 5 instantes, apresentação etapas 1–4 em tempo real com pausa/próxima/anterior/encerrar e arrastar a câmera depois; etapas 5–6 por salto direto; celular 390 px (corrigido nesta versão: área 3D tinha ficado muito baixa).
- Capturas em `screenshots/v16/`.

### Limitações
- Desempenho: o navegador do teste renderiza por software (~2 fps), então **FPS real não foi medido**; só movimento suave de câmera por lógica. Teste em seu navegador.
- Apresentação completa em tempo real passou só até a etapa 4 no navegador real (render lento); 5–6 foram vistas por salto direto.
- Tablet 768 px: sem rolagem horizontal, mas sem captura revisada.

## v17 — Correção de sobreposições (ruas, paredes e estruturas)
Sem funcionalidades novas. Inspeção real (Chromium, 15 vistas + 14 close-ups + 6 cantos de parede) e sondagem por raio (`tests/browser/probe.js`) para achar o objeto exato sob cada pixel suspeito.

| Problema | Causa identificada | Correção realizada | Resultado |
|---|---|---|---|
| Tracejado amarelo da avenida atravessando as faixas de pedestres | O laço do tracejado só pulava o cruzamento da via leste, não a faixa de pedestres (x −4,4…1,0) | Tracejado pula x −4,75…1,35 | Verificado em captura: faixas limpas |
| Linhas/emendas finas e degraus ao longo da via do supermercado | Camada duplicada de asfalto: lajotas da rota do caminhão (h 0,13, mais altas que o asfalto, 1,4 de largura, passando 0,1 para fora da via) + dois "remendos" de via (h 0,018) sobre a via (h 0,016) | Via única contínua (z 5,2→19,9, h 0,02 igual ao resto); lajotas da rota com h 0,12 e largura 1,2 (alinhadas às bordas da via) | Verificado: emendas somem; linhas de retenção amarelas, antes escondidas, aparecem |
| Via do supermercado terminava na calçada sem ligar ao estacionamento (z 17 vs 19,9; vão x 12,1–12,8) | Comprimento/posição incompatíveis | Via prolongada até o fim do estacionamento e estacionamento estendido até x 12,1 | Verificado: via e estacionamento contínuos; rota do caminhão testada |
| Degrau/entalhe entre a via e o pátio dos caminhões (x 9,2–10,1) | Pátio começava em x 10,1, via em 9,2 | Pátio de 8,7 de largura a partir de x 9,2 | Verificado |
| Pilares da fachada sobrepostos aos pilares de canto e 5 cm para fora da parede | Laço gerava pilares em i=0 e i=4, nos mesmos pontos dos cantos | Pilares só em i=1..3 | Auditoria de sobreposição: casos somem |

**Não alterado (conferido):** cantos de parede dos 4 prédios (esquadro e faixas bem encontrados), encontro avenida × via (v15), silo, galpão, supermercado. As sobreposições restantes na auditoria são faixas/rodapés propositalmente 2 cm maiores que a parede (acabamento).
**Observação:** o rótulo "DOCA 02" fica parcialmente atrás da plataforma "Carga e descarga" em vistas frontais (oclusão, sem interseção; não movi a plataforma).

Testes v17: test 40, extra 12, cam 19, motion 5, features 35 — todos passando; z-fighting 0; simulação em navegador real até a fase 5 (coleta) sem erro, rota do caminhão sobre a via; capturas em `screenshots/v17/` (antes/depois). Contatos residuais: 6 casos de 2 cm entre personagem sentado e perna de cadeira.

## v18 — Câmera automática da simulação e tempos de 8 s
**Tempos (mínimos):** etapas 1, 2 e 3 = 8 s (antes 5 s); etapa 4 = trajeto + coleta + retorno + triagem concluída **+ 8 s na triagem** (antes cortava a triagem 1,5 s depois da chegada; total ≈ 44 s); etapa 5 = 8 s no JSL ODS + 4 s de visão geral (12 s). A parada no supermercado antes do carregamento passou de 1,4 s para 2,6 s (a fase fica legível). Constantes: `STEP_MIN`, `TRI_HOLD`, `END_OV` em `stepUpdate`.

**Câmera (coordenadas reais dos prédios, `FC` / `flowFrame` / `flowCamUpdate`):** Iniciar ativa a câmera automática e sai da visão geral.
1. Município + JSL ODS (r 17,5) → 2. Diretoria (r 15) → 3. Administrativo (r 15,5) → 4. Logística: base (r 21), segue o caminhão pela estrada (r 21), aproxima no supermercado (r 15), segue o retorno (r 21) e, ao chegar, enquadra a triagem (r 11) por 8 s após concluída → 5. JSL ODS (r 15) e, após 8 s, visão geral da integração (r 46).
Pausar congela o enquadramento; Continuar retoma; Reiniciar volta à visão geral e à etapa 1. Mexer na câmera (arrastar, roda, teclado) desliga a automática e ela não disputa; o botão "Câmera automática" reativa. O zoom se ajusta à proporção da tela. Durante a simulação a dica de controles some para não cobrir a cena.

**Testes:** node `camsim.js` (21: enquadramento por etapa, caminhão nunca a >7 u da câmera, distância 15–21, triagem 8,03 s, sem saltos, pausa, manual, reativar, fluxo passo a passo) + test 40, extra 12, cam 21, motion 5, features 35, z-fighting 0. Navegador real: simulação completa (11 enquadramentos, sem erro de console) e enquadramentos nas telas 390×800, 768×1024, 1366×768 (sem rolagem horizontal). Limites: render por software (FPS real não medido); em 1920×1080 não revisei captura.

## v19 — Paredes dos 4 prédios: quinas sem sobreposição
Auditoria nova `tests/walls.js` (faces coplanares de mesma orientação, interseções parciais entre paredes/pilares/peitoris/rodapés/batentes, contato entre prédios). Ignora só faces ocultas, ou seja, encostadas em outra peça opaca ou embutidas nela. `node tests/run_all.js` roda todos os testes Node.

| Problema (em `building()`) | Correção |
|---|---|
| Parede do fundo e parede lateral ocupavam o mesmo canto fundo-esquerdo (faces externas e topo duplicados) | O fundo é dono do canto; a lateral vai de z −1,9 a 1,9 |
| Pilares de canto exatamente no mesmo volume das pontas das paredes (fundo-direito) e da lateral (frente-esquerdo), com cores diferentes: **z-fighting** | Parede do fundo termina na face do pilar; lateral termina na face do pilar frontal |
| Peitoril direito, peitoris frontais e vidros entravam nos pilares, com faces no mesmo plano | Terminam nas faces dos pilares (vidro lateral D−0,4) |
| Topo da faixa superior (y 2,10) no mesmo plano do topo das paredes e dos pilares: **z-fighting** visto de cima | Faixa com 0,20 de altura (topo 2,12); as faixas do fundo e da lateral não se cruzam mais |
| Viga frontal e viga direita: pontas e topo coplanares com os pilares, e as duas se cruzavam na quina | Vigas entre os pilares, com a mesma espessura da parede (0,2) |
| Frisos vermelhos com pontas coplanares com os pilares e cruzando-se na quina | Friso frontal W+0,04; friso lateral termina nele |
| Rodapés do fundo e da lateral sobrepostos no canto | Rodapé lateral começa onde o do fundo termina |
| Montantes dos vãos com topo no mesmo plano do friso vermelho | Altura 1,34 (encostam por baixo do friso) |
| Caixilho das janelas: travessas e montantes com quinas sobrepostas; vidro com topo/base no plano do caixilho | Montantes inteiros, travessas e vidro entre eles; janelas do fundo em x ±2,2 (antes entravam no pilar) e topo em 1,9 (antes entravam na faixa) |
| Marquise: topo coplanar com o friso; no Administrativo, a lateral coincidia com a face da faixa (x −3,1); postes paravam 0,2 abaixo da marquise | Marquise 1,96; friso 0,12 de altura; postes em ±0,92 com altura até a marquise |
| Verga da porta com faces frente/trás no plano do friso | Profundidade 0,28 |

Portas, vãos, posições dos prédios, rotas dos personagens e rotas do caminhão não mudaram.
