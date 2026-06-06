# SmartBib - Mobile (Expo/React Native)

Aplicativo mobile para reservas de salas da biblioteca SENAC.

## Pré-requisitos

- **Node.js** 18+
- **npm** 9+
- **Expo CLI** (`npm install -g expo-cli`)
- **Emulador Android** (Android Studio) ou dispositivo físico com Expo Go

## Instalação

```bash
cd smartbib
npm install
```

## Configuração

Copie o arquivo de exemplo e ajuste a URL da API:

```bash
cp .env.example .env
```

Variável `EXPO_PUBLIC_API_URL`:

| Ambiente | Valor |
|----------|-------|
| Emulador Android | `http://10.0.2.2:3000/api` |
| Emulador iOS | `http://localhost:3000/api` |
| Dispositivo físico | `http://<IP-da-máquina>:3000/api` |

## Rodando

### Desenvolvimento

```bash
npm start
```

Isso abre o Expo Dev Tools. Escolha uma opção:

- Pressione `a` — abrir no emulador Android
- Pressione `i` — abrir no emulador iOS
- Escaneie o QR code — abrir no dispositivo físico com Expo Go

### Web (para debug no navegador)

```bash
npm run web
```

## Telas

| Rota | Descrição |
|------|-----------|
| `/` | Login |
| `/cadastro` | Registro de usuário |
| `/salas` | Listagem de salas |
| `/reservar/[id]` | Reservar horário em uma sala |
| `/reservas` | Gerenciar reservas (confirmar, liberar) |

## Backend

O app requer o backend rodando. Consulte `../backend/README.md` para instruções.