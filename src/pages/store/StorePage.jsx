import React, { useState } from 'react';
import {
  ShoppingBag, Search, ShoppingCart, Plus, Minus, X, Truck, Star, Filter,
  ChevronRight, Check, MapPin, CreditCard, Package, Home, Phone, User,
  Heart, ArrowLeft, Tag, Pill, Stethoscope, Thermometer, Activity, Sparkles, Shield
} from 'lucide-react';

// ====== PRODUCT CATALOG ======
const categories = [
  {
    id: 'medicines',
    name: 'Medicines',
    icon: Pill,
    color: 'bg-red-500',
    subgroups: [
      {
        name: 'Pain Relief',
        products: [
          { id: 101, name: 'Paracetamol 500mg', desc: '20 Tablets • Fever & Pain', price: 3.99, rating: 4.8, delivery24h: true, stock: 200, rx: false, img: '💊' },
          { id: 102, name: 'Ibuprofen 400mg', desc: '30 Tablets • Anti-Inflammatory', price: 5.49, rating: 4.7, delivery24h: true, stock: 150, rx: false, img: '💊' },
          { id: 103, name: 'Aspirin 300mg', desc: '100 Tablets • Blood Thinner', price: 6.99, rating: 4.5, delivery24h: true, stock: 120, rx: false, img: '💊' },
        ],
      },
      {
        name: 'Cough & Cold',
        products: [
          { id: 104, name: 'Cough Syrup (Honey)', desc: '100ml • Sore Throat Relief', price: 7.99, rating: 4.6, delivery24h: true, stock: 80, rx: false, img: '🍯' },
          { id: 105, name: 'Nasal Decongestant Spray', desc: '15ml • Blocked Nose', price: 4.99, rating: 4.4, delivery24h: true, stock: 60, rx: false, img: '💨' },
          { id: 106, name: 'Throat Lozenges', desc: '24 Lozenges • Menthol', price: 3.49, rating: 4.5, delivery24h: true, stock: 90, rx: false, img: '🍬' },
        ],
      },
      {
        name: 'Digestive Care',
        products: [
          { id: 107, name: 'Antacid Tablets', desc: '30 Chewable • Heartburn Relief', price: 4.29, rating: 4.6, delivery24h: true, stock: 100, rx: false, img: '💊' },
          { id: 108, name: 'Probiotics Capsules', desc: '30 Caps • Gut Health', price: 12.99, rating: 4.8, delivery24h: false, stock: 45, rx: false, img: '🦠' },
        ],
      },
      {
        name: 'First Aid',
        products: [
          { id: 109, name: 'Antiseptic Solution', desc: '100ml • Wound Cleaning', price: 3.99, rating: 4.7, delivery24h: true, stock: 75, rx: false, img: '🧴' },
          { id: 110, name: 'Bandage Wrap Roll (6 Pack)', desc: 'Elastic • Compression', price: 8.99, rating: 4.3, delivery24h: true, stock: 55, rx: false, img: '🩹' },
          { id: 111, name: 'Premium First Aid Kit', desc: '85 Pieces • Home & Travel', price: 24.99, rating: 4.9, delivery24h: false, stock: 18, rx: false, img: '🏥' },
          { id: 112, name: 'Hand Sanitizer 500ml', desc: 'Antibacterial • Aloe Vera', price: 5.99, rating: 4.4, delivery24h: true, stock: 100, rx: false, img: '🧴' },
        ],
      },
    ],
  },
  {
    id: 'supplements',
    name: 'Supplements & Vitamins',
    icon: Sparkles,
    color: 'bg-green-500',
    subgroups: [
      {
        name: 'Vitamins',
        products: [
          { id: 201, name: 'Vitamin C 1000mg', desc: '60 Tablets • Immunity Support', price: 12.99, rating: 4.8, delivery24h: true, stock: 45, rx: false, img: '🍊' },
          { id: 202, name: 'Vitamin D3 5000IU', desc: '120 Softgels • Bone Health', price: 14.99, rating: 4.7, delivery24h: true, stock: 38, rx: false, img: '☀️' },
          { id: 203, name: 'Multivitamin Gummies', desc: '60 Count • Daily Essential', price: 15.99, rating: 4.8, delivery24h: true, stock: 42, rx: false, img: '🍬' },
          { id: 204, name: 'B-Complex Tablets', desc: '90 Tablets • Energy & Nerve', price: 9.99, rating: 4.5, delivery24h: true, stock: 50, rx: false, img: '⚡' },
        ],
      },
      {
        name: 'Omega & Fish Oil',
        products: [
          { id: 205, name: 'Omega-3 Pure Fish Oil', desc: '120 Softgels • Heart Health', price: 19.99, rating: 4.7, delivery24h: true, stock: 32, rx: false, img: '🐟' },
          { id: 206, name: 'Cod Liver Oil Capsules', desc: '100 Caps • Joint Support', price: 16.99, rating: 4.6, delivery24h: false, stock: 28, rx: false, img: '🐟' },
        ],
      },
      {
        name: 'Protein & Fitness',
        products: [
          { id: 207, name: 'Whey Protein Powder', desc: '1kg • Chocolate • 24g Protein', price: 34.99, rating: 4.7, delivery24h: true, stock: 20, rx: false, img: '💪' },
          { id: 208, name: 'BCAA Powder', desc: '300g • Recovery • Watermelon', price: 24.99, rating: 4.5, delivery24h: true, stock: 25, rx: false, img: '🏋️' },
          { id: 209, name: 'Creatine Monohydrate', desc: '250g • Strength & Power', price: 18.99, rating: 4.6, delivery24h: true, stock: 30, rx: false, img: '⚡' },
        ],
      },
      {
        name: 'Sleep & Relaxation',
        products: [
          { id: 210, name: 'Melatonin 5mg', desc: '90 Tablets • Sleep Support', price: 8.99, rating: 4.5, delivery24h: true, stock: 67, rx: false, img: '😴' },
          { id: 211, name: 'Ashwagandha Extract', desc: '60 Caps • Stress Relief', price: 13.99, rating: 4.6, delivery24h: true, stock: 40, rx: false, img: '🌿' },
          { id: 212, name: 'Magnesium Glycinate', desc: '120 Caps • Relaxation', price: 11.99, rating: 4.7, delivery24h: true, stock: 35, rx: false, img: '💤' },
        ],
      },
    ],
  },
  {
    id: 'devices',
    name: 'Medical Devices',
    icon: Activity,
    color: 'bg-blue-500',
    subgroups: [
      {
        name: 'Monitoring',
        products: [
          { id: 301, name: 'Digital Blood Pressure Monitor', desc: 'Automatic • Arm Cuff • LCD', price: 49.99, rating: 4.8, delivery24h: false, stock: 12, rx: false, img: '🩺' },
          { id: 302, name: 'Pulse Oximeter', desc: 'SpO2 & Heart Rate • Fingertip', price: 24.99, rating: 4.6, delivery24h: true, stock: 30, rx: false, img: '❤️' },
          { id: 303, name: 'Blood Glucose Monitor Kit', desc: 'Digital • 50 Test Strips', price: 39.99, rating: 4.7, delivery24h: false, stock: 15, rx: false, img: '🩸' },
        ],
      },
      {
        name: 'Thermometers',
        products: [
          { id: 304, name: 'Infrared Thermometer', desc: 'Contactless • Instant Read', price: 29.99, rating: 4.6, delivery24h: true, stock: 25, rx: false, img: '🌡️' },
          { id: 305, name: 'Digital Oral Thermometer', desc: 'Fast Read • Beep Alert', price: 9.99, rating: 4.4, delivery24h: true, stock: 50, rx: false, img: '🌡️' },
        ],
      },
      {
        name: 'Smart Health',
        products: [
          { id: 306, name: 'Smart Body Scale', desc: 'Body Comp • WiFi • App Sync', price: 44.99, rating: 4.5, delivery24h: false, stock: 8, rx: false, img: '⚖️' },
          { id: 307, name: 'Fitness Tracker Band', desc: 'Heart Rate • Steps • Sleep', price: 34.99, rating: 4.4, delivery24h: true, stock: 18, rx: false, img: '⌚' },
        ],
      },
    ],
  },
  {
    id: 'personal',
    name: 'Personal Care',
    icon: Shield,
    color: 'bg-purple-500',
    subgroups: [
      {
        name: 'Skin Care',
        products: [
          { id: 401, name: 'Moisturizing Lotion', desc: '200ml • All Skin Types', price: 8.99, rating: 4.5, delivery24h: true, stock: 60, rx: false, img: '🧴' },
          { id: 402, name: 'Sunscreen SPF 50', desc: '100ml • UVA/UVB Protection', price: 12.99, rating: 4.7, delivery24h: true, stock: 45, rx: false, img: '☀️' },
        ],
      },
      {
        name: 'Oral Care',
        products: [
          { id: 403, name: 'Medicated Mouthwash', desc: '500ml • Antibacterial', price: 6.99, rating: 4.6, delivery24h: true, stock: 55, rx: false, img: '🪥' },
          { id: 404, name: 'Sensitive Toothpaste', desc: '150g • Enamel Protect', price: 4.99, rating: 4.5, delivery24h: true, stock: 80, rx: false, img: '🦷' },
        ],
      },
      {
        name: 'Eye & Ear Care',
        products: [
          { id: 405, name: 'Lubricating Eye Drops', desc: '15ml • Dry Eye Relief', price: 7.99, rating: 4.4, delivery24h: true, stock: 70, rx: false, img: '👁️' },
          { id: 406, name: 'Ear Drops', desc: '10ml • Wax Softener', price: 5.99, rating: 4.3, delivery24h: true, stock: 40, rx: false, img: '👂' },
        ],
      },
    ],
  },
];

// ====== CHECKOUT STEPS ======
const STEPS = ['cart', 'address', 'payment', 'confirm'];

export default function StorePage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [address, setAddress] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', type: 'home',
  });
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, fullName: 'Sarah Jenkins', phone: '+91-9876543210', addressLine1: '42, MG Road, Sector 15', addressLine2: 'Near Central Park', city: 'Bangalore', state: 'Karnataka', pincode: '560001', type: 'home' },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Flatten products for search
  const allProducts = categories.flatMap(cat =>
    cat.subgroups.flatMap(sg => sg.products.map(p => ({ ...p, category: cat.id, subgroup: sg.name })))
  );

  const searchResults = searchQuery.trim()
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const deliveryFee = cartTotal > 25 ? 0 : 4.99;
  const discount = cartTotal > 50 ? cartTotal * 0.05 : 0;
  const grandTotal = cartTotal + deliveryFee - discount;

  const placeOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => { setOrderPlaced(false); setCheckoutStep('cart'); setShowCart(false); setCart([]); }, 4000);
  };

  const saveAddress = () => {
    const newAddr = { ...address, id: Date.now() };
    setSavedAddresses(prev => [...prev, newAddr]);
    setSelectedAddress(newAddr.id);
    setAddress({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', type: 'home' });
  };

  // Product Card component
  const ProductCard = ({ product }) => (
    <div className="uc-card hover:shadow-card-hover transition-all group p-4">
      {product.delivery24h && (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 px-2 py-0.5 rounded-full mb-2">
          <Truck className="w-3 h-3" /> 24hr Delivery
        </span>
      )}
      <div className="w-full h-24 rounded-xl bg-surface-container-low dark:bg-dark-surface-container flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
        {product.img}
      </div>
      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
      <p className="text-xs text-on-surface-variant mt-0.5">{product.desc}</p>
      <div className="flex items-center gap-1 mt-1.5">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        <span className="text-xs font-medium">{product.rating}</span>
        <span className="text-[10px] text-on-surface-variant">({product.stock} in stock)</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        <div className="flex gap-1.5">
          <button onClick={() => toggleWishlist(product.id)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${wishlist.has(product.id) ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 'bg-surface-container dark:bg-dark-surface-container text-on-surface-variant hover:text-red-500'}`}>
            <Heart className={`w-4 h-4 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
          </button>
          <button onClick={() => addToCart(product)}
            className="w-9 h-9 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 active:scale-95 transition-all">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="uc-page relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="uc-page-title">Wellness E-Store</h1>
          <p className="text-on-surface-variant">Trusted pharmacy items delivered to your door.</p>
        </div>
        <button onClick={() => { setShowCart(true); setCheckoutStep('cart'); }} className="uc-btn-secondary text-sm relative">
          <ShoppingCart className="w-4 h-4" /> Cart
          {cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center">{cartCount}</span>}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search medicines, supplements, devices..." className="uc-input pl-10" />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeCategory === 'all' ? 'bg-primary-500 text-white shadow-md' : 'bg-white dark:bg-dark-surface-container border border-outline-variant/30 text-on-surface-variant'}`}>
          All Products
        </button>
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${activeCategory === cat.id ? 'bg-primary-500 text-white shadow-md' : 'bg-white dark:bg-dark-surface-container border border-outline-variant/30 text-on-surface-variant'}`}>
              <Icon className="w-3.5 h-3.5" /> {cat.name}
            </button>
          );
        })}
      </div>

      {/* Offer Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 p-6 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Special Offer</span>
        </div>
        <h3 className="text-xl font-bold relative z-10">Free delivery on orders above $25</h3>
        <p className="text-white/80 text-sm mt-1 relative z-10">5% discount on orders above $50 • Earn rewards on every purchase</p>
      </div>

      {/* Search Results */}
      {searchResults !== null ? (
        <div>
          <h2 className="font-bold text-lg mb-4">Search Results <span className="text-sm text-on-surface-variant font-normal">({searchResults.length} items)</span></h2>
          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No products found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      ) : (
        /* Category View */
        <div className="space-y-10">
          {categories.filter(cat => activeCategory === 'all' || cat.id === activeCategory).map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.id}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${cat.color} text-white flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  <span className="text-sm text-on-surface-variant">({cat.subgroups.reduce((s, sg) => s + sg.products.length, 0)} items)</span>
                </div>

                {/* Subgroups */}
                {cat.subgroups.map(sg => (
                  <div key={sg.name} className="mb-6">
                    <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ChevronRight className="w-3.5 h-3.5" /> {sg.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sg.products.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ==== CART / CHECKOUT SIDEBAR ==== */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowCart(false)} />
          <div className="fixed right-0 top-0 h-full w-[440px] max-w-full bg-white dark:bg-dark-surface shadow-modal z-50 flex flex-col" style={{ animation: 'slideInRight 0.3s ease-out' }}>

            {/* Header with step indicator */}
            <div className="p-5 border-b border-outline-variant/20 dark:border-dark-surface-container-high/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {checkoutStep !== 'cart' && (
                    <button onClick={() => setCheckoutStep(STEPS[STEPS.indexOf(checkoutStep) - 1])}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container dark:hover:bg-dark-surface-container">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <h2 className="text-lg font-bold">
                    {checkoutStep === 'cart' ? `Cart (${cartCount})` :
                     checkoutStep === 'address' ? 'Delivery Address' :
                     checkoutStep === 'payment' ? 'Payment' : 'Order Confirmation'}
                  </h2>
                </div>
                <button onClick={() => setShowCart(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container dark:hover:bg-dark-surface-container"><X className="w-4 h-4" /></button>
              </div>
              {/* Step indicator */}
              {!orderPlaced && (
                <div className="flex items-center gap-1">
                  {STEPS.map((step, i) => (
                    <React.Fragment key={step}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        STEPS.indexOf(checkoutStep) >= i ? 'bg-primary-500 text-white' : 'bg-surface-container dark:bg-dark-surface-container text-on-surface-variant'
                      }`}>{i + 1}</div>
                      {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${STEPS.indexOf(checkoutStep) > i ? 'bg-primary-500' : 'bg-surface-container-high dark:bg-dark-surface-container-high'}`} />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Order Placed */}
            {orderPlaced ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4" style={{ animation: 'scaleIn 0.4s ease-out' }}>
                  <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Order Placed! 🎉</h3>
                <p className="text-sm text-on-surface-variant">Order #UC-{Math.floor(10000 + Math.random() * 90000)}</p>
                <p className="text-sm text-on-surface-variant mt-2">Estimated delivery: {new Date(Date.now() + 86400000).toLocaleDateString()}</p>
                <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm text-primary-700 dark:text-primary-300 w-full">
                  <Package className="w-4 h-4 inline mr-1" /> You'll receive delivery updates via notifications.
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  {/* STEP 1: CART */}
                  {checkoutStep === 'cart' && (
                    <div className="space-y-4">
                      {cart.length === 0 ? (
                        <div className="text-center py-16 text-on-surface-variant">
                          <ShoppingCart className="w-14 h-14 mx-auto mb-3 opacity-20" />
                          <p className="font-medium">Your cart is empty</p>
                          <p className="text-xs mt-1">Browse products and add items to get started</p>
                        </div>
                      ) : cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low dark:bg-dark-surface-container">
                          <div className="w-12 h-12 rounded-xl bg-white dark:bg-dark-surface flex items-center justify-center text-2xl shrink-0">{item.img}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                            <p className="text-xs text-on-surface-variant">${item.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container"><Minus className="w-3 h-3" /></button>
                            <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="text-sm font-bold w-16 text-right">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* STEP 2: ADDRESS */}
                  {checkoutStep === 'address' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm mb-2">Saved Addresses</h3>
                      {savedAddresses.map(addr => (
                        <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedAddress === addr.id ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-outline-variant/30 dark:border-dark-surface-container-high/50'
                        }`}>
                          <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)}
                            className="mt-1 w-4 h-4 text-primary-500 focus:ring-primary-500" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{addr.fullName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container dark:bg-dark-surface-container text-on-surface-variant uppercase font-semibold">{addr.type}</span>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-1">{addr.addressLine1}</p>
                            {addr.addressLine2 && <p className="text-xs text-on-surface-variant">{addr.addressLine2}</p>}
                            <p className="text-xs text-on-surface-variant">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {addr.phone}</p>
                          </div>
                        </label>
                      ))}

                      {/* Add New Address Form */}
                      <details className="rounded-xl border border-outline-variant/30 dark:border-dark-surface-container-high/50 overflow-hidden">
                        <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-primary-500 flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Add New Address
                        </summary>
                        <div className="p-4 pt-0 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} className="uc-input text-sm py-2" />
                            <input type="tel" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} className="uc-input text-sm py-2" />
                          </div>
                          <input type="text" placeholder="Address Line 1 (House No, Street)" value={address.addressLine1} onChange={(e) => setAddress({...address, addressLine1: e.target.value})} className="uc-input text-sm py-2" />
                          <input type="text" placeholder="Address Line 2 (Landmark, Area)" value={address.addressLine2} onChange={(e) => setAddress({...address, addressLine2: e.target.value})} className="uc-input text-sm py-2" />
                          <div className="grid grid-cols-3 gap-3">
                            <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="uc-input text-sm py-2" />
                            <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="uc-input text-sm py-2" />
                            <input type="text" placeholder="PIN Code" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="uc-input text-sm py-2" />
                          </div>
                          <div className="flex gap-2">
                            {['home', 'office', 'other'].map(t => (
                              <button key={t} onClick={() => setAddress({...address, type: t})}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${address.type === t ? 'bg-primary-500 text-white' : 'bg-surface-container dark:bg-dark-surface-container text-on-surface-variant'}`}>
                                {t === 'home' ? '🏠' : t === 'office' ? '🏢' : '📍'} {t}
                              </button>
                            ))}
                          </div>
                          <button onClick={saveAddress} disabled={!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.pincode}
                            className="uc-btn-primary w-full text-sm disabled:opacity-50">Save Address</button>
                        </div>
                      </details>
                    </div>
                  )}

                  {/* STEP 3: PAYMENT */}
                  {checkoutStep === 'payment' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm mb-2">Select Payment Method</h3>
                      {[
                        { key: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                        { key: 'upi', label: 'UPI / Google Pay', icon: '📱', desc: 'Instant payment' },
                        { key: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
                        { key: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
                      ].map(pm => (
                        <label key={pm.key} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === pm.key ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-outline-variant/30 dark:border-dark-surface-container-high/50'
                        }`}>
                          <input type="radio" name="payment" checked={paymentMethod === pm.key} onChange={() => setPaymentMethod(pm.key)}
                            className="w-4 h-4 text-primary-500 focus:ring-primary-500" />
                          <span className="text-2xl">{pm.icon}</span>
                          <div>
                            <p className="font-semibold text-sm">{pm.label}</p>
                            <p className="text-xs text-on-surface-variant">{pm.desc}</p>
                          </div>
                        </label>
                      ))}

                      {paymentMethod === 'card' && (
                        <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface-container space-y-3" style={{ animation: 'slideUp 0.2s ease-out' }}>
                          <input type="text" placeholder="Card Number" className="uc-input text-sm py-2" maxLength={19} />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/YY" className="uc-input text-sm py-2" maxLength={5} />
                            <input type="text" placeholder="CVV" className="uc-input text-sm py-2" maxLength={3} />
                          </div>
                          <input type="text" placeholder="Cardholder Name" className="uc-input text-sm py-2" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 4: CONFIRMATION */}
                  {checkoutStep === 'confirm' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface-container">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Delivery Address</h4>
                        {(() => {
                          const addr = savedAddresses.find(a => a.id === selectedAddress);
                          return addr ? (
                            <div className="text-xs text-on-surface-variant">
                              <p className="font-medium text-on-surface dark:text-dark-on-surface">{addr.fullName}</p>
                              <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                              <p className="mt-1">📞 {addr.phone}</p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                      <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface-container">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Payment</h4>
                        <p className="text-xs text-on-surface-variant capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface-container">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Items ({cartCount})</h4>
                        <div className="space-y-2">
                          {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-xs">
                              <span>{item.img} {item.name} × {item.qty}</span>
                              <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom: Order Summary + CTA */}
                {cart.length > 0 && (
                  <div className="p-5 border-t border-outline-variant/20 dark:border-dark-surface-container-high/50 space-y-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span className="font-medium">${cartTotal.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">Delivery</span><span className={`font-medium ${deliveryFee === 0 ? 'text-green-600 dark:text-green-400' : ''}`}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span></div>
                      {discount > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Discount (5%)</span><span className="font-medium text-green-600 dark:text-green-400">-${discount.toFixed(2)}</span></div>}
                      <div className="flex justify-between pt-2 border-t border-outline-variant/10"><span className="font-bold">Total</span><span className="font-bold text-lg">${grandTotal.toFixed(2)}</span></div>
                    </div>
                    <button onClick={() => {
                      if (checkoutStep === 'confirm') placeOrder();
                      else setCheckoutStep(STEPS[STEPS.indexOf(checkoutStep) + 1]);
                    }} className="uc-btn-primary w-full">
                      {checkoutStep === 'cart' ? 'Proceed to Address' :
                       checkoutStep === 'address' ? 'Continue to Payment' :
                       checkoutStep === 'payment' ? 'Review Order' : '🛒 Place Order'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
