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

Run

    vagrant up
    ansible-playbook playbook.yml
    vagrant ssh monitor -- "cd sync; sudo docker-compose up"

