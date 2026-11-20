# Maquete Virtual 3D Interativa — Integração de Setores e Logística Reversa JSL

**Agenda 2030 & ODS** · projeto acadêmico em Three.js

🔗 **Demonstração ao vivo:** <https://adrianos4ntos.github.io/JSL-Maquete/>

Maquete 3D que roda no navegador e mostra como quatro setores de uma operação de logística reversa se integram para atender a uma solicitação municipal de coleta e destinação de resíduos. Os setores são Diretoria / Investidores, Administrativo, Logística e Operações e JSL ODS (Organização e Desenvolvimento Sustentável).

> **Aviso:** demonstração conceitual para fins acadêmicos. O "JSL ODS" é uma proposta de unidade de negócio, não uma divisão oficial da JSL. Pesos, frota e tempos da simulação são ilustrativos. Só os índices de reciclagem do painel final usam dados reais, com as fontes indicadas.

## Funcionalidades

- **Simulação em 5 etapas:** solicitação municipal → Diretoria → Administrativo → Logística e Operações → JSL ODS.
  - Controles de Iniciar, Pausar, Continuar, Reiniciar e de fluxo passo a passo.
  - Os personagens circulam entre os prédios levando documentos, e linhas animadas ligam os setores envolvidos em cada etapa.
- **Circuito viário de coleta:** o caminhão sai da base, percorre a avenida e contorna o supermercado num circuito de mão única. Ele coleta os resíduos por categoria, volta ao pátio e leva a carga à triagem.
  - A triagem tem esteira, contêineres por material e fardos.
  - As subfases são saída, percurso, chegada, coleta, retorno e triagem.
- **Câmera livre:**
  - **Mouse e toque:** arrastar gira a cena; botão direito, Shift + arrastar ou dois dedos movem a vista; a roda do mouse ou o gesto de pinça dão zoom.
  - **Teclado:** W A S D move, Q E gira, + − dá zoom, R reinicia a vista e F segue o caminhão.
  - **Atalhos de enquadramento:** cada setor, vista de cima e câmera automática que acompanha a simulação.
- **Modo apresentação:** um tour guiado pelos setores, com câmera conduzida e textos explicativos.
- **Narrador ao vivo no celular:** em retrato ou paisagem, o cabeçalho vira um narrador da etapa em andamento, e o layout se reorganiza para telas pequenas.
- **Painel de indicadores reais:** ao final da simulação aparecem os índices de reciclagem e destinação no Brasil, com as fontes oficiais.
  - **Materiais:** papel e papelão, plásticos, metais, vidro, orgânicos, óleo usado e resíduos perigosos (Classe I).
  - **Fontes:** ABREMA (2025), IBÁ, Recicla Latas, PICPlast, Abividro, ANP, Sabesp e IBAMA/SINIR.
- **Painéis por setor:** objetivos, funções, responsabilidades, entradas e saídas de cada setor, e uma visão da integração entre eles.

## Estrutura do projeto

```text
.
├── index.html               # redireciona a raiz do GitHub Pages para a maquete
├── README.md
└── JSL-Maquete/
    ├── index.html           # a maquete inteira (HTML + CSS + JS em um arquivo)
    ├── vendor/
    │   └── three.min.js     # Three.js r128 local (usado pelos testes de navegador, offline)
    └── tests/
        ├── run_all.js       # executa a suíte e resume PASS/FAIL
        ├── mock.js          # mock mínimo de THREE + DOM para rodar a lógica sem WebGL
        ├── test.js          # simulação completa: controles, sequência, tempos e coleta
        ├── extra.js         # personagens em cada etapa e estado após o fim
        ├── cam.js           # câmera livre (mouse, toque e teclado)
        ├── camsim.js        # câmera automática da simulação
        ├── motion.js        # suavidade do caminhão e distância entre personagens
        ├── features.js      # painéis por setor, HUD, modo apresentação e triagem
        ├── narrator.js      # narrador ao vivo no layout mobile
        ├── zf.js            # z-fighting em decalques coplanares
        ├── walls.js         # faces coplanares nas paredes dos 4 prédios
        ├── coplanar.js      # faces coplanares em X, Y e Z nos 4 setores
        ├── audit.js, audit2.js, audit_dyn.js   # auditorias geométricas (manuais)
        └── browser/         # scripts Playwright opcionais (capturas e layout mobile)
```

### Organização de `JSL-Maquete/index.html`

O arquivo é dividido em seções numeradas por comentários de banner:

| Seção | Conteúdo |
| --- | --- |
| CSS A · B | tema e layout desktop; layout responsivo para celular e tablet |
| JS 1 | configuração e dados: textos dos setores (`SECT`), etapas (`STEPS`), integração (`INTEG`), aviso legal (`LEGAL`), cores (`K`), rota (`ROUTE`) e índices reais (`RECICLAGEM_BR`) |
| JS 2–3 | renderizador, luzes, helpers de geometria, prédios e ambientes internos |
| JS 4 | frota, rotas, pátio operacional, triagem e circuito do supermercado |
| JS 5 | personagens e roteiros de movimento |
| JS 6 | cenário urbano: avenida, galpão, supermercado e sinalização |
| JS 7–8 | câmera orbital, estado da simulação e painel lateral (incluindo o painel final) |
| JS 9 | HUD, layout mobile, modo apresentação e narrador |
| JS 10–11 | interação, loop de animação e a API de testes `window.__jsl` |

> A API `window.__jsl` e os IDs do DOM (`#view`, `#cv`, `#panel`, `#hud`, `#pres`) são usados pela suíte de testes. Não os renomeie.

## Como executar localmente

A maquete é um único arquivo estático, sem build. O Three.js é carregado do cdnjs, então é preciso ter internet.

```bash
git clone https://github.com/AdrianoS4ntos/JSL-Maquete.git
cd JSL-Maquete
```

Abra `JSL-Maquete/index.html` direto no navegador ou sirva a pasta com um servidor estático:

```bash
npx serve .          # depois acesse http://localhost:3000/
# ou
python -m http.server 8000
```

## Testes automatizados

A suíte roda em Node.js, versão 18 ou mais recente, e não instala dependências. Ela executa a lógica real da maquete sobre um mock de Three.js e do DOM.

```bash
node JSL-Maquete/tests/run_all.js
```

Saída esperada: todos os arquivos com `exit=0` e `FAIL=0`, incluindo `test` com 40/40 e as três auditorias de z-fighting (`zf`, `walls` e `coplanar`) com 0 ocorrências.

As auditorias geométricas ficam fora da suíte principal e servem para inspeção manual:

```bash
node JSL-Maquete/tests/audit2.js [--all]       # objetos fora do terreno, enterrados, flutuando ou sobrepostos
node JSL-Maquete/tests/audit_dyn.js [--strict] # personagens e caminhão contra sólidos durante toda a simulação
node JSL-Maquete/tests/coplanar.js --dup --sum # faces coplanares, incluindo duplicadas da mesma cor
```

Os scripts em `tests/browser/` abrem a maquete em Chromium real. Eles dependem do Playwright, que se instala com `npm i -D playwright` seguido de `npx playwright install chromium`, e servem para capturas de tela e para verificar o layout mobile:

```bash
node JSL-Maquete/tests/browser/narr_mob.js
```

## Tecnologias

- [Three.js r128](https://threejs.org/) para a renderização 3D (WebGL)
- HTML, CSS e JavaScript puros, sem framework e sem etapa de build
- Node.js para a suíte de testes e Playwright para os testes opcionais de navegador
- GitHub Pages para a hospedagem
