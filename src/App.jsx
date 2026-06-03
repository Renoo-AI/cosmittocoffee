import React, { useState, useEffect } from 'react';

const menuData = {
  morningBoost: [
    { name: 'Morning Classic', price: '3,9 DT', desc: 'Café + Viennoiserie ou Cake + Eau' },
    { name: 'Morning Quick', price: '4,2 DT', desc: 'Café + Cookie ou Brownie ou Muffin' },
    { name: 'Morning Salé', price: '5,5 DT', desc: 'Café + Croissant salé + Eau' },
    { name: 'Morning Drum', price: '6,9 DT', desc: 'Café + 2 Pancakes + Citronnade ou Jus d\'orange' },
    { name: 'Morning Breakfast', price: '7,9 DT', desc: 'Café + Egg croq muffin + Citronnade ou Jus d\'orange' },
  ],
  lunchPower: [
    { name: 'Tahricha', price: '6,9 DT', desc: 'Feuilleté au choix + Citronnade (➔ Cookie offert)' },
    { name: 'Tanwicha', price: '7,5 DT', desc: 'Quiche + Bouquet de salade + Citronnade (➔ Espresso offert)' },
  ],
  crunchyFrappes: [
    { name: 'Cookie Frappé Signature', price: '8,0 DT', desc: 'Frappé onctueux blended avec éclats de cookies artisanaux et crème fouettée' },
    { name: 'Brownie Frappé Gourmand', price: '8,0 DT', desc: 'Base intense de chocolat, morceaux fondants de brownie maison' },
    { name: 'Donut Frappé Festif', price: '8,0 DT', desc: 'L\'alliance unique d\'un donut glacé mixé au cœur d\'une texture veloutée' },
  ],
  classicBenna: {
    note: "Prices vary depending on chosen roast profile (🟡 Kicker, 🔴 House Blend, 🔵 Groove). Size Supplement: +1,0 TND for GRAND size format.",
    items: [
      { name: 'Espresso', kicker: '2,5 DT', house: '4,0 DT', groove: '4,0 DT' },
      { name: 'Espresso Macchiato', kicker: '3,0 DT', house: '4,5 DT', groove: '4,5 DT' },
      { name: 'Americano', kicker: '3,0 DT', house: '4,5 DT', groove: '4,5 DT' },
      { name: 'Café Latte', kicker: '4,0 DT', house: '5,0 DT', groove: '5,0 DT' },
      { name: 'Cappuccino', kicker: '4,0 DT', house: '5,0 DT', groove: '5,0 DT' },
    ]
  },
  bennaDelight: [
    { name: 'Caramel Macchiato', medium: '5,0 DT', grand: '6,0 DT' },
    { name: 'Chococookies Latte', medium: '5,0 DT', grand: '6,0 DT' },
    { name: 'Vanilla Latte', medium: '5,0 DT', grand: '6,0 DT' },
    { name: 'Spicy Nut Latte', medium: '5,0 DT', grand: '6,0 DT' },
  ],
  coldDrinks: [
    { name: 'Mojitos Premium', desc: '(Classic / Strawberry / Mango)', price: '6,9 DT' },
    { name: 'Frozen Granités', desc: '(Strawberry Chiller / Mango Chiller)', price: '6,9 DT' },
    { name: 'Frappés Classiques', desc: '(Caramel / Chocolat / Cappuccino / Cookies Moka)', price: '6,9 DT' },
  ],
  smoothies: [
    { name: 'Ginger Glow', desc: 'Ananas, citron, menthe fraîche, gingembre', price: '6,9 DT' },
    { name: 'Green Energy', desc: 'Pomme verte, citron pressé, menthe', price: '6,9 DT' },
    { name: 'Fresh Boost', desc: 'Fraise, banane mûre, orange fraîche', price: '6,9 DT' },
  ],
  sweetTreats: [
    { name: 'Cake Nature / Cake Marbré', price: '2,5 DT' },
    { name: 'Mille Feuilles', price: '2,5 DT' },
    { name: 'Cookie / Donut / Brownie', price: '4,0 DT' },
    { name: 'Apple Pie', price: '5,0 DT' },
    { name: 'Cheesecake Premium', price: '6,5 DT' },
  ],
  refreshments: [
    { name: 'Fresh Lemonade', price: '3,5 DT' },
    { name: 'Mint Lemonade', price: '4,0 DT' },
    { name: 'Fresh Orange Juice', price: '4,0 DT' },
    { name: 'Pink Lemonade', price: '4,5 DT' },
    { name: 'Pink Orange Juice', price: '4,5 DT' },
    { name: 'Eau Minérale', price: '1,0 DT' },
  ],
  hot: [
    { name: 'Thé Infusion Sélection', price: '4,0 DT' },
    { name: 'Chocolat Chaud Onctueux', price: '6,0 DT' },
  ]
};

const images = {
  mojito: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
  strawberryMojito: "https://images.unsplash.com/photo-1543157145-f78c636d023d?q=80&w=600&auto=format&fit=crop",
  coldBrew: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop",
  espresso: "https://images.unsplash.com/photo-1510705315444-837e6f4a04d0?q=80&w=600&auto=format&fit=crop",
  latte: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop",
  macchiato: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop",
  croissant: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
  pancakes: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=600&auto=format&fit=crop"
};

const logos = {
  black: "https://dropshare.42web.io/1/files/isW0l6ITPE.png",
  red: "https://dropshare.42web.io/1/files/yTO92SNtna.png",
  white: "https://dropshare.42web.io/1/files/kha1uqV3vE.png"
};

function App() {
  const [activeTab, setActiveTab] = useState('coffee');

  useEffect(() => {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }, []);

  const BrutalistItem = ({ item }) => (
    <div className="group border-b-2 border-secondary/20 py-4 hover:border-primary transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
      <div className="flex-1">
        <h4 className="font-sans font-bold text-xl md:text-2xl text-secondary group-hover:text-primary transition-colors">{item.name}</h4>
        {item.desc && <p className="text-secondary/70 font-medium text-sm mt-1">{item.desc}</p>}
      </div>
      <div className="bg-primary text-off-white font-sans font-black px-4 py-2 text-lg transform group-hover:scale-105 transition-transform">
        {item.price}
      </div>
    </div>
  );

  const SectionHeader = ({ title }) => (
    <h3 className="text-4xl md:text-6xl font-black text-secondary mb-10 tracking-tighter leading-none border-t-8 border-secondary pt-4">
      {title}
    </h3>
  );

  return (
    <div className="min-h-screen bg-off-white font-secondary text-secondary overflow-x-hidden selection:bg-primary selection:text-white">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference px-6 py-4 flex justify-between items-center pointer-events-none">
        <img src={logos.white} alt="Cosmitto" className="h-8 md:h-12 pointer-events-auto" />
        <div className="hidden md:flex gap-8 font-sans font-bold text-white tracking-widest text-sm pointer-events-auto">
          <a href="#menu" className="hover:text-primary transition-colors">MENU</a>
          <a href="#location" className="hover:text-primary transition-colors">LOCATION</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-between bg-noise clip-diagonal bg-secondary overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-105">
            <source src="https://dropshare.42web.io/1/files/9asN6BXde2.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 mt-20">
          <div className="reveal">
            <h1 className="text-[12vw] md:text-[8vw] leading-[0.8] font-black text-off-white tracking-tighter mb-4">
              COSMIC <br/>
              <span className="text-primary">BENNA.</span>
            </h1>
            <p className="text-off-white/80 font-medium text-lg md:text-2xl max-w-xl mt-8 border-l-4 border-primary pl-6">
              Experience the perfect blend of specialty coffee, gourmet treats, and raw atmosphere at Lac I.
            </p>
          </div>
        </div>

        {/* Marquee Ticker */}
        <div className="relative z-10 bg-primary text-off-white py-4 overflow-hidden border-t border-b border-off-white/20">
          <div className="animate-marquee font-sans font-black text-2xl md:text-4xl tracking-widest uppercase whitespace-nowrap">
             {/* Repeat text to ensure continuous flow */}
            {[...Array(6)].map((_, i) => (
              <span key={i} className="mx-8 flex items-center">
                YOUR DAILY DOSE OF BENNA <span className="mx-8">✱</span> EST. TUNIS
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Hour Bento Box */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto reveal bg-noise">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-secondary text-off-white p-8 md:p-12 flex flex-col justify-center border-l-8 border-primary group hover:bg-[#1a1314] transition-colors">
            <div className="uppercase tracking-widest text-primary font-bold text-sm mb-4">Every Day • 15:00 - 18:00</div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none tracking-tighter">HAPPY<br/>HOUR</h2>
            <div className="space-y-6 font-medium text-lg md:text-xl">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🧊</span>
                <p>1 Boisson Froide au choix <br/><span className="text-primary font-bold font-sans">➔ 1 Cookie offert !</span></p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">🍰</span>
                <p>1 Pâtisserie au choix <br/><span className="text-primary font-bold font-sans">➔ 1 Café classique offert !</span></p>
              </div>
            </div>
          </div>
          <div className="h-64 md:h-auto overflow-hidden bg-accent-1 relative group">
            <img src={images.pancakes} alt="Happy Hour" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-700"></div>
          </div>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <section id="menu" className="py-24 bg-off-white bg-noise">
        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="text-6xl md:text-8xl font-black text-secondary leading-none tracking-tighter">THE<br/>MENU.</h2>

            {/* Minimalist Tabs */}
            <div className="flex flex-wrap gap-4 font-sans font-bold text-sm md:text-base">
              {[
                { id: 'coffee', label: 'Coffee & Hot' },
                { id: 'food', label: 'Food & Bakery' },
                { id: 'cold', label: 'Cold & Smoothies' },
                { id: 'sweets', label: 'Sweets' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 uppercase tracking-widest border-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-secondary text-off-white border-secondary'
                      : 'bg-transparent text-secondary border-secondary/20 hover:border-secondary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Content Grid */}
          <div className="grid md:grid-cols-12 gap-12">

            {/* Dynamic Image Col */}
            <div className="hidden md:block md:col-span-4 space-y-6">
              {activeTab === 'coffee' && (
                <>
                  <img src={images.espresso} className="w-full h-80 object-cover filter contrast-125" alt="Espresso" />
                  <img src={images.latte} className="w-full h-64 object-cover filter contrast-125 grayscale" alt="Latte" />
                </>
              )}
              {activeTab === 'food' && (
                <img src={images.croissant} className="w-full h-[600px] object-cover filter contrast-125" alt="Croissant" />
              )}
              {activeTab === 'cold' && (
                <>
                  <img src={images.mojito} className="w-full h-96 object-cover filter contrast-125" alt="Mojito" />
                  <img src={images.coldBrew} className="w-full h-64 object-cover filter contrast-125 grayscale" alt="Cold Brew" />
                </>
              )}
              {activeTab === 'sweets' && (
                <div className="w-full h-[600px] bg-primary flex items-center justify-center p-8 text-off-white">
                  <h3 className="text-6xl font-black text-outline">SUGAR<br/>RUSH</h3>
                </div>
              )}
            </div>

            {/* List Col */}
            <div className="md:col-span-8 space-y-20">

              {activeTab === 'coffee' && (
                <div className="animate-fade-in">
                  <div className="mb-16">
                    <SectionHeader title="CLASSIC BENNA" />
                    <p className="text-secondary/60 mb-8 font-medium italic border-l-2 border-primary pl-4">{menuData.classicBenna.note}</p>
                    <div className="overflow-x-auto pb-4">
                      <table className="w-full text-left font-sans">
                        <thead>
                          <tr className="border-b-4 border-secondary text-lg">
                            <th className="py-4 pr-4 font-black">SELECTION</th>
                            <th className="py-4 px-4 font-black text-center text-primary">KICKER</th>
                            <th className="py-4 px-4 font-black text-center text-primary">HOUSE</th>
                            <th className="py-4 px-4 font-black text-center text-primary">GROOVE</th>
                          </tr>
                        </thead>
                        <tbody className="text-lg font-bold">
                          {menuData.classicBenna.items.map((item, i) => (
                            <tr key={i} className="border-b-2 border-secondary/10 hover:bg-secondary/5">
                              <td className="py-4 pr-4">{item.name}</td>
                              <td className="py-4 px-4 text-center">{item.kicker}</td>
                              <td className="py-4 px-4 text-center">{item.house}</td>
                              <td className="py-4 px-4 text-center">{item.groove}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-16">
                    <SectionHeader title="BENNA DELIGHT" />
                    <div className="space-y-2">
                      {menuData.bennaDelight.map((item, i) => (
                        <div key={i} className="group border-b-2 border-secondary/20 py-4 hover:border-primary transition-colors flex justify-between items-center">
                          <h4 className="font-sans font-bold text-2xl group-hover:text-primary transition-colors">{item.name}</h4>
                          <div className="flex gap-6 font-sans font-black text-lg">
                            <div><span className="text-xs text-secondary/50 block leading-none">MED</span>{item.medium}</div>
                            <div className="text-primary"><span className="text-xs text-primary/50 block leading-none">GRAND</span>{item.grand}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionHeader title="HOT INFUSIONS" />
                    <div className="space-y-2">
                      {menuData.hot.map((item, i) => <BrutalistItem key={i} item={item} />)}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'food' && (
                <div className="animate-fade-in">
                  <div className="mb-16">
                    <SectionHeader title="MORNING BOOST" />
                    <div className="space-y-2">
                      {menuData.morningBoost.map((item, i) => <BrutalistItem key={i} item={item} />)}
                    </div>
                  </div>
                  <div>
                    <SectionHeader title="LUNCH POWER" />
                    <div className="space-y-2">
                      {menuData.lunchPower.map((item, i) => <BrutalistItem key={i} item={item} />)}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cold' && (
                <div className="animate-fade-in">
                  <div className="mb-16">
                    <SectionHeader title="CRUNCHY FRAPPÉS" />
                    <div className="space-y-2">
                      {menuData.crunchyFrappes.map((item, i) => <BrutalistItem key={i} item={item} />)}
                    </div>
                  </div>
                  <div className="mb-16">
                    <SectionHeader title="ICE BLENDED" />
                    <div className="space-y-2">
                      {menuData.coldDrinks.map((item, i) => <BrutalistItem key={i} item={item} />)}
                    </div>
                  </div>
                  <div className="mb-16">
                    <SectionHeader title="FRESH SMOOTHIES" />
                    <div className="space-y-2">
                      {menuData.smoothies.map((item, i) => <BrutalistItem key={i} item={item} />)}
                    </div>
                  </div>
                  <div>
                    <SectionHeader title="REFRESHMENTS" />
                    <div className="space-y-2">
                      {menuData.refreshments.map((item, i) => <BrutalistItem key={i} item={item} />)}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sweets' && (
                <div className="animate-fade-in">
                  <div className="mb-16">
                    <SectionHeader title="SWEET TREATS" />
                    <div className="space-y-2">
                      {menuData.sweetTreats.map((item, i) => <BrutalistItem key={i} item={item} />)}
                    </div>
                  </div>
                  <div className="bg-secondary text-off-white p-8">
                    <h3 className="text-3xl font-black mb-6 uppercase tracking-widest text-primary">Extras</h3>
                    <div className="space-y-4 font-sans text-xl font-bold">
                      <div className="flex justify-between border-b border-off-white/20 pb-4">
                        <span>Nappage / Sirops</span>
                        <span className="text-primary">+1,0 DT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crème Chantilly Royale</span>
                        <span className="text-primary">+2,0 DT</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Brutalist Footer / Location */}
      <footer id="location" className="bg-primary text-off-white relative overflow-hidden clip-diagonal pt-32 pb-12">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <img src={logos.black} alt="Goat" className="w-[600px] invert" />
        </div>

        <div className="px-6 md:px-16 max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <div>
              <h2 className="text-5xl md:text-8xl font-black leading-none mb-8">LAC I.<br/>TUNIS.</h2>
              <div className="font-sans font-bold text-xl md:text-2xl space-y-2 border-l-4 border-secondary pl-6">
                <p>R6MP+4GC, Rue du Lac Biwa</p>
                <p>71 862 842</p>
                <p>08:00 – 23:00 DAILY</p>
              </div>
            </div>

            <div className="bg-secondary p-8 transform rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-4 border-b-2 border-off-white/20 pb-6 mb-6">
                <div className="text-6xl font-black text-primary">3.8</div>
                <div>
                  <div className="text-2xl text-yellow-500 tracking-widest">★★★★☆</div>
                  <div className="font-sans font-bold text-sm tracking-widest uppercase">Based on 354 Reviews</div>
                </div>
              </div>

              <div className="space-y-6">
                <blockquote className="italic font-medium text-lg text-off-white/80">
                  "Good coffee and croissant, calm atmosphere and welcoming staff."
                  <footer className="font-sans font-bold text-sm text-primary mt-2 uppercase">— Syrine B.</footer>
                </blockquote>
                <blockquote className="italic font-medium text-lg text-off-white/80">
                  "The atmosphere is fresh, clean, and inviting..."
                  <footer className="font-sans font-bold text-sm text-primary mt-2 uppercase">— Jassim A.</footer>
                </blockquote>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t-2 border-off-white/20 pt-8 gap-6">
            <img src={logos.white} alt="Cosmitto Logo" className="h-12" />
            <p className="font-sans font-bold text-sm tracking-widest uppercase">
              © {new Date().getFullYear()} COSMITTO COFFEE.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
