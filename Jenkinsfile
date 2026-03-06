// ─────────────────────────────────────────────────────────────────
//  Jenkinsfile  —  GitHub → Build → Docker Hub → Minikube
//  Place this file at the ROOT of your application repository.
// ─────────────────────────────────────────────────────────────────

pipeline {
    agent any

    environment {
        // ── Change these three values ──────────────────────────────
        DOCKERHUB_USER   = "jiem117"
        APP_NAME         = "fleetcom"
        K8S_NAMESPACE    = "default"
        // ──────────────────────────────────────────────────────────

        DOCKER_IMAGE     = "${DOCKERHUB_USER}/${APP_NAME}"
        IMAGE_TAG        = "${BUILD_NUMBER}"

        // Jenkins credential ID for Docker Hub (set up in Jenkins UI)
        DOCKERHUB_CREDS  = credentials('dockerhub-credentials')
    }

    stages {

        // 1. Pull latest code from GitHub
        stage('Checkout') {
            steps {
                checkout scm
                echo "-> Code checked out — branch: ${env.GIT_BRANCH}"
            }
        }

        // 2. Build the Docker image
        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag  ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
                echo "-> Image built: ${DOCKER_IMAGE}:${IMAGE_TAG}"
            }
        }

        // 3. Push image to Docker Hub
        stage('Push to Docker Hub') {
            steps {
                sh """
                    echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                """
                echo "-> Image pushed to Docker Hub"
            }
        }

        // 4. Deploy / update in Minikube
        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    # If deployment already exists → rolling update
                    # If not yet deployed → apply all k8s manifests
                    kubectl set image deployment/${APP_NAME} \
                        ${APP_NAME}=${DOCKER_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE} \
                    || kubectl apply -f k8s/ -n ${K8S_NAMESPACE}
                """
            }
        }

        // 5. Wait for rollout to finish
        stage('Verify Rollout') {
            steps {
                sh "kubectl rollout status deployment/${APP_NAME} -n ${K8S_NAMESPACE} --timeout=120s"
                echo "-> Deployment is live"
            }
        }
    }

    post {
        always {
            // Always clean up Docker login
            sh 'docker logout || true'
        }
        success {
            echo "-> Pipeline #${BUILD_NUMBER} succeeded!"
        }
        failure {
            echo "-> Pipeline #${BUILD_NUMBER} failed — check logs above"
        }
    }
}
