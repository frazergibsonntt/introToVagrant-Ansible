# -*- mode: ruby -*-
# vi: set ft=ruby :

#Handy links:
# https://deparkes.co.uk/2018/04/30/writing-a-vagrantfile/
# https://www.techrepublic.com/article/how-to-easily-add-an-ssh-fingerprint-to-your-knownhosts-file-in-linux/



Vagrant.configure("2") do |config|

#The web VM is defined first, so that there is a VM to ssh-keyscan later in the control VM. the ssh-keyscan didn't work when i defined the control VM first

  config.vm.define "web1" do |web1|
    web1.vm.box = "centos/7"
    web1.vm.network :"private_network", ip: "10.0.0.11"
    web1.vm.hostname = 'web1'
    web1.vm.provider :virtualbox do |v|
      v.customize ["modifyvm", :id, "--memory", 1024]
      v.customize ["modifyvm", :id, "--name", "web1"]
    end
    web1.vm.network "forwarded_port", id: "tomcat", guest: 8080, host: 8080
    web1.vm.provision "shell", inline: <<-SHELL
      cat /vagrant/keys/ansible_key.pub >> /home/vagrant/.ssh/authorized_keys
    SHELL
  end

  config.vm.define "db1" do |db1|
    db1.vm.box = "centos/7"
    db1.vm.network :"private_network", ip: "10.0.0.12"
    db1.vm.hostname = 'db1'
    db1.vm.provider :virtualbox do |v|
      v.customize ["modifyvm", :id, "--memory", 1024]
      v.customize ["modifyvm", :id, "--name", "db1"]
    end
    #Think about whether i need to forward port for a DB
    #web.vm.network "forwarded_port", id: "db", guest: 8080, host: 8080
    db1.vm.provision "shell", inline: <<-SHELL
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
      # echo "[web] 
      # 10.0.0.11 ansible_connection=ssh ansible_ssh_private_key_file=/home/vagrant/.ssh/ansible_key
      # [db]
      # 10.0.0.12 ansible_connection=ssh ansible_ssh_private_key_file=/home/vagrant/.ssh/ansible_key" >> /etc/ansible/hosts
      echo "10.0.0.11 web1
      10.0.0.12 db1" >> /etc/hosts
      chmod 400 /home/vagrant/.ssh/ansible_key
      runuser -l vagrant -c 'ssh-keyscan -H 10.0.0.11 >> /home/vagrant/.ssh/known_hosts'
      runuser -l vagrant -c 'ssh-keyscan -H 10.0.0.12 >> /home/vagrant/.ssh/known_hosts'
      runuser -l vagrant -c 'cd /vagrant/playbook && ansible-playbook playbook.yml'
    SHELL
    control.vm.synced_folder ".", "/vagrant",  :mount_options => ["dmode=755,fmode=755"]

  end

end
