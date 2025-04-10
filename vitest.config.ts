// vitest.config.ts
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// 現在のファイルのディレクトリを取得
const __dirname = dirname(fileURLToPath(import.meta.url));

// Nuxtプロジェクト用のVitest設定
export default defineVitestConfig({
  test: {
    // グローバルな環境設定としてjsdomを指定
    environment: "jsdom",
    // グローバル変数を有効化
    globals: true,
    // テストファイルのパターン
    include: ["test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // DOMテストのための設定
    setupFiles: [resolve(__dirname, "./test/setup.ts")],
    // テストのタイムアウトを増やす
    testTimeout: 10000,
    // テスト環境の詳細設定
    environmentOptions: {
      jsdom: {
        // jsdomの設定をカスタマイズする場合はここに追加
      }
    },
  },
  resolve: {
    // エイリアスの設定
    alias: {
      "@": resolve(__dirname),
      "~": resolve(__dirname)
    }
  }
});
