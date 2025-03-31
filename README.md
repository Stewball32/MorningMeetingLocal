# Morning Meeting

**Morning Meeting** is a local-first web app for running interactive classroom presentations, tracking attendance, and showcasing student/teacher info. Built with modern tools for easy local hosting and fast iteration.

## 🧱 Tech Stack
- **Frontend:** [SvelteKit 5](https://kit.svelte.dev/) + [Skeleton UI v3](https://www.skeleton.dev/) + [Reveal.js](https://revealjs.com/) + Tailwind CSS
- **Backend:** [PocketBase](https://pocketbase.io/)
- **Local Dev:** Runs on Raspberry Pi or other local hardware

## 📦 Project Structure
- `/animotion/`: Main SvelteKit project ("Animotion") for presentation frontend
- `/`: PocketBase backend for storing and managing student/teacher data

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/Stewball32/MorningMeetingLocal.git
cd MorningMeetingLocal
```

### 2. Setup PocketBase
```bash
cd pocketbase
./pocketbase serve
```

Then open your browser to the local PocketBase web UI (e.g., `http://127.0.0.1:8090/_/`) and:
- Log in as admin
- Create collections for `students` and `teachers`
- Add your data manually or via CSV import

### 3. Setup the Frontend
```bash
cd ../animotion
cp .env.example .env
# Make sure the .env file points to your local PocketBase instance

npm install
npm run dev
```

### 4. Build Frontend for Production
```bash
npm install
npm run build
```
#### 4.1 View Production
```bash
npm run preview
```

## 🧠 Future Plans
- Custom UI for managing student data
- More interactivity for slides
- Remote control / cast view mode

## 📝 License
MIT or your preferred license

---
Push the Elevator!
