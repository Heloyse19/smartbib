# SmartBib - Mobile (Expo / React Native)

Aplicativo mobile para reserva e gerenciamento de salas de estudo da biblioteca SENAC. Permite que alunos reservem salas, confirmem presenca e gerenciem historico de reservas.

## Tech Stack

- **React Native** (Expo SDK 54)
- **Expo Router** (file-based routing)
- **NativeWind** (Tailwind CSS para React Native)
- **TypeScript**

## Pre-requisitos

- **Node.js** 18+
- **npm** 9+
- **Expo Go** no dispositivo fisico ou emulador Android/iOS

## Instalacao

```bash
cd smartbib
npm install
```

## Configuracao

Copie o arquivo de exemplo e ajuste a URL da API:

```bash
cp .env.example .env
```

Variavel `EXPO_PUBLIC_API_URL`:

| Ambiente | Valor |
|---|---|
| Emulador Android | `http://10.0.2.2:3000/api` |
| Emulador iOS | `http://localhost:3000/api` |
| Dispositivo fisico | `http://<IP-da-maquina>:3000/api` |
| Producao (AWS EC2) | `http://34.237.145.36/api` |

## Rodando

### Desenvolvimento

```bash
npm start
```

Isso abre o Expo Dev Tools. Escolha uma opcao:

- Pressione `a` -- abrir no emulador Android
- Pressione `i` -- abrir no emulador iOS
- Escaneie o QR code -- abrir no dispositivo fisico com Expo Go

### Web (para debug no navegador)

```bash
npm run web
```

## Telas

| Rota | Descricao |
|---|---|
| `/` | Login |
| `/cadastro` | Registro de usuario (email, matricula, senha) |
| `/salas` | Listagem de salas com busca e status em tempo real (livre/reservada/ocupada) |
| `/reservar/[id]` | Reservar horario em uma sala (slots de 08:00 as 22:00) |
| `/reservas` | Gerenciar reservas com abas Ativas e Historico |

## Funcionalidades

- **Autenticacao** -- Login e registro com JWT (token armazenado em contexto React)
- **Listagem de salas** -- Busca por nome, pull-to-refresh, indicador visual de status
- **Reserva de horario** -- Slots de 1 hora, validacao de conflitos, exibicao da data em portugues
- **Confirmacao de presenca** -- Ocupar sala (apenas durante o horario reservado)
- **Cancelamento** -- Liberar reserva ativa
- **Historico** -- Excluir reservas individualmente ou limpar todo o historico

### Ciclo de Vida da Reserva

```
pendente --> [scheduler envia comando MQTT no horario] --> reservada
                                                              |
                                             (aluno confirma presenca)
                                                              |
                                                              v
                                                         confirmada
                                                              |
                                             (aluno libera ou fim do horario)
                                                              |
                                                              v
                                                         cancelada
```

## Backend

O app requer o **backend-smartbib** rodando. Consulte `../backend-smartbib/README.md` para instrucoes.

## Build (EAS)

```bash
eas build --platform android
eas build --platform ios
```
