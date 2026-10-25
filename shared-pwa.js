/**
 * BorlaAlert GH — shared state, service worker, and install prompt.
 */
(function() {
  'use strict';

  // 1. Strict URL Normalization (prevents clean URL path resolution issues on mobile)
  if (window.location.pathname.match(/\/apps\/[^\/.]+$/)) {
    window.location.replace(window.location.pathname + '/' + window.location.search + window.location.hash);
    return;
  }

  // 2. Monorepo Path Resolver
  function getRootRelativePath(target) {
    const path = window.location.pathname;
    if (path.includes('/apps/resident') || path.includes('/apps/collector') || path.includes('/apps/admin')) {
      return '../../' + target;
    }
    return './' + target;
  }

  // 3. Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = getRootRelativePath('sw.js');
      navigator.serviceWorker.register(swUrl)
        .then(reg => {
          console.log('[BorlaAlert] Service worker registered:', reg.scope);
        })
        .catch(err => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
  }

  // 4. Material 3 / Google State Store
  const STORAGE_KEY = 'borlaalert_global_state';
  const defaultState = {
    user: {
      name: 'Akua Mensah',
      phone: '024 582 1928',
      role: 'resident',
      address: 'House 14, Lagos Ave, East Legon',
      ecoPoints: 850,
      wallet: 'MTN Mobile Money'
    },
    collector: {
      name: 'Emmanuel Mensah',
      phone: '024 123 4567',
      vehicle: 'Aboboyaa (GW-4921-24)',
      dutyStatus: 'ONLINE',
      rating: 4.98,
      todayEarnings: 190.00,
      todayTrips: 8,
      loggedIn: true
    },
    activePickup: {
      id: 'BLA-GH-77402',
      status: 'EN_ROUTE',
      wasteType: 'Standard Household Borla',
      bags: 3,
      estWeight: '8.4 kg',
      momoFee: 2.00,
      collectorEta: '3 mins',
      timestamp: new Date().toISOString()
    }
  };

  function getState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? { ...defaultState, ...JSON.parse(data) } : defaultState;
    } catch (e) {
      return defaultState;
    }
  }

  function saveState(updates) {
    const current = getState();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('borlaStateChange', { detail: updated }));
    return updated;
  }

  window.BorlaStore = {
    get: getState,
    set: saveState,
    awardEcoPoints: (pts) => {
      const s = getState();
      const currentPts = (s.user && s.user.ecoPoints) || 850;
      saveState({ user: { ...s.user, ecoPoints: currentPts + pts } });
    },
    createPickup: (data) => {
      const pickup = {
        id: 'BLA-GH-' + Math.floor(10000 + Math.random() * 90000),
        status: 'EN_ROUTE',
        momoFee: 2.00,
        collectorEta: '3 mins',
        timestamp: new Date().toISOString(),
        ...data
      };
      saveState({ activePickup: pickup });
      return pickup;
    },
    completePickup: () => {
      const s = getState();
      saveState({
        activePickup: { ...s.activePickup, status: 'COMPLETED' },
        collector: {
          ...s.collector,
          todayEarnings: (s.collector.todayEarnings || 190) + 35.00,
          todayTrips: (s.collector.todayTrips || 8) + 1
        }
      });
    }
  };

  // 5. Google Material 3 Styles Injection (Typography, Ripples, Bottom Sheet)
  const m3Style = document.createElement('style');
  m3Style.id = 'google-m3-system';
  m3Style.textContent = `
    /* Google Material 3 Ripple Effect */
    button, a.btn, [role="button"], .m3-interactive {
      position: relative;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    .m3-ripple-wave {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: m3-ripple-expand 550ms cubic-bezier(0.2, 0, 0, 1);
      background-color: currentColor;
      opacity: 0.16;
      pointer-events: none;
    }
    @keyframes m3-ripple-expand {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* Google Sans / Outfit typography touch */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
    .font-google-sans {
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }

    /* Google Bottom Navigation Bar Active Indicator Pill */
    nav[data-active-classes] a[aria-current="page"] {
      position: relative;
    }

    /* Google Sparkle Animation */
    @keyframes google-gemini-shimmer {
      0% { filter: hue-rotate(0deg); }
      50% { filter: hue-rotate(45deg); }
      100% { filter: hue-rotate(0deg); }
    }
    .gemini-gradient {
      background: linear-gradient(135deg, #4285F4 0%, #9B72CF 50%, #D96570 100%);
      animation: google-gemini-shimmer 8s infinite linear;
    }
  `;
  document.head.appendChild(m3Style);

  // 6. Material 3 Ripple & Native Haptic Trigger
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('button, [role="button"], a.btn, nav a');
    if (!btn || btn.disabled) return;

    // Subtle tactile haptic on Android / supported devices
    if ('vibrate' in navigator) {
      try { navigator.vibrate(8); } catch(err) {}
    }

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'm3-ripple-wave';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    const oldRipple = btn.querySelector('.m3-ripple-wave');
    if (oldRipple) oldRipple.remove();

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // 7. Network Status Toast
  function showNetworkToast(isOnline) {
    let toast = document.getElementById('borla-pwa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'borla-pwa-toast';
      toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-sans text-xs font-semibold backdrop-blur-xl transition-all duration-300 pointer-events-none transform -translate-y-12 opacity-0 border';
      document.body.appendChild(toast);
    }

    if (isOnline) {
      toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-sans text-xs font-semibold backdrop-blur-xl transition-all duration-300 pointer-events-none transform -translate-y-12 opacity-0 bg-[#006e2d]/95 text-white border-emerald-400/30';
      toast.innerHTML = '<span class="material-symbols-outlined text-[17px]">cloud_done</span><span>Back online</span>';
    } else {
      toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-sans text-xs font-semibold backdrop-blur-xl transition-all duration-300 pointer-events-none transform -translate-y-12 opacity-0 bg-slate-900/95 text-white border-amber-400/40';
      toast.innerHTML = '<span class="material-symbols-outlined text-[17px] text-amber-400">cloud_off</span><span>You are offline. Some actions will wait until you reconnect.</span>';
    }

    requestAnimationFrame(() => {
      toast.classList.remove('-translate-y-12', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('-translate-y-12', 'opacity-0');
    }, 4000);
  }

  window.addEventListener('online', () => showNetworkToast(true));
  window.addEventListener('offline', () => showNetworkToast(false));

  // 8. Google Play / Chrome PWA Installation Bottom Sheet
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.triggerPWAInstall = function() {
    let sheet = document.getElementById('google-play-install-sheet');
    if (!sheet) {
      sheet = document.createElement('div');
      sheet.id = 'google-play-install-sheet';
      sheet.className = 'fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-end justify-center transition-opacity duration-200';
      sheet.innerHTML = `
        <div class="w-full max-w-md bg-white rounded-t-[28px] p-6 shadow-2xl flex flex-col gap-5 animate-slideUp text-slate-900 font-sans" onclick="event.stopPropagation()">
          <div class="w-10 h-1.5 rounded-full bg-slate-300 mx-auto -mt-1"></div>
          
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 rounded-2xl bg-[#006e2d] p-2 flex items-center justify-center shrink-0 shadow-md">
              <img src="${getRootRelativePath('packages/brand-assets/logo.svg')}" alt="BorlaAlert" class="w-full h-full object-contain">
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <h3 class="font-bold text-lg text-slate-900 leading-tight">BorlaAlert GH</h3>
                <span class="material-symbols-outlined text-[18px] text-[#006e2d]" style="font-variation-settings: 'FILL' 1;">verified</span>
              </div>
              <span class="text-xs text-slate-500 font-medium">On-demand waste pickup · Greater Accra</span>
            </div>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed">Add BorlaAlert to your home screen for faster access to pickups.</p>

          <div class="flex items-center gap-2.5 pt-1">
            <button onclick="document.getElementById('google-play-install-sheet').remove()" class="flex-1 h-12 rounded-full border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors">
              Not Now
            </button>
            <button id="google-install-action" class="flex-1 h-12 rounded-full bg-[#006e2d] hover:bg-[#005320] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-95">
              <span class="material-symbols-outlined text-[18px]">download</span>
              <span>Install to Device</span>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(sheet);
      sheet.addEventListener('click', () => sheet.remove());

      document.getElementById('google-install-action').addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            sheet.remove();
          });
        } else {
          sheet.remove();
          alert('To install on your phone:\n\n• On iPhone Safari: Tap Share (⎋) ➔ "Add to Home Screen"\n• On Android Chrome: Tap Menu (⋮) ➔ "Install App"');
        }
      });
    }
  };

  // 9. Google Gemini Nano On-Device Vision Simulation Modal
  window.openGeminiVision = function() {
    let modal = document.getElementById('google-gemini-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'google-gemini-modal';
      modal.className = 'fixed inset-0 z-[10001] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none';
      modal.innerHTML = `
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white relative overflow-hidden" onclick="event.stopPropagation()">
          <div class="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl gemini-gradient flex items-center justify-center text-white shadow-sm">
                <span class="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-sm text-white">Estimate bags</span>
                  <span class="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase tracking-wider">Photo</span>
                </div>
                <span class="text-[11px] text-slate-400">Demo estimate from a sample photo</span>
              </div>
            </div>
            <button onclick="document.getElementById('google-gemini-modal').remove()" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <!-- Live Neural Camera Simulator -->
          <div class="relative w-full h-48 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpBs4FWdStRqgYj5o-iNAx71rhNFaeGpjpFAqI0VBRD4M23and_6Q1xKAFOQM-XKeBrE0DlVeCTYXGyL2lHzebk2r5KtxyS73mYlDzqPd8SJRa0lRuCnUUfpOvN6402Gp_bP7uxaJ3usAH2VbsJ1tkvOKOQFxCWNEkpDKxoIRq7FuUmzgF2l2dUrcMAxpeqdPStb5a5FnS0BE-edLnFZzr4KfFShdhB5B50JNdT3Qa8IWsB78VsOII" alt="Waste scanning preview" class="w-full h-full object-cover opacity-80">
            
            <!-- AI Bounding Box 1 -->
            <div class="absolute inset-x-8 inset-y-6 border-2 border-emerald-400/90 rounded-xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wider uppercase">
                  LDPE / PP Pure Sachets · 99.4%
                </span>
                <span class="px-1.5 py-0.5 rounded bg-black/60 font-mono text-[9px] text-emerald-400">8.4 kg EST</span>
              </div>
              <div class="flex items-center justify-between text-[9px] text-emerald-200 bg-black/50 px-2 py-1 rounded backdrop-blur-xs">
                <span>Purity Index: Grade A Clean</span>
                <span class="text-amber-300 font-bold">+120 EcoPoints</span>
              </div>
            </div>

            <!-- Scanning laser beam line -->
            <div class="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2"></div>
          </div>

          <!-- Analysis Telemetry -->
          <div class="flex flex-col gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Estimate:</span>
              <span class="text-emerald-400 font-semibold">About 3 bags · 8.4 kg</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Status:</span>
              <span class="text-slate-200 font-semibold">Demo only — not a live scan</span>
            </div>
          </div>

          <button onclick="document.getElementById('google-gemini-modal').remove()" class="w-full h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-transform active:scale-95">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>Use this estimate</span>
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', () => modal.remove());
    }
  };

  // Public product: no role-switcher or screen-catalog floating dock.
})();
