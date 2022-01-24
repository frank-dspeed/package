# package
A Packaging Repository with Scripts and stuff that allows me to Package and ship Prototypes faster.

uses: frank-dspeed/package/action-download@v1.0

## Packaging
/src - contains ESM src with optional node_modules dependencies
/lib - contains same as src but node_modules are bundled into ESM Compatible Syntax
/modules - contains the Main Code 
/action-* - prefixed folders contain github actions that use /modules and /lib
