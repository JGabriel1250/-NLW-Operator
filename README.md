# 🎬 ClipMaker

> Transforme vídeos longos em **momentos virais** com o poder da Inteligência Artificial.

---

## 📌 Sobre o Projeto

O **ClipMaker** é uma aplicação web desenvolvida durante o evento gratuito de 3 dias da **Rocketseat** — trilha iniciante — com foco em integração de IA em projetos reais.

A proposta é simples e poderosa: você faz o upload de um vídeo, a IA analisa o conteúdo e entrega automaticamente o trecho mais viral, pronto para ser publicado nas redes sociais.

---

## 🚀 Como Funciona

O fluxo da aplicação é dividido em 3 etapas principais:

**1. Upload do vídeo**
O usuário faz o upload do vídeo diretamente pela interface, utilizando o widget da **Cloudinary**. O arquivo é armazenado na nuvem e a URL gerada é usada nas próximas etapas.

**2. Transcrição com IA**
O vídeo enviado é encaminhado para a API do **Gemini (Google)**, que transcreve todo o áudio em texto corrido, mantendo a ordem cronológica do conteúdo.

**3. Identificação do momento viral**
A transcrição é analisada novamente pelo Gemini, que atua como um editor de vídeo profissional especializado em conteúdo viral. Ele identifica o trecho mais engajante (entre 30 e 60 segundos) e retorna os parâmetros de tempo exatos.

Com esses parâmetros, a aplicação monta a URL final da Cloudinary com o recorte preciso do vídeo e exibe o clipe diretamente no player da página.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| **HTML5 + CSS3** | Estrutura e estilização da interface |
| **JavaScript (Vanilla)** | Lógica da aplicação e integração com APIs |
| **Tailwind CSS** | Utilitários de estilo e responsividade |
| **GSAP** | Animações de entrada fluidas |
| **Lucide Icons** | Ícones da interface |
| **Cloudinary** | Upload, armazenamento e recorte de vídeos |
| **Gemini API (Google)** | Transcrição e análise de conteúdo com IA |

---

## 📁 Estrutura de Arquivos

```
clipmaker/
├── index.html        # Estrutura principal da página
├── css/
│   └── style.css     # Estilos customizados (glassmorphism, animações)
└── js/
    └── script.js     # Lógica da aplicação e integração com APIs
```

---

## ⚙️ Configuração e Uso

### Pré-requisitos

- Uma conta gratuita na [Cloudinary](https://cloudinary.com/)
- Uma chave de API do [Google Gemini](https://aistudio.google.com/)

### Configurando a Cloudinary

No arquivo `js/script.js`, localize o objeto `config` e substitua pelos seus dados:

```javascript
const config = {
    cloudName:    'seu-cloud-name',
    uploadPreset: 'seu-upload-preset'
}
```

> Para criar um **Upload Preset**, acesse o painel da Cloudinary → Settings → Upload → Add upload preset. Defina o modo como **Unsigned**.

### Usando a aplicação

1. Abra o `index.html` no navegador
2. Cole sua **Gemini API Key** no campo indicado
3. Clique em **"Fazer Upload do Vídeo"**
4. Aguarde o processamento — a IA irá transcrever e encontrar o melhor momento
5. O clipe viral aparecerá automaticamente no player

---

## 💡 Funcionalidades

- 🎯 **Detecção automática de momentos virais** com IA generativa
- ☁️ **Upload na nuvem** com o widget oficial da Cloudinary
- ✂️ **Recorte automático do vídeo** via parâmetros de URL da Cloudinary
- 🔄 **Retry automático** (3 tentativas) em caso de falha na chamada da IA
- 💎 **Interface moderna** com glassmorphism, gradientes e animações suaves
- 📱 **Layout responsivo** adaptado para diferentes tamanhos de tela

---

## 🎓 Contexto do Projeto

Este projeto foi desenvolvido no evento **NLW (Next Level Week)** da Rocketseat — edição gratuita de 3 dias, voltada para a trilha iniciante. O objetivo central do evento foi mostrar na prática como integrar Inteligência Artificial em aplicações web reais, mesmo para quem está começando na programação.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais durante o evento da Rocketseat. Sinta-se livre para estudar, modificar e evoluir o código.
