# Selasfora

## Installation and  Running the project:

1. Install dependencies

    npm install 

2. start the development server with npm start 

    npm start

3. navigate to http://localhost:4200

## bulding for production and deployment 

1. In the terminal , run the command 

    npm run build:prod

2. login to AWS and navigate to S3 Bucket service under storage 

3. click on the staging.selasfora.com bucket

4. copy all contents for the dist folder created after the build here.

5. navigate to AWS cloud front service

6. select staging.selasfora ( click on check box )

7. go to the invalidations tab and create a new invalidation with " /* "

