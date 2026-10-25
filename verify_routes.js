const http = require('http');

const urls = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/shared-pwa.js',
  // Resident App Flow
  '/apps/resident/index.html',
  '/apps/resident/onboarding.html',
  '/apps/resident/login.html',
  '/apps/resident/registration.html',
  '/apps/resident/otp.html',
  '/apps/resident/home.html',
  '/apps/resident/request.html',
  '/apps/resident/collector-match.html',
  '/apps/resident/payment.html',
  '/apps/resident/processing.html',
  '/apps/resident/confirmed.html',
  '/apps/resident/tracking.html',
  '/apps/resident/complete.html',
  '/apps/resident/rating.html',
  '/apps/resident/receipt.html',
  '/apps/resident/pickups.html',
  '/apps/resident/receipts.html',
  '/apps/resident/account.html',
  // Collector App Flow
  '/apps/collector/index.html',
  '/apps/collector/login.html',
  '/apps/collector/register.html',
  '/apps/collector/id-upload.html',
  '/apps/collector/pending.html',
  '/apps/collector/home.html',
  '/apps/collector/request-alert.html',
  '/apps/collector/navigation.html',
  '/apps/collector/arrived.html',
  '/apps/collector/jobs.html',
  '/apps/collector/ratings.html',
  '/apps/collector/profile.html',
  // Admin App Flow
  '/apps/admin/index.html',
  '/apps/admin/login.html',
  '/apps/admin/dashboard.html',
  '/apps/admin/revenue.html',
  '/apps/admin/live-map.html',
  '/apps/admin/users.html',
  '/apps/admin/settings.html'
];

function fetchWithRedirect(url, maxRedirects = 3) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location && maxRedirects > 0) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `http://localhost:3000${redirectUrl}`;
        }
        return resolve(fetchWithRedirect(redirectUrl, maxRedirects - 1));
      }
      resolve({ statusCode: res.statusCode, ok: res.statusCode === 200 });
    }).on('error', (err) => {
      resolve({ statusCode: err.message, ok: false });
    });
  });
}

async function run() {
  console.log('Testing all BorlaAlert GH routes on http://localhost:3000...\n');
  let passed = 0;
  for (const u of urls) {
    const res = await fetchWithRedirect(`http://localhost:3000${u}`);
    if (res.ok) {
      console.log(`[PASS] ${res.statusCode} - ${u}`);
      passed++;
    } else {
      console.error(`[FAIL] ${res.statusCode} - ${u}`);
    }
  }
  console.log(`\nVerified ${passed}/${urls.length} routes online and fully accessible!`);
  if (passed === urls.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

run();
