pipeline {
    agent any

    stages {
        stage('Build Backend Docker Image') {
            steps {
                script {
                    docker.build("my-backend:latest", "./backend")
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    docker.build("my-frontend:latest", "./frontend")
                }
            }
        }
    }
}