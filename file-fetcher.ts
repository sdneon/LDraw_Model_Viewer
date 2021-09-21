var fs = require('fs');

var files: { [filename: string]: string } = {},
    encoding = 'utf-8',
    //rootDirectory = __dirname + '/../../LDraw/',
    rootDirectory = 'c:/p/LDraw_Data/LDraw/',
    partsDirectory = rootDirectory + 'parts/',
    pDirectory = rootDirectory + 'p/',
    unofficialPartsDirectory = rootDirectory + 'Unofficial/parts/',
    unofficialPDirectory = rootDirectory + 'Unofficial/p/';

/**
 * Remove all comments from given string
 **/
function cleanComments(content: string)
{
    if ((content.length <= 0) || (content.indexOf('//') < 0))
    {
        return content;
    }
    content = content.split(/\r?\n/);
    content.forEach((line, j) => {
        const i = line.indexOf('//');
        if (i >= 0)
        {
            content[j] = line.substring(0, i);
        }
    });
    return content.join('\n');
}

/**
 * Recursively load all LDR files needed
 * @param filenames (string[] | string) Can be LDR file content as a string, or array of filenames
 **/
var getSubfiles = (filenames: string[] | string, completedCallback: (allFiles: { [filename: string]: string }) => void) => {
    // keeps track of how many subfiles we've successfully fetched.
    // when completedCount === the number of subfile references, we're done with this file
    let completedCount = 0;

    if (typeof filenames === 'string')
    {
        // the file split into individual lines;
        var lines = filenames.split(/\r?\n/g);

        // break this file down into lines, filter out any non-subfile reference lines,
        // and map it to an array of just filenames
        filenames = lines.filter(l => {
            // only return subfile reference lines (lines that begin will line code 1)
            if (!/$\s*^/.test(l)) {
                var splitLine = l.trim().split(/\s+/g)
                if (splitLine[0] === '1') {
                    return true;
                }
            }
            return false;
        }).map(m => {

            // return the filename
            return m.trim().split(/\s+/g)[14];
        });
    }

    filenames.forEach((filename, i, arr) => {
        filename = filename.toLowerCase().replace(/\\/g, '/');

        if (!(filename in files)) {
            // if we haven't already fetched this file (or at least started the fetching process)

            // create a placeholder for this file so we won't try and fetch it again
            files[filename] = null;

            // find the file
            fs.stat(partsDirectory + filename, (err, stat) => {
                if (err === null) {
                    // we found the file in the parts directory

                    fs.readFile(partsDirectory + filename, encoding, (err, data) => {
                        files[filename] = cleanComments(data);

                        // fetch this file's subfiles
                        getSubfiles(data, () => {
                            completedCount++;
                            if (completedCount === arr.length) {
                                completedCallback(files);
                            }
                        });
                    });
                } else {
                    // we didn't find the file in the parts directory, look in the p directory

                    fs.stat(pDirectory + filename, (err, stat) => {
                        if (err === null) {
                            fs.readFile(pDirectory + filename, encoding, (err, data) => {
                                files[filename] = cleanComments(data);

                                // fetch this file's subfiles
                                getSubfiles(data, () => {
                                    completedCount++;
                                    if (completedCount === arr.length) {
                                        completedCallback(files);
                                    }
                                });
                            });
                        } else {
                            // still no luck, let's check the unofficial parts directory

                            fs.stat(unofficialPartsDirectory + filename, (err, stat) => {
                                if (err === null) {
                                    // we found the file in the parts directory

                                    fs.readFile(unofficialPartsDirectory + filename, encoding, (err, data) => {
                                        files[filename] = cleanComments(data);

                                        // fetch this file's subfiles
                                        getSubfiles(data, () => {
                                            completedCount++;
                                            if (completedCount === arr.length) {
                                                completedCallback(files);
                                            }
                                        });
                                    });
                                } else {
                                    // last chance, let's check the unofficial p directory

                                    fs.stat(unofficialPDirectory + filename, (err, stat) => {
                                        if (err === null) {
                                            // we found the file in the parts directory

                                            fs.readFile(unofficialPDirectory + filename, encoding, (err, data) => {
                                                files[filename] = cleanComments(data);

                                                // fetch this file's subfiles
                                                getSubfiles(data, () => {
                                                    completedCount++;
                                                    if (completedCount === arr.length) {
                                                        completedCallback(files);
                                                    }
                                                });
                                            });
                                        } else {

                                            // we didn't find the part, let's ignore it,
                                            // it might be part of a .mpd
                                            files[filename] = '';
                                            console.log('Failed to find:'.bold.error, filename);

                                            completedCount++;
                                            if (completedCount === arr.length) {
                                                completedCallback(files);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            // we've previously fetched this file (or are already in the process of fetching it).
            // don't try and fetch it again.

            completedCount++;
            if (completedCount === arr.length) {
                completedCallback(files);
            }
        }
    });

    if (filenames.length === 0) {
        // this file didn't have any further subfile references, so just call the callback immediately

        completedCallback(files);
    }
}

module.exports = {
    fetchFiles: (filenames: string[] | string, completedCallback: (allFiles: { [filename: string]: string }) => void) => {
        // store the provided file in the "files" object
        //files['$rootfile$'] = rootFile;

        // begin the recursive subfile-fetching process
        getSubfiles(filenames, (allFiles) => {
            // also get LDConfig.ldr
            var ldConfigFilename = 'LDConfig.ldr';
            fs.readFile(rootDirectory + ldConfigFilename, encoding, (err, data) => {
                if (err === null) {
                    allFiles[ldConfigFilename] = data;
                    completedCallback(allFiles);
                } else {
                    throw 'LDConfig.ldr not found';
                }
            });
        });
    }
}
