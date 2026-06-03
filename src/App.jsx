import React, { useState } from 'react';

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

  const Section = ({ title, emoji, items, twoCols = false, children }) => (
    <div className="mb-12">
      <h3 className="text-2xl md:text-3xl font-black text-primary mb-6 uppercase tracking-wider flex items-center gap-3">
        <span>{emoji}</span> {title}
      </h3>
      {children ? children : (
        <div className={`grid gap-6 ${twoCols ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {items.map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-accent-1 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2 gap-4">
                <h4 className="font-bold text-lg text-secondary leading-tight">{item.name}</h4>
                <span className="font-bold text-primary whitespace-nowrap bg-red-50 px-3 py-1 rounded-full text-sm">{item.price}</span>
              </div>
              {item.desc && <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-off-white font-secondary text-secondary">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://dropshare.42web.io/1/files/9asN6BXde2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <img src={logos.white} alt="Cosmitto Logo" className="h-24 md:h-32 mb-8" />
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            YOUR DAILY DOSE OF <span className="text-primary">BENNA</span>
          </h1>
          <p className="text-lg md:text-xl text-off-white font-medium max-w-2xl mx-auto mb-8">
            Experience the perfect blend of specialty coffee, gourmet treats, and a cosmic atmosphere at Lac I.
          </p>
          <div className="flex gap-4">
            <a href="#menu" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors uppercase tracking-wide">
              Explore Menu
            </a>
            <a href="#location" className="bg-white text-secondary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors uppercase tracking-wide">
              Visit Us
            </a>
          </div>
        </div>
      </div>

      {/* Highlights / Happy Hour */}
      <div className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary to-red-800 p-8 rounded-3xl shadow-xl">
            <div className="flex-1">
              <h3 className="text-sm font-bold tracking-widest text-red-200 mb-2 uppercase">Every Day • 15:00 - 18:00</h3>
              <h2 className="text-3xl md:text-4xl font-black mb-4">🕒 HAPPY HOUR</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">🧊</div>
                  <p><strong>Option Cold:</strong> 1 Boisson Froide au choix ➔ <span className="text-yellow-300 font-bold">1 Cookie offert !</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">🍰</div>
                  <p><strong>Option Sweet:</strong> 1 Pâtisserie au choix ➔ <span className="text-yellow-300 font-bold">1 Café classique offert !</span></p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img src={images.pancakes} alt="Happy Hour Treats" className="w-48 h-48 object-cover rounded-2xl shadow-lg border-4 border-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div id="menu" className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-secondary mb-4 uppercase">Our Menu</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {['coffee', 'food', 'cold', 'sweets'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-bold uppercase tracking-wide transition-all ${
                activeTab === tab
                  ? 'bg-secondary text-white shadow-lg scale-105'
                  : 'bg-white text-secondary hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab === 'coffee' ? '☕ Coffee & Hot' :
               tab === 'food' ? '🥞 Breakfast & Lunch' :
               tab === 'cold' ? '🧊 Cold & Smoothies' : '🍰 Sweets'}
            </button>
          ))}
        </div>

        <div className="bg-off-white">
          {/* Coffee Tab */}
          {activeTab === 'coffee' && (
            <div className="space-y-16 animate-fade-in">
              {/* Image Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <img src={images.espresso} className="w-full h-48 object-cover rounded-2xl" alt="Espresso" />
                <img src={images.latte} className="w-full h-48 object-cover rounded-2xl" alt="Latte" />
                <img src={images.macchiato} className="w-full h-48 object-cover rounded-2xl hidden md:block" alt="Macchiato" />
                <img src={images.croissant} className="w-full h-48 object-cover rounded-2xl hidden md:block" alt="Croissant" />
              </div>

              <Section title="CLASSIC BENNA" emoji="☕" items={[]}>
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-accent-1">
                  <p className="text-sm text-gray-500 mb-6 italic">{menuData.classicBenna.note}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-100">
                          <th className="py-4 px-4 font-bold text-gray-400 uppercase text-sm">Coffee Selection</th>
                          <th className="py-4 px-4 font-bold text-center"><span className="text-xl">🟡</span><br/>Kicker</th>
                          <th className="py-4 px-4 font-bold text-center"><span className="text-xl">🔴</span><br/>House</th>
                          <th className="py-4 px-4 font-bold text-center"><span className="text-xl">🔵</span><br/>Groove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menuData.classicBenna.items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 font-bold">{item.name}</td>
                            <td className="py-4 px-4 text-center font-medium">{item.kicker}</td>
                            <td className="py-4 px-4 text-center font-medium">{item.house}</td>
                            <td className="py-4 px-4 text-center font-medium">{item.groove}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Section>

              <Section title="BENNA DELIGHT" emoji="✨" items={[]}>
                <div className="grid md:grid-cols-2 gap-6">
                  {menuData.bennaDelight.map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-accent-1 flex justify-between items-center">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <div className="flex gap-4 text-sm font-medium">
                        <div className="text-center"><span className="text-gray-400 block text-xs uppercase">Medium</span> {item.medium}</div>
                        <div className="text-center"><span className="text-gray-400 block text-xs uppercase">Grand</span> {item.grand}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="7AJA HOT" emoji="🫖" items={menuData.hot} twoCols />
            </div>
          )}

          {/* Food Tab */}
          {activeTab === 'food' && (
            <div className="space-y-16 animate-fade-in">
               <Section title="MORNING BOOST" emoji="🥞" items={menuData.morningBoost} twoCols />
               <Section title="LUNCH POWER" emoji="🥪" items={menuData.lunchPower} twoCols />
            </div>
          )}

          {/* Cold Tab */}
          {activeTab === 'cold' && (
            <div className="space-y-16 animate-fade-in">
              <div className="grid grid-cols-2 gap-4 mb-12">
                <img src={images.mojito} className="w-full h-64 object-cover rounded-2xl" alt="Mojito" />
                <img src={images.coldBrew} className="w-full h-64 object-cover rounded-2xl" alt="Cold Brew" />
              </div>

              <Section title="LA FIKRA JDIDA" emoji="✨" items={menuData.crunchyFrappes} />
              <Section title="7AJA BERDA" emoji="🧊" items={menuData.coldDrinks} twoCols />
              <Section title="SMOOTHIES" emoji="🌿" items={menuData.smoothies} twoCols />
              <Section title="FARSHEK JAWEK" emoji="🍊" items={menuData.refreshments} twoCols />
            </div>
          )}

          {/* Sweets Tab */}
          {activeTab === 'sweets' && (
            <div className="space-y-16 animate-fade-in">
               <Section title="7AJA 7LOWA" emoji="🍰" items={menuData.sweetTreats} twoCols />

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-accent-1">
                 <h3 className="text-xl font-bold mb-4">➕ EXTRAS</h3>
                 <div className="space-y-3">
                   <div className="flex justify-between border-b border-gray-100 pb-2">
                     <span>Nappage / Sirops (Caramel, Vanille, Chocolat, Cookies)</span>
                     <span className="font-bold">+1,0 DT</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Crème Chantilly Royale</span>
                     <span className="font-bold">+2,0 DT</span>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Location / Footer */}
      <div id="location" className="bg-secondary text-white py-20 border-t-8 border-primary">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src={logos.white} alt="Cosmitto Logo" className="h-16 mb-8" />
              <h2 className="text-3xl font-black mb-6">VISIT US AT LAC I</h2>
              <div className="space-y-4 text-gray-300">
                <p className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <span>R6MP+4GC, Rue du Lac Biwa, Tunis</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <span>71 862 842</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-xl">🕒</span>
                  <span>08:00 – 23:00 daily</span>
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-400">3.8★</div>
                  <div className="text-xs text-gray-400">354 Reviews</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg text-center flex items-center justify-center">
                  <span className="font-medium">10–20 DT / person</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl">
              <h3 className="text-xl font-bold mb-4 text-primary">What People Say</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Syrine Baccouch</span>
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <p className="text-sm text-gray-300 italic">"Good coffee and croissant, calm atmosphere and welcoming staff."</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Jassim Alsaady</span>
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <p className="text-sm text-gray-300 italic">"The atmosphere is fresh, clean, and inviting — perfect for working or relaxing. The best part? No smoking indoors..."</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Cosmitto Coffee. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
