// MODULES //
// const { sayHello } = require('./helpers/sayHello.helper');
// sayHello();

// GLOBAL VARIABLES //
//__dirname, __filename, process.cwd();
// console.log('from app.js');
//
// console.log(__dirname);
// console.log(__filename);
// console.log(process.cwd());
// CWD - current working directory

// PATH
// const path = require('path');
// C:\Users\l4pukhh\WebstormProjects\dec-2022
// Users/l4pukhh/WebstormProjects/dec-2022/helpers
// const joinedPath = path.join(__dirname, 'folder', 'folder2', 'text.txt');
// const normalizedPath = path.normalize('////test////test2////////test3///test4');
// const resolvedPath = path.resolve('folder', 'folder2', 'text.txt');
//
// console.log(joinedPath)
// console.log(normalizedPath);
// console.log(resolvedPath);

// OS
// const os = require('os');
// const { exec } = require('child_process');
//
// // x64 x86 = x32
// console.log(os.cpus());
// console.log(os.arch());
// console.log(os.version());

// const fs = require('fs');
// const path = require('path')
//
// const text2Path = path.join(__dirname, 'folder', 'folder2', 'text2.txt');

// fs.writeFile(text2Path, 'Hello from Okten again', (err)=>{
//   if (err) throw new Error(err.message);
// })
//
// fs.readFile(text2Path, { encoding: 'utf-8' },(err, data)=>{
//   if (err) throw new Error(err.message);
//   console.log(data);
// })
//
// fs.appendFile(text2Path, '\njsdkalf;sdjak;flda', (err)=>{
//   if (err) throw new Error(err.message);
// })
//
// fs.truncate(text2Path, (err)=>{
//   if (err) throw new Error(err.message);
// })
//
// fs.unlink(text2Path, (err)=>{
//   if (err) throw new Error(err.message);
// })
//
// fs.readdir(path.join(__dirname, 'folder'), { withFileTypes: true }, (err, files)=>{
//   if (err) throw new Error(err.message);
//   files.forEach(file=>{
//     console.log(file.isDirectory());
//   })
// })
//
// fs.mkdir(path.join(__dirname, 'folder', 'folder4'), (err)=>{
//   if (err) throw new Error(err.message);
// })
// fs.rm(path.join(__dirname, 'folder', 'folder2'), { recursive: true }, (err)=>{
//   if (err) throw new Error(err.message);
// })

const fs = require('node:fs/promises');
const path = require('node:path');

const foo = async () => {
    const bastPath = path.join(process.cwd(), 'baseFolder')
    await fs.mkdir(bastPath, {recursive: true});
    const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'];
    const folderNames = ['folder1', 'folder2', 'folder3', 'folder4'];

    for (const file of fileNames) {
        await fs.writeFile(path.join(bastPath, file), 'HELLO');
    }

    for (const folder of folderNames) {
        await fs.mkdir(path.join(bastPath, folder), {recursive: true});
    }
    const files = await fs.readdir(bastPath);
    for (const file of files) {
        // console.log(file)
        const stat = await fs.stat(path.join(bastPath, file));
        console.log(path.join(bastPath, file), ':', stat.isDirectory() ? 'folder' : 'file');

    }
}
// foo();

const footwo = async () => {
    const bastPath = path.join(process.cwd(), 'baseFolder')
    await fs.mkdir(bastPath, {recursive: true});
    const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'];
    const folderNames = ['folder1', 'folder2', 'folder3', 'folder4'];


    for (const folder of folderNames) {
        const folderPath = path.join(bastPath, folder)
        await fs.mkdir(folderPath, {recursive: true});
        for (const file of fileNames) {
            await fs.writeFile(path.join(folderPath, file), 'HELLO');
        }
    }
    const files = await fs.readdir(bastPath);
    for (const file of files) {
        // console.log(file)
        const stat = await fs.stat(path.join(bastPath, file));
        console.log(path.join(bastPath, file), ':', stat.isDirectory() ? 'folder' : 'file');

    }
}
// footwo();

const foothree = async () => {
    const basePath = path.join(process.cwd(), 'baseFolder');

    await fs.mkdir(basePath, {recursive: true});
    const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt', 'file6.txt',];
    const folderNames = ['folder1', 'folder2', 'folder3', 'folder4'];


    console.log(await Promise.allSettled(folderNames.map(async (folder) => {
        const folderPath = path.join(basePath, folder);
        await fs.mkdir(folderPath);

        await Promise.allSettled(fileNames.map(async (file) => {
            await fs.writeFile(path.join(folderPath, file), 'HELLO');
        }));
    })));
    console.log(11111111111)


    // const files = await fs.readdir(bastPath);
    // for (const file of files) {
    //     // console.log(file)
    //     const stat = await fs.stat(path.join(bastPath, file));
    //     console.log(path.join(bastPath, file), ':', stat.isDirectory() ? 'folder' : 'file');
    //
    // }
}
foothree();
