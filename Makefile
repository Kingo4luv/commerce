# Decrypt an ansible vault
prod_decrypt:
	ansible-vault decrypt deploy/production/group_vars/all.yml --vault-password-file ~/.ansible/key

# Encrypt an ansible vault
prod_encrypt:
	ansible-vault encrypt deploy/production/group_vars/all.yml --vault-password-file ~/.ansible/key

# Decrypt an ansible vault
staging_decrypt:
	ansible-vault decrypt deploy/staging/group_vars/all.yml --vault-password-file ~/.ansible/key

# Encrypt an ansible vault
staging_encrypt:
	ansible-vault encrypt deploy/staging/group_vars/all.yml --vault-password-file ~/.ansible/key

deployment:
	scripts/deploy.sh

setup:
	scripts/setup.sh

server:
	scripts/server.sh

# Logging to server
ssh_staging:
	clear && ssh -o ProxyCommand="ssh -W %h:%p ubuntu@3.250.87.89" cyberomin@10.0.1.222

ssh_prod_1:
	clear && ssh -o ProxyCommand="ssh -W %h:%p ubuntu@52.212.206.191" cyberomin@10.0.1.239

ssh_prod_2:
	clear && ssh -o ProxyCommand="ssh -W %h:%p ubuntu@52.212.206.191" cyberomin@10.0.1.202
