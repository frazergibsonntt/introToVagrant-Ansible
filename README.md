Prerequisites:
- Vagrant installed
- Oracle VirtualBox installed

Setup steps:
- Create a keys directory
- Generate ansible ssh keys (ssh-keygen -t ed25519 -f keys/ansible_key)
- Run Vagrant (vagrant up)
- SSH in the control VM (vagrant ssh control)
- Ansible ping the web VM (Ansible web -m ping)

