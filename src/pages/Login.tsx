import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

type Mode = "login" | "register" | "forgot";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      setSent(true);
      return;
    }
    // placeholder — подключение к бэкенду будет добавлено позже
  };

  return (
    <div className="min-h-screen bg-iip-dark flex flex-col relative overflow-hidden">
      {/* Фоновые геометрические элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-iip-pink/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-iip-violet/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-iip-mint/5 rounded-full blur-3xl" />
        <div className="absolute top-24 right-24 w-20 h-20 border-2 border-iip-yellow/20 rotate-45 animate-spin-slow" />
        <div className="absolute bottom-32 left-16 w-12 h-12 border-2 border-iip-pink/30 rotate-12" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Шапка */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <button
          onClick={() => navigate("/")}
          className="font-display font-black text-xl text-white tracking-tight"
        >
          IIP<span className="text-iip-pink">.</span>
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-body transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          На главную
        </button>
      </header>

      {/* Основной блок */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Карточка */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 animate-fade-in">
            {/* Заголовок */}
            <div className="mb-8">
              {mode === "login" && (
                <>
                  <h1 className="font-display font-black text-3xl text-white mb-2">
                    ВОЙТИ
                  </h1>
                  <p className="text-white/50 font-body text-sm">
                    Добро пожаловать обратно
                  </p>
                </>
              )}
              {mode === "register" && (
                <>
                  <h1 className="font-display font-black text-3xl text-white mb-2">
                    РЕГИСТРАЦИЯ
                  </h1>
                  <p className="text-white/50 font-body text-sm">
                    Создайте аккаунт, чтобы делать заказы
                  </p>
                </>
              )}
              {mode === "forgot" && (
                <>
                  <h1 className="font-display font-black text-3xl text-white mb-2">
                    ВОССТАНОВЛЕНИЕ
                  </h1>
                  <p className="text-white/50 font-body text-sm">
                    Отправим ссылку на вашу почту
                  </p>
                </>
              )}
            </div>

            {/* Форма */}
            {mode === "forgot" && sent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-iip-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MailCheck" size={28} className="text-iip-mint" />
                </div>
                <p className="text-white font-display font-bold text-lg mb-2">
                  Письмо отправлено!
                </p>
                <p className="text-white/50 font-body text-sm mb-6">
                  Проверьте почту {email} и перейдите по ссылке
                </p>
                <button
                  onClick={() => { setMode("login"); setSent(false); }}
                  className="text-iip-pink font-body text-sm hover:underline"
                >
                  Вернуться ко входу
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className="text-white/60 text-xs font-body mb-1.5 block">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Анна"
                      required
                      className="w-full bg-white/8 border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-iip-pink transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="text-white/60 text-xs font-body mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anna@mail.ru"
                    required
                    className="w-full bg-white/[0.08] border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-iip-pink transition-colors"
                  />
                </div>

                {mode !== "forgot" && (
                  <div>
                    <label className="text-white/60 text-xs font-body mb-1.5 block">
                      Пароль
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-white/[0.08] border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-3 pr-11 font-body text-sm focus:outline-none focus:border-iip-pink transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                      >
                        <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-white/40 hover:text-iip-pink text-xs font-body transition-colors"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-iip-pink hover:bg-iip-pink/90 text-white py-4 rounded-xl font-display font-bold text-sm transition-all hover:shadow-lg hover:shadow-iip-pink/25 mt-2"
                >
                  {mode === "login" && "Войти в аккаунт"}
                  {mode === "register" && "Создать аккаунт"}
                  {mode === "forgot" && "Отправить ссылку"}
                </button>

                {/* Разделитель */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-xs font-body">или</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Переключение режима */}
                {mode === "login" ? (
                  <p className="text-center text-white/40 font-body text-sm">
                    Нет аккаунта?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-iip-pink hover:underline font-medium"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                ) : mode === "register" ? (
                  <p className="text-center text-white/40 font-body text-sm">
                    Уже есть аккаунт?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-iip-pink hover:underline font-medium"
                    >
                      Войти
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-white/40 font-body text-sm">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-iip-pink hover:underline font-medium"
                    >
                      Вернуться ко входу
                    </button>
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Преимущества аккаунта */}
          {mode !== "forgot" && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: "Package", label: "История заказов" },
                { icon: "Heart", label: "Список желаний" },
                { icon: "Percent", label: "Скидки и бонусы" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 border border-white/8 rounded-2xl p-3 text-center"
                >
                  <Icon name={item.icon} size={18} className="text-iip-yellow mx-auto mb-1.5" />
                  <p className="text-white/40 font-body text-xs leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
