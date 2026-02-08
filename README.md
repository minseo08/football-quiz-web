# FOOT:AGE (Football Quiz Challenge)

> 축구 로고, 경기장, 선수 등 다양한 퀴즈를 실시간으로 즐길 수 있는 솔로 및 멀티플레이 퀴즈 플랫폼

---

## Key Features

* **실시간 퀴즈**: Socket.io를 활용하여 친구들과 대기실에서 만나 실시간으로 퀴즈 대결
* **다양한 퀴즈 모드**: 
    * **SOLO PLAY**: 혼자서 실력을 쌓고 기록을 측정하는 연습 모드
    * **MULTI PLAY**: 방을 생성하거나 참여하여 다른 유저와 점수 경쟁을 하는 실시간 모드
* **다양한 퀴즈 유형**: 로고 맞히기, 경기장 사진 보고 이름 입력하기 등 시각적 요소를 활용한 퀴즈
* **UI/UX**: Tailwind CSS와 애니메이션 효과를 활용한 디자인

---

## Tech Stack

### Frontend
* **Framework**: Next.js 15 (App Router)
* **Styling**: Tailwind CSS
* **State Management**: Zustand
* **Communication**: Socket.io-client, Axios

### Backend
* **Framework**: NestJS
* **Database**: MongoDB (Mongoose)
* **Real-time**: Socket.io
* **Auth**: JWT (JSON Web Token), Bcrypt

### DevOps & Deployment
* **CI/CD**: GitHub Actions
* **Container**: Docker & Docker Compose
* **Cloud**: AWS EC2

---

## 📂 Project Structure

```bash
football-quiz-project/
├── football-quiz-frontend/  # Next.js Application
├── football-quiz-backend/   # NestJS API Server
├── docker-compose.yml       # Docker orchestration
└── .github/workflows/       # CI/CD (GitHub Actions)
