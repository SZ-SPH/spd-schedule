import useUserStore from '@/store/modules/user';
import CryptoJS from 'crypto-js';
// 加密消息
export function encrypt(str) {
  var KEY = useUserStore().encrypted.KEY; //32位
  var IV = useUserStore().encrypted.IV; //16位
  var key = CryptoJS.enc.Utf8.parse(KEY);
  var iv = CryptoJS.enc.Utf8.parse(IV);
  var encrypted = '';

  var srcs = CryptoJS.enc.Utf8.parse(str);
  encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.ciphertext.toString();
}


//解密消息
export function decrypt(str) {
  var KEY = useUserStore().encrypted.KEY; //32位
  var IV = useUserStore().encrypted.IV; //16位
  var key = CryptoJS.enc.Utf8.parse(KEY);
  var iv = CryptoJS.enc.Utf8.parse(IV);
  var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
