# ldraw-visualizer (aka LDraw Model Viewer) mod
A in-browser LEGO model viewer, built using three.js and LDraw part files. Built by nfriend, [source @ github](https://github.com/nfriend/ldraw-visualizer) and [demo @ LDraw.org](https://www.ldraw.org/parts/tools/ldraw-model-viewer.html) - excellent work!

The source doesn't have a guide on how to use it (both viewer and server) in your own webpages, so I've modded it for ease of use. Targets:
* Pack online viewer webpage into minimal set of 'portable' files.
  * 1 'web' version retains the ability to select and load LDR Lego model file from disk. Requires server.
  * Another 'portable' version with embedded LDR Lego model data to view a Lego model. I.e. does not require server.
* Pack its server.
  * Basically figure out how to setup and run one for yourself.
  * Allow it to generate data for embed into prior portable viewer.

**2024 Update**
Am trying to pack it into a single Executable less data files for easier usage.
* Phase 1 (done): include the node module dependencies, so user won't have to find (old, compatible versions) & download them on their own.
* Phase 2 (mostly done): Use my Node.JS 22.x+ to run all dependencies bundled within, so no longer need the messy node_modules folder (with countless little files).
  * Also patched server and viewer to fix edge cases of missing parts. Viewer somehow needs to internally retry after requesting and receiving missing parts from server.
* Phase 3 (work in progress; alpha version): Pack into a Node.JS SEA Single Executable Application, less data files, viewer(?) and config.
  * Will need to add a config file or commandline option overrides to access PORT and data library path settings. Since server scripts will now be embedded and untouchable with the SEA.
  * Possibly bundle web folder content (i.e. viewer) as well - will be tedious as Node.JS doesn't have a convenient virtual file system. Will have to explore zipping it or something.
  * SEA means no scripts files including node_modules needed. All are embedded within the .EXE for easy use.

# How ldraw-visualizer works
First, a primer on how ldraw-visualizer works on [LDraw.org](https://www.ldraw.org/parts/tools/ldraw-model-viewer.html)].
`Server <-> Viewer in browser <- your disk`

1. You use the Viewer to select one of your LDR Lego model files.
2. The Viewer (JavaScript codes) grabs every part in the model and sends the list of parts to the Server.
`(.ldr) -> Viewer in browser -(parts list)-> Server`
3. Server goes through the list of parts and finds all sub-parts from its LDraw libraries.
`Server's LDRaw library installation -(sub-parts)-> Server`
4. Server sends the entire list of all parts back to Viewer.
`Server -(all parts used)-> Viewer`
5. Viewer renders the model.

# How to Use My Mods
## Server Mod
Usages of Server mod:
* At your own leisure, generate data for embed into portable viewer.
* Run for online Viewer.

### Setup
1. Download and install LDraw parts libraries.
    a. Download AIO (all-in-one) LDraw installation package from [LDraw's Getting Started page](https://www.ldraw.org/help/getting-started.html) - actually is one of the sub-pages.
       i. E.g. for Window, you may download Draw_AIOI_2020-03_setup_32bit_v1.exe.
    b. Install it for its parts libraries.
        * So probably just install LDView and parts libraries.
        * Installer can be rather pesky, asking for separate paths for parts library (that MUST end in 'LDraw' sub-folder) and apps.
        * E.g. Choose `c:\LDraw_Data\LDraw\` for parts library. This is ESSENTIAL for Server use. And choose `c:\LDraw\apps\` for apps.
2. Download my AIO-Server and my [Node.JS+ >= 16.6.0.1](https://github.com/sdneon/node/releases).
    * PS: Modded Server codes are in 2 TypeScript files (`parts-server.ts` and `file-fetcher.ts`). Am not a TS fan, so have Not retained nfriend's original entire/TS folder structure, so I don't know if you can run my mod correctly the usual TS way. Hence, for simplicity, (Windows users) just use my [Node.JS+ >= 16.6.0.1](https://github.com/sdneon/node/releases). E.g.: [node.exe for 16.6.0.1](https://github.com/sdneon/node/releases/download/16.6.0.1%2B/node.exe).
    * Install Server's dependencies: body-parser, domain, express.
3. Configure **parts library path** in `file-fetcher.ts`.
    * Near top of file, set `rootDirectory` to your **parts library path**. E.g.: `rootDirectory = 'c:/LDraw_Data/LDraw/',`
4. If desired, configure your web server port number in `parts-server.ts`. Look for .
    * Look for `const PORT = 80;` near the top of the file, and change the number.

#### Where to find Lego Parts
* Official parts are on [this LDraw page](https://library.ldraw.org/updates?latest)'s "Download Links" Section's ["Complete LDraw.org Library Zip archive (complete.zip)" link](https://library.ldraw.org/library/updates/complete.zip).
* Unofficial parts are on [this LDraw page](https://library.ldraw.org/tracker)'s ["Download All Unofficial Files" link](https://library.ldraw.org/library/unofficial/ldrawunf.zip).

### Run Server for Online Viewer
1. Using [Node.JS+ >= 16.6.0.1](https://github.com/sdneon/node/releases), simple run:
   ```
   node parts-server.ts
   ```
2. In browser, navigate to [http://localhost:80/viewer.html](http://localhost:80/viewer.html). Have fun loading your Lego models.

### Run Server to Generate Data for Portable Viewer
1. Using [Node.JS+ >= 16.6.0.1](https://github.com/sdneon/node/releases), simple run:
   ```
   node parts-server.ts file_path_to_LDR_file
   ```
    * This generates 2 files for embedding into a portable Viewer template .html file.
2. Make a copy of portable Viewer template (viewer_template.html), say naming it view_model_1.html. Make these changes:
    * ESSENTIAL: copy line from **file_path_to_LDR_file.*model*.txt** and paste it into the template, replacing the `[.model.txt]`. 
    ```
    const model = 'data:text/plain;base64,'
	    + `[.model.txt]`,
	part_paths = [.resp.txt];
	```
    * ESSENTIAL: copy line from **file_path_to_LDR_file.*resp*.txt** and paste it into the template, replacing the `[.resp.txt]`. The outcome is something like:
    ```
    const model = 'data:text/plain;base64,'
	    + `MCB......`, //very long base64 string
	part_paths = {"LDRConfig.ldr":......}; //very large JSON
	```
	* Customize page title, header text and notes.
	* Optional: Change background colour (using typical web RGB syntax) in line: `LDR.Options.bgColor = 0x0000aa;`
	* Optional: either link to separate AIO JS codes file, or embed entire JS into HTML file.
	    * Separate file: `<script src='res/ldr-aio.min.js'></script>`
	    * Embed: replace above with `<script>`*everything from ldr-aio.min.js*`</script>`
    * Actually, there are a few other files not embedded, like .woff2 and .css. You can try embedding them yourselves or leave them separate and make sure they can be found.
3. Save file, and open the HTML file  in browser to view your Lego models.

### (Alpha!) Run Server SEApp
1. Simply run web server mode:
   ```
   ldr.exe
   ```
   or commandline output mode:
   ```
   ldr.exe file_path_to_LDR_file
   ```

Dev Notes:
* `ldr.ds` is all-in-one script embedded into ldr.exe the SEApp.

## Portable Viewer Mod
Just follow the steps in `Run Server to Generate Data for Portable Viewer`.

Alternatively, if you can't run Server mod to generate the data offline, you can try to capture the data from  [online LDraw Viewer](https://www.ldraw.org/parts/tools/ldraw-model-viewer.html). Steps:
* Debug the online viewer webpage. Search for 'posting' to set breakpoints in `ldraw-model-viewer.html`:
```
part_paths = JSON.parse(response);
//console.log(part_paths);
model = 'data:text/plain;base64,' + btoa(model);
if (scene) { //<-- breakpoint here
```
* Switch to debugger's Console tab to print `part_paths` and `model` and use 'Copy Object' (or equivalent) to copy each piece of data out.
    *  These 2 pieces of course then go right into the embed.

PS: Unfortunately, the LDraw page is down as of Jul 2024, as it appears to be missing ldraw scripts.

# Known Issues
There are some Lego models which fail to load, even in original viewer. Haven't figured out why. (This may be partly fixed in my 2024 update).

# Thanks
Thanks to everyone who made virtual Lego builds possible!

Do also check out my [LeoCAD mod](https://github.com/sdneon/leocad/) with better parts search et al, and a [fun blog](https://yunharla.wixsite.com/legommm).
