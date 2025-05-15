import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log("확장 활성화됨");
  vscode.window.showInformationMessage("🎉 확장 실행 완료!");

  const tabDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(103, 58, 183, 0.8)', // 진한 보라
    borderRadius: '1px'
  });

  const spaceDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(144, 202, 249, 0.4)', // 연한 파랑
    borderRadius: '1px'
  });

  const trailingWhitespaceDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 138, 128, 0.4)', // 연한 빨강
    borderRadius: '1px'
  });

  const highlightDecoration = vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  });

  let whitespaceHighlightEnabled = true;

  const updateHighlight = (editor: vscode.TextEditor | undefined) => {
    if (!editor) {return;}
    const selections = editor.selections;

    const ranges = selections.map(selection => {
      const start = selection.start.line;
      const end = selection.end.line;
      const rangeList: vscode.Range[] = [];

      for (let i = start; i <= end; i++) {
        rangeList.push(new vscode.Range(i, 0, i, 0));
      }

      return rangeList;
    }).flat();

    editor.setDecorations(highlightDecoration, ranges);
  };

  const updateWhitespaceHighlights = (editor: vscode.TextEditor | undefined) => {
    if (!editor || !whitespaceHighlightEnabled) {return;}

    const doc = editor.document;
    const tabRanges: vscode.DecorationOptions[] = [];
    const spaceRanges: vscode.DecorationOptions[] = [];
    const trailingRanges: vscode.DecorationOptions[] = [];

    for (let lineNum = 0; lineNum < doc.lineCount; lineNum++) {
      const line = doc.lineAt(lineNum);
      const text = line.text;

      // ✅ 탭 / 스페이스 구분
      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '\t') {
          tabRanges.push({ range: new vscode.Range(lineNum, i, lineNum, i + 1) });
        }

        if (char === ' ') {
          spaceRanges.push({ range: new vscode.Range(lineNum, i, lineNum, i + 1) });
        }
      }

      // ✅ 줄 끝 공백 감지
      const match = text.match(/[\t ]+$/);
      if (match) {
        const start = new vscode.Position(lineNum, text.length - match[0].length);
        const end = new vscode.Position(lineNum, text.length);
        trailingRanges.push({ range: new vscode.Range(start, end) });
      }
    }

    editor.setDecorations(tabDecoration, tabRanges);
    editor.setDecorations(spaceDecoration, spaceRanges);
    editor.setDecorations(trailingWhitespaceDecoration, trailingRanges);
  };

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    updateHighlight(editor);
    updateWhitespaceHighlights(editor);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(e => {
      updateHighlight(e.textEditor);
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      if (vscode.window.activeTextEditor?.document === e.document) {
        updateWhitespaceHighlights(vscode.window.activeTextEditor);
      }
    }),
    vscode.window.onDidChangeActiveTextEditor(editor => {
      updateHighlight(editor);
      updateWhitespaceHighlights(editor);
    }),
    highlightDecoration,
    tabDecoration,
    spaceDecoration,
    trailingWhitespaceDecoration
  );

  // ✅ 명령: 줄 끝 공백 제거
  const trimCommand = vscode.commands.registerCommand(
    'extension.trimTrailingWhitespace',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {return;}

      const doc = editor.document;
      editor.edit(editBuilder => {
        for (let lineNum = 0; lineNum < doc.lineCount; lineNum++) {
          const line = doc.lineAt(lineNum);
          const trimmed = line.text.replace(/[\t ]+$/, '');
          if (trimmed.length < line.text.length) {
            const range = new vscode.Range(
              new vscode.Position(lineNum, 0),
              new vscode.Position(lineNum, line.text.length)
            );
            editBuilder.replace(range, trimmed);
          }
        }
      });
    }
  );

  // ✅ 명령: 하이라이트 토글
  const toggleCommand = vscode.commands.registerCommand(
    'extension.toggleWhitespaceHighlight',
    () => {
      whitespaceHighlightEnabled = !whitespaceHighlightEnabled;
      const editor = vscode.window.activeTextEditor;
      if (!editor) {return;}

      if (!whitespaceHighlightEnabled) {
        editor.setDecorations(tabDecoration, []);
        editor.setDecorations(spaceDecoration, []);
        editor.setDecorations(trailingWhitespaceDecoration, []);
        vscode.window.showInformationMessage("🔕 공백 하이라이트 꺼짐");
      } else {
        updateWhitespaceHighlights(editor);
        vscode.window.showInformationMessage("🔔 공백 하이라이트 켜짐");
      }
    }
  );

  context.subscriptions.push(trimCommand, toggleCommand);
}

export function deactivate() {}
