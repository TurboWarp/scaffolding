# Scaffolding

Plumbs together all of the small libraries that make up a Scratch project runner into one mostly cohesive package.

This was originally part of the [TurboWarp Packager](https://packager.turbowarp.org/) (and is still used by it) but we think it is useful on its own too.

## API documentation

### Importing

Scaffolding is available in two variants. The only difference is how they handle the music extension. The default version downloads the sounds from `https://packagerdata.turbowarp.org/` when the extension is used, which makes the JS almost 2MB smaller but the sounds won't work offline or on networks that block turbowarp.org. There is an alternative variant that includes the sounds in the JS file as base64 data: URLs so they will always work, but again the file will be much larger.

### Usage

TODO

## Development

```bash
git clone https://github.com/TurboWarp/scaffolding.git
cd scaffolding
npm run build
```

## License

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
