<div align="center">
  <br />
   <p>
    <img src="https://share.baibusu.social/akPIGo8t.png">
  </p>

![Discord](https://img.shields.io/discord/162293073718673409?style=for-the-badge&color=%237289da)
![GitHub License](https://img.shields.io/github/license/baibusu-social/community-api?style=for-the-badge)
![GitHub Tag](https://img.shields.io/github/v/tag/baibusu-social/community-api?style=for-the-badge)

[![Made with Docker](https://img.shields.io/badge/Made_with-Docker-blue?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/ 'Go to Docker homepage')
[![Made with GH Actions](https://img.shields.io/badge/CI-GitHub_Actions-blue?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions 'Go to GitHub Actions homepage')
[![Baibusu.Social](https://img.shields.io/badge/Baibusu.Social-a793b2?style=for-the-badge&logo=misskey&logoColor=white)](https://baibusu.social/ 'Go to Baibusu.Social')

<p>
API service for our Discord bots and other services/servers. Intended for private use only and not available to the public outside of our associated bots and/or services. Documentation however is [provided](https://api.baibusu.social/docs) via scalar. Any issues with this service can be directed to Support Staff or by submitting and issue.
</p>

</div>

## Self-Hosting

> _Notice_: Repeated requests for aid with self-hosting will lead to a ban from the support server.

As with all our projects they not intended to be self-hosted, we highly encourage you to invite our bots to use the services that way. Self-hosting is permitted but will never be supported. Source code is provided in the interest
of being open with out community. Ultimately no help or guidance will be provided for setup, editing, or any action from running our services within your own environment. Joining of the development and testing server is permitted but questions about
self-hosting will be disregarded entirely. Self-hosting is done at you own risk.

Generally the included docker-compose.yml along with .env should include everything you need to run anything we produce.

### Running this service

Create needed directory.

`mkdir babibusu`

Fetch required files

> _Notice_: The included compose file is our master docker compose file. It will include all services we utilize within our stack. You may comment services out but keep in mind any options with the "depends_on" when doing so.

```bash
wget -O babibusu/docker-compose.yml https://raw.githubusercontent.com/baibusu-social/community-api/refs/heads/main/compose-example.yml
wget -O babibusu/.env https://raw.githubusercontent.com/baibusu-social/community-api/refs/heads/main/.env.example
cd baibusu
```

Make any edits required in the docker-compose.yml file, you may comment out any items you don't need. If they are listed in `depends_on` you must leave them or you
will encounter errors. All API keys are mandatory at the moment but a future solution will allow for dynamic API key creation to be stored on the database.

`docker compose up -d`