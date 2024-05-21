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

- **Watch Xahaud trace logs live, filtered @ Hook data:**: `./logs`
- **Close a ledger, commit transactions, generate logging (`./logs`):**: `./advance`


# Endpoints

- **JSON RPC**: [http://localhost:9005](http://localhost:9005)
- **WebSocket**: [http://localhost:9006](http://localhost:9006)
- **Explorer**: [http://localhost:9007/ws:localhost:9006](http://localhost:9007/ws:localhost:9006)

## Dev:

#### Watch install script in dev (autoreload) mode:

```
./run-dev
```

## Alternatives

#### Hooks JS container only

Easiest way: use `xrpl-netgen` to run a specific version of the JS Hooks binary.

```
pip3bin=$(echo "$(echo $(which pipx 2>&1); echo $(which pip3 2>&1))"|grep /|head -n 1)
$pip3bin install xrpld-netgen

# Run, binary 2024.5.20-dev+jshooks as per https://build.xahau.tech
xrpld-netgen up:standalone --protocol xahau --version 2024.5.20-dev+jshooks --build_type binary --server https://build.xahau.tech --network_id 65535
# xrpld-netgen down:standalone --version 2024.5.20-dev+jshooks

# Advance ledger
curl -X POST --data '{"method":"ledger_accept"}' localhost:5007

# Trace
docker logs --tail 100 -f xahau 2>&1 | grep -E 'HookTrace|HookError'
```
