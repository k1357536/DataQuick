# Prerequisites

- CentOS 7
- git
- nodejs + npm
- postgres

## Extended

- Install CentOS 7
- Update via `yum update`
- Add node repo via `curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -`
- Install `yum install nodejs git postgresql-server`

# Clone and Configuration

- Clone git repo into a foler, e.g. `cd /srv; git clone https://github.com/k1357536/DataQuick.git`
- Install dependecies `npm install`
- Build `npm run build`
- Run production environment `npm run prod`
