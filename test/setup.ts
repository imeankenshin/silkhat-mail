// Vitestのテスト環境セットアップファイル
import consola from 'consola';
import { beforeAll, afterAll, vi } from 'vitest';

// グローバル変数の設定
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window {
    // 必要に応じてWindowオブジェクトに追加のプロパティを定義
    // 現時点では追加のプロパティは不要ですが、将来的に必要になる可能性があるため定義しておきます
  }
}

// テスト全体の前処理
beforeAll(() => {
  // jsdomの設定をカスタマイズする場合はここに追加
  consola.log('jsdom環境をセットアップしています...');

  // タイマーのモック化
  vi.useFakeTimers();
});

// テスト全体の後処理
afterAll(() => {
  // タイマーのリセット
  vi.useRealTimers();

  // その他のクリーンアップ処理
  consola.log('jsdom環境のクリーンアップを実行しています...');
});
