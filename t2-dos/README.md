# Play with a web service in the preconfigured setup

There is a setup of two hosts

    host1 <-- host2

- host1 is service a web app
- host2 can be used to load the application

Both VMs are in the same network inside a linux pc.

The addresses are handed over on premises.

Dashboard looks like this

![Riemann Dashboard](riemann-dashboard2.png)

# Running an own setup

## Requirements

Vagrant on a linux host (requires KVM) and a shell.

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

## Instructions to start from scratch with Ubuntu

The instructions are for Ubuntu host to be accesesd remotely

    sudo apt-get install vim virt-manager qemu-system openssh-server

    sudo apt-get dist-upgrade

    # /etc/ssh/sshd_config
    PasswordAuthentication no

Downlad and install vagrant .deb package

    sudo apt-get install git build-essential ruby-dev libvirt-dev golang python-virtualenv ansible libffi-dev python-dev libssl-dev

    # one can use also a virtualenv, initialize it before running pip
    pip install ansible

    vagrant up
