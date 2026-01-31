# Football Quiz: Football Master

축구 팬들을 위한 실시간 퀴즈 플랫폼, **Football Master**입니다.  
사용자는 혼자서 실력을 쌓는 **솔로 모드**부터 다른 사용자들과 실시간으로 경쟁하는 **멀티플레이 모드**까지 즐길 수 있습니다.

---

## 프로젝트 개요

이 프로젝트는 **React**와 **Node.js**를 기반으로 구축되었으며, **REST API**와 **Socket.io**를 결합하여 퀴즈 사이트에서 데이터의 안정성과 실시간성을 모두 확보했습니다.

### Tech Stack

**Frontend**
- **Library:** React
- **State Management:** Custom Hooks (`useAuth`, `useQuiz`, `useSocket`)
- **Communication:** Axios (API), Socket.io-client
- **Styling:** CSS3

**Backend**
- **Runtime:** Node.js (Express)
- **Real-time:** Socket.io
- **Database:** MongoDB / MySQL (via `db.js`)

---

## 주요 기능

- **다양한 게임 모드:** - **Solo Mode:** 혼자서 축구 지식을 테스트
  - **Multiplayer Mode:** 방을 생성하고 대기실에서 인원을 모집해 함께 대결
  - **Timer Mode:** 제한 시간 내에 정답을 맞춰야 하는 긴장감을 제공합니다.
- **실시간 멀티플레이:** Socket.io를 활용하여 여러 명의 사용자가 동시에 같은 퀴즈를 풀고 정답 개수를 즉시 공유
- **관리자 퀴즈 제어:** 관리자는 `AdminQuizScreen`을 통해 퀴즈 추가
- **마이페이지:** 사용자의 퀴즈 기록과 통계를 확인할 수 있는 기능 제공

---

## 프로젝트 구조

### [App] - Client-side
```text
src/
├── components/     # UI 구성 요소 (Auth, Common, Modals, Screens)
├── hooks/          # 비즈니스 로직 분리 (인증, 퀴즈, 소켓)
├── services/       # 서버 통신 정의 (API 요청, 소켓 설정)
└── constants/      # 공통 설정 및 환경 변수 관리
```

### [Server] - Server-side
```text
server/
├── models/         # DB 스키마 (User, Quiz)
├── routes/         # API 엔드포인트 (Auth, Quiz)
├── sockets/        # 실시간 게임 로직 처리 (gameHandler)
└── config/         # DB 연결 설정
```
