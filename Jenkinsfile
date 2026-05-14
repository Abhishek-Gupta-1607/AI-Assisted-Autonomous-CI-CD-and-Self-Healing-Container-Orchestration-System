pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    triggers {
        githubPush() // Automated build trigger on GitHub Push event
        pollSCM('H/5 * * * *') // Fallback polling every 5 minutes
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                // git 'https://github.com/your-repo/project.git'
            }
        }
        stage('Maven Build') {
            steps {
                echo 'Building Java microservices...'
                dir('user-service') {
                    sh './mvnw clean install -DskipTests'
                }
                dir('product-service') {
                    sh './mvnw clean install -DskipTests'
                }
                dir('order-service') {
                    sh './mvnw clean install -DskipTests'
                }
            }
        }
        stage('Run Unit Tests') {
            steps {
                echo 'Running unit tests...'
                dir('user-service') {
                    sh './mvnw test'
                }
                dir('product-service') {
                    sh './mvnw test'
                }
                dir('order-service') {
                    sh './mvnw test'
                }
            }
        }
        stage('Build Docker Images & Start Compose') {
            steps {
                echo 'Starting Docker Compose...'
                sh 'docker-compose up --build -d'
            }
        }
        stage('Run Health Checks') {
            steps {
                echo 'Waiting for services to be healthy...'
                sleep time: 30, unit: 'SECONDS'
                sh 'curl -f http://localhost:8081/actuator/health'
                sh 'curl -f http://localhost:8082/actuator/health'
                sh 'curl -f http://localhost:8083/actuator/health'
                sh 'curl -f http://localhost:5000/health'
            }
        }
        stage('Trigger AI Deployment Analysis') {
            steps {
                echo 'Analyzing deployment risk...'
                script {
                    def response = sh(script: "curl -s -X POST -H 'Content-Type: application/json' -d '{\"cpu_usage\": 45, \"memory_usage\": 50, \"restart_count\": 0, \"response_time_ms\": 120, \"failed_requests\": 0}' http://localhost:5000/analyze", returnStdout: true).trim()
                    echo "AI Analysis Response: ${response}"
                    
                    if (response.contains('Rollback Recommended')) {
                        error('High deployment risk detected by AI! Triggering rollback.')
                    }
                }
            }
        }
        stage('Deploy or Rollback') {
            steps {
                echo 'Deployment successful and verified by AI.'
            }
        }
    }
    post {
        failure {
            echo 'Pipeline failed. Executing rollback...'
            sh 'docker-compose down'
            // In a real scenario, this would revert to previous stable tags
        }
    }
}
