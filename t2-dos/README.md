# A setup to play with a web service

## Requirements
Vagrant needs plugins

- vagrant-libvirt
- vagrant-hostmanager
- vagrant-host-shell

Other requirements

ansible 2.2 or later
(can be installed using python-virtualenv)

## To create the stack

Build go app locally

    cd mygotodo
    make
    cd ..

Run to start the vms

    vagrant up
    ansible-playbook playbook.yml
    vagrant ssh monitor -- "cd /vagrant; sudo docker-compose up"

