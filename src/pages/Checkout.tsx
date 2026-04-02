import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { CartItem } from "./Index";

const API = "https://functions.poehali.dev/b597fd9a-ad15-471a-9c9a-23f9039e704f";
type ApiProduct = { id: number; name: string; priceNum: number; color: string; weight: string };


type DeliveryType = "cdek" | "post" | "courier" | "pickup";
type PaymentType = "card" | "sbp" | "cash";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartFromState: CartItem[] = location.state?.cart ?? [];

  const [cart] = useState<CartItem[]>(cartFromState);
  const [delivery, setDelivery] = useState<DeliveryType>("cdek");
  const [payment, setPayment] = useState<PaymentType>("card");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "", address: "", comment: "",
  });

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    fetch(`${API}?route=products`).then(r => r.json()).then(setApiProducts);
  }, []);

  const getProduct = (id: number) => apiProducts.find(p => p.id === id);

  const cartTotal = cart.reduce((s, i) => {
    const p = getProduct(i.id);
    return s + (p ? p.priceNum * i.qty : 0);
  }, 0);

  const deliveryCost = cartTotal >= 3000
    ? 0
    : delivery === "courier" ? 450
    : delivery === "cdek" ? 350
    : delivery === "post" ? 250
    : 0;

  const total = cartTotal + deliveryCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await fetch(`${API}?route=orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.name,
        phone: form.phone,
        email: form.email,
        city: form.city,
        address: form.address,
        delivery,
        payment,
        comment: form.comment,
        items: cart,
        total,
      }),
    });
    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-iip-dark flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-iip-mint/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-iip-violet/20 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-md animate-fade-in">
          <div className="w-24 h-24 bg-iip-mint/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-5xl">
            🎉
          </div>
          <h1 className="font-display font-black text-3xl text-white mb-3">
            ЗАКАЗ ПРИНЯТ!
          </h1>
          <p className="text-white/60 font-body mb-2">
            Спасибо, <span className="text-white font-medium">{form.name}</span>!
          </p>
          <p className="text-white/50 font-body text-sm mb-8 leading-relaxed">
            Мы отправим подтверждение на {form.email || form.phone}.<br />
            Свяжемся с вами в течение 30 минут.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-2">
            <div className="flex justify-between text-sm font-body">
              <span className="text-white/50">Сумма товаров</span>
              <span className="text-white">{cartTotal.toLocaleString("ru-RU")} ₽</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-white/50">Доставка</span>
              <span className="text-white">{deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} ₽`}</span>
            </div>
            <div className="h-px bg-white/10 my-1" />
            <div className="flex justify-between font-display font-black">
              <span className="text-white">Итого</span>
              <span className="text-iip-yellow">{total.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-iip-pink hover:bg-iip-pink/90 text-white px-8 py-4 rounded-full font-display font-bold text-sm transition-all hover:scale-105"
          >
            Вернуться в магазин
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-iip-cream font-body">
      {/* Шапка */}
      <header className="bg-iip-dark border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="font-display font-black text-xl text-white">
            IIP<span className="text-iip-pink">.</span>
          </button>
          <h1 className="font-display font-bold text-white text-sm tracking-widest uppercase">
            Оформление заказа
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-body transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Левая колонка — форма */}
          <div className="lg:col-span-2 space-y-6">

            {/* Контактные данные */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="font-display font-bold text-iip-dark mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-iip-pink text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                Контактные данные
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1.5 block">Имя *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="Анна Иванова"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1.5 block">Телефон *</label>
                  <input
                    required
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="+7 (999) 999-99-99"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground font-body mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="anna@mail.ru"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Доставка */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="font-display font-bold text-iip-dark mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-iip-pink text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
                Способ доставки
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {([
                  { id: "cdek", icon: "Truck", label: "СДЭК", desc: "2–7 дней", cost: cartTotal >= 3000 ? "Бесплатно" : "350 ₽" },
                  { id: "post", icon: "Package", label: "Почта России", desc: "3–14 дней", cost: cartTotal >= 3000 ? "Бесплатно" : "250 ₽" },
                  { id: "courier", icon: "Zap", label: "Курьер", desc: "1–2 дня, Москва", cost: cartTotal >= 3000 ? "Бесплатно" : "450 ₽" },
                  { id: "pickup", icon: "MapPin", label: "Самовывоз", desc: "Садовая, 12", cost: "Бесплатно" },
                ] as const).map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDelivery(opt.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      delivery === opt.id
                        ? "border-iip-pink bg-iip-pink/5"
                        : "border-border hover:border-iip-pink/40"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${delivery === opt.id ? "bg-iip-pink text-white" : "bg-iip-cream text-iip-pink"}`}>
                      <Icon name={opt.icon} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-sm text-iip-dark">{opt.label}</div>
                      <div className="text-muted-foreground text-xs font-body">{opt.desc}</div>
                    </div>
                    <div className={`font-display font-black text-sm flex-shrink-0 ${delivery === opt.id ? "text-iip-pink" : "text-muted-foreground"}`}>
                      {opt.cost}
                    </div>
                  </button>
                ))}
              </div>

              {delivery !== "pickup" && (
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1.5 block">Город *</label>
                    <input
                      required
                      value={form.city}
                      onChange={e => set("city", e.target.value)}
                      placeholder="Москва"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1.5 block">Адрес / Пункт выдачи *</label>
                    <input
                      required
                      value={form.address}
                      onChange={e => set("address", e.target.value)}
                      placeholder="ул. Пушкина, д. 1, кв. 5"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Оплата */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="font-display font-bold text-iip-dark mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-iip-pink text-white rounded-full flex items-center justify-center text-xs font-black">3</span>
                Способ оплаты
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: "card", icon: "CreditCard", label: "Картой онлайн" },
                  { id: "sbp", icon: "Smartphone", label: "СБП" },
                  { id: "cash", icon: "Banknote", label: "При получении" },
                ] as const).map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPayment(opt.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      payment === opt.id
                        ? "border-iip-pink bg-iip-pink/5"
                        : "border-border hover:border-iip-pink/40"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${payment === opt.id ? "bg-iip-pink text-white" : "bg-iip-cream text-iip-pink"}`}>
                      <Icon name={opt.icon} size={16} />
                    </div>
                    <span className={`text-xs font-body text-center leading-tight ${payment === opt.id ? "text-iip-dark font-medium" : "text-muted-foreground"}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Комментарий */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <label className="font-display font-bold text-iip-dark text-sm block mb-3">Комментарий к заказу</label>
              <textarea
                rows={3}
                value={form.comment}
                onChange={e => set("comment", e.target.value)}
                placeholder="Пожелания по упаковке, цвету или что-то важное..."
                className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors resize-none"
              />
            </div>
          </div>

          {/* Правая колонка — итог */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="font-display font-bold text-iip-dark mb-4">Ваш заказ</h2>

              <div className="space-y-3 mb-4">
                {cart.map(item => {
                  const product = getProduct(item.id);
                  if (!product) return null;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0"
                        style={{ backgroundColor: product.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-iip-dark font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.qty} шт.</p>
                      </div>
                      <span className="font-display font-bold text-sm text-iip-dark flex-shrink-0">
                        {(product.priceNum * item.qty).toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Товары ({cart.reduce((s, i) => s + i.qty, 0)} шт.)</span>
                  <span>{cartTotal.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Доставка</span>
                  <span className={deliveryCost === 0 ? "text-iip-mint font-medium" : ""}>
                    {deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} ₽`}
                  </span>
                </div>
                {cartTotal < 3000 && (
                  <p className="text-xs text-muted-foreground font-body bg-iip-cream rounded-lg px-3 py-2">
                    До бесплатной доставки ещё {(3000 - cartTotal).toLocaleString("ru-RU")} ₽
                  </p>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-display font-bold text-iip-dark">Итого</span>
                  <span className="font-display font-black text-2xl text-iip-pink">
                    {total.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-iip-pink hover:bg-iip-pink/90 disabled:opacity-60 text-white py-4 rounded-2xl font-display font-bold text-sm transition-all hover:shadow-lg hover:shadow-iip-pink/25 flex items-center justify-center gap-2"
            >
              <Icon name={sending ? "Loader" : "ShoppingBag"} size={16} />
              {sending ? "Отправляем..." : "Подтвердить заказ"}
            </button>

            <p className="text-center text-xs text-muted-foreground font-body px-2 leading-relaxed">
              Нажимая кнопку, вы соглашаетесь с условиями доставки и обработки персональных данных
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}