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
      # The line below copies the public key into the authorised key file on the remote machine. (remote i mean web and db)
      # This authorized_keys file  on the remote machine is compared against
      # the private key in the .ssh/ dir on the control machine when attempting to ssh into the remote 
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
    # The line below copies the private key onto the control machine, in this case we're calling the private key ansible_key
    # the private key on the control machines is compared against the public key on the remote machine when trying the ssh
    control.vm.provision "file", source: "keys/ansible_key", destination: "/home/vagrant/.ssh/ansible_key"
    control.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y ansible
      # the etc/ansible/hosts file below is where ansible looks for hosts/machines and the ssh details
      # the ansible_ssh_private_key_file arg below tells ansible where it should be looking for its private key
      # the lines below are commented out as i've instead used an inventory/hosts file on local machine (local i mean my laptop)
      # and added "inventory=inventory" to the ansible.cfg file, so that ansible knows to look in the investory file for 
      # the info we previously put in the ansible/hosts file
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
