import { useState, useEffect } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { db, app } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function Auth({ setUser }) {
  // Inicializa autenticação
  const auth = getAuth(app);

  // Estados: controlo de interface e formulário
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Limpa as mensagens de erro/sucesso após 3 segundos
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Valida se a senha cumpre os requisitos
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<> ]/.test(password);
    const minLength = password.length >= 6;
    return hasUpperCase && hasLowerCase && hasSpecialChar && minLength;
  };

  // Login com Google usando popup
  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Guarda ou atualiza os dados do utilizador no Firestore
      await setDoc(
        doc(db, "users", user.email.toLowerCase()),
        {
          nome: user.displayName,
          email: user.email.toLowerCase(),
        },
        { merge: true },
      );

      setUser({
        nome: user.displayName,
        email: user.email,
      });
    } catch (error) {
      console.error("Erro no Google Login:", error);
      setMessage({ text: "Falha ao entrar com Google.", type: "error" });
    }
  }

  // Submit do formulário para login ou registo
  async function handleSubmit(e) {
    e.preventDefault();

    // Registo
    if (!isLogin) {
      if (!validatePassword(formData.password)) {
        setMessage({
          text: "Senha fraca! Use 6+ caracteres, maiúsculas e símbolos.",
          type: "error",
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ text: "As senhas não coincidem!", type: "error" });
        return;
      }

      try {
        // Cria o utilizador no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        const user = userCredential.user;

        // Atualiza o nome no perfil e guarda no Firestore
        await updateProfile(user, { displayName: formData.nome });
        await setDoc(doc(db, "users", user.email.toLowerCase()), {
          nome: formData.nome,
          email: user.email.toLowerCase(),
        });

        setMessage({
          text: "Conta criada! Já podes fazer login.",
          type: "success",
        });
        setIsLogin(true);
      } catch (error) {
        console.error("Erro no Registo:", error.code);
        if (error.code === "auth/email-already-in-use") {
          setMessage({ text: "Este e-mail já está registado.", type: "error" });
        } else {
          setMessage({ text: "Erro ao criar conta.", type: "error" });
        }
      }
      return;
    }

    // Login
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      // Busca o nome personalizado no Firestore
      const userDoc = await getDoc(doc(db, "users", user.email.toLowerCase()));
      const nomeFinal = userDoc.exists()
        ? userDoc.data().nome
        : user.displayName;

      setUser({
        nome: nomeFinal || "Utilizador",
        email: user.email,
      });
    } catch (error) {
      console.error("Erro no Login:", error.message);
      setMessage({
        text: "E-mail ou palavra-passe incorretos.",
        type: "error",
      });
    }
  }

  // Estilo padrão dos inputs
  const inputClass =
    "bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-500 px-4 py-3 pl-11 pr-11 rounded-2xl w-full focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-violet-500 tracking-tighter">
          Focus<span>.</span>
        </h1>
        <p className="text-slate-400 mt-3 text-lg font-medium">
          Privado. Seguro. Organizado.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/40 p-8 md:p-10 rounded-[2.5rem] w-full max-w-md space-y-6 border border-violet-500/20 shadow-2xl shadow-violet-900/30 backdrop-blur-sm relative overflow-hidden"
      >
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? "Bem-vindo de volta" : "Criar nova conta"}
          </h2>
          <div className="h-1.5 w-10 bg-violet-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Alertas */}
        {message.text && (
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 border ${
              message.type === "error"
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle2 size={20} />
            )}
            <p className="text-sm font-medium leading-tight">{message.text}</p>
          </div>
        )}

        {/* Campos formulário */}
        <div className="space-y-4">
          {!isLogin && (
            <div className="relative animate-in fade-in zoom-in duration-300">
              <User
                className="absolute left-4 top-3.5 text-violet-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Como te devemos chamar?"
                className={inputClass}
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail
              className="absolute left-4 top-3.5 text-violet-500"
              size={20}
            />
            <input
              type="email"
              placeholder="email@email.com"
              className={inputClass}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-3.5 text-violet-500"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Palavra-passe"
              className={inputClass}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-500 hover:text-violet-400 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative animate-in slide-in-from-top-2 duration-300">
              <Lock
                className="absolute left-4 top-3.5 text-violet-500"
                size={20}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma tua palavra-passe"
                className={inputClass}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-violet-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}
        </div>

        {/* Botões */}
        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-violet-700/40 text-lg mt-2"
        >
          {isLogin ? "Entrar no Focus" : "Finalizar Registo"}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-3"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt="Google"
          />
          {isLogin ? "Entrar com Google" : "Registar com Google"}
        </button>

        {/* Alternar entre login e registo */}
        <div className="pt-4 border-t border-slate-700/50 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({
                ...formData,
                nome: "",
                password: "",
                confirmPassword: "",
              });
              setShowPassword(false);
              setShowConfirmPassword(false);
              setMessage({ text: "", type: "" });
            }}
            className="text-sm text-slate-400 hover:text-violet-400 transition-colors"
          >
            {isLogin ? (
              <>
                Ainda não tens conta?{" "}
                <span className="font-bold underline decoration-violet-500/50 underline-offset-4">
                  Regista-te aqui
                </span>
              </>
            ) : (
              <>
                Já fazes parte da equipa?{" "}
                <span className="font-bold underline decoration-violet-500/50 underline-offset-4">
                  Login
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;
