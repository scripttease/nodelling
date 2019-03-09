#!/usr/bin/env python
 
from subprocess import Popen, PIPE
 
process = Popen(['cat', '../test/test.py'], stdout=PIPE, stderr=PIPE)
stdout, stderr = process.communicate()
print stdout

# size of repo is in kb (not actually how big on disk but prob close enough)
# can find users but are ordered by date no way to just skip to the last one like with other pagination
# approx 48394669 repos but link header pagination link just gives you 'since 46' as 'rel next' if you just do users because it has users id 1 to 46 in it.
# Don't really want users after about 40 million as they wont necessarily have much data.
# Thats june 2018 approx.
# best way to randomly sample a data set so large

# Given that we have our random id:
#1. curl -u myusername:token-from-ENV https://api.github.com/users\?since=RANDOMNUN
# returns an array in body our user is object0 from the body arr = JSON.parse(response), username  = arr[0]['login']
#2.use this username to construct the uri to get the users repos pages and their pagination header
#3. call all of the repos t=with the api to get their size in kb
#4. clone a repo if under 10 MB (10000 kb) maybe? need to pick a reasonable size
#This is how to convert the url to the ssh clone point
#https://github.com/scripttease/scripttease.github.io.git
# becomes git@github.com:scripttease/scripttease.github.io.git
#5. use tokei to get lines of code, comments etc
#6. store this info in a db and then delete the repo, move to next sample

