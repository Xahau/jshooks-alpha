# Xahau(d) - JS Hooks ALPHA TOOLKIT
## EARLY STAGE! Expect dragons! 🐉 🐉

```
             _                    #    ▐▄▄▄.▄▄ ·      ▄ .▄            ▄ •▄ .▄▄ ·
  __  ____ _| |__   __ _ _   _    #     ·██▐█ ▀.     ██▪▐█▪     ▪     █▌▄▌▪▐█ ▀.
  \ \/ / _` | "_ \ / _` | | | |   #   ▪▄ ██▄▀▀▀█▄    ██▀▐█ ▄█▀▄  ▄█▀▄ ▐▀▀▄·▄▀▀▀█▄
   >  < (_| | | | | (_| | |_| |   #   ▐▌▐█▌▐█▄▪▐█    ██▌▐▀▐█▌.▐▌▐█▌.▐▌▐█.█▌▐█▄▪▐█
  /_/\_\__,_|_| |_|\__,_|\__,_|   #    ▀▀▀• ▀▀▀▀     ▀▀▀ · ▀█▄▀▪ ▀█▄▀▪·▀  ▀ ▀▀▀▀
```

<img width="700" alt="image" src="https://github.com/Xahau/jshooks-alpha/assets/4756161/a5ade08d-ee46-43da-8474-3df330356a1b">

## Todo:

- [ ] Build scripts for JS
- [ ] Log watcher scripts (xahaud)
- [ ] Deploy scripts for JS Hook(s)
- [ ] Sample scripts (xrpl-accountlib)

# Commands:

## Setup

#### Install / renew environment:

To install (or update, or reload, or restart, or ...)

```
./install
```

#### Remove/cleanup:

```
./clean
```

##  Use

- **Close a ledger, commit transactions, get logging:**: `./advance`


# Endpoints

- **JSON RPC**: [http://localhost:9005](http://localhost:9005)
- **WebSocket**: [http://localhost:9006](http://localhost:9006)
- **Explorer**: [http://localhost:9007/ws:localhost:9006](http://localhost:9007/ws:localhost:9006)

## Dev:

#### Watch install script in dev (autoreload) mode:

```
nodemon -w ./ --ext '*' --ignore ./conf --ignore ./bin --ignore ./repos --exec bash install
```
