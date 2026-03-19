const http = require('http');

function api(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (body) headers['Content-Length'] = Buffer.byteLength(body);
    const req = http.request({ hostname: 'localhost', port: 5000, path, method, headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

let passed = 0;
let failed = 0;

function check(label, condition, detail) {
  if (condition) {
    passed++;
    console.log('PASS ' + label + (detail ? ' - ' + detail : ''));
  } else {
    failed++;
    console.log('FAIL ' + label + (detail ? ' - ' + detail : ''));
  }
}

async function run() {
  // Login as tutor
  console.log('--- Login as tutor ---');
  const loginRes = await api('POST', '/api/v1/auth/login', { email: 'tutor1@test.com', password: 'Tutor123!' });
  if (!loginRes.data.success) {
    console.log('FATAL: Cannot login as tutor:', JSON.stringify(loginRes.data));
    return;
  }
  const T = loginRes.data.data.accessToken;
  console.log('Tutor logged in OK\n');

  // Login as admin
  const adminLogin = await api('POST', '/api/v1/auth/login', { email: 'admin@induae.com', password: 'Admin123!' });
  const ADMIN = adminLogin.data.data.accessToken;
  console.log('Admin logged in OK\n');

  // Clean up from previous runs
  console.log('--- Cleanup ---');
  let templates = await api('GET', '/api/v1/tutors/availability/templates', null, T);
  if (templates.data.data) {
    for (const t of templates.data.data) {
      await api('DELETE', '/api/v1/tutors/availability/templates/' + t.id, null, T);
    }
  }
  let blocked = await api('GET', '/api/v1/tutors/availability/blocked-dates', null, T);
  if (blocked.data.data) {
    for (const b of blocked.data.data) {
      await api('DELETE', '/api/v1/tutors/availability/blocked-dates/' + b.id, null, T);
    }
  }
  let certs = await api('GET', '/api/v1/tutors/certifications', null, T);
  if (certs.data.data) {
    for (const c of certs.data.data) {
      await api('DELETE', '/api/v1/tutors/certifications/' + c.id, null, T);
    }
  }
  console.log('Cleanup done\n');

  // ============ M3: TUTOR SELF ============

  console.log('--- M3: Tutor Self-Management ---');

  let r = await api('GET', '/api/v1/tutors/profile', null, T);
  check('EP1 GET /tutors/profile', r.status === 200 && r.data.success, 'id=' + (r.data.data && r.data.data.id));
  const tutorProfileId = r.data.data && r.data.data.id;

  r = await api('PATCH', '/api/v1/tutors/profile', { bio: 'Math teacher from India', experience: 5 }, T);
  check('EP2 PATCH /tutors/profile', r.status === 200 && r.data.success);

  r = await api('GET', '/api/v1/tutors/my-students', null, T);
  check('EP3 GET /tutors/my-students', r.status === 200 && r.data.success);

  r = await api('GET', '/api/v1/tutors/dashboard', null, T);
  check('EP4 GET /tutors/dashboard', r.status === 200 && r.data.success);

  // ============ M3: CERTIFICATIONS ============

  console.log('\n--- M3: Certifications ---');

  r = await api('POST', '/api/v1/tutors/certifications', {
    title: 'B.Ed Mathematics', institution: 'Delhi University', year: 2020, documentUrl: 'https://example.com/cert.pdf'
  }, T);
  check('EP5 POST /tutors/certifications', r.status === 201 && r.data.success);
  const certId = r.data.data && r.data.data.id;

  r = await api('GET', '/api/v1/tutors/certifications', null, T);
  check('EP6 GET /tutors/certifications', r.status === 200 && r.data.data && r.data.data.length >= 1, 'count=' + (r.data.data && r.data.data.length));

  r = await api('DELETE', '/api/v1/tutors/certifications/' + certId, null, T);
  check('EP7 DELETE /tutors/certifications/:id', r.status === 200 && r.data.success);

  // ============ M3: PUBLIC ============

  console.log('\n--- M3: Public Directory ---');

  r = await api('GET', '/api/v1/tutors', null, null);
  check('EP8 GET /tutors (search)', r.status === 200 && r.data.success, 'count=' + (r.data.data && r.data.data.length));

  r = await api('GET', '/api/v1/tutors/' + tutorProfileId, null, null);
  check('EP9 GET /tutors/:id (public)', r.status === 200 && r.data.success);

  // ============ M3: ADMIN ============

  console.log('\n--- M3: Admin Tutor Management ---');

  r = await api('PATCH', '/api/v1/admin/tutors/' + tutorProfileId, { bio: 'Updated by admin', experience: 8 }, ADMIN);
  check('EP10 PATCH /admin/tutors/:id', r.status === 200 && r.data.success);

  r = await api('PATCH', '/api/v1/admin/tutors/' + tutorProfileId + '/status', { isActive: false }, ADMIN);
  check('EP11 PATCH /admin/tutors/:id/status', r.status === 200 && r.data.success);

  // Re-activate
  await api('PATCH', '/api/v1/admin/tutors/' + tutorProfileId + '/status', { isActive: true }, ADMIN);

  r = await api('GET', '/api/v1/admin/tutors/' + tutorProfileId + '/performance', null, ADMIN);
  check('EP12 GET /admin/tutors/:id/performance', r.status === 200 && r.data.success);

  // Get a subject for assignment
  const subRes = await api('GET', '/api/v1/subjects', null, T);
  const subjectId = subRes.data.data && subRes.data.data[0] && subRes.data.data[0].id;

  if (subjectId) {
    r = await api('POST', '/api/v1/admin/tutors/' + tutorProfileId + '/subjects', { subjectId: subjectId, tutorRate: 5000 }, ADMIN);
    check('EP13 POST /admin/tutors/:id/subjects', r.status === 201 && r.data.success);

    r = await api('DELETE', '/api/v1/admin/tutors/' + tutorProfileId + '/subjects/' + subjectId, null, ADMIN);
    check('EP14 DELETE /admin/tutors/:id/subjects/:subjectId', r.status === 200 && r.data.success);
  } else {
    console.log('SKIP EP13-14: No subjects in DB');
    failed += 2;
  }

  // Re-login as tutor (token may be invalidated)
  const reLogin = await api('POST', '/api/v1/auth/login', { email: 'tutor1@test.com', password: 'Tutor123!' });
  const T2 = reLogin.data.data.accessToken;

  // ============ M5: TEMPLATES ============

  console.log('\n--- M5: Availability Templates ---');

  r = await api('POST', '/api/v1/tutors/availability/templates', { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' }, T2);
  check('EP15 POST /tutors/availability/templates', r.status === 201 && r.data.success);
  const tplId1 = r.data.data && r.data.data.id;

  // Overlap test
  r = await api('POST', '/api/v1/tutors/availability/templates', { dayOfWeek: 1, startTime: '10:00', endTime: '13:00' }, T2);
  check('EP15b Overlap rejection', r.status === 409);

  r = await api('GET', '/api/v1/tutors/availability/templates', null, T2);
  check('EP16 GET /tutors/availability/templates', r.status === 200 && r.data.data && r.data.data.length >= 1, 'count=' + (r.data.data && r.data.data.length));

  // Add another template then delete it
  const tpl2 = await api('POST', '/api/v1/tutors/availability/templates', { dayOfWeek: 3, startTime: '14:00', endTime: '17:00' }, T2);
  const tplId2 = tpl2.data.data && tpl2.data.data.id;
  r = await api('DELETE', '/api/v1/tutors/availability/templates/' + tplId2, null, T2);
  check('EP17 DELETE /tutors/availability/templates/:id', r.status === 200 && r.data.success);

  // ============ M5: BLOCKED DATES ============

  console.log('\n--- M5: Blocked Dates ---');

  r = await api('POST', '/api/v1/tutors/availability/blocked-dates', { date: '2026-03-23', reason: 'Personal leave' }, T2);
  check('EP18 POST /tutors/availability/blocked-dates', r.status === 201 && r.data.success);
  const bdId = r.data.data && r.data.data.id;

  // Duplicate test
  r = await api('POST', '/api/v1/tutors/availability/blocked-dates', { date: '2026-03-23' }, T2);
  check('EP18b Duplicate blocked date rejection', r.status === 409);

  r = await api('GET', '/api/v1/tutors/availability/blocked-dates', null, T2);
  check('EP19 GET /tutors/availability/blocked-dates', r.status === 200 && r.data.data && r.data.data.length >= 1, 'count=' + (r.data.data && r.data.data.length));

  r = await api('DELETE', '/api/v1/tutors/availability/blocked-dates/' + bdId, null, T2);
  check('EP20 DELETE /tutors/availability/blocked-dates/:id', r.status === 200 && r.data.success);

  // ============ M5: COMPUTE AVAILABILITY ============

  console.log('\n--- M5: Compute Availability ---');

  // Re-add blocked date for computation test
  await api('POST', '/api/v1/tutors/availability/blocked-dates', { date: '2026-03-23', reason: 'Blocked' }, T2);

  r = await api('GET', '/api/v1/tutors/' + tutorProfileId + '/availability?startDate=2026-03-16&endDate=2026-03-29', null, T2);
  check('EP-COMPUTE GET /tutors/:id/availability', r.status === 200 && r.data.success);
  if (r.data.data) {
    console.log('  Slots returned: ' + r.data.data.length);
    r.data.data.forEach(function(s) { console.log('    ' + s.date + ' ' + s.startTime + '-' + s.endTime); });
    // Mon Mar 23 is blocked, so only Mon Mar 16 and Mon Mar 29 should appear (if within range)
  }

  // ============ SUMMARY ============

  console.log('\n========================================');
  console.log('PASSED: ' + passed + '/' + (passed + failed));
  console.log('FAILED: ' + failed + '/' + (passed + failed));
  console.log('========================================');
}

run().catch(console.error);
