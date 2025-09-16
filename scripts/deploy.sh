#!/bin/bash
clear
user="cyberomin"

RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

BOLDRED="\e[1;31m"
BOLDGREEN="\e[1;32m"

# Ask for the environment
echo -n -e $(printf "${GREEN}Enter the environment you are deploying up, followed by [ENTER]: ${ENDCOLOR}")
read env

# Verify right environment was entered
environment="$(tr '[:upper:]' '[:lower:]' <<< ${env})"
if [[ $environment != 'staging' && $environment != 'production' ]]; then
    echo $(printf "${RED}You entered a wrong environment ${environment}${ENDCOLOR}")
    exit 1
fi

echo -n "Are you deploying a specific branch? [y/n]: "
read question

if [[ $question != "y" && $question != "n" ]]; then
    echo -e $(printf "${RED}Invalid input. Exiting...${ENDCOLOR}")
    exit 1
fi

# Ask for git branch.
if [[ $question == "y" ]]; then
    echo -n -e $(printf "${GREEN}Enter the branch you are deploying up, followed by [ENTER]: ${ENDCOLOR}")
    read branch
elif [[ $question == "n" && $env == 'staging' ]]; then
    branch="release/develop"
    echo -e $(printf "You did not specify a branch, for that reason, we are deploying ${BOLDRED}${branch}${ENDCOLOR}")
elif [[ $question == "n" && $env == 'production' ]]; then
    branch="master"
    echo -e $(printf "You did not specify a branch, for that reason, we are deploying ${BOLDRED}${branch}${ENDCOLOR}")
fi

# Show messages
echo -e $(printf "Deploying ${BOLDGREEN}$branch${ENDCOLOR} to ${BOLDGREEN}$env${ENDCOLOR}")
echo -e $(printf "Hang on, this may take a while...")

# Begin deployment
echo $(printf "Begining deployment to the ${BOLDGREEN}$environment${ENDCOLOR} environment")
ansible-playbook deploy/$environment/deploy.yml --skip-tags "" -u $user -i deploy/$environment/inventory.ini --vault-id ~/.ansible/key --extra-vars 'ansible_become_pass="{{ sudo_password }}"' --extra-vars "branch=$branch"
