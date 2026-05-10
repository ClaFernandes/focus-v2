import { useState, useRef, useEffect } from "react";
import { Plus, Calendar, Tag, ChevronDown, AlertCircle } from "lucide-react";

function AddTask({ onAddTaskSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);

  const categories = [
    { label: "Trabalho", color: "bg-blue-500" },
    { label: "Estudo", color: "bg-amber-500" },
    { label: "Pessoal", color: "bg-fuchsia-500" },
    { label: "Saúde", color: "bg-teal-500" },
    { label: "Finanças", color: "bg-lime-600" },
    { label: "Lazer", color: "bg-emerald-500" },
    { label: "Urgente", color: "bg-rose-500" },
  ];

  // Fecha o menu de categorias se clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Faz a mensagem de erro sumir após 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  function handleAddTask() {
    // Validação antes de enviar para o Firebase
    if (!title.trim() || !category) {
      setError("Título e categoria são obrigatórios!");
      return;
    }

    const selectedCategory = categories.find((c) => c.label === category);
    const categoryColor = selectedCategory
      ? selectedCategory.color
      : "bg-slate-500";

    // dados da nova tarefa que serão enviados para o App.jsx
    onAddTaskSubmit(title, description, category, categoryColor, deadline);

    // Limpa os campos para a próxima tarefa
    setTitle("");
    setDescription("");
    setDeadline("");
    setCategory("");
    setIsOpen(false);
    setError("");
  }

  const inputClass =
    "bg-slate-900/40 border border-slate-700/50 text-white placeholder:text-slate-600 px-4 py-3.5 rounded-2xl w-full focus:outline-none focus:border-violet-500 transition-all font-light";

  return (
    <div className="p-6 space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`${inputClass} flex items-center justify-between text-left`}
          >
            <div className="flex items-center gap-3">
              <Tag className="text-violet-500/70" size={18} />
              <span className={!category ? "text-slate-500" : "text-white"}>
                {category || "Escolha uma categoria"}
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => {
                    setCategory(cat.label);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-slate-300 hover:bg-violet-600 hover:text-white transition-colors flex items-center gap-3 font-light"
                >
                  <div className={`w-4 h-4 rounded-full ${cat.color}`} />
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Calendar
            className="absolute left-4 top-4 text-violet-500/70 pointer-events-none"
            size={18}
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={`${inputClass} pl-11 cursor-pointer [color-scheme:dark]`}
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="O que precisa ser feito?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={inputClass}
      />
      <textarea
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={`${inputClass} resize-none h-20`}
      />

      <button
        onClick={handleAddTask}
        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-violet-600/20"
      >
        <Plus size={20} />
        <span>Adicionar Tarefa</span>
      </button>
    </div>
  );
}

export default AddTask;
