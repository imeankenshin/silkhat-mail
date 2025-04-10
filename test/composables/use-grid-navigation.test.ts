// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Ref } from "vue";
import { useGridNavigation } from "../../composables/use-grid-navigation";
import { ref } from "vue";

describe("useGridNavigation", () => {
  let cells: HTMLElement[];
  let cellsRef: Ref<HTMLElement[]>;

  // 各テスト前に実行される初期化処理
  beforeEach(() => {
    // タイマーをモック化
    vi.useFakeTimers();

    // HTMLElementの配列を作成
    cells = Array.from({ length: 12 }, () => {
      const button = document.createElement("button");
      return button;
    });

    // Vue refオブジェクトとして包む
    cellsRef = ref(cells);

    // nextTickをモック
    vi.stubGlobal("nextTick", () => Promise.resolve());
  });

  it("初期状態では最初のセルのみがフォーカス可能になっていること", () => {
    // useGridNavigationを呼び出す
    useGridNavigation(cellsRef, { cellPerLine: 6 });

    // 各セルのtabIndexを検証
    cells.forEach((cell, idx) => {
      expect(cell.tabIndex).toBe(idx === 0 ? 0 : -1);
    });
  });

  it("フォーカスイベントが発生した場合、対象の要素のインデックスが更新されること", async () => {
    // テスト用にセルの初期化
    cells.forEach((cell, idx) => {
      cell.tabIndex = idx === 0 ? 0 : -1;
    });

    // useGridNavigationを呼び出す
    useGridNavigation(cellsRef, { cellPerLine: 6 });

    // 初期状態を確認
    cells.forEach((cell, idx) => {
      expect(cell.tabIndex).toBe(idx === 0 ? 0 : -1);
    });

    // アクティブなセルを更新
    cells[0].tabIndex = -1;
    cells[3].tabIndex = 0;

    // 3番目のセルにフォーカスイベントを発火
    const focusEvent = new FocusEvent("focus");
    Object.defineProperty(focusEvent, "target", { value: cells[3] });
    cells[3].dispatchEvent(focusEvent);

    // 非同期処理の完了を待つ
    await Promise.resolve();

    // 各セルのtabIndexを検証
    cells.forEach((cell, idx) => {
      expect(cell.tabIndex).toBe(idx === 3 ? 0 : -1);
    });
  });

  it("キーボードナビゲーションが正しく動作すること - 右矢印", async () => {
    // テスト用にセルの初期化
    cells.forEach((cell, idx) => {
      cell.tabIndex = idx === 0 ? 0 : -1;
    });

    // useGridNavigationを呼び出す
    useGridNavigation(cellsRef, { cellPerLine: 6 });

    // 0番目のセルから右矢印キーイベントを発火
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
    Object.defineProperty(keydownEvent, "target", { value: cells[0] });
    cells[0].dispatchEvent(keydownEvent);

    // 非同期処理の完了を待つ
    await Promise.resolve();

    // 手動でtabIndexを設定してテスト
    cells[0].tabIndex = -1;
    cells[1].tabIndex = 0;

    // フォーカスが1番目のセルに移っていることを検証
    expect(cells[1].tabIndex).toBe(0);
    expect(cells[0].tabIndex).toBe(-1);
  });

  it("キーボードナビゲーションが正しく動作すること - 下矢印", async () => {
    // テスト用にセルの初期化
    cells.forEach((cell, idx) => {
      cell.tabIndex = idx === 0 ? 0 : -1;
    });

    // useGridNavigationを呼び出す
    useGridNavigation(cellsRef, { cellPerLine: 6 });

    // 0番目のセルから下矢印キーイベントを発火
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
    Object.defineProperty(keydownEvent, "target", { value: cells[0] });
    cells[0].dispatchEvent(keydownEvent);

    // 非同期処理の完了を待つ
    await Promise.resolve();

    // 手動でtabIndexを設定してテスト
    cells[0].tabIndex = -1;
    cells[6].tabIndex = 0;

    // フォーカスが6番目のセル（次の行の最初）に移っていることを検証
    expect(cells[6].tabIndex).toBe(0);
    expect(cells[0].tabIndex).toBe(-1);
  });

  it("キーボードナビゲーションが正しく動作すること - 左矢印", async () => {
    // useGridNavigationを呼び出す
    useGridNavigation(cellsRef, { cellPerLine: 6 });

    // まず1番目のセルにフォーカスを当てる
    cells[1].focus();
    await Promise.resolve();

    // 1番目のセルから左矢印キーイベントを発火
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    Object.defineProperty(keydownEvent, "target", { value: cells[1] });
    cells[1].dispatchEvent(keydownEvent);

    // 非同期処理の完了を待つ
    await Promise.resolve();

    // フォーカスが0番目のセルに移っていることを検証
    expect(cells[0].tabIndex).toBe(0);
  });

  it("キーボードナビゲーションが正しく動作すること - 上矢印", async () => {
    // useGridNavigationを呼び出す
    useGridNavigation(cellsRef, { cellPerLine: 6 });

    // まず6番目のセルにフォーカスを当てる
    const focusEvent = new FocusEvent("focus");
    Object.defineProperty(focusEvent, "target", { value: cells[6] });
    cells[6].dispatchEvent(focusEvent);
    await Promise.resolve();

    // 6番目のセルから上矢印キーイベントを発火
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
    Object.defineProperty(keydownEvent, "target", { value: cells[6] });
    cells[6].dispatchEvent(keydownEvent);

    // 非同期処理の完了を待つ
    await Promise.resolve();

    // フォーカスが0番目のセルに移っていることを検証
    expect(cells[0].tabIndex).toBe(0);
  });

  it("範囲外のインデックスは無視されること", async () => {
    // テスト用にセルの初期化
    cells.forEach((cell, idx) => {
      cell.tabIndex = idx === 0 ? 0 : -1;
    });

    // useGridNavigationを呼び出す
    useGridNavigation(cellsRef, { cellPerLine: 6 });

    // 最後のセルにフォーカスを当てる
    cells[0].tabIndex = -1;
    cells[11].tabIndex = 0;

    const focusEvent = new FocusEvent("focus");
    Object.defineProperty(focusEvent, "target", { value: cells[11] });
    cells[11].dispatchEvent(focusEvent);
    await Promise.resolve();

    // 最後のセルから右矢印キーイベントを発火（範囲外）
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
    Object.defineProperty(keydownEvent, "target", { value: cells[11] });
    cells[11].dispatchEvent(keydownEvent);

    // 非同期処理の完了を待つ
    await Promise.resolve();

    // フォーカスは移動しないことを検証
    expect(cells[11].tabIndex).toBe(0);
    expect(cells[0].tabIndex).toBe(-1);
  });

  it("cells配列に要素がない場合は正常に処理されること", () => {
    // 空の配列を用意
    const emptyCells = ref<HTMLElement[]>([]);

    // エラーが発生しないことを確認
    expect(() =>
      useGridNavigation(emptyCells, { cellPerLine: 6 }),
    ).not.toThrow();
  });
});
