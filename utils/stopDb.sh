#!/bin/bash

[ `whoami` = root ] || exec sudo $0

su postgres -l -c "/usr/lib/postgresql/9.5/bin/pg_ctl stop -D /var/lib/postgresql/DataQuick/"
