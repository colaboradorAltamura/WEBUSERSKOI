# KOI Web App Framework

KOI Web App Framework

## Tasks

No funciona el placeholder en los select (src/views/components/dynamics/DynamicFormComponentSelect.tsx)

## USEFULL

- https://docs.github.com/es/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
- npm i firebase@latest
  > VSCode utils
- nvm alias default v16.17.1

- $ npm login --scope=abdalamichel --registry=https://npm.pkg.github.com

- Username: USERNAME
- Password: TOKEN
- Email: PUBLIC-EMAIL-ADDRESS

- Para crear FIREBASE TOKEN
  firebase login:ci

- Crear los secrets:
- NODE_AUTH_TOKEN: ${{secrets.VS_GITHUB_NPM_TOKEN}}
- VS_GITHUB_NPM_TOKEN: ${{secrets.VS_GITHUB_NPM_TOKEN}}
- FIREBASE_TOKEN: ${{secrets.FIREBASE_TOKEN}}

npm install --force --legacy-peer-deps

## Local setup

- Requirements:

  - nvm
  - git bash
  - vs code with eslint extension.

- Install nodejs version:

  - Open .nvmrs file to get required nodejs version (refered as \<version> down below)
  - Install version: "nvm install \<version>" in command line.
  - Activate nodejs in repo: "nvm use \<version>" in command line.

- Install dependencies:

  - Install app dependencies: "npm i" in command line.

- Set .env.local file:

  - Copy .env.template to a new file and rename it to ".env.local".

- Run app: "npm start" in command line.

El siguiente fragmento de codigo representa un campo de una tabla de base de datos,
Las respuestas deben siempre ser sin comentarios ni aclaraciones, solo texto que se pueda copiar y pegar a un compilador javascript.

{
"isRequired": false,
"enableReadOnly": false,
"enableHidden": false,
"hidden_create": false,
"tooltip": "",
"label": "Description",
"readOnly_edit": false,
"organizationId": "ecommitment",
"hidden_edit": false,
"enableConditionalRender": false,
"conditionalRenderIs": "",
"name": "description",
"id": "j9PzSNsz5A6GZaUK6Tog",
"state": 1,
"dimensions_sm": 12,
"conditionalRenderWhen": "",
"fieldType": "text",
"dimensions_xs": 12,
"readOnly_create": false,
"order": 2,
"relationshipSchemaId": "",
}

Quisiera que me generes otros dos campos de tipo texto y con nombres 'primerNombre' y 'apellido'

src/types/entities/index.ts
src/types/dynamics/index.ts

useEffect(() => {
if (window.location.pathname != router.pathname) {
router.push(`/${window.location.pathname}`)
}
}, [])

useEffect(() => {
console.log("path: ", router.asPath)
if(router.asPath !== "/"){
router.push(router.asPath, router.asPath)
}
}, [])
