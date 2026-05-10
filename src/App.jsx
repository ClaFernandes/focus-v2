import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { db } from "./firestore";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp, // grava o horário oficial do servidor do Google
} from "firebase/firestore";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import TaskPage from "./pages/TaskPage";

function App() {
  const isGithubPages = window.location.hostname.includes("github.io");
  const baseName = isGithubPages ? "/focus-v2" : "";

  // Estado do usuário - preenchido pelo Auth.jsx
  const [user, setUser] = useState(null);

  // As tarefas começam como um array vazio. O Firebase vai preencher.
  const [tasks, setTasks] = useState([]);

  // substitui a lógica de ler/salvar no LocalStorage.
  useEffect(() => {
    // Se não houver usuário logado, limpas as tarefas e conecta
    if (!user) {
      setTasks([]);
      return;
    }

    // apenas as tarefas onde o userEmail é igual ao email do usuário atual
    const q = query(
      collection(db, "focus_tasks"),
      where("userEmail", "==", user.email),
    );

    // onSnapshot executa sempre que o banco mudar
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setTasks(tasksData); // atualiza o estado do React

      console.log(
        "%c Focus: Banco sincronizado! ",
        "background: #8b5cf6; color: #fff; border-radius: 5px;",
      );
    });

    return () => unsubscribe();
  }, [user]);

  // Adiciona tarefa ao Firebase (chamado pelo AddTask.jsx)
  async function addTask(title, description, category, color, deadline) {
    if (!user) return;

    try {
      await addDoc(collection(db, "focus_tasks"), {
        title,
        description,
        category,
        color,
        deadline: deadline || null,
        userEmail: user.email,
        completed: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    }
  }

  // Atualiza tarefas
  async function updateTask(updatedTask) {
    try {
      // referência ao documento específico pelo ID
      const taskDoc = doc(db, "focus_tasks", updatedTask.id);
      // altera apenas os campos enviados
      await updateDoc(taskDoc, updatedTask);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  }

  // Deletar tarefa
  async function deleteTask(id) {
    try {
      const taskDoc = doc(db, "focus_tasks", id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  // Alternar status
  async function toggleTask(id) {
    // Localiza a tarefa para saber o status atual
    const taskToToggle = tasks.find((t) => t.id === id);
    if (!taskToToggle) return;

    try {
      const taskDoc = doc(db, "focus_tasks", id);
      await updateDoc(taskDoc, {
        completed: !taskToToggle.completed,
      });
    } catch (error) {
      console.error("Erro ao mudar status:", error);
    }
  }

  return (
    <BrowserRouter basename={baseName}>
      <Routes>
        {/* Rota de Auth: setUser para logar o usuário */}
        <Route
          path="/login"
          element={
            !user ? <Auth setUser={setUser} /> : <Navigate replace to="/" />
          }
        />

        <Route
          path="/"
          element={
            user ? (
              <Home
                user={user}
                tasks={tasks}
                onAddTaskSubmit={addTask}
                onDeleteTaskClick={deleteTask}
                onToggleTask={toggleTask}
                handleLogout={() => setUser(null)}
              />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />

        <Route
          path="/task/:id"
          element={
            user ? (
              <TaskPage
                tasks={tasks}
                onUpdateTask={updateTask}
                onDeleteTaskClick={deleteTask}
              />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
