// import pkg from 'paseto';

// const { generateKeyPair } = pkg;

// const { publicKey, privateKey } = await generateKeyPair('public', { version: 'v4' });

// console.log(publicKey.export({ type: 'spki', format: 'pem' }));
// console.log(privateKey.export({ type: 'pkcs8', format: 'pem' }));

import { V4 as paseto } from "paseto";

const generate = async() => {
    const keyPair = await paseto.generateKey("public");
    const privateKeyPem = keyPair.export({
        format: "pem",
        type: "pkcs8"
    });
    
    console.log(privateKeyPem);
}

generate();
