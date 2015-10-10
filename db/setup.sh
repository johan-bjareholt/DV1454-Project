#!/bin/bash
echo "Please enter root password"
mysql --user="root" -p < createuser.sql
echo "Creating table models"
mysql --user="DBProjectUser" --password="xyz321456xyz" DBProject < createddl.sql
