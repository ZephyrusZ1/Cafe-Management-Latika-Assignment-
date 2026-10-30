/* ==========================================================================
   StateBrew POS & Fulfillment Engine
   app.js — Fulfillment State Machine, Cart Sync & Unified KDS Logic
   ========================================================================== */

const MENU_DATA = [
  {
    id: 'cortado',
    category: 'DRINK',
    name: 'Cortado Oat Asal Tunggal',
    station: 'BARISTA',
    prepMins: 2,
    price: 4.75,
    preview: '☕',
    image: 'pict/cortado-oat.jpg',
    variants: [
      { name: 'Klasik', price: 0 },
      { name: 'Sirup vanila', price: 0.75 },
      { name: 'Ekstra satu shot espresso', price: 1.25 }
    ],
    desc: 'Espresso ristretto pekat dengan susu oat kukus yang lembut.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: '4.5oz Gibraltar Glass + Ceramic Saucer',
      PICKUP: '6oz Double-Wall Compostable Cup + Sip Lid',
      DELIVERY: 'Sealed Thermal Cup + Splash Plug + Bag Seal'
    },
    modifiers: {
      TABLE: 'Latte art pour • Serve immediately on wooden tray',
      PICKUP: 'Hold sleeve ready at Pick-Up Shelf',
      DELIVERY: 'Apply tamper-evident tape across lid'
    }
  },
  {
    id: 'iced_matcha',
    category: 'DRINK',
    name: 'Matcha Latte Dingin',
    station: 'BARISTA',
    prepMins: 3,
    price: 5.50,
    preview: '🧋',
    image: 'pict/green-tea.jpg',
    variants: [
      { name: 'Reguler · susu sapi', price: 0 },
      { name: 'Reguler · susu oat', price: 0.50 },
      { name: 'Besar · susu oat', price: 1.25 }
    ],
    desc: 'Matcha premium yang dikocok lembut, disajikan dengan es dan susu.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: '12oz Highball Glass + Stainless Straw',
      PICKUP: '12oz Clear PLA Cup + Strawless Lid',
      DELIVERY: 'Split Pouch (Matcha Shot + Separate Ice Cup)'
    },
    modifiers: {
      TABLE: 'Layered presentation at table',
      PICKUP: 'GPS-Staged: Do not pour over ice until customer <3m away',
      DELIVERY: 'Zero-dilution split pack so ice never melts in transit'
    }
  },
  {
    id: 'panini',
    category: 'MEAL',
    name: 'Focaccia Mortadella Truffle dan Burrata',
    station: 'KITCHEN',
    prepMins: 6,
    price: 12.50,
    preview: '🥪',
    image: 'pict/Focaccia.jpg',
    variants: [
      { name: 'Focaccia klasik', price: 0 },
      { name: 'Focaccia bebas gluten', price: 1.50 },
      { name: 'Tambahan keju burrata', price: 2.00 }
    ],
    desc: 'Roti focaccia rosemary panggang dengan mortadella, burrata, dan pesto pistachio.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Warmed Stoneware Plate + Steak Knife',
      PICKUP: 'Foil-Lined Kraft Clamshell + Napkin Pack',
      DELIVERY: 'Vented Crisp-Box + Side Balsamic Pipette'
    },
    modifiers: {
      TABLE: 'Plate with dressed arugula salad',
      PICKUP: 'Cut in halves, wrap warm',
      DELIVERY: 'Keep dressing in sealed pipette to prevent soggy bread'
    }
  },
  {
    id: 'shakshuka',
    category: 'MEAL',
    name: 'Shakshuka Telur Panggang',
    station: 'KITCHEN',
    prepMins: 9,
    price: 14.00,
    preview: '🍳',
    image: 'pict/Shakshuka.jpg',
    variants: [
      { name: 'Tidak pedas · satu telur', price: 0 },
      { name: 'Pedas · satu telur', price: 0 },
      { name: 'Tidak pedas · tambah telur', price: 1.50 }
    ],
    desc: 'Telur dalam saus tomat berbumbu, disajikan bersama roti sourdough.',
    allowedModes: ['TABLE'],
    lockReason: 'Dine-In Exclusive: Served bubbling hot in heavy cast-iron skillet.',
    vessels: {
      TABLE: '6-inch Cast-Iron Skillet + Wooden Trivet',
      PICKUP: 'Locked',
      DELIVERY: 'Locked'
    },
    modifiers: {
      TABLE: 'Runner warning: Hot skillet handle cover required',
      PICKUP: 'Unavailable',
      DELIVERY: 'Unavailable'
    }
  },
  {
    id: 'kopi_gula_aren',
    category: 'DRINK',
    name: 'Es Kopi Susu Gula Aren',
    station: 'BARISTA',
    prepMins: 3,
    price: 4.50,
    preview: '🧋',
    image: 'pict/milk-coffee.jpg',
    variants: [
      { name: 'Susu segar', price: 0 },
      { name: 'Susu oat', price: 0.50 },
      { name: 'Ekstra espresso', price: 1.25 }
    ],
    desc: 'Espresso, susu lembut, dan manis legit gula aren dengan es.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Gelas tinggi + sedotan stainless',
      PICKUP: 'Gelas dingin + tutup anti tumpah',
      DELIVERY: 'Gelas segel + kantong pengaman'
    },
    modifiers: {
      TABLE: 'Sajikan dingin dengan lapisan gula aren',
      PICKUP: 'Siapkan di rak pengambilan',
      DELIVERY: 'Segel tutup sebelum dikirim'
    }
  },
  {
    id: 'teh_lemon_madu',
    category: 'DRINK',
    name: 'Teh Lemon Madu',
    station: 'BARISTA',
    prepMins: 3,
    price: 3.75,
    preview: '🍋',
    variants: [
      { name: 'Dingin', price: 0 },
      { name: 'Hangat', price: 0 },
      { name: 'Ekstra madu', price: 0.50 }
    ],
    desc: 'Teh harum dengan perasan lemon segar dan madu alami.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Gelas kaca + tatakan',
      PICKUP: 'Gelas kertas + tutup',
      DELIVERY: 'Gelas segel + kantong pengaman'
    },
    modifiers: {
      TABLE: 'Sajikan dengan irisan lemon',
      PICKUP: 'Siapkan di rak pengambilan',
      DELIVERY: 'Segel tutup sebelum dikirim'
    }
  },
  {
    id: 'nasi_ayam_matah',
    category: 'MEAL',
    name: 'Nasi Ayam Sambal Matah',
    station: 'KITCHEN',
    prepMins: 8,
    price: 9.50,
    preview: '🍗',
    variants: [
      { name: 'Sambal matah terpisah', price: 0 },
      { name: 'Sambal matah ekstra', price: 0.75 },
      { name: 'Tambah telur', price: 1.25 }
    ],
    desc: 'Ayam panggang berbumbu dengan nasi hangat dan sambal matah segar.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Piring keramik + sambal segar',
      PICKUP: 'Kotak makan hangat + sambal terpisah',
      DELIVERY: 'Kotak anti tumpah + sambal tersegel'
    },
    modifiers: {
      TABLE: 'Sajikan dengan lalapan segar',
      PICKUP: 'Pisahkan sambal agar tetap segar',
      DELIVERY: 'Kemas sambal dalam wadah tersegel'
    }
  },
  {
    id: 'mie_goreng_jawa',
    category: 'MEAL',
    name: 'Mie Goreng Jawa',
    station: 'KITCHEN',
    prepMins: 7,
    price: 8.25,
    preview: '🍜',
    image: 'pict/bakmie.jpg',
    variants: [
      { name: 'Tidak pedas', price: 0 },
      { name: 'Pedas sedang', price: 0 },
      { name: 'Tambah telur', price: 1.25 }
    ],
    desc: 'Mie goreng berbumbu dengan sayuran, telur, dan taburan bawang goreng.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Mangkuk keramik hangat',
      PICKUP: 'Kotak makan + alat makan',
      DELIVERY: 'Kotak rapat anti tumpah'
    },
    modifiers: {
      TABLE: 'Sajikan hangat dengan acar',
      PICKUP: 'Kemas selagi hangat',
      DELIVERY: 'Pastikan kotak tertutup rapat'
    }
  },
  {
    id: 'pisang_goreng',
    category: 'SNACK',
    name: 'Pisang Goreng Keju',
    station: 'KITCHEN',
    prepMins: 5,
    price: 4.25,
    preview: '🍌',
    image: 'pict/pisang-goreng.jpg',
    variants: [
      { name: 'Gula aren', price: 0 },
      { name: 'Keju parut', price: 0.50 },
      { name: 'Keju dan cokelat', price: 1.00 }
    ],
    desc: 'Pisang goreng renyah di luar dan lembut di dalam, dengan topping pilihan.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Piring saji + topping',
      PICKUP: 'Kotak kertas berlubang uap',
      DELIVERY: 'Kotak renyah + topping terpisah'
    },
    modifiers: {
      TABLE: 'Sajikan hangat dengan topping',
      PICKUP: 'Kemas agar tetap renyah',
      DELIVERY: 'Kemas topping dalam wadah kecil'
    }
  },
  {
    id: 'risol_mayo',
    category: 'SNACK',
    name: 'Risol Mayo',
    station: 'KITCHEN',
    prepMins: 5,
    price: 3.50,
    preview: '🥟',
    image: 'pict/risol-mayo.jpg',
    variants: [
      { name: 'Isi ayam dan mayo', price: 0 },
      { name: 'Isi smoked beef dan mayo', price: 0.75 },
      { name: 'Tambah saus sambal', price: 0.25 }
    ],
    desc: 'Risol renyah dengan isian gurih dan saus mayo yang lembut.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Piring kecil + saus cocol',
      PICKUP: 'Kantong kertas + saus terpisah',
      DELIVERY: 'Kotak kecil + saus tersegel'
    },
    modifiers: {
      TABLE: 'Sajikan hangat',
      PICKUP: 'Pisahkan saus dari risol',
      DELIVERY: 'Gunakan kotak agar tetap utuh'
    }
  },
  {
    id: 'singkong_keju',
    category: 'SNACK',
    name: 'Singkong Keju',
    station: 'KITCHEN',
    prepMins: 6,
    price: 4.00,
    preview: '🍟',
    variants: [
      { name: 'Keju parut', price: 0 },
      { name: 'Sambal bawang', price: 0.50 },
      { name: 'Keju dan sambal bawang', price: 0.75 }
    ],
    desc: 'Singkong goreng merekah, gurih, dan disajikan dengan topping pilihan.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Piring saji + topping',
      PICKUP: 'Kotak kertas berlubang uap',
      DELIVERY: 'Kotak renyah + topping terpisah'
    },
    modifiers: {
      TABLE: 'Sajikan selagi hangat',
      PICKUP: 'Kemas agar tetap renyah',
      DELIVERY: 'Kemas sambal terpisah'
    }
  },
  {
    id: 'soto_ayam',
    category: 'MEAL',
    name: 'Soto Ayam Kampung',
    station: 'KITCHEN',
    prepMins: 8,
    price: 8.75,
    preview: '🍲',
    image: 'pict/soto-ayam.jpg',
    variants: [
      { name: 'Nasi putih', price: 0 },
      { name: 'Nasi merah', price: 0.75 },
      { name: 'Tambah telur', price: 1.25 }
    ],
    desc: 'Soto ayam berkuah rempah dengan suwiran ayam, telur, dan taburan seledri.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Mangkuk keramik + nasi terpisah',
      PICKUP: 'Kuah dan nasi dalam wadah terpisah',
      DELIVERY: 'Wadah kuah anti tumpah + nasi terpisah'
    },
    modifiers: {
      TABLE: 'Sajikan dengan jeruk nipis',
      PICKUP: 'Pisahkan kuah dan nasi',
      DELIVERY: 'Segel wadah kuah sebelum dikirim'
    }
  },
  {
    id: 'gado_gado',
    category: 'MEAL',
    name: 'Gado-Gado Siram',
    station: 'KITCHEN',
    prepMins: 7,
    price: 7.50,
    preview: '🥗',
    image: 'pict/gado-gado.jpg',
    variants: [
      { name: 'Saus kacang terpisah', price: 0 },
      { name: 'Saus kacang ekstra', price: 0.75 },
      { name: 'Tambah lontong', price: 1.00 }
    ],
    desc: 'Sayuran segar, tahu, dan lontong dengan saus kacang gurih.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Piring saji + saus kacang',
      PICKUP: 'Kotak makan + saus terpisah',
      DELIVERY: 'Kotak rapat + saus tersegel'
    },
    modifiers: {
      TABLE: 'Sajikan dengan kerupuk',
      PICKUP: 'Pisahkan saus agar sayuran tetap segar',
      DELIVERY: 'Kemas saus dalam wadah tersegel'
    }
  },
  {
    id: 'wedang_jahe',
    category: 'DRINK',
    name: 'Wedang Jahe Madu',
    station: 'BARISTA',
    prepMins: 4,
    price: 3.50,
    preview: '🍵',
    image: 'pict/wedang-jahe.jpg',
    variants: [
      { name: 'Madu', price: 0 },
      { name: 'Madu ekstra', price: 0.50 },
      { name: 'Tambahan serai', price: 0.50 }
    ],
    desc: 'Minuman jahe hangat dengan madu dan aroma rempah yang menenangkan.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Cangkir keramik + tatakan',
      PICKUP: 'Gelas panas berpenutup',
      DELIVERY: 'Gelas panas tersegel + kantong'
    },
    modifiers: {
      TABLE: 'Sajikan hangat',
      PICKUP: 'Tutup rapat sebelum diserahkan',
      DELIVERY: 'Gunakan segel anti tumpah'
    }
  },
  {
    id: 'cokelat_panas',
    category: 'DRINK',
    name: 'Cokelat Panas',
    station: 'BARISTA',
    prepMins: 4,
    price: 4.00,
    preview: '🍫',
    image: 'pict/hot-chocolate.jpg',
    variants: [
      { name: 'Susu segar', price: 0 },
      { name: 'Susu oat', price: 0.50 },
      { name: 'Krim kocok', price: 0.75 }
    ],
    desc: 'Cokelat pekat hangat dengan susu lembut dan pilihan topping.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Cangkir keramik + taburan cokelat',
      PICKUP: 'Gelas panas berpenutup',
      DELIVERY: 'Gelas panas tersegel + kantong'
    },
    modifiers: {
      TABLE: 'Sajikan dengan taburan cokelat',
      PICKUP: 'Tutup rapat sebelum diserahkan',
      DELIVERY: 'Gunakan segel anti tumpah'
    }
  },
  {
    id: 'tahu_cabai_garam',
    category: 'SNACK',
    name: 'Tahu Cabai Garam',
    station: 'KITCHEN',
    prepMins: 5,
    price: 4.25,
    preview: '🧆',
    image: 'pict/tahu-cabai.jpg',
    variants: [
      { name: 'Tidak pedas', price: 0 },
      { name: 'Pedas sedang', price: 0 },
      { name: 'Ekstra cabai', price: 0.50 }
    ],
    desc: 'Tahu goreng renyah dengan bawang putih, cabai, dan daun bawang.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Piring kecil + taburan cabai',
      PICKUP: 'Kotak kertas berlubang uap',
      DELIVERY: 'Kotak renyah + cabai terpisah'
    },
    modifiers: {
      TABLE: 'Sajikan selagi hangat',
      PICKUP: 'Kemas agar tetap renyah',
      DELIVERY: 'Kemas cabai dan bawang terpisah'
    }
  },
  {
    id: 'martabak_mini',
    category: 'SNACK',
    name: 'Martabak Mini Cokelat Keju',
    station: 'KITCHEN',
    prepMins: 6,
    price: 4.50,
    preview: '🥞',
    image: 'pict/martabak-mini.jpg',
    variants: [
      { name: 'Cokelat dan keju', price: 0 },
      { name: 'Kacang dan cokelat', price: 0.50 },
      { name: 'Keju ekstra', price: 0.75 }
    ],
    desc: 'Martabak mini lembut dengan isian manis yang lumer.',
    allowedModes: ['TABLE', 'PICKUP', 'DELIVERY'],
    vessels: {
      TABLE: 'Piring saji + topping',
      PICKUP: 'Kotak kertas + alas',
      DELIVERY: 'Kotak kecil + topping terpisah'
    },
    modifiers: {
      TABLE: 'Sajikan hangat',
      PICKUP: 'Kemas setelah matang',
      DELIVERY: 'Kemas topping agar tetap rapi'
    }
  }
];

let state = {
  mode: 'TABLE',
  menuCategory: 'ALL',
  tableNumber: '04',
  tableThemes: {
    '01': 'Window',
    '02': 'Window',
    '03': 'Window',
    '04': 'Window',
    '05': 'Window',
    '06': 'Window',
    '07': 'Window',
    '08': 'Window',
    '09': 'Patio',
    '10': 'Window',
    '11': 'Window',
    '12': 'Roastery Bar'
  },
  openTab: true,
  pickupCustomer: 'Alex R. (#PK-88)',
  gpsStaging: true,
  deliveryAddress: 'Jl. Senopati No. 42 (0.8 km • 6 min ride)',
  throttled: false,
  cart: [
    { itemId: 'cortado' },
    { itemId: 'panini' }
  ],
  kdsTickets: [
    {
      id: 'ORD-401',
      channel: 'TABLE',
      destination: 'Table 04 (Window)',
      status: 'IN_PREP',
      migratedNote: null,
      items: [
        { id: 'cortado', name: 'Single-Origin Oat Cortado', station: 'BARISTA', prepMins: 2 },
        { id: 'panini', name: 'Truffle Mortadella & Burrata Focaccia', station: 'KITCHEN', prepMins: 6 }
      ]
    },
    {
      id: 'ORD-402',
      channel: 'PICKUP',
      destination: 'Maya K. (#PK-19)',
      status: 'STAGED_WAIT_GPS',
      migratedNote: null,
      items: [
        { id: 'iced_matcha', name: 'Uji Ceremonial Iced Matcha Latte', station: 'BARISTA', prepMins: 3 }
      ]
    },
    {
      id: 'ORD-403',
      channel: 'DELIVERY',
      destination: 'Courier #GRAB-912 • SCBD Lot 8',
      status: 'IN_PREP',
      migratedNote: null,
      items: [
        { id: 'iced_matcha', name: 'Uji Ceremonial Iced Matcha Latte', station: 'BARISTA', prepMins: 3 },
        { id: 'panini', name: 'Truffle Mortadella & Burrata Focaccia', station: 'KITCHEN', prepMins: 6 }
      ]
    }
  ]
};

function switchView(viewName, btnEl) {
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.getElementById('view-' + viewName).classList.add('active');
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  renderAll();
}

function getMenuVisual(item, imageClass) {
  if (!item.image) {
    return `<span class="food-emoji" role="img" aria-label="${item.name}">${item.preview}</span>`;
  }
  return `
    <img class="${imageClass}" src="${item.image}" alt="Foto ${item.name}"
      onerror="this.hidden=true; this.nextElementSibling.hidden=false">
    <span class="food-emoji" role="img" aria-label="${item.name}" hidden>${item.preview}</span>
  `;
}

function setFulfillmentMode(newMode) {
  state.mode = newMode;
  // Remove any locked dine-in items from cart if switching to PICKUP or DELIVERY
  state.cart = state.cart.filter(c => {
    const item = MENU_DATA.find(m => m.id === c.itemId);
    return item && item.allowedModes.includes(newMode);
  });
  renderAll();
}

function getTableDestination() {
  const number = state.tableNumber.padStart(2, '0');
  return `Table ${number} (${state.tableThemes[number]})`;
}

function setActiveTable(tableNumber) {
  state.tableNumber = tableNumber;
  renderAll();
}

function setActiveTableTheme(theme) {
  state.tableThemes[state.tableNumber] = theme;
  renderAll();
}

function addToCart(itemId, variantIndex = 0) {
  state.cart.push({ itemId, variantIndex });
  renderCart();
}

function updateMenuVariantPrice(itemId, variantIndex) {
  const item = MENU_DATA.find(menuItem => menuItem.id === itemId);
  if (!item) return;
  const variant = item.variants[Number(variantIndex)];
  if (!variant) return;
  document.getElementById(`menu-price-${itemId}`).textContent =
    `$${(item.price + variant.price).toFixed(2)}`;
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  renderCart();
}

function toggleThrottle() {
  state.throttled = !state.throttled;
  renderAll();
}

function simulateProximityPing() {
  let updated = 0;
  state.kdsTickets.forEach(t => {
    if (t.channel === 'PICKUP' && t.status === 'STAGED_WAIT_GPS') {
      t.status = 'IN_PREP (GPS <3m PINGED)';
      t.migratedNote = 'GPS Ping Received: Promoted from STAGED to Active Espresso Queue!';
      updated++;
    }
  });
  if (updated === 0) {
    alert('All Pick-Up orders are already in active prep!');
  }
  renderKDS();
}

function migrateTicketChannel(ticketId, newChannel) {
  const ticket = state.kdsTickets.find(t => t.id === ticketId);
  if (!ticket || ticket.channel === newChannel) return;

  const oldChannel = ticket.channel;
  ticket.channel = newChannel;
  if (newChannel === 'TABLE') ticket.destination = 'Table 08 (Migrated Walk-In)';
  if (newChannel === 'PICKUP') ticket.destination = 'Counter Pickup Shelf';
  if (newChannel === 'DELIVERY') ticket.destination = 'Instant Courier Dispatch';

  ticket.migratedNote = `LIVE MIGRATION: ${oldChannel} → ${newChannel}. Barista & Kitchen vessels updated automatically.`;
  renderKDS(ticketId);
}

function advanceTicketStatus(ticketId) {
  const idx = state.kdsTickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return;
  const t = state.kdsTickets[idx];
  if (t.status.startsWith('STAGED')) {
    t.status = 'IN_PREP';
  } else if (t.status.startsWith('IN_PREP')) {
    t.status = 'READY_FOR_HANDOFF';
  } else {
    state.kdsTickets.splice(idx, 1);
  }
  renderKDS();
}

function submitOrderToKDS() {
  if (state.cart.length === 0) {
    alert('Add at least one item to fire an order to the KDS.');
    return;
  }
  const id = 'ORD-' + Math.floor(404 + Math.random() * 500);
  const dest = state.mode === 'TABLE'
    ? getTableDestination()
    : state.mode === 'PICKUP'
      ? state.pickupCustomer
      : state.deliveryAddress;

  const items = state.cart.map(c => {
    const m = MENU_DATA.find(x => x.id === c.itemId);
    const variant = m.variants[c.variantIndex || 0];
    return {
      id: m.id,
      name: m.name,
      variant: variant.name,
      price: m.price + variant.price,
      station: m.station,
      prepMins: m.prepMins
    };
  });

  state.kdsTickets.unshift({
    id,
    channel: state.mode,
    destination: dest,
    status: (state.mode === 'PICKUP' && state.gpsStaging) ? 'STAGED_WAIT_GPS' : 'IN_PREP',
    migratedNote: 'Newly fired from POS state engine',
    items
  });

  state.cart = [];
  const kdsBtn = document.querySelectorAll('.view-btn')[1];
  switchView('KDS', kdsBtn);
}

function renderContextBar() {
  const bar = document.getElementById('contextBar');
  const codeEl = document.getElementById('activeStateCode');
  codeEl.textContent = `STATE: MODE_${state.mode}_FULFILLMENT`;

  document.querySelectorAll('.mode-card').forEach(card => {
    card.classList.toggle('active', card.dataset.mode === state.mode);
  });

  document.getElementById('eta-TABLE').textContent = '~5–8 mins';
  document.getElementById('eta-PICKUP').textContent = state.throttled ? '~23–25 mins (+15m)' : '~8–10 mins';
  document.getElementById('eta-DELIVERY').textContent = state.throttled ? '~35–40 mins (+15m)' : '~20–25 mins';

  if (state.mode === 'TABLE') {
    bar.innerHTML = `
      <div class="context-field">
        <label for="activeTableNumber">Nomor meja:</label>
        <select id="activeTableNumber" class="input-control" onchange="setActiveTable(this.value)">
          ${Array.from({ length: 12 }, (_, index) => {
            const number = String(index + 1).padStart(2, '0');
            return `<option value="${number}" ${state.tableNumber === number ? 'selected' : ''}>Meja ${number}</option>`;
          }).join('')}
        </select>
      </div>
      <div class="context-field">
        <label for="activeTableTheme">Area meja:</label>
        <select id="activeTableTheme" class="input-control" onchange="setActiveTableTheme(this.value)">
          ${['Window', 'Patio', 'Roastery Bar'].map(theme =>
            `<option value="${theme}" ${state.tableThemes[state.tableNumber] === theme ? 'selected' : ''}>${theme}</option>`
          ).join('')}
        </select>
      </div>
      <div class="context-field">
        <label>Payment Flow:</label>
        <span style="color:var(--accent-table); font-weight:700;">Open Tab Enabled (Pay at end of visit)</span>
      </div>
      <div class="state-rule-chip">Rule: Full Ceramic &amp; Carafe Menu Unlocked</div>
    `;
  } else if (state.mode === 'PICKUP') {
    bar.innerHTML = `
      <div class="context-field">
        <label>Pickup Identity:</label>
        <input class="input-control" value="${state.pickupCustomer}" onchange="state.pickupCustomer=this.value; renderCart();" />
      </div>
      <div class="context-field">
        <label>Proximity Sync:</label>
        <span style="color:var(--accent-pickup); font-weight:700;">Hold Iced Drinks in STAGED Until &lt;3m Away</span>
      </div>
      <div class="state-rule-chip" style="border-left-color:var(--accent-pickup);">Rule: Dine-In Carafes &amp; Skillets Auto-Locked</div>
    `;
  } else {
    bar.innerHTML = `
      <div class="context-field">
        <label>Isochrone Zone (&lt;10m Drive):</label>
        <input class="input-control" style="min-width:260px;" value="${state.deliveryAddress}" onchange="state.deliveryAddress=this.value; renderCart();" />
      </div>
      <div class="state-rule-chip" style="border-left-color:var(--accent-delivery);">Rule: Split Ice/Espresso &amp; Tamper Seal Enforced</div>
    `;
  }
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  document.querySelectorAll('.filter-chip').forEach(button => {
    const active = button.dataset.category === state.menuCategory;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const categoryLabels = { MEAL: 'Makanan', DRINK: 'Minuman', SNACK: 'Camilan' };
  const visibleItems = MENU_DATA.filter(item =>
    state.menuCategory === 'ALL' || item.category === state.menuCategory
  );
  grid.innerHTML = visibleItems.map(item => {
    const unlocked = item.allowedModes.includes(state.mode);
    const vessel = item.vessels[state.mode];
    const mod = item.modifiers[state.mode];
    const variants = item.variants.map((variant, index) =>
      `<option value="${index}">${variant.name}${variant.price ? ` (+$${variant.price.toFixed(2)})` : ''}</option>`
    ).join('');

    return `
      <article class="menu-card ${unlocked ? '' : 'locked'}">
        <div class="menu-card-image">
          ${getMenuVisual(item, 'menu-food-image')}
        </div>
        <div>
          <div class="menu-top">
            <span class="station-tag">${categoryLabels[item.category]}</span>
            <span class="prep-badge">&#9201; ${item.prepMins}m prep</span>
          </div>
          <div class="menu-title">${item.name}</div>
          <div class="menu-desc">${item.desc}</div>

          ${unlocked ? `
            <label class="menu-variant-label" for="variant-${item.id}">Pilih variasi</label>
            <select class="input-control menu-variant" id="variant-${item.id}"
              onchange="updateMenuVariantPrice('${item.id}', this.value)">
              ${variants}
            </select>
            <div class="fulfillment-meta">
              <div class="meta-row">
                <span class="meta-label">Vessel:</span>
                <span class="meta-val">${vessel}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Auto-Rule:</span>
                <span class="meta-val">${mod}</span>
              </div>
            </div>
          ` : `
            <div class="lock-reason">&#128274; ${item.lockReason}</div>
          `}
        </div>

        <div class="menu-footer">
          <span class="menu-price" id="menu-price-${item.id}">$${item.price.toFixed(2)}</span>
          <button class="btn-add" ${unlocked ? '' : 'disabled'}
            onclick="addToCart('${item.id}', Number(document.getElementById('variant-${item.id}').value))">
            ${unlocked ? 'Tambahkan' : 'Hanya makan di tempat'}
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function setMenuCategory(category) {
  state.menuCategory = category;
  renderMenu();
}

function renderCart() {
  const banner = document.getElementById('cartBanner');
  const itemsContainer = document.getElementById('cartItems');
  const syncBox = document.getElementById('syncEngineBox');

  const colors = {
    TABLE: { bg: 'var(--accent-table-bg)', border: 'var(--accent-table)', label: 'IN-CAFE TABLE' },
    PICKUP: { bg: 'var(--accent-pickup-bg)', border: 'var(--accent-pickup)', label: 'PICK-UP SHELF' },
    DELIVERY: { bg: 'var(--accent-delivery-bg)', border: 'var(--accent-delivery)', label: 'COURIER DELIVERY' }
  }[state.mode];

  const destLabel = state.mode === 'TABLE' ? getTableDestination() : state.mode === 'PICKUP' ? state.pickupCustomer : 'Isochrone Verified';
  banner.style.background = colors.bg;
  banner.style.border = `1px solid ${colors.border}`;
  banner.innerHTML = `<span>${colors.label}</span><span>${destLabel}</span>`;

  if (state.cart.length === 0) {
    itemsContainer.innerHTML = `<div class="cart-empty">Cart is empty. Add menu items to see Prep-Time Normalization.</div>`;
  } else {
    itemsContainer.innerHTML = state.cart.map((c, idx) => {
      const item = MENU_DATA.find(m => m.id === c.itemId);
      const variant = item.variants[c.variantIndex || 0];
      return `
        <div class="cart-item">
          <div class="cart-item-head">
            <span>${item.name}</span>
            <span>$${(item.price + variant.price).toFixed(2)}</span>
          </div>
          <div class="cart-item-mod">${variant.name}</div>
          <div class="cart-item-mod">Vessel: ${item.vessels[state.mode]}</div>
          <div class="cart-item-mod">Station: ${item.station} (${item.prepMins}m prep)</div>
          <button class="cart-item-remove" onclick="removeFromCart(${idx})">Remove</button>
        </div>
      `;
    }).join('');
  }

  // Calculate KDS Prep-Time Normalization
  const detailed = state.cart.map(c => MENU_DATA.find(m => m.id === c.itemId));
  const kitchenMax = Math.max(0, ...detailed.filter(i => i.station === 'KITCHEN').map(i => i.prepMins));
  const baristaMax = Math.max(0, ...detailed.filter(i => i.station === 'BARISTA').map(i => i.prepMins));

  if (kitchenMax > 0 && baristaMax > 0 && kitchenMax > baristaMax) {
    const holdDiff = kitchenMax - baristaMax;
    syncBox.innerHTML = `
      <div class="sync-title">
        <span>&#9201; KDS Prep-Time Normalization</span>
        <span>+${holdDiff} mins Hold</span>
      </div>
      <div class="sync-detail">
        Kitchen takes ${kitchenMax}m vs. Barista ${baristaMax}m. KDS holds Barista ticket for <strong>+${holdDiff} mins</strong> so hot food &amp; drinks finish together.
      </div>
    `;
  } else {
    syncBox.innerHTML = `
      <div class="sync-title">
        <span>&#9201; KDS Prep-Time Normalization</span>
        <span>Immediate Fire</span>
      </div>
      <div class="sync-detail">Single-station or equal-time items: all stations fire immediately upon checkout.</div>
    `;
  }

  const subtotal = state.cart.reduce((sum, cartItem) => {
    const item = MENU_DATA.find(menuItem => menuItem.id === cartItem.itemId);
    return sum + item.price + item.variants[cartItem.variantIndex || 0].price;
  }, 0);
  const fee = state.mode === 'TABLE' ? 0 : state.mode === 'PICKUP' ? 0.50 : 2.50;
  document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cartFee').textContent = `$${fee.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `$${(subtotal + fee).toFixed(2)}`;
}

function renderKDS(flashedTicketId = null) {
  document.getElementById('metricActiveCount').textContent = state.kdsTickets.length;
  document.getElementById('metricTableLoad').textContent = state.throttled ? '88% (HIGH)' : '72%';
  document.getElementById('metricStagedCount').textContent =
    state.kdsTickets.filter(t => t.status.startsWith('STAGED')).length;

  const board = document.getElementById('kdsBoard');
  board.innerHTML = state.kdsTickets.map(ticket => {
    const kitchenMax = Math.max(0, ...ticket.items.filter(i => i.station === 'KITCHEN').map(i => i.prepMins));

    const itemsHtml = ticket.items.map(it => {
      const ref = MENU_DATA.find(m => m.id === it.id);
      const vessel = ref ? ref.vessels[ticket.channel] : 'Standard Vessel';
      const holdMins = (it.station === 'BARISTA' && kitchenMax > it.prepMins) ? (kitchenMax - it.prepMins) : 0;
      const displayName = ref ? ref.name : it.name;

      return `
        <div class="ticket-item">
          <div class="ticket-item-title">
            <span>[${it.station}] ${displayName}${it.variant ? ` · ${it.variant}` : ''}</span>
            <span>${it.prepMins}m</span>
          </div>
          ${it.price !== undefined ? `<div class="ticket-item-vessel">Item price: $${it.price.toFixed(2)}</div>` : ''}
          <div class="ticket-item-vessel">Vessel: <strong>${vessel}</strong></div>
          ${holdMins > 0 ? `<div style="color:#d8b4fe; font-size:0.73rem; font-weight:700; margin-top:0.2rem;">&#9208; Barista Sync Hold: Delayed +${holdMins}m for Kitchen</div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="kds-ticket ${flashedTicketId === ticket.id ? 'migrated-flash' : ''}" data-channel="${ticket.channel}">
        <div class="ticket-header">
          <div>
            <div class="ticket-id">${ticket.id} &bull; ${ticket.channel}</div>
            <div class="ticket-dest">${ticket.destination}</div>
          </div>
          <span class="ticket-state-badge">${ticket.status}</span>
        </div>

        ${ticket.migratedNote ? `<div class="migration-notice">${ticket.migratedNote}</div>` : ''}

        <div class="ticket-items">${itemsHtml}</div>

        <div class="ticket-controls">
          <div class="migrate-row">
            <span style="color:var(--text-muted); font-weight:600;">&#8644; Migrate Channel:</span>
            <select class="input-control" onchange="migrateTicketChannel('${ticket.id}', this.value)">
              <option value="TABLE" ${ticket.channel === 'TABLE' ? 'selected' : ''}>In-Cafe Table</option>
              <option value="PICKUP" ${ticket.channel === 'PICKUP' ? 'selected' : ''}>Pick-Up Shelf</option>
              <option value="DELIVERY" ${ticket.channel === 'DELIVERY' ? 'selected' : ''}>Courier Delivery</option>
            </select>
          </div>
          <button class="btn-advance" onclick="advanceTicketStatus('${ticket.id}')">
            Advance Ticket State &rarr;
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderAll() {
  const badge = document.getElementById('globalThrottleBadge');
  const banner = document.getElementById('throttleBanner');
  const kdsBtn = document.getElementById('btnThrottleToggle');

  if (state.throttled) {
    badge.textContent = 'Load Balancer: THROTTLED (+15m Online ETA)';
    badge.classList.add('throttled');
    banner.classList.add('visible');
    if (kdsBtn) kdsBtn.classList.add('active-toggle');
  } else {
    badge.textContent = 'Load Balancer: Normal (ETAs Standard)';
    badge.classList.remove('throttled');
    banner.classList.remove('visible');
    if (kdsBtn) kdsBtn.classList.remove('active-toggle');
  }

  renderContextBar();
  renderMenu();
  renderCart();
  renderKDS();
}

// Initialize App on DOM Load
document.addEventListener('DOMContentLoaded', renderAll);