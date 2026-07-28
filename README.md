# 🛡️ Sistema de Controle de Retirada de EPI - Front-end


Este repositório contém a aplicação **Front-end** do sistema de **Controle de Retirada de Equipamentos de Proteção Individual (EPI)** desenvolvido para a **CPFL Energia**. O projeto digitaliza o processo de requisição, controle de saldo de estoque no almoxarifado operacional e coleta de assinatura digital do colaborador.


[![Acessar o Aplicativo](https://img.shields.io/badge/ACESSAR_O_APLICATIVO-007acc?style=for-the-badge)](https://matheuscsampaio.github.io/Site-de-Confirma-o-de-EPI/client/)
[![Repositório Back-end](https://img.shields.io/badge/Reposit%C3%B3rio--back--end-28a745?style=for-the-badge&)](https://github.com/FelipeCorreia-TI/API-Site-de-Confirma-o-de-EPI.git)

---

## 👨‍💻 Desenvolvedores

* **Matheus Cavalcante Sampaio** - [@MatheusCSampaio](https://github.com/MatheusCSampaio)
* **Felipe Correia** - [@FelipeCorreia-TI](https://github.com/FelipeCorreia-TI)

---

## 🚀 Tecnologias Utilizadas

A aplicação foi desenvolvida com foco em leveza, responsividade e usabilidade direta em dispositivos móveis e desktops no ambiente de almoxarifado:

- **HTML5**: Estruturação semântica, formulários de requisição e elemento `<canvas>` para captura de assinatura touchscreen/mouse.
- **CSS3**: Estilização moderna e responsiva (`css/estilo.css`), padronizada com a identidade visual da CPFL Energia.
- **JavaScript (ES6+)**: Consumo assíncrono de APIs REST via `fetch`, manipulação dinâmica do DOM, gestão do carrinho de EPIs e controle do Canvas.
- **PWA (Progressive Web App)**: Configuração via `manifest.json` permitindo a instalação do sistema como aplicativo web nativo em dispositivos móveis.

---

## 📦 Funcionalidades do Front-end

1. **Identificação e Validação do Colaborador**
   - Preenchimento obrigatório do nome completo do funcionário.
   - Seleção da Base Operacional (ex: *Base Piracicaba, LT Piracicaba, ST Piracicaba, etc.*).

2. **Seleção de EPIs com Estoque Dinâmico**
   - Carregamento em tempo real do catálogo e saldo disponível via integração com a API backend (`/estoque`).
   - Campo de busca instantânea para filtragem rápida de equipamentos.
   - Adição de itens ao carrinho com validação automática da quantidade máxima disponível em estoque.

3. **Gerenciamento do Carrinho**
   - Visualização interativa dos itens selecionados com ajuste dinâmico de quantidade e remoção.

4. **Coleta de Assinatura Digital**
   - Painel interativo (`<canvas>`) para assinatura do funcionário no ato da retirada.
   - Conversão e otimização automática da assinatura para imagem no formato Base64.
   - Recursos para limpar e refazer a assinatura na tela.

5. **Envio e Feedback ao Usuário**
   - Bloqueio temporário do botão de envio durante a requisição para evitar duplicidade de chamadas.
   - Tratamento de respostas do servidor e exibição de alertas.
   - Atualização automática do estoque na tela imediatamente após a confirmação da retirada.

---

## 📁 Estrutura de Pastas e Arquivos

```text
.
├── index.html              # Interface principal da aplicação
├── css/
│   └── estilo.css          # Estilização visual e regras de responsividade
├── js/
│   └── logica.js           # Lógica do carrinho, Canvas e comunicação com a API REST
├── assets/
│   └── logos/
│       └── Logo_CPFL_Energia.png  # Identidade visual da CPFL
├── cpl_icon.ico            # Favicon da aplicação
└── manifest.json           # Configuração PWA para instalação no dispositivo
```

---

## ⚙️ Integração com a API Backend

A comunicação com o servidor backend é configurada no arquivo `js/logica.js`:

```javascript
// URL base da API REST (Ambiente de Produção / Render)
const API_URL = "https://api-site-de-confirma-o-de-epi.onrender.com";
```

### Endpoints Consumidos:

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/estoque` | Retorna a lista atualizada de EPIs e saldos disponíveis. |
| `POST` | `/entrega` | Envia os dados do colaborador, lista de EPIs retirados e assinatura em Base64. |

---

## 🛠️ Como Executar Localmente

Como se trata de uma aplicação web estática, não é necessária a instalação de dependências de build:

1. Clone o repositório:
   ```bash
   git clone https://github.com/MatheusCSampaio/Site-de-Confirma-o-de-EPI.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd Site-de-Confirma-o-de-EPI

   ```
3. Abra o arquivo `index.html` em qualquer navegador web ou utilize a extensão **Live Server** no VS Code.

---

## 📜 Licença

Projeto desenvolvido para automação do controle de estoque e entrega de EPIs na **CPFL Energia**.