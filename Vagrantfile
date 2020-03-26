# -*- mode: ruby -*-
# vi: set ft=ruby :

#Handy links:
# https://deparkes.co.uk/2018/04/30/writing-a-vagrantfile/


Vagrant.configure("2") do |config|

  config.vm.define "control" do |control|
    control.vm.box = "ubuntu/trusty64"
    control.vm.network :"private_network", ip: "10.0.0.10"
    control.vm.hostname = 'control'
    control.vm.provider :virtualbox do |v|
      v.customize ["modifyvm", :id, "--memory", 1024]
      v.customize ["modifyvm", :id, "--name", "control"]
    end
    control.vm.provision "file", source: "keys/ansible_key", destination: "~/.ssh/ansible_key"
    control.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y ansible
      echo "[web] 
      10.0.0.11 ansible_connection=ssh ansible_ssh_private_key_file=~/.ssh/ansible_key" >> /etc/ansible/hosts
      echo "10.0.0.11 web" >> /etc/hosts
      chmod 400 /home/vagrant/.ssh/ansible_key
    SHELL
  end
  
  config.vm.define "web" do |web|
    web.vm.box = "ubuntu/trusty64"
    web.vm.network :"private_network", ip: "10.0.0.11"
    web.vm.hostname = 'web'
    web.vm.provider :virtualbox do |v|
      v.customize ["modifyvm", :id, "--memory", 1024]
      v.customize ["modifyvm", :id, "--name", "web"]
    end
    web.vm.provision "file", source: "keys/ansible_key.pub", destination: "~/.ssh/authorized_keys"
  end

end
