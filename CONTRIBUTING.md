# Contributing to Colbrush

Thank you for your interest in contributing to Colbrush! We welcome contributions from the community.

[한국어 버전은 아래를 참조하세요](#한국어)

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)


## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, React version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed feature
- Examples of how the feature would be used
- Why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch from `develop` (not `master`)
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Update documentation if needed
7. Submit a pull request

## 🛠 Development Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/colbrush.git
cd colbrush

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev
```

### Project Structure

```
colbrush/
├── src/
│   ├── cli/           # CLI tool implementation
│   ├── client/        # React components and hooks
│   ├── devtools/      # Developer tools (SimulationFilter, etc.)
│   ├── core/          # Core color transformation logic
│   └── styles.css     # Base styles
├── dist/              # Built files
└── tests/             # Test files
```

### Running Tests

```bash
pnpm test
```

### Building

```bash
pnpm build
```

## 🔄 Pull Request Process

1. **Branch Naming**: Use Issue Number
   - `feat/#42` for new features
   - `fix/#27` for bug fixes
   - `docs/#75` for documentation
   - `refactor/#86` for refactoring

2. **PR Title**: Use the format `[TAG/#ISSUE_NUMBER] Description`
   - Examples:
     - `✨ [FEAT/#42] Add support for monochromacy`
     - `🐛 [FIX/#38] Fix theme persistence in localStorage`
     - `📝 [DOCS/#45] Update installation guide`

3. **Tags**:
   - ✨ `FEAT` - New feature
   - 🐛 `FIX` - Bug fix
   - 📝 `DOCS` - Documentation
   - ♻️ `REFACTOR` - Code refactoring
   - ✅ `TEST` - Adding or updating tests
   - 🎨 `STYLE` - Code style changes (formatting, etc.)
   - ⚡️ `PERF` - Performance improvements

4. **Fill out the PR template completely**

5. **Ensure CI passes** - All checks must pass before merge

6. **Request review** from maintainers

7. **Address feedback** promptly and professionally

## 📝 Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid using `any` type unless absolutely necessary

### Code Style

- Follow existing code formatting
- Run `pnpm lint` before committing
- Use meaningful variable and function names
- Add comments for complex logic

### React Components

- Use functional components with hooks
- Follow React best practices
- Keep components focused and reusable
- Document props with TypeScript interfaces

### Testing

- Write tests for new features
- Update tests when modifying existing features
- Aim for meaningful test coverage



## ❓ Questions?

Feel free to open an issue with your question, or reach out to the maintainers.

---

# 한국어

## 📋 목차

- [행동 강령](#행동-강령)
- [기여 방법](#기여-방법)
- [개발 환경 설정](#개발-환경-설정)
- [Pull Request 프로세스](#pull-request-프로세스)
- [코딩 가이드라인](#코딩-가이드라인)

## 📜 행동 강령

이 프로젝트와 모든 참여자는 [행동 강령](CODE_OF_CONDUCT.md)의 적용을 받습니다. 참여함으로써 본 강령을 준수할 것을 동의하는 것으로 간주됩니다.

## 🤝 기여 방법

### 버그 제보

버그 리포트를 작성하기 전에 기존 이슈를 확인해 중복을 피해주세요. 버그 리포트 작성 시 다음을 포함해주세요:

- 명확하고 설명적인 제목
- 문제 재현 단계
- 예상 동작
- 실제 동작
- 스크린샷 (해당되는 경우)
- 환경 정보 (OS, Node 버전, React 버전 등)

### 기능 제안

기능 제안은 GitHub 이슈로 추적됩니다. 기능 제안 작성 시 다음을 포함해주세요:

- 명확하고 설명적인 제목
- 제안하는 기능에 대한 상세한 설명
- 기능 사용 예시
- 이 개선사항이 유용한 이유

### Pull Request

1. 저장소를 Fork합니다
2. `develop` 브랜치에서 새 브랜치를 생성합니다 (`master`가 아님)
3. 변경사항을 작성합니다
4. 필요시 테스트를 작성하거나 업데이트합니다
5. 모든 테스트가 통과하는지 확인합니다
6. 필요시 문서를 업데이트합니다
7. Pull Request를 제출합니다

## 🛠 개발 환경 설정

### 사전 요구사항

- Node.js 18+
- pnpm (권장) 또는 npm

### 설정 단계

```bash
# Fork한 저장소 클론
git clone https://github.com/YOUR_USERNAME/colbrush.git
cd colbrush

# 의존성 설치
pnpm install

# 프로젝트 빌드
pnpm build

# 개발 모드 실행
pnpm dev
```

### 프로젝트 구조

```
colbrush/
├── src/
│   ├── cli/           # CLI 도구 구현
│   ├── client/        # React 컴포넌트와 훅
│   ├── devtools/      # 개발자 도구 (SimulationFilter 등)
│   ├── core/          # 핵심 색상 변환 로직
│   └── styles.css     # 기본 스타일
├── dist/              # 빌드된 파일
└── tests/             # 테스트 파일
```

### 테스트 실행

```bash
pnpm test
```

### 빌드

```bash
pnpm build
```

## 🔄 Pull Request 프로세스

1. **브랜치 이름**: 이슈번호 사용
   - `feat/#42` - 새 기능
   - `fix/#27` - 버그 수정
   - `docs/#75` - 문서
   - `refactor/#86` - 리팩토링

2. **PR 제목**: `[TAG/#이슈번호] 설명` 형식 사용
   - 예시:
     - `✨ [FEAT/#42] 전색맹 지원 추가`
     - `🐛 [FIX/#38] localStorage 테마 지속성 버그 수정`
     - `📝 [DOCS/#45] 설치 가이드 업데이트`

3. **태그**:
   - ✨ `FEAT` - 새 기능
   - 🐛 `FIX` - 버그 수정
   - 📝 `DOCS` - 문서
   - ♻️ `REFACTOR` - 코드 리팩토링
   - ✅ `TEST` - 테스트 추가/업데이트
   - 🎨 `STYLE` - 코드 스타일 변경 (포맷팅 등)
   - ⚡️ `PERF` - 성능 개선

4. **PR 템플릿 완전히 작성**

5. **CI 통과 확인** - 모든 체크가 통과해야 합니다

6. **리뷰 요청** - 메인테이너에게 리뷰 요청

7. **피드백 대응** - 신속하고 전문적으로 대응

## 📝 코딩 가이드라인

### TypeScript

- 모든 새 코드에 TypeScript 사용
- 적절한 타입 정의 제공
- 불가피한 경우를 제외하고 `any` 타입 사용 금지

### 코드 스타일

- 기존 코드 포맷팅 따르기
- 커밋 전 `pnpm lint` 실행
- 의미있는 변수명과 함수명 사용
- 복잡한 로직에 주석 추가

### React 컴포넌트

- 훅을 사용한 함수형 컴포넌트 사용
- React 모범 사례 준수
- 컴포넌트는 집중적이고 재사용 가능하게 작성
- TypeScript 인터페이스로 props 문서화

### 테스트

- 새 기능에 테스트 작성
- 기존 기능 수정 시 테스트 업데이트
- 의미있는 테스트 커버리지 목표



## ❓ 질문이 있으신가요?

질문이 있으시면 이슈를 열거나 메인테이너에게 연락해주세요.

---

Thank you for contributing to Colbrush! 🎨
