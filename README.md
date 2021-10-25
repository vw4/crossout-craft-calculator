# crossout-craft-calculator
Receives crafting and pricing information from crossoutdb.com and reports about the most profitable crafts
Report on [GitHub Pages](https://vw4.github.io/crossout-craft-calculator/)

## Jenkins
Setup jenkins pipeline using [Jenkinsfile](Jenkinsfile)  
Required plugins:
- [HTML Publisher](https://plugins.jenkins.io/htmlpublisher/)
- [Extended Choice Parameter](https://plugins.jenkins.io/extended-choice-parameter/)

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
