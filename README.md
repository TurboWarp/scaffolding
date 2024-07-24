# Scaffolding (alpha)

Scaffolding is a minimal Scratch project runner. It was began as part of the [TurboWarp Packager](https://packager.turbowarp.org/) (and is still used by it). Usage in other applications was historically an afterthought, but we're trying to improve that and making it a separate library is a necessary step.

What scaffolding does for you:

 - Pre-builds all the packages needed to run Scratch projects into one package and connects them all together in the right way.
 - Implements user input like mouse input including sprite dragging and keyboard input.
 - Implements highly performant variable monitors and list monitors (the boxes that appear over the stage).
 - Implements the "ask and wait" block.
 - Implements the video sensing extension.
 - Provides cloud variable implementations using WebSockets or local storage.
 - Closely emulates the style of vanilla Scratch.

What scaffolding does not do for you:

 - Downloading projects. You have to fetch it yourself, though we have some code below you can copy and paste for common cases.
 - The rest of the interface, like the control bar or green flag overlay. We have some APIs that can help, but you have to make the actual buttons yourself.
 - Provide a project editor. Scaffolding just runs projects. Removing features only used by the editor is one way we make scaffolding smaller and faster.

## Usage

Scaffolding is available in two variants. The only difference is how they handle the music extension:

 - `scaffolding-min` (2.2MB) is the default variant. When the music extension is used, the sounds will be downloaded from `https://packagerdata.turbowarp.org/`. This variant is 2MB smaller, but the music extension won't work offline or if the network blocks turbowarp.org.
 - `scaffolding-with-music` (4.3MB) includes all the sounds as data: URLs inside the JavaScript, so the music extension will always work, even without an internet connection.

Having multiple versions or variants of scaffolding on the same page probably won't work, don't try.

### Installation

Each variant of scaffolding is distributed as a single pre-built pre-compressed JavaScript bundle; you just need to load that bundle somehow. There's a bunch of ways to do this, sorted roughly in order of difficulty.

#### &lt;script&gt; tag

Replace `0.0.0` with the latest version number from https://github.com/TurboWarp/scaffolding/releases. You should use **exact** version numbers instead of things like "1" or "latest". We use [jsDelivr](https://www.jsdelivr.com/) in the examples for simplicity, but you can also download the JS file to your own server if you prefer having full control.

```html
<!-- Do ONE of these: -->
<script src="https://cdn.jsdelivr.net/npm/@turbowarp/scaffolding@0.0.0/dist/scaffolding-min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@turbowarp/scaffolding@0.0.0/dist/scaffolding-with-music.js"></script>

<script>
    // Then scaffolding is exported as a global variable
    const scaffolding = new Scaffolding.Scaffolding();
</script>
```

#### Native ESM import

Scaffolding does not have a build that use native ESM syntax. However, you can still use either static or dynamic import, it will just be accessible from a global variable instead of from the import.

```html
<script type="module">
    // Do ONE of these:
    import "https://cdn.jsdelivr.net/npm/@turbowarp/scaffolding@0.0.0/dist/scaffolding-min.js";
    import "https://cdn.jsdelivr.net/npm/@turbowarp/scaffolding@0.0.0/dist/scaffolding-with-music.js";
    await import("https://cdn.jsdelivr.net/npm/@turbowarp/scaffolding@0.0.0/dist/scaffolding-min.js");
    await import("https://cdn.jsdelivr.net/npm/@turbowarp/scaffolding@0.0.0/dist/scaffolding-with-music.js");

    // Then scaffolding is exported as a global variable
    const scaffolding = new Scaffolding.Scaffolding();
</script>
```

#### npm with a build tool

If you use a build tool like webpack, you can install scaffolding from npm and then import as any other library:

```bash
npm install --save-exact @turbowarp/scaffolding
```

Then scaffolding can be imported by doing any **one** of these:

```js
// Do ONE of these or the import statements below:
const Scaffolding = require('@turbowarp/scaffolding');
const Scaffolding = require('@turbowarp/scaffolding/with-music');
```

webpack in particular will let you use the nicer ESM syntax even though it is actually a CJS module, so you can do these instead:

```js
// Do ONE of these or the require() statements above:
import * as Scaffolding from '@turbowarp/scaffolding';
import * as Scaffolding from '@turbowarp/scaffolding/with-music';
const Scaffolding = await import('@turbowarp/scaffolding');
const Scaffolding = await import('@turbowarp/scaffolding/with-music');

// DO NOT do one of these, it WILL NOT work:
import Scaffolding from '@turbowarp/scaffolding';
import Scaffolding from '@turbowarp/scaffolding/with-music';
```

then you can use the import as normal:

```js
const scaffolding = new Scaffolding.Scaffolding();
```

### Configuring it

We'll assume you've followed the above steps and now have a scaffolding instance named `scaffolding`.

There are a few settings that can't be changed later. The full list and their default value are below, so modify any of these first if you want to change them:

```js
scaffolding.width = 480;
scaffolding.height = 360;
scaffolding.resizeMode = 'preserve-ratio'; // or 'dynamic-resize' or 'stretch'
scaffolding.editableLists = false;
scaffolding.shouldConnectPeripherals = true;
scaffolding.usePackagedRuntime = false;
```

Then tell scaffolding to initialize the runtime:

```js
scaffolding.setup();
```

Then put scaffolding's root element into the DOM somewhere using `scaffolding.appendTo(element)`. Scaffolding uses `width: 100%; height: 100%;`, so use CSS to control the size of the element you append scaffolding into. For example this will make a fixed 480x360 stage:

```html
<style>
    #project {
        width: 480px;
        height: 360px;
    }
</style>
<div id="project"></div>
```

```js
scaffolding.appendTo(document.getElementById('project'));
```

Scaffolding will automatically resize when the window is resized. If you have another button that can cause the element to be resized, run `scaffolding.relayout()` to ensure it updates.

### Loading a project

If you intend to load projects from Scratch or loose project.json files, you'll have to tell scratch-storage where to download assets from. This will tell it to use the scratch.mit.edu assets server:

```js
const storage = scaffolding.storage;
storage.addWebStore(
  [storage.AssetType.ImageVector, storage.AssetType.ImageBitmap, storage.AssetType.Sound],
  (asset) => `https://assets.scratch.mit.edu/internalapi/asset/${asset.assetId}.${asset.dataFormat}/get/`
);
```

You can supply scaffolding with a project.json file or a full sb, sb2, or sb3 file as an ArrayBuffer, Uint8Array, or Blob and then feed it into `scaffolding.loadProject`. However you go about acquiring those is up to you; you can ask the user to enter one into an input or fetch it from your own server. If you want to load projects from Scratch, we suggest the following as a starting point.

```js
// See https://docs.turbowarp.org/unshared-projects#developers
const getProjectMetadata = async (projectId) => {
    const response = await fetch(`https://trampoline.turbowarp.org/api/projects/${projectId}`);
    if (response.status === 404) {
        throw new Error('The project is unshared or does not exist');
    }
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status} fetching project metadata`);
    }
    const json = await response.json();
    return json;
};
const getProjectData = async (projectId) => {
    const metadata = await getProjectMetadata(projectId);
    const token = metadata.project_token;
    const response = await fetch(`https://projects.scratch.mit.edu/${projectId}?token=${token}`);
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status} fetching project data`);
    }
    const data = await response.arrayBuffer();
    return data;
};

const loadProject = (projectId) => {
    const project = await getProjectData(projectId);
    await scaffolding.loadProject(project);
};
loadProject('60917032');
```

Once the project loads, you can start the project with

```js
scaffolding.greenFlag();
```

### Content-Security-Policy considerations

Meaningfully sandboxing scaffolding with Content-Security-Policy is hard. It needs to be able to fetch things from `data:` and `blob:` URLs, and the TurboWarp compiler, enabled by default, requires `unsafe-eval`.

## Development

```bash
git clone https://github.com/TurboWarp/scaffolding.git
cd scaffolding
npm run build
```

## License

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
