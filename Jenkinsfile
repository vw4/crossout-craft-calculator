pipeline {
    agent any

    triggers {
        cron 'H/30 * * * *'
    }

    options {
        buildDiscarder logRotator(daysToKeepStr: '7', numToKeepStr: '336')
        disableConcurrentBuilds()
        timestamps()
        timeout(15)
        githubProjectProperty(projectUrlStr: 'https://github.com/vw4/crossout-craft-calculator/')
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
                    keepAll: true,
                    reportDir: 'report',
                    reportFiles: 'index.html',
                    reportName: "Report #${BUILD_NUMBER}",
                    reportTitles: 'Crossout Craft Calculation',
                    includes: 'index.html,css/*.*,img/*.*'
                ])
            }
        }
    }
}
