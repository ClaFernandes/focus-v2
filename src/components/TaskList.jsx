import { useState } from "react";
import {
  Check,
  ChevronRight,
  Trash2,
  Calendar,
  AlertTriangle,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function TaskList({ tasks, onDeleteTaskClick, onToggleTask }) {
  const navigate = useNavigate();

  // Estado para controlar qual tarefa o utilizador quer apagar (abre o modal)
  const [taskToDelete, setTaskToDelete] = useState(null);

  return (
    <ul className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500 font-medium italic">
            Nenhuma tarefa encontrada.
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          // key usa o ID real gerado pelo Firebase
          <li
            key={task.id}
            className="group flex items-center gap-4 bg-slate-800/40 p-4 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all hover:shadow-lg hover:shadow-violet-900/10 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {/* Check */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // impede que o clique abra a página de detalhes
                onToggleTask(task.id);
              }}
              className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                task.completed
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-slate-600 hover:border-violet-500"
              }`}
            >
              {task.completed && <Check size={16} strokeWidth={3} />}
            </button>

            {/* Conteúdo da tarefa */}
            <div
              className="flex-1 cursor-pointer min-w-0"
              onClick={() => navigate(`/task/${task.id}`)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-4 h-4 rounded-full ${task.color || "bg-violet-500"}`}
                />
                <h3
                  className={`font-bold truncate transition-all ${task.completed ? "text-slate-500 line-through" : "text-white"}`}
                >
                  {task.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "Sem data"}
                </span>
                <span className="bg-slate-700/50 px-2 py-0.5 rounded-md text-slate-400">
                  {task.category || "Geral"}
                </span>
              </div>
            </div>

            {/* Lixeira e Detalhes */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTaskToDelete(task); // Define a tarefa que será apagada para mostrar o modal
                }}
                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>

              <button
                onClick={() => navigate(`/task/${task.id}`)}
                className="p-2.5 rounded-xl bg-slate-700/50 text-slate-400 hover:text-white transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </li>
        ))
      )}

      {/* Modal de confirmação: aparece apenas quando taskToDelete não é nulo */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl shadow-rose-900/20 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-rose-500" size={40} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Excluir tarefa?</h3>
              <p className="text-slate-400 font-light leading-relaxed">
                A tarefa{" "}
                <span className="text-rose-400 font-medium">
                  {taskToDelete.title}
                </span>{" "}
                será removida permanentemente da nuvem.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="flex-1 px-6 py-4 rounded-2xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  onDeleteTaskClick(taskToDelete.id); // função no App.jsx chama o deleteDoc do Firebase
                  setTaskToDelete(null); // fecha o modal
                }}
                className="flex-1 px-6 py-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
              >
                <Trash size={18} />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </ul>
  );
}

export default TaskList;
