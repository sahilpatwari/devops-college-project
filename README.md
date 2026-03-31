# 📄 Visual Resume Editor — DevOps CI/CD Showcase

A simple web-based resume editor that lets you fill in your details and see a live preview. **The primary purpose of this project is to demonstrate DevOps practices** — specifically a Jenkins CI/CD pipeline, Docker containerization, automated testing, and linting.

---

## 📸 Project Overview

| Component | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript (Vanilla) |
| **Backend** | Node.js + Express |
| **CI/CD** | Jenkins (Declarative Pipeline) |
| **Containerization** | Docker (Multi-stage build) |
| **Orchestration** | Docker Compose |
| **Reverse Proxy** | Nginx |
| **Testing** | Jest + Supertest |
| **Linting** | ESLint |

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────────────────────────┐
                    │                  JENKINS CI/CD                  │
                    │                                                 │
                    │  ┌──────────┐  ┌─────────┐  ┌──────┐  ┌──────┐│
  Git Push ────────▶│  │ Checkout │─▸│ Install │─▸│ Lint │─▸│ Test ││
                    │  └──────────┘  └─────────┘  └──────┘  └──┬───┘│
                    │                                          │     │
                    │  ┌──────────────┐  ┌───────┐  ┌──────┐   │     │
                    │  │ Docker Build │◂─┤ Build │◂─┘      │   │     │
                    │  │   & Push     │  └───────┘         │   │     │
                    │  └──────┬───────┘                    │   │     │
                    │         │                            │   │     │
                    │  ┌──────▼───────┐                    │   │     │
                    │  │   Deploy     │                    │   │     │
                    │  │  (Staging)   │                    │   │     │
                    │  └──────────────┘                    │   │     │
                    └─────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Docker Compose    │
                    │                     │
                    │  ┌───────┐          │
        Port 80 ───▸│  │ Nginx │──▸ app  │
                    │  └───────┘  :3000   │
                    └─────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** 18+ and **npm**
- **Docker** and **Docker Compose** (for containerized deployment)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd visual-resume-editor
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run with Docker Compose
```bash
docker-compose up --build
```
Open [http://localhost](http://localhost) (port 80 via Nginx).

---

## 🔧 Available Scripts

| Script | Command | Description |
|---|---|---|
| **Start** | `npm start` | Run the production server |
| **Dev** | `npm run dev` | Run the development server |
| **Test** | `npm test` | Run Jest unit tests |
| **Lint** | `npm run lint` | Run ESLint code quality checks |
| **Build** | `npm run build` | Create production build in `dist/` |

---

## 🔄 Jenkins Pipeline — Detailed Breakdown

The `Jenkinsfile` defines a **declarative pipeline** with 7 stages:

### Stage 1: Checkout
```groovy
checkout scm
```
**DevOps Concept**: Source Control Management (SCM) integration. Jenkins automatically pulls the latest code from the configured Git repository.

### Stage 2: Install Dependencies
```groovy
sh 'npm ci'
```
**DevOps Concept**: Reproducible builds. `npm ci` uses `package-lock.json` exactly, ensuring every build uses the same dependency versions.

### Stage 3: Lint
```groovy
sh 'npm run lint'
```
**DevOps Concept**: Code quality gates. ESLint checks for code style issues and potential bugs. If linting fails, the pipeline stops — preventing bad code from being deployed.

### Stage 4: Test
```groovy
sh 'npm test'
```
**DevOps Concept**: Automated testing. Jest runs unit tests that verify the API health endpoint and project structure. Fail-fast: if tests fail, no deployment occurs.

### Stage 5: Build
```groovy
sh 'npm run build'
```
**DevOps Concept**: Build artifacts. The `dist/` folder contains production-ready files. These are archived using `archiveArtifacts` for traceability.

### Stage 6: Docker Build & Push
```groovy
sh "docker build -t ${IMAGE_FULL} ."
sh "docker push ${IMAGE_FULL}"
```
**DevOps Concept**: Containerization & image registry. The app is packaged into a Docker container, tagged with the build number, and pushed to a registry.

### Stage 7: Deploy to Staging
```groovy
sh 'docker-compose up -d'
sh 'curl --fail http://localhost/api/health || exit 1'
```
**DevOps Concept**: Automated deployment with health verification. After deploying, the pipeline verifies the app is healthy before marking the build as successful.

### Post-Build Actions
- **`always`**: Workspace cleanup (`cleanWs()`)
- **`success`**: Success notification (Slack/email placeholder)
- **`failure`**: Failure notification (Slack/email placeholder)

---

## 🐳 Docker — Explained

### Multi-Stage Dockerfile
The `Dockerfile` uses two stages:
1. **Builder stage**: Installs all dependencies (including dev) and runs the build script
2. **Production stage**: Copies only the build output, installs production deps only, runs as a non-root user

**Key features**:
- Layer caching (COPY package files before source → faster rebuilds)
- Non-root user (security best practice)
- HEALTHCHECK directive (Docker monitors app health)

### Docker Compose
`docker-compose.yml` orchestrates two services:
- **app**: The Node.js resume editor
- **nginx**: Reverse proxy (port 80 → app:3000)

The Nginx service depends on the app being healthy (`condition: service_healthy`).

---

## 🧪 Testing

Tests are in the `tests/` directory:

| File | What it tests |
|---|---|
| `server.test.js` | API health endpoint (status, JSON structure), static file serving |
| `app.test.js` | Project structure validation, HTML content checks |

Run tests:
```bash
npm test
```

---

## ⚙️ Setting Up Jenkins Locally

Follow these steps to set up Jenkins on your local machine and run the pipeline.

### Step 1: Install Jenkins

#### Option A: Using Docker (Recommended)
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

> **Note**: Mounting the Docker socket allows Jenkins to run Docker commands inside the pipeline.

#### Option B: Windows Installer
1. Download Jenkins from [https://www.jenkins.io/download/](https://www.jenkins.io/download/)
2. Run the installer `.msi`
3. Follow the setup wizard
4. Jenkins will be available at `http://localhost:8080`

#### Option C: Using Java directly
```bash
# Requires Java 11 or 17
java -jar jenkins.war --httpPort=8080
```

### Step 2: Unlock Jenkins
1. Open `http://localhost:8080` in your browser
2. Get the initial admin password:
   - **Docker**: `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`
   - **Windows**: Check `C:\Program Files\Jenkins\secrets\initialAdminPassword`
   - **Java**: Look at the console output
3. Enter the password and click **Continue**

### Step 3: Install Plugins
During the setup wizard, choose **"Install suggested plugins"**, then additionally install:
- **NodeJS Plugin** — for Node.js tool auto-installation
- **Docker Pipeline** — for Docker commands in pipeline
- **Pipeline** — should be installed by default

To install plugins later: **Manage Jenkins → Plugins → Available plugins**

### Step 4: Configure Node.js Tool
1. Go to **Manage Jenkins → Tools**
2. Scroll to **NodeJS installations**
3. Click **Add NodeJS**
4. Set name to: `NodeJS-18` (must match the name in `Jenkinsfile`)
5. Select version: **NodeJS 18.x**
6. Check **Install automatically**
7. Click **Save**

### Step 5: Create the Pipeline Job
1. Click **New Item** on the Jenkins dashboard
2. Enter a name: `visual-resume-editor`
3. Select **Pipeline** and click **OK**
4. Under **Pipeline** section:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: your git repo URL (can be a local path for testing)
   - **Branch**: `*/main`
5. Click **Save**

### Step 6: Run the Pipeline
1. Click **Build Now** on the project page
2. Watch the stages execute in **Stage View**
3. Click on any stage to see detailed console output

### Troubleshooting
| Issue | Solution |
|---|---|
| `NodeJS-18 not found` | Ensure the NodeJS tool is named exactly `NodeJS-18` in Global Tool Configuration |
| `docker: command not found` | Install Docker on the Jenkins agent, or mount the Docker socket |
| `npm ci` fails | Make sure `package-lock.json` is committed to your repo |
| `Permission denied` on Docker socket | Add Jenkins user to docker group: `sudo usermod -aG docker jenkins` |

---

## 📁 Project Structure

```
visual-resume-editor/
├── Jenkinsfile              ← CI/CD Pipeline (7 stages)
├── Dockerfile               ← Multi-stage Docker build
├── docker-compose.yml       ← Container orchestration
├── nginx/
│   └── default.conf         ← Nginx reverse proxy config
├── package.json             ← Project metadata & scripts
├── .eslintrc.json           ← ESLint linting rules
├── jest.config.js           ← Test runner config
├── server.js                ← Express server + health endpoint
├── scripts/
│   └── build.js             ← Build script (copies to dist/)
├── public/
│   ├── index.html           ← Resume editor page
│   ├── css/
│   │   └── style.css        ← Styling
│   └── js/
│       └── app.js           ← Editor logic
└── tests/
    ├── server.test.js       ← API tests
    └── app.test.js          ← Structure & content tests
```

---

## 📊 DevOps Concepts Demonstrated

| # | Concept | Where |
|---|---|---|
| 1 | **CI/CD Pipeline** | `Jenkinsfile` — 7-stage pipeline |
| 2 | **Source Control** | Git + `checkout scm` |
| 3 | **Automated Testing** | Jest tests in `tests/` |
| 4 | **Code Quality Gates** | ESLint in `.eslintrc.json` |
| 5 | **Containerization** | Multi-stage `Dockerfile` |
| 6 | **Container Orchestration** | `docker-compose.yml` |
| 7 | **Reverse Proxy** | Nginx config in `nginx/` |
| 8 | **Health Monitoring** | `/api/health` endpoint + Docker HEALTHCHECK |
| 9 | **Build Artifacts** | `dist/` + Jenkins `archiveArtifacts` |
| 10 | **Environment Variables** | `Jenkinsfile` environment block |
| 11 | **Post-build Notifications** | Jenkins post blocks (Slack/email) |
| 12 | **Workspace Cleanup** | `cleanWs()` in post-always |

---

## 📝 License

MIT License — this is a college course project for DevOps education.
