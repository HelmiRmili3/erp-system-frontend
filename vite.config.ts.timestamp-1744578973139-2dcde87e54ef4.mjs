// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/work/PFE2025-01/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/work/PFE2025-01/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///C:/work/PFE2025-01/frontend/node_modules/unplugin-vue-components/dist/vite.js";
import { PrimeVueResolver } from "file:///C:/work/PFE2025-01/frontend/node_modules/@primevue/auto-import-resolver/index.mjs";
import vueDevTools from "file:///C:/work/PFE2025-01/frontend/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import svgLoader from "file:///C:/work/PFE2025-01/frontend/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/work/PFE2025-01/frontend/vite.config.ts";
var vite_config_default = defineConfig({
  build: {
    outDir: "dist"
  },
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()]
    }),
    vueDevTools(),
    svgLoader()
  ],
  server: {
    port: 4e3
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3b3JrXFxcXFBGRTIwMjUtMDFcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHdvcmtcXFxcUEZFMjAyNS0wMVxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovd29yay9QRkUyMDI1LTAxL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgUHJpbWVWdWVSZXNvbHZlciB9IGZyb20gJ0BwcmltZXZ1ZS9hdXRvLWltcG9ydC1yZXNvbHZlcidcclxuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdkaXN0J1xyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbUHJpbWVWdWVSZXNvbHZlcigpXVxyXG4gICAgfSksXHJcbiAgICB2dWVEZXZUb29scygpLFxyXG4gICAgc3ZnTG9hZGVyKClcclxuICBdLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNDAwMFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxlQUFlLFdBQVc7QUFFOVMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsd0JBQXdCO0FBQ2pDLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sZUFBZTtBQVArSSxJQUFNLDJDQUEyQztBQVV0TixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLGlCQUFpQixDQUFDO0FBQUEsSUFDaEMsQ0FBQztBQUFBLElBQ0QsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
