#!/bin/bash

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

su postgres -l -c "/usr/lib/postgresql/9.5/bin/pg_ctl stop -D /var/lib/postgresql/DataQuick/"

