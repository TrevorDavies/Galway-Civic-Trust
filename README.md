# Bachelor of Science(Honours) in Software Development 4th Year Project
## Walking Tours System for the Galway Civic Trust using MEAN stack and Ionic Framework

#### Developed By: Arjun Kharel, Trevor Davies, and Patryk Piecha
####**Project video Demo** : http://sendvid.com/ley01nxu

##System Architecture

![Alt text](https://github.com/TrevorDavies/Galway-Civic-Trust/blob/master/architectureDiagram.PNG "Optional title")

##Overview
This project has been done in conjunction with the Galway Civic
Trust. The purpose of the project was to solve the problem the Galway
Civic Trust had. The main problem they had was that they had no facility
by which the trust could create, read, update and delete walking tours with
out the need to have a separate mobile application developed for each tour.
The system comprises of two main parts a back end web application(Admin
Panel) which its self consists of two parts an administration site and an
API(Application Programming Interface). The API is protected using jwt
and is safe from external injection/attacks. The Admin Panel which is what
the trust will use to manage the walking tour’s content, has been developed
using a MEAN(MongoDB, Express, Angular JS, Node JS) stack approach.
The API is used by both the Admin panel and the mobile application to
communicate with the database. The second part of the project was to
develop a cross platform mobile application that consumes the data from
the database, which is provided by the API. The mobile application makes
extensive use of Google’s Map API for both dynamic and static maps used
within the mobile application. The mobile application was developed using
the Ionic Framework and Angular JS.

##Project Resources:
**Admin Panel (Back-end / API )** : https://github.com/ultimatecodelab/Galway-Civic-Trust

**Ionic mobile application that consume data from an API::** https://github.com/TrevorDavies/Galway-Civic-Trust

**Detailed documentation about the project is at:**: https://github.com/Paddero/GCT-Documentation

## Installation
To install and run the application on a computer please follow the installation guide [here](http://ionicframework.com/docs/guide/installation.html) provided by ionicframework.com.
Alternatively you can install the android apk. Download and install the android apk provided.
To install the .apk file on an android device first go to settings>>Security scroll down until you find Unknown sources,
click the check box "Allow installation of apps from sources other than the Play Store".
Then go to the folder you downloaded the apk file to and click the apk file. The application should install on to your phone.
