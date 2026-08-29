<div align="center">

# 🍪 프롬프트 한입 (Prompt Bite)
### 바쁜 일상과 실무에서 가볍게 쏙쏙 뽑아 먹는 실전 프롬프트 큐레이션 PWA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Single File](https://img.shields.io/badge/Architecture-Single--File%20HTML-success.svg)](#-기술-특징)
[![PWA Ready](https://img.shields.io/badge/PWA-Mobile--First-orange.svg)](#)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)](#)

<p align="center">
  <b>설치도, 회원가입도, 복잡한 설정도 필요 없습니다.</b><br>
  단 하나의 <code>index.html</code> 파일로 실무·글쓰기·기획·자동화·데이터 분석 프롬프트를 1초 만에 완성하세요.
</p>

[✨ 라이브 데모 체험하기](#) · [🚀 빠른 시작](#-빠른-시작) · [💡 주요 기능](#-핵심-기능)

---

</div>

## 📌 프로젝트 소개

**프롬프트 한입 (Prompt Bite)** 은 생성형 AI(ChatGPT, Claude, Gemini 등)를 실무에서 가장 효율적으로 활용할 수 있도록 돕는 **초경량 웹 애플리케이션(PWA)** 입니다.

장황하고 추상적인 프롬프트 대신, 실무 현장에서 검증된 **구조화된 템플릿(TRIAC, CoT, Few-Shot, 역분석, 하네스)** 에 `[변수]`만 입력하여 **1초 만에 최적의 프롬프트를 완성**하고 원클릭으로 실행할 수 있습니다.

---

## ✨ 핵심 기능

### ⚡ 1초 한입 커스텀
* 프롬프트 본문의 `[부서명]`, `[안건]`, `[제약조건]` 등의 변수를 자동으로 감지하여 **실시간 입력 폼을 동적 생성**합니다.
* 사용자가 값을 입력하는 즉시 완성본이 조합되며, 원클릭으로 클립보드에 복사됩니다.

### 📚 실전 비즈니스 & 전문 프롬프트 큐레이션
* **💼 직장 & 업무**: 1-Page 기안서 작성, 15년 차 전문가 역할 부여(Role-Playing), CS 7대 안전 하네스 대응
* **✍️ 글쓰기 & SNS**: Temperature별 3단계 카피라이팅, 쇼츠/릴스 60초 대본, 바이럴 캡션
* **💡 기획 & 아이디어**: 단계별 생각(Chain-of-Thought) 논리 추론, 역분석(Inversion) 오류 방어
* **⚡ 자동화 & 엑셀**: Google Apps Script(GAS) 크롤러, Excel VBA 매크로, Slack Webhook 연동
* **📊 데이터 & 감사**: Python Pandas 데이터 정제, Matplotlib 차트 시각화, AI 산출물 보안·컴플라이언스 5대 감사

### 🤖 원클릭 AI 플랫폼 직접 연동
* 완성된 프롬프트를 복사와 동시에 **ChatGPT, Claude, Gemini**로 바로 전달하여 실행할 수 있는 바로가기 버튼 제공.

### ⭐ 로컬 맞춤 보관함 (Local-First)
* **즐겨찾기(Favorites)** 및 **최근 복사 기록(History)** 기능 제공.
* 나만의 프롬프트 템플릿을 등록하여 브라우저 `localStorage`에 안전하게 보관.

---

## 🛠 기술 특징 (Architecture)

* **Zero-Build & Zero-Dependency**: Node.js, Webpack, 외부 라이브러리 설치 없이 순수 웹 표준(Vanilla HTML5, CSS3, ES6+)으로 구동됩니다.
* **오프라인 동작 (Offline-First)**: 인터넷 연결이 끊겨도 로컬 브라우저에서 100% 독립 실행 가능합니다.
* **모바일 퍼스트 반응형 UI**: 스마트폰, 태블릿, PC 브라우저 어디서나 최적화된 앱 형태의 레이아웃을 제공합니다.

---

## 🚀 빠른 시작

### 방법 1. 단일 파일 직접 실행 (가장 추천)
1. 저장소의 `index.html` 파일을 다운로드합니다.
2. 바탕화면 또는 원하는 폴더에 저장한 뒤, **더블클릭**하여 브라우저로 엽니다.

### 방법 2. 로컬 클론 실행
```bash
# 1. 저장소 클론
git clone https://github.com/your-username/prompt-bite.git

# 2. 디렉토리 이동
cd prompt-bite

# 3. 브라우저에서 index.html 실행
open index.html # macOS
start index.html # Windows
