# 🎬 VideoDrop — Baixe seus próprios vídeos

**VideoDrop** é uma solução web full-stack, moderna, rápida e responsiva para análise e salvamento de conteúdos próprios ou autorizados do **YouTube** e **Instagram**.

---

## 🚀 Funcionalidades

- **Interface SaaS Minimalista & Premium**: Visual escuro moderno (glassmorphism), animações sutis e experiência fluida.
- **Detecção Automática de Plataformas**: Reconhece links de vídeo do YouTube, YouTube Shorts, Instagram Reels e Instagram Video Posts.
- **Visualização de Metadados**: Exibe thumbnail em alta definição, título, canal/autor, duração formatada e lista real de qualidades disponíveis (1080p, 720p, 480p, 360p).
- **Opções de Download**: Suporte para download de vídeo em MP4 ou extração direta de áudio em MP3.
- **Histórico Local no Navegador**: Salva os links processados recentemente no `LocalStorage` do navegador sem coletar dados no servidor. Botão de limpeza com um clique.
- **Segurança Reforçada**:
  - Proteção estrita contra SSRF (bloqueio de IPs locais `127.0.0.1`, subredes privadas `10.x.x.x`, `192.168.x.x`, `172.16-31.x.x`, IPv6 locais e domínios não permitidos).
  - Sanitização rigorosa de entradas de texto.
  - Rate limiting configurável por IP via variáveis de ambiente.
  - Sem execução direta de comandos shell de string montada do usuário.
- **Conformidade Legal**: Páginas integradas de **Termos de Uso** (`/terms`), **Política de Privacidade** (`/privacy`) e **Direitos Autorais** (`/copyright`), reforçando o uso exclusivo para conteúdos próprios ou autorizados.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **React Router DOM**

### **Backend**
- **Node.js** + **Express**
- **TypeScript** (`tsx` em desenvolvimento / `tsc` para build)
- **@distube/ytdl-core** (extração e streaming seguro de mídias do YouTube)
- **Helmet**, **CORS**, **Express Rate Limit**, **Zod**, **IP / Validator**

---

## 📁 Estrutura do Projeto

```text
youtube/
├── package.json               # Gerenciador de scripts e desenvolvimento concorrente
├── .env.example               # Modelo de variáveis de ambiente
├── README.md                  # Documentação completa e guia de deploy VPS
│
├── backend/                   # API Express + Node.js + TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts          # Ponto de entrada do servidor HTTP
│       ├── app.ts             # Configuração do Express, Helmet e CORS
│       ├── config/            # Leitura centralizada de variáveis (.env)
│       ├── controllers/       # Controladores de rotas (/api/info, /api/download)
│       ├── middleware/        # SSRF Guard, Rate Limiter, Erros, Concorrência
│       ├── routes/            # Definição das rotas da API
│       ├── services/          # Serviços do YouTube e Instagram
│       └── utils/             # Parser e validador de URLs
│
└── frontend/                  # Aplicação React + Vite + Tailwind CSS
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.tsx            # Roteamento principal
        ├── main.tsx           # Renderização da aplicação
        ├── components/        # Header, Footer, UrlInput, VideoCard, History, Steps
        ├── pages/             # Home, Terms, Privacy, Copyright
        ├── services/          # Integração API (/api/info, /api/download)
        ├── hooks/             # Hook de histórico no LocalStorage
        ├── types/             # Interfaces TypeScript
        └── utils/             # Formatadores e utilitários
```

---

## ⚡ Como Executar em Desenvolvimento

### 1. Clonar e Instalar as Dependências

Execute no terminal raiz do projeto:

```bash
npm run install:all
```

Isso instalará automaticamente as dependências da raiz, do `backend` e do `frontend`.

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Conteúdo padrão do `.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
MAX_VIDEO_DURATION=1800
MAX_CONCURRENT_DOWNLOADS=3
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10
```

### 3. Iniciar o Servidor de Desenvolvimento

Execute no terminal raiz:

```bash
npm run dev
```

O comando iniciará concorrentemente:
- **Backend API**: `http://localhost:3001`
- **Frontend App**: `http://localhost:5173`

---

## 🏗️ Gerar Build de Produção

Para testar o build compilado de produção localmente:

```bash
npm run build
```

O build gerará:
- Arquivos estáticos otimizados do React em `frontend/dist`
- Código TypeScript transpilado do backend em `backend/dist`

---

## 🌐 Guia de Deploy em VPS Ubuntu (Nginx + PM2 + Node.js)

Siga este guia passo a passo para implantar o **VideoDrop** em um servidor Ubuntu (ex: AWS, DigitalOcean, Hetzner, Linode).

### 1. Atualizar o Servidor e Instalar Node.js 20

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
```

### 2. Instalar o PM2 Globalmente

```bash
sudo npm install -g pm2
```

### 3. Clonar o Repositório e Compilar o Projeto

```bash
cd /var/www
sudo git clone https://github.com/seu-usuario/videodrop.git
cd videodrop
sudo chown -R $USER:$USER /var/www/videodrop

# Instalar dependências e realizar o build
npm run install:all
npm run build
```

### 4. Configurar o `.env` de Produção

Crie o arquivo `/var/www/videodrop/.env`:

```env
PORT=3001
FRONTEND_URL=https://seu-dominio.com
MAX_VIDEO_DURATION=1800
MAX_CONCURRENT_DOWNLOADS=3
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10
```

### 5. Iniciar a API Backend com PM2

No diretório `/var/www/videodrop`:

```bash
pm2 start backend/dist/server.js --name "videodrop-api"
pm2 save
pm2 startup
```

### 6. Configurar o Nginx

Crie a configuração do site no Nginx:

```bash
sudo nano /etc/nginx/sites-available/videodrop
```

Adicione o seguinte conteúdo (substituindo `seu-dominio.com` pelo seu domínio real):

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Frontend - Arquivos estáticos do Vite
    location / {
        root /var/www/videodrop/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Reverse Proxy
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Aumentar timeouts para downloads
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

Ative o site e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/videodrop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Ativar SSL Gratuito com Certbot (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Pronto! Seu **VideoDrop** estará online com HTTPS ativado e pronto para uso.

---

## 🔒 Aviso de Direitos Autorais

Use esta ferramenta somente para conteúdo que você possui, conteúdo em domínio público ou conteúdo para o qual tenha permissão expressa do proprietário. O usuário é o único responsável por respeitar direitos autorais e os termos das plataformas de mídia de origem.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença [MIT](LICENSE).
