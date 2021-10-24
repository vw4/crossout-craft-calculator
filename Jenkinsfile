pipeline {
    agent any

    triggers {
        cron 'H/30 * * * *'
    }

    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '7', artifactNumToKeepStr: '3', daysToKeepStr: '7', numToKeepStr: '15')
        disableConcurrentBuilds()
        timestamps()
        timeout(15)
    }

    stages {
        stage('Clean') {
            steps {
                cleanWs(deleteDirs: true)
            }
        }
        stage('Clone') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    userRemoteConfigs: [[url: 'https://github.com/vw4/crossout-craft-calculator.git']],
                    branches: [[name: '*/main']],
                    browser: [$class: 'GithubWeb', repoUrl: 'https://github.com/vw4/crossout-craft-calculator/'],
                    extensions: []
                ])
            }
        }
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Run') {
            steps {
                sh 'npm run start'
            }
        }
        stage('Report') {
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: false,
                    reportDir: 'report',
                    reportFiles: 'index.html',
                    reportName: 'Report',
                    reportTitles: 'Crossout Craft Calculation',
                    includes: 'index.html,css/*.*,img/*.*'
                ])
            }
        }
    }
}
