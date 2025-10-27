---
title: SSH tunnels, port-frowarding and reverse-forwarding
created: 1727094160246
updated:
tags: ssh
slug: SSH%20tunnels%2C%20port-frowarding%20and%20reverse-forwarding
---
# SSH Jumps, Tunnels and Forwards

This is a collection of tricks I found in a HackerNews thread (and article) that felt like it might be a good idea to store for future use.

# SSH Jump Hosts Config
[Link](https://news.ycombinator.com/item?id=41597919)
Configure your ~/.ssh/config with LocalForward, RemoteForward, and ProxyJump. This can save you a significant amount of time, especially when using ssh, scp, or rsync to transfer data from a remote server that requires multiple intermediate SSH connections.

e.g:
```
    Host jump-host-1
        HostName jump1.example.com
        User your_username
        IdentityFile ~/.ssh/id_rsa

        Host jump-host-2
            HostName jump2.example.com
            User your_username
            IdentityFile ~/.ssh/id_rsa
            ProxyJump jump-host-1

            Host jump-host-3
                HostName jump3.example.com
                User your_username
                IdentityFile ~/.ssh/id_rsa
                ProxyJump jump-host-2

                Host target-server
                    HostName target.example.com
                    User your_username
                    IdentityFile ~/.ssh/id_rsa
                    ProxyJump jump-host-3
                    LocalForward 0.0.0.0:8080 0.0.0.0:80  
                    RemoteForward 0.0.0.0:9022 0.0.0.0:22

    # after this:
    # - you can ssh/scp/rsync to your target-server via an alias
    # - forward traffic FROM port 80 on your target-server to port 8080 on your local machine
    # - forward ssh requests TO port 9022 on your target-server to port 22 on your local machine
    # - remember, for LocalForward & RemoteForward : 
    #   + left is target-server
    #   + right is your local
    #   + use 0.0.0.0 instead of localhost or 127.0.0.1
```


# Jump Host
[Link](https://ittavern.com/visual-guide-to-ssh-tunneling-and-port-forwarding/#jumphost)

Transparently connecting to a remote host through one or more hosts.

`ssh -J user@REMOTE-MACHINE:22 -p 22 user@10.99.99.1`

Jumphosts must be separated by commas:

`ssh -J user@REMOTE-MACHINE:22,user@ANOTHER-REMOTE-MACHINE:22 -p 22 user@10.99.99.1`

# Local port forwarding
[Link](https://ittavern.com/visual-guide-to-ssh-tunneling-and-port-forwarding/#local-port-forwarding)

Forward traffic on your local machine (that's listening on 10.10.10.1:8001) to a remote machine (that's listening on localhost:8000), through a SSH tunnel

`ssh -L 10.10.10.1:8001:localhost:8000 user@REMOTE-MACHINE`

# Remove port forward
[Link](https://ittavern.com/visual-guide-to-ssh-tunneling-and-port-forwarding/#remote-port-forwarding)

Forward traffic from a remote machine (on port 8000) to your local machine (on port 8001)

`ssh -R 8000:localhost:8001 user@REMOTE-MACHINE`

