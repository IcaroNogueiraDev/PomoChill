# PomoChill

Aplicação de timer Pomodoro com interface responsiva, alternância entre temas e um player de música preparado para receber sua lógica de áudio.

O projeto está dividido em um frontend React e uma API Node.js responsável pelo catálogo de faixas.

## Status

Em desenvolvimento.

O timer e sua interface principal já estão implementados. O player de música ainda é uma interface visual e não possui reprodução, navegação ou integração com a API.

## Funcionalidades

- Timer nos modos foco, pausa curta e pausa longa.
- Iniciar, pausar e reiniciar o timer.
- Ajuste manual de minutos.
- Contagem de sessões concluídas.
- Progresso visual do timer em um círculo SVG.
- Tema claro e escuro com preferência salva no `localStorage`.
- Layout responsivo para desktop, tablet e mobile.
- Player visual inspirado no player da tela bloqueada do iOS.
- API para listar e cadastrar faixas musicais.

## Tecnologias

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui
- Base UI
- Lucide React
- Inter Variable

### Backend

- Node.js
- Express 5
- TypeScript
- Supabase
- CORS
- dotenv

## Estrutura

```text
pomodoro-timer/
├── frontend/
│   ├── src/
│   │   ├── components/ui/       # Componentes reutilizáveis da interface
│   │   ├── pages/timer/         # Página e componentes do timer
│   │   ├── lib/                 # Utilitários
│   │   ├── index.css            # Tokens de tema e estilos globais
│   │   └── main.tsx             # Entrada da aplicação React
│   └── package.json
├── backend-api/
│   ├── src/
│   │   ├── config/              # Configuração do Supabase
│   │   ├── controllers/         # Regras dos endpoints
│   │   ├── routes/              # Rotas HTTP
│   │   ├── utils/               # Respostas padronizadas
│   │   └── server.ts            # Entrada da API
│   └── package.json
└── README.md
```

## Pré-requisitos

- Node.js 20 ou superior.
- npm.
- Projeto do Supabase com uma tabela `tracks`.

## Instalação

Instale as dependências de cada aplicação separadamente:

```bash
cd frontend
npm install

cd ../backend-api
npm install
```

## Variáveis de ambiente

Crie o arquivo `backend-api/.env`:

```env
PORT=3003
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-do-supabase
```

O arquivo `.env` não deve ser commitado. Ele já está listado no `.gitignore` do backend.

## Executando localmente

Abra dois terminais.

### Frontend

```bash
cd frontend
npm run dev
```

O Vite disponibiliza a aplicação no endereço exibido no terminal, normalmente `http://localhost:5173`.

### Backend

```bash
cd backend-api
npm run dev
```

A API inicia, por padrão, em `http://localhost:3003`.

## API de faixas

Todas as rotas da API usam o prefixo `/api`.

### Listar faixas

```http
GET /api/tracks
```

Exemplo:

```bash
curl http://localhost:3003/api/tracks
```

### Criar faixa

```http
POST /api/tracks
Content-Type: application/json
```

Corpo esperado:

```json
{
  "name": "Lofi Focus Beats",
  "artist": "Aesthetic Soundscape",
  "url": "https://exemplo.com/faixa.mp3"
}
```

As operações de atualização e exclusão ainda não estão implementadas.

## Banco de dados

O backend consulta e insere dados na tabela `tracks` do Supabase.

Os campos usados pela API são:

| Campo da API | Campo armazenado |
| --- | --- |
| `name` | `track_name` |
| `artist` | `track_artist` |
| `url` | `track_url` |

## Scripts

### Frontend

```bash
npm run dev      # inicia o Vite em modo de desenvolvimento
npm run lint     # executa o Oxlint
npm run build    # verifica o TypeScript e gera o build do Vite
npm run preview  # serve o build localmente
```

### Backend

```bash
npm run dev      # inicia a API com hot reload
npm run build    # compila o backend TypeScript
npm start        # inicia a versão compilada, quando dist/index.js existir
```

## Validação atual

No frontend, a verificação direta de tipos pode ser executada com:

```bash
npx tsc --noEmit --ignoreDeprecations 6.0 -p tsconfig.app.json
```

O projeto usa TypeScript 6 no frontend, e o `tsconfig.app.json` ainda possui a opção `baseUrl`. Com a versão atual do TypeScript, o comando `npm run build` pode falhar com `TS5101` por causa dessa opção depreciada. A verificação equivalente pode ser executada com `--ignoreDeprecations 6.0` até a configuração de aliases ser migrada para o formato recomendado.

Também é possível validar somente o bundle do Vite:

```bash
npx vite build
```

No backend, o script `start` espera `dist/index.js`, mas as opções `rootDir` e `outDir` ainda estão comentadas no `backend-api/tsconfig.json`. A configuração de saída precisa ser ajustada antes de usar esse script em produção.

## Próximos passos

- Conectar o `MusicPlayer` à API de faixas.
- Adicionar reprodução usando o elemento `audio`.
- Implementar play/pause, faixa anterior e próxima faixa.
- Sincronizar o slider com o progresso real da música.
- Adicionar notificações ou sons ao finalizar uma sessão.
- Implementar testes para o ciclo do timer e os endpoints da API.
