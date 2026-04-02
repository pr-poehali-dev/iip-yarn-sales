import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/b597fd9a-ad15-471a-9c9a-23f9039e704f";

const DELIVERY_LABELS: Record<string, string> = {
  cdek: "СДЭК", post: "Почта России", courier: "Курьер", pickup: "Самовывоз"
};
const PAYMENT_LABELS: Record<string, string> = {
  card: "Картой", sbp: "СБП", cash: "При получении"
};
const STATUS_OPTIONS = [
  { value: "new",        label: "Новый",       color: "bg-iip-yellow text-iip-dark" },
  { value: "confirmed",  label: "Подтверждён", color: "bg-iip-mint text-white" },
  { value: "shipped",    label: "Отправлен",   color: "bg-iip-violet text-white" },
  { value: "delivered",  label: "Доставлен",   color: "bg-green-500 text-white" },
  { value: "cancelled",  label: "Отменён",     color: "bg-red-400 text-white" },
];
const COLOR_OPTIONS = [
  "#F03E6E","#2ECC8F","#FFD234","#7C3AED","#FF6B35","#E91E8C",
  "#3B82F6","#F59E0B","#10B981","#6366F1","#EC4899","#14B8A6"
];

type Product = { id: number; name: string; fiber: string; weight: string; priceNum: number; color: string; tag: string; inStock: boolean };
type OrderItem = { id: number; qty: number };
type Order = { id: number; customerName: string; phone: string; email: string; city: string; address: string; delivery: string; payment: string; comment: string; items: OrderItem[]; total: number; status: string; createdAt: string };

function getStatusInfo(val: string) {
  return STATUS_OPTIONS.find(s => s.value === val) ?? STATUS_OPTIONS[0];
}

export default function Admin() {
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem("iip_admin_key") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Редактор товара
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ name: "", fiber: "", weight: "", priceNum: 0, color: "#F03E6E", tag: "", inStock: true });
  const [showProductForm, setShowProductForm] = useState(false);

  // Просмотр заказа
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const headers = { "Content-Type": "application/json", "X-Admin-Key": adminKey };

  const login = async () => {
    const res = await fetch(`${API}?route=orders`, { headers: { "X-Admin-Key": keyInput } });
    if (res.ok) {
      setAdminKey(keyInput);
      localStorage.setItem("iip_admin_key", keyInput);
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetch(`${API}?route=orders`, { headers: { "X-Admin-Key": adminKey } })
        .then(r => r.ok ? setAuthenticated(true) : null);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    loadData();
  }, [authenticated, tab]);

  const loadData = async () => {
    setLoading(true);
    if (tab === "orders") {
      const res = await fetch(`${API}?route=orders`, { headers });
      setOrders(await res.json());
    } else {
      const res = await fetch(`${API}?route=products`);
      setProducts(await res.json());
    }
    setLoading(false);
  };

  const saveProduct = async () => {
    const isNew = !editProduct;
    const url = isNew ? `${API}?route=products` : `${API}?route=products/${editProduct!.id}`;
    await fetch(url, { method: isNew ? "POST" : "PUT", headers, body: JSON.stringify(editForm) });
    setShowProductForm(false);
    setEditProduct(null);
    loadData();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Удалить товар?")) return;
    await fetch(`${API}?route=products/${id}`, { method: "DELETE", headers });
    loadData();
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    await fetch(`${API}?route=orders/${orderId}`, { method: "PUT", headers, body: JSON.stringify({ status }) });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status } : null);
  };

  const openEdit = (p?: Product) => {
    if (p) {
      setEditProduct(p);
      setEditForm({ name: p.name, fiber: p.fiber, weight: p.weight, priceNum: p.priceNum, color: p.color, tag: p.tag, inStock: p.inStock });
    } else {
      setEditProduct(null);
      setEditForm({ name: "", fiber: "", weight: "", priceNum: 0, color: "#F03E6E", tag: "", inStock: true });
    }
    setShowProductForm(true);
  };

  const logout = () => {
    localStorage.removeItem("iip_admin_key");
    setAdminKey("");
    setAuthenticated(false);
  };

  // Экран входа
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-iip-dark flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-iip-pink/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-iip-violet/20 rounded-full blur-3xl" />
        <div className="relative z-10 w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <div className="font-display font-black text-3xl text-white mb-1">IIP<span className="text-iip-pink">.</span></div>
            <p className="text-white/40 font-body text-sm">Панель администратора</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="font-display font-bold text-white mb-6">Вход</h2>
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs font-body mb-1.5 block">Секретный ключ</label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && login()}
                  placeholder="••••••••••"
                  className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none transition-colors ${authError ? "border-red-400" : "border-white/20 focus:border-iip-pink"}`}
                />
                {authError && <p className="text-red-400 text-xs font-body mt-1.5">Неверный ключ</p>}
              </div>
              <button
                onClick={login}
                className="w-full bg-iip-pink hover:bg-iip-pink/90 text-white py-3.5 rounded-xl font-display font-bold text-sm transition-all"
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Шапка */}
      <header className="bg-iip-dark border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-display font-black text-lg text-white">IIP<span className="text-iip-pink">.</span> <span className="text-white/40 font-body font-normal text-sm">Админка</span></span>
            <div className="hidden sm:flex gap-1">
              {(["orders", "products"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-body transition-colors ${tab === t ? "bg-iip-pink text-white" : "text-white/50 hover:text-white"}`}>
                  {t === "orders" ? "Заказы" : "Товары"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-white/40 hover:text-white text-xs font-body transition-colors flex items-center gap-1">
              <Icon name="ExternalLink" size={13} /> Сайт
            </a>
            <button onClick={logout} className="text-white/40 hover:text-red-400 text-xs font-body transition-colors flex items-center gap-1">
              <Icon name="LogOut" size={13} /> Выйти
            </button>
          </div>
        </div>
        {/* Мобильные табы */}
        <div className="sm:hidden flex border-t border-white/10">
          {(["orders", "products"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-body transition-colors ${tab === t ? "text-iip-pink border-b-2 border-iip-pink" : "text-white/50"}`}>
              {t === "orders" ? "Заказы" : "Товары"}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ===== ЗАКАЗЫ ===== */}
        {tab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display font-black text-2xl text-iip-dark">ЗАКАЗЫ</h1>
              <button onClick={loadData} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-iip-dark font-body transition-colors">
                <Icon name="RefreshCcw" size={15} /> Обновить
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted-foreground font-body">Загрузка...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">📦</div>
                <p className="font-display font-bold text-iip-dark">Заказов пока нет</p>
                <p className="text-muted-foreground text-sm mt-1">Они появятся здесь после первой покупки</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => {
                  const st = getStatusInfo(order.status);
                  return (
                    <div key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group">
                      <div className="font-display font-black text-iip-dark/30 text-sm w-8">#{order.id}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-iip-dark">{order.customerName}</span>
                          <span className="text-muted-foreground font-body text-sm">{order.phone}</span>
                        </div>
                        <div className="text-muted-foreground text-xs font-body mt-0.5">
                          {DELIVERY_LABELS[order.delivery]} · {order.city || "—"} · {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                      <div className="font-display font-black text-iip-dark hidden sm:block">
                        {order.total.toLocaleString("ru-RU")} ₽
                      </div>
                      <span className={`text-xs font-display font-bold px-3 py-1 rounded-full flex-shrink-0 ${st.color}`}>
                        {st.label}
                      </span>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-iip-pink transition-colors" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== ТОВАРЫ ===== */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display font-black text-2xl text-iip-dark">ТОВАРЫ</h1>
              <button onClick={() => openEdit()}
                className="flex items-center gap-2 bg-iip-pink text-white px-4 py-2 rounded-full text-sm font-display font-bold hover:bg-iip-pink/90 transition-colors">
                <Icon name="Plus" size={15} /> Добавить
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted-foreground font-body">Загрузка...</div>
            ) : (
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 group hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-iip-dark">{p.name}</span>
                        {p.tag && <span className="text-xs bg-iip-dark text-white px-2 py-0.5 rounded-full font-display font-bold">{p.tag}</span>}
                        {!p.inStock && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-body">скрыт</span>}
                      </div>
                      <span className="text-muted-foreground text-sm font-body">{p.fiber} · {p.weight}</span>
                    </div>
                    <span className="font-display font-black text-iip-dark hidden sm:block">{p.priceNum.toLocaleString("ru-RU")} ₽</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)}
                        className="w-8 h-8 bg-gray-100 hover:bg-iip-pink hover:text-white rounded-lg flex items-center justify-center transition-colors">
                        <Icon name="Pencil" size={14} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)}
                        className="w-8 h-8 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== МОДАЛКА: детали заказа ===== */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white z-50 flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-display font-black text-xl text-iip-dark">Заказ #{selectedOrder.id}</h2>
                <p className="text-muted-foreground text-xs font-body mt-0.5">
                  {new Date(selectedOrder.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 bg-gray-100 hover:bg-iip-dark hover:text-white rounded-xl flex items-center justify-center transition-colors">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Статус */}
              <div>
                <p className="text-xs text-muted-foreground font-body mb-2">Статус заказа</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s.value}
                      onClick={() => updateOrderStatus(selectedOrder.id, s.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-display font-bold transition-all ${
                        selectedOrder.status === s.value ? s.color + " scale-105 shadow" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Покупатель */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="font-display font-bold text-sm text-iip-dark mb-3">Покупатель</p>
                {[
                  { icon: "User", val: selectedOrder.customerName },
                  { icon: "Phone", val: selectedOrder.phone },
                  { icon: "Mail", val: selectedOrder.email || "—" },
                  { icon: "MapPin", val: [selectedOrder.city, selectedOrder.address].filter(Boolean).join(", ") || "—" },
                ].map(item => (
                  <div key={item.icon} className="flex items-center gap-3">
                    <Icon name={item.icon} size={15} className="text-muted-foreground flex-shrink-0" />
                    <span className="font-body text-sm text-iip-dark">{item.val}</span>
                  </div>
                ))}
              </div>

              {/* Доставка и оплата */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-body mb-1">Доставка</p>
                  <p className="font-display font-bold text-sm text-iip-dark">{DELIVERY_LABELS[selectedOrder.delivery]}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-body mb-1">Оплата</p>
                  <p className="font-display font-bold text-sm text-iip-dark">{PAYMENT_LABELS[selectedOrder.payment]}</p>
                </div>
              </div>

              {/* Товары */}
              <div>
                <p className="font-display font-bold text-sm text-iip-dark mb-3">Состав заказа</p>
                <div className="space-y-2">
                  {(selectedOrder.items as OrderItem[]).map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="font-body text-sm text-iip-dark">Товар #{item.id} × {item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 mt-1">
                  <span className="font-body text-muted-foreground text-sm">Итого</span>
                  <span className="font-display font-black text-xl text-iip-pink">{selectedOrder.total.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>

              {/* Комментарий */}
              {selectedOrder.comment && (
                <div className="bg-iip-cream rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-body mb-1">Комментарий</p>
                  <p className="font-body text-sm text-iip-dark">{selectedOrder.comment}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ===== МОДАЛКА: редактор товара ===== */}
      {showProductForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowProductForm(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-black text-xl text-iip-dark">
                  {editProduct ? "Редактировать" : "Добавить товар"}
                </h2>
                <button onClick={() => setShowProductForm(false)}
                  className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-iip-dark hover:text-white transition-colors">
                  <Icon name="X" size={15} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1 block">Название *</label>
                  <input value={editForm.name} onChange={e => setEditForm(p => ({...p, name: e.target.value}))}
                    placeholder="Хлопок PURE"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1 block">Состав *</label>
                  <input value={editForm.fiber} onChange={e => setEditForm(p => ({...p, fiber: e.target.value}))}
                    placeholder="Хлопок 100%"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Вес / метраж</label>
                    <input value={editForm.weight} onChange={e => setEditForm(p => ({...p, weight: e.target.value}))}
                      placeholder="100г / 200м"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body mb-1 block">Цена (₽) *</label>
                    <input type="number" value={editForm.priceNum || ""} onChange={e => setEditForm(p => ({...p, priceNum: Number(e.target.value)}))}
                      placeholder="590"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-1 block">Метка (Хит, Новинка...)</label>
                  <input value={editForm.tag} onChange={e => setEditForm(p => ({...p, tag: e.target.value}))}
                    placeholder="Хит"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-iip-pink transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-body mb-2 block">Цвет карточки</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map(c => (
                      <button key={c} onClick={() => setEditForm(p => ({...p, color: c}))}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-lg transition-all ${editForm.color === c ? "ring-2 ring-iip-dark ring-offset-2 scale-110" : "hover:scale-105"}`} />
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setEditForm(p => ({...p, inStock: !p.inStock}))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${editForm.inStock ? "bg-iip-mint" : "bg-gray-300"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${editForm.inStock ? "left-5" : "left-1"}`} />
                  </div>
                  <span className="text-sm font-body text-iip-dark">Отображать в каталоге</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowProductForm(false)}
                  className="flex-1 border border-border text-muted-foreground py-3 rounded-xl text-sm font-body hover:border-iip-dark hover:text-iip-dark transition-colors">
                  Отмена
                </button>
                <button onClick={saveProduct}
                  className="flex-1 bg-iip-pink text-white py-3 rounded-xl text-sm font-display font-bold hover:bg-iip-pink/90 transition-colors">
                  {editProduct ? "Сохранить" : "Добавить"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
