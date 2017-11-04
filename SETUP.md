# Prerequisites

- CentOS 7
- git
- nodejs + npm
- postgres

## Extended

- Install CentOS 7
- Update via `yum update`
- Add node repo via `curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -`
- Add postgresql repo via `yum install https://download.postgresql.org/pub/repos/yum/10/redhat/rhel-7-x86_64/pgdg-centos10-10-1.noarch.rpm`
- Install `yum install nodejs git postgresql10-server`

# Clone and Configuration

- Clone git repo into a foler, e.g. `cd /srv; git clone https://github.com/k1357536/DataQuick.git`
- Install dependecies via `npm install`
- Build via `npm run build`

- Add application user
  - e.g. `adduser dataquick -r -M -s /sbin/nologin -d /sbin`

- Initialize and set autostart for db 
  - `/usr/pgsql-10/bin/postgresql-10-setup initdb`
  - `systemctl enable postgresql-10`
  - `systemctl start postgresql-10`
- Add db user
  - e.g. `su - postgres -c "createuser dataquick"`
- Add database
  - e.g. `su - postgres -c "createdb -O dataquick dataquick"`

- Add config file `dbCredentials.json`
  - e.g. `{ "user": "dataquick", "database": "dataquick", "host": "/run/postgresql" } `
- Init db via `su - dataquick -s /bin/bash -c /srv/DataQuick/utils/initDb`
- Test production environment via `su dataquick -s /bin/bash -c "npm run serve"`

## Create start scripts

- `cp utils/dataquick.service /etc/systemd/system/`
- Modify it accordingly
- `systemctl daemon-reload`
- `systemctl start dataquick`
- `systemctl enable dataquick`
