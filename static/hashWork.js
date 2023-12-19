// importScripts('./1.js');
// import { add } from './1.js';
// onmessage = e => {
//     console.log(add(1, 2))
// }

// let SparkMd5;

// onmessage = async e => {

//     console.log(e.data.md5);
//     if (e.data.data) {
//         for (const ele of e.data.data) {
//             const form = new FormData()
//             const hash = await setMd5Nmae(ele.file);
//             console.log(form);
//             form.append('f1', ele.file, hash);
//             postMessage(form);
//         }
//     }
//     close();
// }
