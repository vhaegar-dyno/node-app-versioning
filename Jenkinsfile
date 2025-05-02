pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "vhaegar/holmium-boilerplate"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub
                checkout main
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    def version = sh(script: "git describe --tags", returnStdout: true).trim()
                    sh "docker build -t ${DOCKER_IMAGE}:${version} ."
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    // Push Docker image to Docker Hub
                    def version = sh(script: "git describe --tags", returnStdout: true).trim()
                    sh "docker push ${DOCKER_IMAGE}:${version}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy the application (run the container with the new version)
                    def version = sh(script: "git describe --tags", returnStdout: true).trim()
                    sh """
                    docker stop holmium-boilerplate || true
                    docker rm holmium-boilerplate || true
                    docker run -d --name holmium-boilerplate -p 5000:5000 --env-file .env.development ${DOCKER_IMAGE}:${version}
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up after the build if necessary (like stopping/removing containers)
            sh 'docker system prune -f'
        }
    }
}
