pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = "jiem117"
        APP_NAME        = "fleetcom"
        K8S_NAMESPACE   = "default"
        DOCKER_IMAGE    = "${DOCKERHUB_USER}/${APP_NAME}"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "✅ Code récupéré — branch: ${env.GIT_BRANCH}"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                    docker tag  ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                    echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                """
                echo "✅ Image poussée sur Docker Hub"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    kubectl set image deployment/${APP_NAME} \
                        ${APP_NAME}=${DOCKER_IMAGE}:${IMAGE_TAG} \
                        -n ${K8S_NAMESPACE} \
                    || kubectl apply -f k8s/ -n ${K8S_NAMESPACE}
                """
            }
        }

        stage('Verify Rollout') {
            steps {
                sh "kubectl rollout status deployment/${APP_NAME} -n ${K8S_NAMESPACE} --timeout=120s"
                echo "✅ Déployé avec succès"
            }
        }
    }

    post {
        always { sh 'docker logout || true' }
        success { echo "🎉 Pipeline #${BUILD_NUMBER} réussi !" }
        failure { echo "❌ Pipeline #${BUILD_NUMBER} échoué" }
    }
}