# 🎯 Focus. - Gerenciador de Tarefas (Cloud Edition)

O **Focus.** é uma aplicação web de produtividade desenvolvida com **React** e **Tailwind CSS**. Esta versão marca a transição definitiva para a nuvem, substituindo o armazenamento local por uma infraestrutura escalável e segura com Firebase, além de introduzir funcionalidades essenciais que não existiam na versão anterior:

## 🚀 Funcionalidades Principais

- **Persistência na Nuvem**: Tarefas armazenadas no Google Firestore, acessíveis de qualquer lugar.
- **Autenticação Híbrida**: Login via e-mail/senha ou Google Login.
- **Gestão avançada**: Organização por categorias, prazos (deadlines) e edição em tempo real.
- **Filtros Inteligentes**: Busca dinâmica por título e ordenação por data ou ordem alfabética.
- **UX/UI Moderna**: Interface totalmente responsiva e minimalista com Lucide React.

## 🪄 Novidades

- **Firebase Auth**: Login seguro e persistente.
- **Real-time Database**: Banco de dados NoSQL em tempo real.
- **Google Auth**: Acesso rápido com sua conta Google.
- **Segurança**: Proteção de dados a nível de banco — cada usuário só acessa seus próprios documentos.

## 🛠️ Tecnologias

- **Frontend**: React.js, Tailwind CSS, React Router Dom.
- **Backend/BaaS**: Firebase (Auth & Firestore).
- **Ícones**: Lucide React.

## 🗂️ Estrutura de Pastas

```text
src/
├── components/ # Componentes reutilizáveis (AddTask, TaskList)
├── pages/ # Páginas da aplicação (Auth, Home, TaskPage)
├── App.jsx # Componente principal com a lógica de estado e rotas
└── main.jsx # Ponto de entrada da aplicação
```

## 👩‍💻 Autora

Projeto desenvolvido por **Clarice Fernandes**

GitHub: https://github.com/ClaFernandes
