import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import webExtension from "vite-plugin-web-extension"
import { resolve } from "path"

export default defineConfig(({ mode }) => {
  const isFirefox = mode === "firefox"
  const isProduction = mode === "production" || process.env.NODE_ENV === "production"

  return {
    plugins: [
      vue(),
      webExtension({
        manifest: () => ({
          manifest_version: 3,
          name: "__MSG_extensionName__",
          version: "0.1.0",
          description: "__MSG_extensionDescription__",
          default_locale: "en",
          icons: {
            16: "icons/icon-16.png",
            48: "icons/icon-48.png",
            128: "icons/icon-128.png"
          },
          permissions: ["activeTab", "storage", "tabs"],
          // Firefox MV3 requires an addon ID (T302)
          browser_specific_settings: isFirefox ? {
            gecko: {
              id: "rgaa-copilot@accessibility.gouv.fr",
              strict_min_version: "115.0"
            }
          } : undefined,
          // Content Security Policy - no eval() or unsafe-inline (T202)
          content_security_policy: {
            extension_pages: "script-src 'self'; object-src 'self'"
          },
          action: {
            default_popup: "popup.html",
            default_icon: {
              16: "icons/icon-16.png",
              48: "icons/icon-48.png"
            }
          },
          background: isFirefox
            ? { scripts: ["src/background/service-worker.js"] }
            : { service_worker: "src/background/service-worker.js" },
          content_scripts: [
            {
              matches: ["<all_urls>"],
              js: ["src/content/content-script.js"],
              run_at: "document_idle"
            }
          ],
          web_accessible_resources: [
            {
              resources: ["src/content/auditor/*.js"],
              matches: ["<all_urls>"]
            }
          ]
        }),
        disableAutoLaunch: true
      })
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    },
    build: {
      outDir: `dist/${isFirefox ? "firefox" : "chrome"}`,
      // T219: Better minification with terser in production
      minify: isProduction ? "terser" : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        format: {
          comments: false
        }
      } : undefined
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ["vue", "webextension-polyfill"]
    }
  }
})
