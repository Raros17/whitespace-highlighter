# Whitespace Highlighter
탭과 띄어쓰기, 줄 끝 공백을 명확하게 구분할 수 있도록 도와주는 Visual Studio Code 확장입니다.


## Features
-  **탭** 공백을 진한 보라색 배경으로 하이라이트
-  **띄어쓰기** 공백을 연한 파란색 배경으로 하이라이트
-  **줄끝 공백**은 연한 빨간색 배경으로 표시
-  모든 줄끝 공백을 한 번에 제거하는 명령어 제공
-  탭/띄어쓰기 하이라이트를 껐다가 킬 수 있는 명령어 제공


## Commands 명령어 다루는 방법
Ctrl + Shift + P를 눌러 명령창을 키고, 아래 중 원하는 명령어를 입력합니다.

- 줄 끝 공백 모두 제거: `Trim Trailing Whitespace`
- 원할 때 하이라이트 키거나 끄기: `Toggle Whitespace Highlight`


## How to Install
### VSIX 파일로 설치
1. `.vsix` 파일을 다운로드합니다
2. 아래 명령어로 설치합니다:

   ```bash
   code --install-extension whitespace-highlighter-0.0.1.vsix


이 외에 VS code에서 좌측 탭을 눌러 설치할 수도 있습니다.
예시: ![image](https://github.com/user-attachments/assets/b4707c06-6dae-4749-90d5-6170873d43dc)

1. VS Code에서 왼쪽 사이드바 → 확장 탭 (Extensions) 클릭
2. 오른쪽 위 ··· 버튼 클릭
3. Install from VSIX... 선택
4. 만든 .vsix 파일 선택해서 열기
