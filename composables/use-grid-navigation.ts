export type UseGridNavigationOptions = {
  cellPerLine: MaybeRefOrGetter<number>;
};

export function useGridNavigation(
  cells: MaybeRefOrGetter<HTMLElement[]>,
  options: UseGridNavigationOptions,
) {
  const activeCellIndex = ref(0);
  const cellsRef = toRef(cells);

  // セルのtabIndexを更新する関数
  const updateTabIndices = (cells: HTMLElement[], activeIndex: number) => {
    if (cells.length === 0) return;

    cells.forEach((cell, i) => {
      cell.tabIndex = i === activeIndex ? 0 : -1;
    });
  };

  // ウォッチャーを設定
  watch(cellsRef, (cells) => {
    updateTabIndices(cells, activeCellIndex.value);
  }, { immediate: true });

  // フォーカスイベントリスナー
  useEventListener(cellsRef, "focus", (e) => {
    if (!(e.target instanceof HTMLElement) || e.defaultPrevented) return;

    const currentCells = toValue(cellsRef);
    const index = currentCells.indexOf(e.target);
    if (index !== -1) {
      // アクティブなインデックスを更新
      activeCellIndex.value = index;

      // テスト環境では明示的に全てのtabIndexを更新
      updateTabIndices(currentCells, index);
    }
  });

  // キーボードイベントリスナー
  useEventListener(cellsRef, "keydown", async (e) => {
    if (!(e.target instanceof HTMLElement) || e.defaultPrevented) return;

    const cellPerLine = toValue(options.cellPerLine);
    const currentCells = toValue(cellsRef);
    let nextCellIndex = currentCells.indexOf(e.target);

    if ((e as KeyboardEvent).key === "ArrowDown") {
      nextCellIndex += cellPerLine;
    }
    if ((e as KeyboardEvent).key === "ArrowUp") {
      nextCellIndex -= cellPerLine;
    }
    if ((e as KeyboardEvent).key === "ArrowRight") {
      nextCellIndex += 1;
    }
    if ((e as KeyboardEvent).key === "ArrowLeft") {
      nextCellIndex -= 1;
    }

    const nextCell = currentCells.at(nextCellIndex);
    if (!nextCell) return;

    // 次のセルにフォーカス
    nextCell.focus();

    // アクティブなインデックスを更新
    activeCellIndex.value = nextCellIndex;

    // テスト環境では明示的に全てのtabIndexを更新
    updateTabIndices(currentCells, nextCellIndex);
  });
}
