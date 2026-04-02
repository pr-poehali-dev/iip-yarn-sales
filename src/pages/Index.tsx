import { useState } from "react";
import Icon from "@/components/ui/icon";

const YARN_IMAGE = "https://cdn.poehali.dev/projects/b8c5241f-9e37-43c2-bddb-46c3970376ae/files/c0b2a2d0-3d80-4f8f-869f-2ae1c6e569d2.jpg";

const NAV_ITEMS = [
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О магазине" },
  { id: "delivery", label: "Доставка" },
  { id: "reviews", label: "Отзывы" },
  { id: "contacts", label: "Контакты" },
];

const PRODUCTS = [
  { id: 1, name: "Хлопок PURE", weight: "100г / 200м", price: "590 ₽", color: "#F03E6E", tag: "Хит", fiber: "Хлопок 100%" },
  { id: 2, name: "Меринос SOFT", weight: "100г / 180м", price: "890 ₽", color: "#2ECC8F", tag: "Новинка", fiber: "Меринос 100%" },
  { id: 3, name: "Лён NATURAL", weight: "100г / 250м", price: "720 ₽", color: "#FFD234", tag: "", fiber: "Лён 100%" },
  { id: 4, name: "Альпака CLOUD", weight: "50г / 150м", price: "1 290 ₽", color: "#7C3AED", tag: "Premium", fiber: "Альпака 80%, Шёлк 20%" },
  { id: 5, name: "Бамбук BREEZE", weight: "100г / 220м", price: "650 ₽", color: "#FF6B35", tag: "", fiber: "Бамбук 100%" },
  { id: 6, name: "Кашемир LUXE", weight: "50г / 120м", price: "2 100 ₽", color: "#E91E8C", tag: "Лимит", fiber: "Кашемир 100%" },
];

const REVIEWS = [
  { id: 1, name: "Анна К.", city: "Москва", text: "Пряжа невероятного качества! Хлопок PURE такой мягкий — связала дочке свитер, и она не хочет его снимать.", rating: 5, avatar: "🧶" },
  { id: 2, name: "Мария В.", city: "Санкт-Петербург", text: "Наконец-то нашла настоящую органику без синтетики. Цвета яркие, не линяют. Доставка быстрая!", rating: 5, avatar: "✨" },
  { id: 3, name: "Светлана Р.", city: "Екатеринбург", text: "Альпака CLOUD — это нечто! Лёгкая как воздух. Заказываю уже третий раз.", rating: 5, avatar: "🌿" },
  { id: 4, name: "Юля М.", city: "Казань", text: "Упаковка супер, состав честный, пряжа не скатывается. Рекомендую всем рукодельницам!", rating: 5, avatar: "💚" },
];

const DELIVERY_OPTIONS = [
  { icon: "Package", title: "Почта России", desc: "3–14 дней по всей России", price: "от 250 ₽" },
  { icon: "Truck", title: "СДЭК", desc: "2–7 дней, пункты выдачи", price: "от 350 ₽" },
  { icon: "Zap", title: "Курьер", desc: "1–2 дня, Москва и МО", price: "от 450 ₽" },
  { icon: "Gift", title: "Бесплатно", desc: "При заказе от 3 000 ₽", price: "0 ₽" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("catalog");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Все");
  const [addedProduct, setAddedProduct] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  const handleAddToCart = (productId: number) => {
    setCartCount(prev => prev + 1);
    setAddedProduct(productId);
    setTimeout(() => setAddedProduct(null), 1500);
  };

  const filters = ["Все", "Хлопок", "Меринос", "Альпака", "Кашемир", "Лён", "Бамбук"];

  return (
    <div className="min-h-screen bg-white font-body">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-iip-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-display font-black text-xl text-white tracking-tight">
            IIP<span className="text-iip-pink">.</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-body transition-colors ${
                  activeSection === item.id
                    ? "text-iip-pink"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("contacts")}
              className="hidden md:flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
            >
              <Icon name="User" size={16} />
              Войти
            </button>
            <button
              onClick={() => scrollTo("catalog")}
              className="relative bg-iip-pink hover:bg-iip-pink/90 text-white px-4 py-2 rounded-full text-sm font-display font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              <Icon name="ShoppingBag" size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-iip-yellow text-iip-dark text-xs font-display font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-iip-dark border-t border-white/10 px-4 py-4 flex flex-col gap-3 animate-fade-in">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-white/80 hover:text-iip-pink text-left py-2 font-body transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contacts")}
              className="text-white/80 hover:text-iip-pink text-left py-2 font-body transition-colors"
            >
              Личный кабинет
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen bg-iip-dark overflow-hidden flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-0 w-96 h-96 bg-iip-pink/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-iip-violet/25 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-iip-mint/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
          <div className="absolute top-32 right-32 w-24 h-24 border-2 border-iip-yellow/30 rotate-45 animate-spin-slow" />
          <div className="absolute bottom-40 left-24 w-16 h-16 border-2 border-iip-pink/40 rotate-12" />
          <div className="absolute top-1/2 right-24 w-8 h-8 bg-iip-mint/50 rotate-45" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center py-20">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-iip-pink/15 border border-iip-pink/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-iip-mint animate-pulse" />
              <span className="text-iip-mint text-sm font-body">100% органические волокна</span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-tight mb-6">
              ПРЯЖА
              <br />
              <span className="text-gradient">БЕЗ</span>
              <br />
              СИНТЕТИКИ
            </h1>
            <p className="text-white/60 text-lg mb-8 font-body max-w-md leading-relaxed">
              Хлопок, меринос, альпака, кашемир — только натуральные волокна. Для тех, кто создаёт с заботой о природе.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("catalog")}
                className="bg-iip-pink hover:bg-iip-pink/90 text-white px-8 py-4 rounded-full font-display font-bold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-iip-pink/30"
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="border border-white/20 hover:border-white/50 text-white px-8 py-4 rounded-full font-display font-bold text-sm transition-all hover:bg-white/5"
              >
                О нас
              </button>
            </div>

            <div className="flex gap-8 mt-12">
              {[
                { num: "50+", label: "видов пряжи" },
                { num: "12+", label: "волокон" },
                { num: "4.9★", label: "рейтинг" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-black text-2xl text-iip-yellow">{stat.num}</div>
                  <div className="text-white/50 text-xs font-body mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in delay-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-iip-pink/30 to-iip-violet/30 rounded-3xl rotate-3" />
              <img
                src={YARN_IMAGE}
                alt="Органическая пряжа IIP"
                className="relative z-10 w-full rounded-3xl object-cover shadow-2xl shadow-iip-pink/20 animate-float"
                style={{ aspectRatio: "1/1" }}
              />
              <div className="absolute -bottom-4 -left-4 bg-iip-yellow text-iip-dark rounded-2xl px-4 py-3 z-20 shadow-lg">
                <div className="font-display font-black text-sm">ЭКО</div>
                <div className="font-body text-xs opacity-70">сертифицировано</div>
              </div>
              <div className="absolute -top-4 -right-4 bg-iip-mint text-white rounded-2xl px-4 py-3 z-20 shadow-lg">
                <div className="font-display font-black text-sm">NEW</div>
                <div className="font-body text-xs opacity-80">сезон 2026</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <Icon name="ChevronDown" size={24} />
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-20 bg-iip-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-iip-pink font-display text-sm font-bold mb-2 tracking-widest uppercase">Ассортимент</p>
              <h2 className="font-display font-black text-4xl text-iip-dark">КАТАЛОГ</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                    activeFilter === f
                      ? "bg-iip-dark text-white"
                      : "bg-white text-iip-dark/60 hover:bg-iip-dark/5 border border-iip-dark/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="h-48 relative overflow-hidden"
                  style={{ backgroundColor: product.color }}
                >
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 20px)'
                    }}
                  />
                  <div className="absolute bottom-4 left-4 text-white/80 font-body text-sm">{product.fiber}</div>
                  {product.tag && (
                    <div className="absolute top-4 right-4 bg-iip-dark text-white text-xs font-display font-bold px-3 py-1 rounded-full">
                      {product.tag}
                    </div>
                  )}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border-4 border-white/20" />
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-4 border-white/15" />
                </div>

                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-iip-dark mb-1">{product.name}</h3>
                  <p className="text-muted-foreground text-sm font-body mb-4">{product.weight}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-xl text-iip-dark">{product.price}</span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-bold transition-all ${
                        addedProduct === product.id
                          ? "bg-iip-mint text-white scale-95"
                          : "bg-iip-dark text-white hover:bg-iip-pink hover:scale-105"
                      }`}
                    >
                      <Icon name={addedProduct === product.id ? "Check" : "Plus"} size={14} />
                      {addedProduct === product.id ? "Добавлено" : "В корзину"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="border-2 border-iip-dark text-iip-dark hover:bg-iip-dark hover:text-white px-8 py-4 rounded-full font-display font-bold text-sm transition-all">
              Показать все товары
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 bg-iip-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-iip-violet/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-iip-mint/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-iip-mint font-display text-sm font-bold mb-2 tracking-widest uppercase">Наша история</p>
              <h2 className="font-display font-black text-4xl text-white mb-6">О МАГАЗИНЕ</h2>
              <p className="text-white/70 font-body text-lg mb-6 leading-relaxed">
                IIP — это не просто магазин пряжи. Это манифест против синтетики. Мы верим, что создавать вещи руками — это искусство, которое заслуживает лучших материалов.
              </p>
              <p className="text-white/50 font-body mb-8 leading-relaxed">
                Каждый моток проходит проверку на состав и экологичность. Мы работаем напрямую с фермерами и мелкими производителями, которые разделяют наши ценности.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Leaf", label: "Без химии", desc: "Только натуральные красители" },
                  { icon: "Award", label: "Сертифицировано", desc: "GOTS и Oeko-Tex стандарты" },
                  { icon: "Heart", label: "Этично", desc: "Честные условия для фермеров" },
                  { icon: "Recycle", label: "Экологично", desc: "Биоразлагаемая упаковка" },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 bg-iip-pink/20 rounded-full flex items-center justify-center mb-3">
                      <Icon name={item.icon} size={16} className="text-iip-pink" />
                    </div>
                    <div className="font-display font-bold text-white text-sm mb-1">{item.label}</div>
                    <div className="font-body text-white/40 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-iip-pink rounded-3xl p-6 text-white">
                <div className="font-display font-black text-5xl mb-2">50+</div>
                <div className="font-body text-white/80">видов натуральной пряжи в каталоге</div>
              </div>
              <div className="bg-iip-mint rounded-3xl p-6 text-white mt-8">
                <div className="font-display font-black text-5xl mb-2">3</div>
                <div className="font-body text-white/80">года опыта работы с органикой</div>
              </div>
              <div className="bg-iip-yellow rounded-3xl p-6 text-iip-dark">
                <div className="font-display font-black text-5xl mb-2">2K+</div>
                <div className="font-body text-iip-dark/70">довольных покупателей</div>
              </div>
              <div className="bg-iip-violet rounded-3xl p-6 text-white mt-8">
                <div className="font-display font-black text-5xl mb-2">0%</div>
                <div className="font-body text-white/80">синтетики в составе</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-iip-pink font-display text-sm font-bold mb-2 tracking-widest uppercase">Логистика</p>
            <h2 className="font-display font-black text-4xl text-iip-dark">ДОСТАВКА</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {DELIVERY_OPTIONS.map((opt) => (
              <div
                key={opt.title}
                className="group border-2 border-iip-dark/10 hover:border-iip-pink rounded-3xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-iip-cream rounded-2xl flex items-center justify-center mb-4 group-hover:bg-iip-pink/10 transition-colors">
                  <Icon name={opt.icon} size={22} className="text-iip-pink" />
                </div>
                <h3 className="font-display font-bold text-iip-dark mb-2">{opt.title}</h3>
                <p className="text-muted-foreground font-body text-sm mb-3">{opt.desc}</p>
                <div className="font-display font-black text-iip-pink">{opt.price}</div>
              </div>
            ))}
          </div>

          <div className="bg-iip-dark rounded-3xl p-8 md:p-12 grid md:grid-cols-3 gap-8 text-white">
            {[
              { icon: "MapPin", color: "text-iip-pink", bg: "bg-iip-pink/20", title: "Самовывоз", desc: "Москва, ул. Садовая, 12. Пн–Пт 10:00–20:00, Сб–Вс 11:00–18:00" },
              { icon: "RefreshCcw", color: "text-iip-mint", bg: "bg-iip-mint/20", title: "Возврат", desc: "14 дней на возврат товара надлежащего качества в оригинальной упаковке" },
              { icon: "Shield", color: "text-iip-yellow", bg: "bg-iip-yellow/20", title: "Гарантия", desc: "Проверяем каждый заказ перед отправкой. Если что-то не так — заменим или вернём деньги" },
            ].map(item => (
              <div key={item.title}>
                <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mb-4`}>
                  <Icon name={item.icon} size={18} className={item.color} />
                </div>
                <h3 className="font-display font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 bg-iip-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-iip-pink font-display text-sm font-bold mb-2 tracking-widest uppercase">Мнения</p>
            <h2 className="font-display font-black text-4xl text-iip-dark">ОТЗЫВЫ</h2>
            <p className="text-muted-foreground font-body mt-3">Что говорят наши покупатели</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-iip-cream rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-display font-bold text-iip-dark">{review.name}</div>
                    <div className="text-muted-foreground font-body text-sm">{review.city}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <span key={j} className="text-iip-yellow text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-foreground/80 font-body leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-6 bg-white rounded-3xl p-6 shadow-sm flex-wrap justify-center">
              <div>
                <div className="font-display font-black text-5xl text-iip-dark">4.9</div>
                <div className="flex gap-0.5 justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-iip-yellow">★</span>
                  ))}
                </div>
              </div>
              <div className="h-16 w-px bg-border hidden sm:block" />
              <div>
                <div className="font-display font-black text-2xl text-iip-dark">247</div>
                <div className="text-muted-foreground font-body text-sm">отзывов</div>
              </div>
              <div className="h-16 w-px bg-border hidden sm:block" />
              <button className="bg-iip-dark text-white px-6 py-3 rounded-full font-display font-bold text-sm hover:bg-iip-pink transition-colors">
                Оставить отзыв
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-iip-pink font-display text-sm font-bold mb-2 tracking-widest uppercase">Связаться</p>
              <h2 className="font-display font-black text-4xl text-iip-dark mb-6">КОНТАКТЫ</h2>
              <p className="text-muted-foreground font-body mb-8">
                Есть вопрос по составу или заказу? Напишите нам — ответим в течение часа.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "Mail", label: "Email", value: "hello@iip-yarn.ru" },
                  { icon: "Phone", label: "Телефон", value: "+7 (800) 555-35-35" },
                  { icon: "MapPin", label: "Адрес", value: "Москва, ул. Садовая, 12" },
                  { icon: "Clock", label: "Часы работы", value: "Пн–Сб, 10:00–20:00" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-iip-cream rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} size={18} className="text-iip-pink" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-body">{item.label}</div>
                      <div className="font-body font-medium text-iip-dark">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {[
                  { icon: "MessageCircle", label: "Telegram" },
                  { icon: "Instagram", label: "Instagram" },
                  { icon: "Youtube", label: "YouTube" },
                ].map(social => (
                  <button
                    key={social.label}
                    className="w-10 h-10 bg-iip-dark text-white rounded-xl flex items-center justify-center hover:bg-iip-pink transition-colors"
                    title={social.label}
                  >
                    <Icon name={social.icon} size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-iip-cream rounded-3xl p-8">
              <h3 className="font-display font-bold text-iip-dark mb-6">Напишите нам</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1.5 block">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Анна"
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-iip-pink transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1.5 block">Email или телефон</label>
                  <input
                    type="text"
                    placeholder="anna@mail.ru"
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-iip-pink transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1.5 block">Сообщение</label>
                  <textarea
                    rows={4}
                    placeholder="Вопрос про состав пряжи или заказ..."
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-iip-pink transition-colors resize-none"
                  />
                </div>
                <button className="w-full bg-iip-pink hover:bg-iip-pink/90 text-white py-4 rounded-xl font-display font-bold text-sm transition-all hover:shadow-lg hover:shadow-iip-pink/25">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-iip-dark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-display font-black text-2xl text-white mb-2">
                IIP<span className="text-iip-pink">.</span>
              </div>
              <div className="text-white/40 font-body text-sm">Органическая пряжа без синтетики</div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-white/40 hover:text-white text-sm font-body transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="text-white/30 font-body text-xs text-center">
              © 2026 IIP. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}