#!/bin/bash

[ `whoami` = root ] || exec sudo $0

mkdir -p /var/run/postgresql/ -m 777

su postgres -l -c "/usr/lib/postgresql/9.5/bin/pg_ctl start -D /var/lib/postgresql/DataQuick/"
