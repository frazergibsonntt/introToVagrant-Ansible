# -*- mode: ruby -*-
# vi: set ft=ruby :

#Handy links:
# https://deparkes.co.uk/2018/04/30/writing-a-vagrantfile/
# https://www.techrepublic.com/article/how-to-easily-add-an-ssh-fingerprint-to-your-knownhosts-file-in-linux/



Vagrant.configure("2") do |config|

#The web VM is defined first, so that there is a VM to ssh-keyscan later in the control VM. the ssh-keyscan didn't work when i defined the control VM first

  config.vm.define "web" do |web|
    web.vm.box = "centos/7"
    web.vm.network :"private_network", ip: "10.0.0.11"
    web.vm.hostname = 'web'
    web.vm.provider :virtualbox do |v|
      v.customize ["modifyvm", :id, "--memory", 1024]
      v.customize ["modifyvm", :id, "--name", "web"]
    end
    web.vm.network "forwarded_port", id: "tomcat", guest: 8080, host: 8080
    web.vm.provision "shell", inline: <<-SHELL
      cat /vagrant/keys/ansible_key.pub >> /home/vagrant/.ssh/authorized_keys
    SHELL
  end

  config.vm.define "control" do |control|
    control.vm.box = "ubuntu/bionic64"
    control.vm.network :"private_network", ip: "10.0.0.10"
    control.vm.hostname = 'control'
    control.vm.provider :virtualbox do |v|
      v.customize ["modifyvm", :id, "--memory", 1024]
      v.customize ["modifyvm", :id, "--name", "control"]
    end
    control.vm.provision "file", source: "keys/ansible_key", destination: "/home/vagrant/.ssh/ansible_key"
    control.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y ansible
      echo "[web] 
      10.0.0.11 ansible_connection=ssh ansible_ssh_private_key_file=/home/vagrant/.ssh/ansible_key" >> /etc/ansible/hosts
      echo "10.0.0.11 web" >> /etc/hosts
      chmod 400 /home/vagrant/.ssh/ansible_key
      runuser -l vagrant -c 'ssh-keyscan -H 10.0.0.11 >> /home/vagrant/.ssh/known_hosts'
      runuser -l vagrant -c 'ansible-playbook /home/vagrant/playbook/playbook.yml'
    SHELL

    control.vm.synced_folder "playbook/", "/home/vagrant/playbook"

  end

end
