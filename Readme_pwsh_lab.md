#Hello, in order to test the PowerShell lab, you must:

Clone 4 repositories: 

##WorkAdventure
##VirtualMachines
##Maps
##Websockify 

##Let's start with the maps repository:

Once in this repository, switch branches to feature/powershell-lab (git checkout feature/powershell-lab).
You will see a powershell-lab folder containing the map's .json file.
For the trigger that displays the link in the web to the VM, the link is (http://localhost:6080/?path=websockify&autoconnect=1)
“localhost” will be changed to the host that will contain the VM.

##Virtual-machines repository:
Go to the feature/powershell-lab branch.
There are 4 files added. 
In the http/ folder, there is the Autounattend.xml file.  (do not change the file name, otherwise Windows will not recognize it)
This file contains the OS language and keyboard settings.

There is also my packer file win-pwsh-lab.pkr.hcl: 
in this file, there is the path to the OS to be modified for yours and various variables (CPU, memory, disk size) to be modified as well. 

In the script/pwsh-lab folder:

there are two scripts, setup-flags.ps1 and setup-winrm.ps. The first creates flags (I am modifying it now for testing purposes), and the second enables Windows Remote Management, allowing Packer to remotely execute the flags script.
Both scripts are launched when the machine is rebooted. 

Once the variables have been changed, simply build the packer file:
with
"packer init .
packer validate win-pwsh-lab.pkr.hcl
packer build win-pwsh-lab.pkr.hcl"
Wait about 10 minutes. 

##Then, in the websockify repo

Do 
“go build -o websockify-go .”
and then
./websockify-go -l 6080 -t 127.0.0.1:5912 --web ./novnc/dist
to simply open a novnc connection with qemu.

## workAdventure repo

Once all the repositories are done, we need to make a few changes in the WorkAdventure repo:
First, switch to the localEnvironment branch.
In the maps folder, create the powershell-lab folder.
Then do the following:
cp ~/SUASecLab/maps/powershell_lab/* ~/SUASecLab/WorkAdventure/maps/powershell_lab

to copy the contents of the maps repo to the maps folder in the workAdventure repo. 

Then 
"cp .env.template .env
docker compose pull
docker compose up -d"
Wait a few seconds, then enter this URL in your browser (http://play.workadventure.localhost/_/global/maps.workadventure.localhost/powershell_lab/office_lab.json). 
Go to the computer at the bottom right and the VM will appear in an iframe !
