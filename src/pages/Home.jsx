import { useState } from "react";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import { Search, SortAsc, CalendarDays, LogOut } from "lucide-react";

function Home({
  tasks,
  onTaskClick,
  onDeleteTaskClick,
  onAddTaskSubmit,
  onToggleTask,
  user,
  handleLogout,
}) {
  // Estado para o termo de busca digitado
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para controlar ordenação (alfabético ou data)
  const [sortBy, setSortBy] = useState("date");

  // Filtragem e ordenação
  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "abc") {
        // de A-Z
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "date") {
        // por data (tarefas sem data vão para o fim da lista)
        const dateA = a.deadline
          ? new Date(a.deadline)
          : new Date(8640000000000000);
        const dateB = b.deadline
          ? new Date(b.deadline)
          : new Date(8640000000000000);
        return dateA - dateB;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex justify-center p-4">
      <div className="w-full max-w-xl space-y-10">
        {/* Header */}
        <header className="flex justify-between items-start pt-8">
          <div>
            <h1 className="text-5xl font-black text-violet-500 tracking-tighter">
              Focus.
            </h1>
            <p className="text-slate-400 mt-3 text-lg font-medium">
              Sua produtividade em alto nível
            </p>
            <div className="mt-2">
              <p className="text-slate-400 text-xl font-extralight tracking-tight">
                Olá,{" "}
                <span className="text-white font-normal">
                  {user?.nome || "Usuário"}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-slate-800/50 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all border border-white/5 shadow-lg"
            title="Sair do App"
          >
            <LogOut size={24} />
          </button>
        </header>

        {/* Formulário */}
        <section className="bg-slate-800/30 p-2 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-sm">
          <AddTask onAddTaskSubmit={onAddTaskSubmit} />
        </section>

        <div className="space-y-6">
          {/* Busca */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-3.5 text-slate-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Alternador de Ordenação */}
            <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setSortBy("abc")}
                className={`p-2.5 rounded-xl transition-all ${
                  sortBy === "abc"
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Ordenar por A-Z"
              >
                <SortAsc size={20} />
              </button>
              <button
                onClick={() => setSortBy("date")}
                className={`p-2.5 rounded-xl transition-all ${
                  sortBy === "date"
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                title="Ordenar por Data"
              >
                <CalendarDays size={20} />
              </button>
            </div>
          </div>

          {/* Exibe os resultados filtrados */}
          <TaskList
            tasks={filteredTasks}
            onTaskClick={onTaskClick}
            onDeleteTaskClick={onDeleteTaskClick}
            onToggleTask={onToggleTask}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
