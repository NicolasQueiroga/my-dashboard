#!/bin/sh
sudo cp -v /home/ubuntu/MeTH-api/docker_boot.service /etc/systemd/system
sudo systemctl enable docker_boot.service
sudo systemctl start docker_boot.service