import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const base = "/ars-vitae/";

function redirectBareBase() {
  const bare = base.replace(/\/$/, "");
  return {
    name: "redirect-bare-base",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "/";
        const path = url.split("?")[0];
        if (path === bare) {
          res.statusCode = 302;
          res.setHeader("Location", base + url.slice(path.length));
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base,
  plugins: [redirectBareBase(), react(), tailwindcss()],
});
