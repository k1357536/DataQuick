#!/bin/bash

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

mkdir -p /var/run/postgresql/ -m 777

su postgres -l -c "/usr/lib/postgresql/9.5/bin/pg_ctl start -D /var/lib/postgresql/DataQuick/"

