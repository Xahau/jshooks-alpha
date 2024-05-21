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

https://github.com/Xahau/jshooks-alpha/issues?q=is%3Aopen+is%3Aissue+label%3Atodo

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

### Watch Xahaud trace logs live, filtered @ Hook info
```
./logs
```
Tip: just keep this running in a separate terminal

### Close a ledger, commit transactions
```
./advance
```
Tip: If you want to automate this, you can POST:  
```
  curl \
    -X POST --data '{"method":"ledger_accept"}' \
    localhost:9005
```

### Compile (build) JS Hooks to `.bc` Hook (binary, to be deployed)
This command will compile `.js/.mjs/.cjs/.ts` contracts to compiled binary SetHook Hook ready hook code. The output will be stored in the `./build` folder.

If your file has the `.ts` extension (TypeScript), it will be compiled from TypeScript to Javascript first, and then compiled to binary SetHook ready code. Your `.js` file will then have the name of your `.ts` file. If an existing `.js` file with the same name exists **IT WILL BE OVERWRITTEN!**

To compile all `.js/.mjs/.cjs/.ts` files in the `./contracts` folder:

```
./compile
```

To compile a single `.js/.mjs/.cjs/.ts` file in the `./contracts` folder:

```
./compile mycontract.ts
```

### Deploy (compiled) JS Hooks to the ledger

Deploy a contract from the `./build` folder to the locally running ledger:

```
./deploy {contract-name} [destination-r-address]
```

The **contract name** is mandatory and matches the file name (without extension) in the `./build` folder. 
The destination r-address is optional, if not specified the contract will deploy to `ryouhapPYV5KNHmFUKrjNqsjxhnxvQiVt`.

To deploy `mycontract.ts` or `mycontract.js` from the `./build` folder:

```
./deploy mycontract
```

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
