import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import {
  ChevronLeftIcon,
  Save,
  Edit3,
  Trash2,
  Calendar,
  AlignLeft,
  ChevronDown,
  AlertTriangle,
  Trash,
} from "lucide-react";

function TaskPage({ onUpdateTask, onDeleteTaskClick }) {
  const { id } = useParams(); // pega o ID da tarefa que está na URL
  const navigate = useNavigate();

  //Estados para controlar a tarefa, carregamento, modo de edição, rascunho da edição, dropdown de categorias e confirmação de exclusão
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const categories = [
    { label: "Trabalho", color: "bg-blue-500" },
    { label: "Estudo", color: "bg-amber-500" },
    { label: "Pessoal", color: "bg-fuchsia-500" },
    { label: "Saúde", color: "bg-teal-500" },
    { label: "Finanças", color: "bg-lime-600" },
    { label: "Lazer", color: "bg-emerald-500" },
    { label: "Urgente", color: "bg-rose-500" },
  ];

  // Busca tarefa no Firebase
  useEffect(() => {
    async function fetchTask() {
      try {
        // Cria uma referência ao documento específico na coleção 'focus_tasks'
        const docRef = doc(db, "focus_tasks", id);

        // Pede ao Firebase para buscar esse documento
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Se o documento existe, guardamos os dados nos estados
          const data = { id: docSnap.id, ...docSnap.data() };
          setTask(data);
          setEditedTask(data); // Preenchemos o rascunho de edição com os dados originais
        } else {
          console.log("Tarefa não encontrada no banco!");
        }
      } catch (error) {
        console.error("Erro ao procurar tarefa:", error);
      } finally {
        // Para de mostrar o carregamento, independente de ter encontrado ou não
        setLoading(false);
      }
    }

    fetchTask();
  }, [id]); //  roda sempre que o ID na URL mudar

  // Carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  // Se não estiver a carregar e a tarefa for nula, o ID é inválido
  if (!task) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-bold mb-4">Tarefa não encontrada</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-violet-600 px-6 py-2 rounded-xl"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  const inputBaseClass =
    "w-full bg-slate-900/50 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-3 outline-none text-white transition-all";

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex justify-center p-4 md:p-10 font-sans">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/")}
            className="p-3 rounded-2xl bg-slate-800/50 border border-white/5 hover:bg-slate-700 transition-colors"
          >
            <ChevronLeftIcon size={24} />
          </button>

          <h1 className="text-3xl md:text-5xl font-black text-white">
            Detalhes
          </h1>

          <div className="flex gap-2">
            {/* Guardar / Editar */}
            <button
              onClick={() => {
                if (isEditing) {
                  // Chama a função do App.jsx que faz o updateDoc no Firebase
                  onUpdateTask(editedTask);
                  setTask(editedTask);
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
              className={`p-3 rounded-2xl border transition-all ${isEditing ? "bg-green-500/20 border-green-500/50 text-green-500" : "bg-slate-800/50 border-white/5 text-slate-400"}`}
            >
              {isEditing ? <Save size={22} /> : <Edit3 size={22} />}
            </button>

            {/* Eliminar */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-3 rounded-2xl bg-slate-800/50 border border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="bg-slate-800/30 p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 backdrop-blur-sm">
          {/* Título */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-violet-400 uppercase tracking-widest">
              Título da Tarefa
            </label>
            {isEditing ? (
              <input
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className={`${inputBaseClass} text-xl font-bold`}
              />
            ) : (
              <h2 className="text-3xl font-black text-white leading-tight">
                {task.title}
              </h2>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft size={14} /> Descrição
            </label>
            {isEditing ? (
              <textarea
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                className={`${inputBaseClass} h-32 resize-none`}
              />
            ) : (
              <p className="text-slate-400 text-lg leading-relaxed">
                {task.description || "Sem descrição adicional."}
              </p>
            )}
          </div>

          {/* Categoria e Prazo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">
                Categoria
              </label>
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className={`${inputBaseClass} flex justify-between items-center`}
                  >
                    <span className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full ${editedTask.color}`}
                      />
                      {editedTask.category}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${isSelectOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isSelectOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                      {categories.map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => {
                            setEditedTask({
                              ...editedTask,
                              category: cat.label,
                              color: cat.color,
                            });
                            setIsSelectOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-violet-600/30 flex items-center gap-2 transition-colors"
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${cat.color}`}
                          />
                          <span className="text-sm font-medium">
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${task.color}`} />
                  <span className="font-bold text-white">{task.category}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">
                Data Limite
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.deadline}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, deadline: e.target.value })
                  }
                  className={`${inputBaseClass} [color-scheme:dark]`}
                />
              ) : (
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Calendar size={18} className="text-violet-500" />
                  <span className="font-bold text-white">
                    {task.deadline || "Sem data"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl shadow-rose-900/20 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-rose-500" size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Apagar Tarefa?</h3>
              <p className="text-slate-400 font-light">
                Esta ação é irreversível na nuvem.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-4 rounded-2xl bg-slate-800 text-slate-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteTaskClick(task.id); // remove do Firestore via App.jsx
                  navigate("/"); // volta para Home
                }}
                className="flex-1 px-6 py-4 rounded-2xl bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
              >
                <Trash size={18} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskPage;
