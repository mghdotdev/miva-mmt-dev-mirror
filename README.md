# miva-mmt-dev-mirror

Used to copy files from your root mmt directory to a new mirrored directory that represents a dev/staging environment. Once the process is running any files saved from the root folder will be mirrored into the environment folder. This allows you to safely checkout branches on a dev environment and push "live" files from your root folder without running into errors.

## Installation

```bash
[npm|pnpm] i miva-mmt-dev-mirror
```

## Usage

```bash
[npx|pnpm exec] mmt-dev [options] [environment]

# In a new terminal window...

cd miva-templates-[environment]
mmt checkout [remote]
mmt push

# Save files from `miva-templates` and they will automatically be mirrored
```

**Note:** Run `mmt-dev --help` for documentation.