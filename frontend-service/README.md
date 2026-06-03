# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Chat API Notes (Q&A)

Q: Local pe frontend chalana ho toh kya karna padega?
A: `.env` me backend URL set karo:
`VITE_PROFILE_BACKEND_URL=http://localhost:8009`

Q: Docker me frontend chalana ho toh kya karna padega?
A: Same-origin `/api/...` use hota hai, nginx `/api` ko `http://profile-backend:8009` pe proxy karta hai (`nginx.conf`).
Rebuild:
`docker compose up -d --build profile-frontend`

Q: Chat connect kyu nahi ho rahi thi?
A: Browser host machine se request bhejta hai, aur `profile-backend` hostname browser me resolve nahi hota. Isliye same-origin + nginx proxy use kiya.

Q: Nginx kyu connect kiya?
A: Browser ko backend ka Docker hostname nahi pata hota. Nginx `/api` request ko backend container tak forward karta hai, same-origin rehta hai aur CORS issue nahi aata.

Q: Proxy kya hota hai?
A: Proxy ek middleman hota hai jo client ki request backend tak forward karta hai aur response wapas client ko deta hai.
