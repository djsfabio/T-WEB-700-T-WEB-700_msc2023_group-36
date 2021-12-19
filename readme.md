<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/EpitechMscProPromo2023/T-WEB-700-T-WEB-700_msc2023_group-36">
    <img src="client/src/images/logo.png" alt="Logo" width="350">
  </a>
  <p align="center">
    A cryptocurrencies web platform
    <br />
    <br />
    <a href="https://github.com/EpitechMscProPromo2023/T-WEB-700-T-WEB-700_msc2023_group-36/issues">Report Bug</a>
    ·
    <a href="https://github.com/EpitechMscProPromo2023/T-WEB-700-T-WEB-700_msc2023_group-36/pulls">Request Feature</a>
  </p>
</div>


<br>
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>
<br>


<!-- ABOUT THE PROJECT -->
## About The Project

The count of money is a complete web platform used to track & analyse cryptocurrencies. To do it the platform provides features likes charts, articles related to cryptocurrencies, user rights that can let an administrator add or remove cryptocurrencies, and some nice features.

The project is divided in two parts :
   - The client also called front (see [client/](client/) folder)
   - The server also called back (see [server/](server/) folder)

Client is used to provide the web platform while server provide the api.

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* <a href="https://reactjs.org/"><img src="https://raw.githubusercontent.com/aleen42/badges/master/src/react.svg"></a>
* <a href="https://reactjs.org/"><img src="https://raw.githubusercontent.com/aleen42/badges/master/src/node.svg"></a>
* <a href="https://reactjs.org/"><img src="https://raw.githubusercontent.com/aleen42/badges/master/src/docker.svg"></a>
* [ExpressJs](https://expressjs.com/)
* [Ant Design](https://ant.design/)
* [Docker Hub](https://hub.docker.com/u/fabiodjs)
* [Circle CI](https://circleci.com/)

#### DevOps Project GitHub

Due to  issues with the EPITECH organization, the DevOps project is on a different GitHub. It is available at the following address :
* [DevOps GitHub](https://github.com/djsfabio/T-WEB-700-T-WEB-700_msc2023_group-36)

<br>

<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Docker 
   1. Docker
   2. Docker Compose

2. Run

a. Mount docker servers 
```shell
docker-compose up --build -d
```
b. Stop docker file

```shell
CTRL + C
docker-compose down
```

c. If you want to delete volume (data) !!!
```shell
docker-compose down -v 
# or
docker volume prune 
```

d. If you want to delete all containers/images/volumes run the script
```shell
sh removealldocker.sh
```

e. View logs
```shell
docker-compose logs -f <web_server_1|web_client_1|...>
```

f. See more information about Docker 
> https://docs.docker.com/

<p align="right">(<a href="#top">back to top</a>)</p>

