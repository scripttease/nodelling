# Usage

In order to authenticate your requests to the github api you will need to generate a personal authentification token (https://github.blog/2013-05-16-personal-api-tokens/)[https://github.blog/2013-05-16-personal-api-tokens/]

Once you have this - to avoid the token being in version control, create a file called .env and copy the format of .env.example but replace "something" with your token.

Note that on cloning the repo the yakbak api tapes are not in version control (as they also contain a token) so the first lot of tests run will be slow while they record.