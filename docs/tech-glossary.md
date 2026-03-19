# Tech Glossary — Quick Revision

---

## Helmet.js
A security middleware that automatically sets HTTP response headers to protect against common attacks. You add one line `app.use(helmet())`, and your app becomes significantly harder to attack. You don't configure anything — it just works.

---

## UUIDs
A way to generate unique IDs. Instead of `1, 2, 3, 4, 5` (sequential — predictable), you get `f47ac10b-58cc-4372-a567-0e02b2c3d479` (random — unpredictable). Attacker can't guess other user IDs. Safer for APIs.

---

## Money as Fils (Integers)
JavaScript has a floating point bug: `0.1 + 0.2 = 0.30000000000000004`. In financial systems, this is unacceptable. So we store money in the smallest unit — fils. `1 AED = 100 fils`. Instead of storing `50.75 AED` (decimal — dangerous), store `5075` fils (integer — always exact). Only convert to AED when showing to the user: `amount / 100`. Every bank and payment platform does this.

---

## Webhook Signature Verification
Normal API call: Your app → calls → Stripe. Webhook: Stripe → calls → Your app (reverse direction). When a parent pays on Stripe, Stripe sends a POST request to YOUR server saying "payment succeeded." But how do you know it's actually from Stripe and not someone faking it? Stripe signs every webhook with a secret key that only you and Stripe know. Your server verifies this signature. Matches → process the payment. Doesn't match → reject (it's fake). Like a tamper-proof seal.

---

## NGINX
A receptionist sitting in front of your Express server. Without NGINX, Express handles SSL, serves React files, does everything (not its job). With NGINX: user → NGINX → Express. NGINX handles SSL/HTTPS, serves the React frontend (static files), forwards API calls to Express. For development: not needed. For production: standard practice, ~15 line config file.

---

## ALB (Application Load Balancer)
AWS's managed version of what NGINX does — but it's a cloud service, not software you install. NGINX is free and you configure it. ALB is paid and AWS manages it. We chose NGINX.

---

## DTOs (Data Transfer Objects)
Just TypeScript interfaces that define the shape of data going in or out of an API. Request DTO = what data comes IN from the client. Response DTO = what data goes OUT to the client. They live in each module's `<module>.types.ts` file.

---

## Passport.js
A library that handles the boring parts of authentication. You define the strategy ONCE (e.g., JWT strategy), then protect any route with one line. Supports 500+ auth strategies via plugins (JWT, Google login, Facebook login). If you ever need "Login with Google" in V2, just add a new strategy — no auth rewrite.

---

## JWT Access + Refresh Token Pattern
Instead of one long-lived token (stolen = 7 days of damage), use two tokens. Access Token: lives 15 minutes, stored in browser memory, proves "I'm logged in". Refresh Token: lives 7 days, stored as HttpOnly cookie (JS can't touch it), used to get a new access token silently. When access token expires, frontend auto-calls `/auth/refresh`, gets new access token, user never notices. Two different secrets so if one is compromised, the other is still safe.

---

## ECS / Docker
EC2 = a virtual server where you install Node.js and run Express directly. Docker = packages your entire app into a container (everything your app needs inside). ECS = AWS service that runs Docker containers. For V1 — plain EC2 is fine. Docker/ECS is V2 concern.

---

## Quick Reference

| Tech | One-Liner |
|------|-----------|
| Helmet | One line of code = security headers |
| UUID | Random unguessable IDs instead of 1,2,3 |
| Fils | Store money as integers (5075 = 50.75 AED) |
| Webhook Verification | Verify webhook is really from Stripe |
| NGINX | Traffic manager in front of Express |
| ALB | AWS's paid NGINX (we use NGINX) |
| DTO | TypeScript interface for API input/output shape |
| Passport | Auth helper — define once, use everywhere |
| Access+Refresh Token | 15min access + 7day refresh = secure + seamless |
| Docker/ECS | App in a container — V2 concern |
