/*  =====================================================================
 *  Jenkinsfile — Declarative CI/CD Pipeline
 *  Visual Resume Editor
 *
 *  Pipeline Stages:
 *    1. Checkout      — Pull source code from SCM
 *    2. Install       — Install Node.js dependencies
 *    3. Lint          — Static code analysis (ESLint)
 *    4. Test          — Run unit tests (Jest)
 *    5. Build         — Create production build artifacts
 *    6. Docker Build  — Build & tag Docker image
 *    7. Deploy        — Deploy to staging via docker-compose
 *  =====================================================================
 */

pipeline {
    // Run on any available Jenkins agent
    agent any

    // ---- Environment Variables ----
    environment {
        // Docker image configuration
        DOCKER_REGISTRY = 'registry.example.com'        // placeholder registry URL
        DOCKER_IMAGE    = 'visual-resume-editor'
        DOCKER_TAG      = "${env.BUILD_NUMBER ?: 'latest'}"
        IMAGE_FULL      = "${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"

        // Node.js
        NODE_ENV = 'production'

        // Disable interactive prompts
        CI = 'true'
    }

    // ---- Tool Installations ----
    tools {
        nodejs 'NodeJS-25'   // Must match the name configured in Jenkins > Global Tool Configuration
    }

    // ---- Pipeline Options ----
    options {
        // Abort the build if it hangs for more than 30 minutes
        timeout(time: 30, unit: 'MINUTES')

        // Keep the last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))

        // Print timestamps in console output
        timestamps()
    }

    // ============================
    //         STAGES
    // ============================
    stages {

        // ── Stage 1: Checkout ──────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        // ── Stage 2: Install Dependencies ──────────────────────────
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                // Using `npm ci` for clean, reproducible installs
                // (uses package-lock.json exactly)
                sh 'npm ci'
            }
        }

        // ── Stage 3: Lint ──────────────────────────────────────────
        stage('Lint') {
            steps {
                echo '🔍 Running ESLint for code quality checks...'
                sh 'npm run lint'
            }
        }

        // ── Stage 4: Test ──────────────────────────────────────────
        stage('Test') {
            steps {
                echo '🧪 Running unit tests...'
                sh 'npm test'
            }
            post {
                always {
                    echo '📊 Test stage completed.'
                    // If using junit reports, you can archive them here:
                    // junit 'reports/**/*.xml'
                }
            }
        }

        // ── Stage 5: Build ─────────────────────────────────────────
        stage('Build') {
            steps {
                echo '🏗️  Building production artifacts...'
                sh 'npm run build'
            }
            post {
                success {
                    echo '✅ Build artifacts created in dist/'
                    // Archive the build output
                    archiveArtifacts artifacts: 'dist/**', fingerprint: true
                }
            }
        }

        // ── Stage 6: Docker Build & Push ───────────────────────────
        stage('Docker Build & Push') {
            steps {
                echo "🐳 Building Docker image: ${IMAGE_FULL}"
                sh "docker build -t ${IMAGE_FULL} ."
                sh "docker tag ${IMAGE_FULL} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"

                echo "📤 Pushing Docker image to registry..."
                // In a real setup, wrap with:
                //   withCredentials([usernamePassword(...)]) { ... }
                // or use:
                //   docker.withRegistry('https://registry.example.com', 'docker-creds') { ... }
                sh "docker push ${IMAGE_FULL}"
                sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
            }
        }

        // ── Stage 7: Deploy to Staging ─────────────────────────────
        stage('Deploy to Staging') {
            steps {
                echo '🚀 Deploying to staging environment...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'

                // Wait for the app to start, then health-check
                echo '⏳ Waiting for application to start...'
                sh 'sleep 5'
                sh 'curl --fail http://localhost/api/health || exit 1'
                echo '✅ Deployment successful — app is healthy!'
            }
        }
    }

    // ============================
    //      POST-BUILD ACTIONS
    // ============================
    post {
        success {
            echo '''
            ╔══════════════════════════════════════╗
            ║   ✅  BUILD SUCCESSFUL               ║
            ║   Pipeline completed all stages.     ║
            ╚══════════════════════════════════════╝
            '''
            // In production, send a Slack / Email notification:
            // slackSend channel: '#deployments', color: 'good',
            //     message: "✅ Build #${env.BUILD_NUMBER} succeeded"
        }
        failure {
            echo '''
            ╔══════════════════════════════════════╗
            ║   ❌  BUILD FAILED                   ║
            ║   Check console output for errors.   ║
            ╚══════════════════════════════════════╝
            '''
            // slackSend channel: '#deployments', color: 'danger',
            //     message: "❌ Build #${env.BUILD_NUMBER} failed"
        }
        always {
            echo "🧹 Cleaning up workspace..."
            cleanWs()
        }
    }
}
