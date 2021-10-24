# crossout-craft-calculator
Receives crafting and pricing information from crossoutdb.com and reports about the most profitable crafts

## Jenkins
Setup jenkins pipeline using [Jenkinsfile](Jenkinsfile)  
Required plugins: [HTML Publisher](https://plugins.jenkins.io/htmlpublisher/)  
To display HTML report correctly [setup Content Security Policy in Jenkins](https://stackoverflow.com/questions/35783964/jenkins-html-publisher-plugin-no-css-is-displayed-when-report-is-viewed-in-j)

## Install
npm & nodejs are required
```
npm install
```

## Run
```
npm run start
```
Resuts are saved to `report/index.html`
