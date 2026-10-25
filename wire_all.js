const fs = require('fs');
const path = require('path');

const root = __dirname;

// 1. apps/collector/login.html
{
  const file = path.join(root, 'apps', 'collector', 'login.html');
  let content = fs.readFileSync(file, 'utf8');

  // Fix back button
  content = content.replace('onclick="history.back()"', 'onclick="window.location.href=\'../../index.html\'"');

  // Add register link under legal / buttons if not present
  if (!content.includes('registration_collector.html')) {
    content = content.replace(
      '<!-- Ghana Card National ID Option -->',
      `<!-- Ghana Card / New Registration Option -->
      <a href="./registration_collector.html" class="w-full h-[52px] bg-emerald-50 hover:bg-emerald-100 active:scale-[0.99] border border-emerald-300 text-emerald-800 font-label-lg text-[14.5px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
        <span class="material-symbols-outlined text-[20px] text-emerald-700">badge</span>
        <span>Register New Collector & Aboboyaa</span>
      </a>`
    );
  }

  // Fix handleContinue to redirect to verification or home
  content = content.replace(
    `      setTimeout(() => {
        submitBtn.innerHTML = \`
          <span class="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Code sent</span>
        \`;
      }, 1000);`,
    `      try {
        const state = JSON.parse(localStorage.getItem('borlaalert_global_state') || '{}');
        state.collector = state.collector || {};
        state.collector.phone = val;
        state.collector.loggedIn = true;
        localStorage.setItem('borlaalert_global_state', JSON.stringify(state));
      } catch(e){}
      setTimeout(() => {
        submitBtn.innerHTML = \`
          <span class="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Code verified!</span>
        \`;
        setTimeout(() => {
          window.location.href = './home.html';
        }, 400);
      }, 800);`
  );

  // Inject shared-pwa.js
  if (!content.includes('shared-pwa.js')) {
    content = content.replace('</body></html>', '<script src="../../shared-pwa.js"></script>\n</body></html>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/login.html');
}

// 2. apps/collector/registration_collector.html
{
  const file = path.join(root, 'apps', 'collector', 'registration_collector.html');
  let content = fs.readFileSync(file, 'utf8');

  // Back button
  content = content.replace('onclick="history.back()"', 'onclick="window.location.href=\'./login.html\'"');

  // Form submission handler
  if (!content.includes('handleCollectorRegistration')) {
    content = content.replace(
      'id="collectorRegForm" onsubmit="event.preventDefault();"',
      'id="collectorRegForm" onsubmit="event.preventDefault(); handleCollectorRegistration();"'
    );

    const regScript = `
<script>
  function handleCollectorRegistration() {
    const name = document.getElementById('fullName')?.value || 'Emmanuel Mensah';
    const phone = document.getElementById('phone')?.value || '024 123 4567';
    const ghanaCard = document.getElementById('ghanaCard')?.value || 'GHA-729481029-4';
    const zone = document.getElementById('zone')?.value || 'East Legon';
    const plate = document.getElementById('plateNumber')?.value || 'GW 4921-24';
    const vehicle = document.querySelector('input[name="vehicle_type"]:checked')?.value || 'aboboyaa';

    try {
      const state = JSON.parse(localStorage.getItem('borlaalert_global_state') || '{}');
      state.collector = state.collector || {};
      state.collector.profile = { name, phone, ghanaCard, zone, plate, vehicle };
      state.collector.loggedIn = true;
      localStorage.setItem('borlaalert_global_state', JSON.stringify(state));
    } catch(e) {}

    window.location.href = './verification.html';
  }
</script>
<script src="../../shared-pwa.js"></script>
</body></html>`;

    content = content.replace('</body></html>', regScript);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/registration_collector.html');
}

// 3. apps/collector/verification.html
{
  const file = path.join(root, 'apps', 'collector', 'verification.html');
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace('onclick="history.back()"', 'onclick="window.location.href=\'./registration_collector.html\'"');

  content = content.replace(
    `      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">task_alt</span><span>Submitted Successfully!</span>';
      }, 1200);`,
    `      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">task_alt</span><span>Submitted Successfully!</span>';
        setTimeout(() => {
          window.location.href = './verification_review.html';
        }, 500);
      }, 1000);`
  );

  if (!content.includes('shared-pwa.js')) {
    content = content.replace('</body></html>', '<script src="../../shared-pwa.js"></script>\n</body></html>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/verification.html');
}

// 4. apps/collector/verification_review.html
{
  const file = path.join(root, 'apps', 'collector', 'verification_review.html');
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace('onclick="history.back()"', 'onclick="window.location.href=\'./home.html\'"');

  // Add instant demo activation button
  if (!content.includes('demoActivate()')) {
    content = content.replace(
      '<button class="w-full py-3.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803d]',
      `<button class="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 font-label-md text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-colors shadow-md" onclick="demoActivate()" type="button">
        <span class="material-symbols-outlined text-[18px]">bolt</span>
        <span>Fast-Track Approval & Enter Radar (Demo)</span>
      </button>
      <button class="w-full py-3.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803d]`
    );

    const script = `
<script>
  function demoActivate() {
    try {
      const state = JSON.parse(localStorage.getItem('borlaalert_global_state') || '{}');
      state.collector = state.collector || {};
      state.collector.verified = true;
      state.collector.loggedIn = true;
      localStorage.setItem('borlaalert_global_state', JSON.stringify(state));
    } catch(e) {}
    window.location.href = './home.html';
  }
</script>
<script src="../../shared-pwa.js"></script>
</body></html>`;
    content = content.replace('</body></html>', script);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/verification_review.html');
}

// 5. apps/collector/navigation.html
{
  const file = path.join(root, 'apps', 'collector', 'navigation.html');
  let content = fs.readFileSync(file, 'utf8');

  // Fix arrival handler to redirect
  content = content.replace(
    `    setTimeout(() => {
      btn.classList.remove('bg-emerald-900');
      btn.classList.add('bg-emerald-700');
      btn.innerHTML = \`
        <span class="material-symbols-outlined text-[24px]">verified</span>
        <span class="font-bold tracking-wide">CONFIRMED AT GATE 14</span>
        <span class="material-symbols-outlined text-[24px]">done_all</span>
      \`;
    }, 850);`,
    `    setTimeout(() => {
      btn.classList.remove('bg-emerald-900');
      btn.classList.add('bg-emerald-700');
      btn.innerHTML = \`
        <span class="material-symbols-outlined text-[24px]">verified</span>
        <span class="font-bold tracking-wide">CONFIRMED AT GATE 14</span>
        <span class="material-symbols-outlined text-[24px]">done_all</span>
      \`;
      setTimeout(() => {
        window.location.href = './arrived.html';
      }, 500);
    }, 850);`
  );

  if (!content.includes('shared-pwa.js')) {
    content = content.replace('</body></html>', '<script src="../../shared-pwa.js"></script>\n</body></html>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/navigation.html');
}

// 6. apps/collector/arrived.html
{
  const file = path.join(root, 'apps', 'collector', 'arrived.html');
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace('onclick="history.back()"', 'onclick="window.location.href=\'./navigation.html\'"');

  content = content.replace(
    `        setTimeout(function() {
          completeBtn.classList.remove('bg-primary', 'hover:bg-primary-container');
          completeBtn.classList.add('bg-primary-container');
          completeBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">check_circle</span><span>Pickup Recorded!</span>';
        }, 900);`,
    `        setTimeout(function() {
          completeBtn.classList.remove('bg-primary', 'hover:bg-primary-container');
          completeBtn.classList.add('bg-primary-container');
          completeBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">check_circle</span><span>Pickup Recorded!</span>';
          setTimeout(function() {
            window.location.href = './gate_checklist.html';
          }, 500);
        }, 900);`
  );

  if (!content.includes('shared-pwa.js')) {
    content = content.replace('</body></html>', '<script src="../../shared-pwa.js"></script>\n</body></html>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/arrived.html');
}

// 7. apps/collector/gate_checklist.html
{
  const file = path.join(root, 'apps', 'collector', 'gate_checklist.html');
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace('onclick="history.back()"', 'onclick="window.location.href=\'./arrived.html\'"');

  content = content.replace(
    `        setTimeout(function() {
          completeBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
          completeBtn.classList.add('bg-slate-900');
          completeBtn.innerHTML = '<span class="flex items-center justify-center gap-2 w-full"><span class="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span><span>Pickup Verified & Paid!</span></span>';
        }, 850);`,
    `        setTimeout(function() {
          completeBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
          completeBtn.classList.add('bg-slate-900');
          completeBtn.innerHTML = '<span class="flex items-center justify-center gap-2 w-full"><span class="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span><span>Pickup Verified & Paid!</span></span>';
          setTimeout(function() {
            window.location.href = './trip_manifest.html';
          }, 600);
        }, 850);`
  );

  if (!content.includes('shared-pwa.js')) {
    content = content.replace('</body></html>', '<script src="../../shared-pwa.js"></script>\n</body></html>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/gate_checklist.html');
}

// 8. apps/collector/trip_manifest.html
{
  const file = path.join(root, 'apps', 'collector', 'trip_manifest.html');
  let content = fs.readFileSync(file, 'utf8');

  // Fix navigation button for stop #9
  content = content.replace(
    'class="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-label-sm text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-sm"',
    'class="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-label-sm text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-sm" onclick="window.location.href=\'./navigation.html\'"'
  );

  // Fix bottom nav
  content = content.replace('data-path="home" href="#"', 'data-path="home" href="./home.html"');
  content = content.replace('data-path="jobs" href="#"', 'data-path="jobs" href="./trip_manifest.html"');
  content = content.replace('data-path="profile" href="#"', 'data-path="profile" href="./account.html"');

  if (!content.includes('shared-pwa.js')) {
    content = content.replace('</body></html>', '<script src="../../shared-pwa.js"></script>\n</body></html>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/trip_manifest.html');
}

// 9. apps/collector/account.html
{
  const file = path.join(root, 'apps', 'collector', 'account.html');
  let content = fs.readFileSync(file, 'utf8');

  // Fix bottom nav
  content = content.replace('data-path="home" href="#"', 'data-path="home" href="./home.html"');
  content = content.replace('data-path="jobs" href="#"', 'data-path="jobs" href="./trip_manifest.html"');
  content = content.replace('data-path="ratings" href="#"', 'data-path="ratings" href="./account.html"');
  content = content.replace('data-path="profile" href="#"', 'data-path="profile" href="./account.html"');

  // Fix sign out button
  content = content.replace(
    '<button class="w-full flex items-center justify-between p-space-md min-h-[56px] hover:bg-error-container/20 transition-colors text-left group" type="button">',
    '<button class="w-full flex items-center justify-between p-space-md min-h-[56px] hover:bg-error-container/20 transition-colors text-left group" id="collectorSignOutBtn" type="button" onclick="handleSignOut()">'
  );

  if (!content.includes('handleSignOut')) {
    const script = `
<script>
  function handleSignOut() {
    try {
      const state = JSON.parse(localStorage.getItem('borlaalert_global_state') || '{}');
      if (state.collector) {
        state.collector.loggedIn = false;
        localStorage.setItem('borlaalert_global_state', JSON.stringify(state));
      }
    } catch(e) {}
    window.location.href = './login.html';
  }
</script>
<script src="../../shared-pwa.js"></script>
</body></html>`;
    content = content.replace('</body></html>', script);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated collector/account.html');
}

// 10. apps/admin/index.html
{
  const file = path.join(root, 'apps', 'admin', 'index.html');
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('window.location.href = \'./admin.html\'')) {
    content = content.replace(
      '</body></html>',
      `<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.location.href = './admin.html';
    }, 2000);
  });
</script>
<script src="../../shared-pwa.js"></script>
</body></html>`
    );
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated admin/index.html');
}

// 11. apps/admin/admin.html
{
  const file = path.join(root, 'apps', 'admin', 'admin.html');
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('shared-pwa.js')) {
    content = content.replace('</body>', '<script src="../../shared-pwa.js"></script>\n</body>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated admin/admin.html');
}

console.log('All pages linked successfully!');
