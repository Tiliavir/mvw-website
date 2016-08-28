# Initial Build

## Prerequisites

```powershell
npm install
gulp development
```

## Build and release

```
gulp
gulp --release=true; gulp copy:toProdDiff
```

# Debug / Test Build

## Prerequisites

```powershell
cd <build-dir>
npm install lite-server
```

## Build and preview

```powershell
gulp Debug
<build-dir>.\node_modules\.bin\lite-server.cmd
```
