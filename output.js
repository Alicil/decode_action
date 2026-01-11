//Sun Jan 11 2026 09:12:09 GMT+0000 (Coordinated Universal Time)
//Base:<url id="cv1cref6o68qmpt26ol0" type="url" status="parsed" title="GitHub - echo094/decode-js: JS混淆代码的AST分析工具 AST analysis tool for obfuscated JS code" wc="2165">https://github.com/echo094/decode-js</url>
//Modify:<url id="cv1cref6o68qmpt26olg" type="url" status="parsed" title="GitHub - smallfawn/decode_action: 世界上本来不存在加密，加密的人多了，也便成就了解密" wc="741">https://github.com/smallfawn/decode_action</url>
const forge = require("node-forge"),
  axios = require("axios"),
  https = require("https"),
  crypto = require("crypto"),
  zlib = require("zlib"),
  {
    promisify
  } = require("util"),
  gunzip = promisify(zlib.gunzip),
  TASK_SETTINGS = {
    "targetGold": 30000,
    "loopTaskDelay": 12000,
    "concurrent": false,
    "withdrawAmount": "0.5",
    "maxWithdrawRetry": 3,
    "totalWithdrawTaskRetry": 10,
    "stopOnUserNotExists": true,
    "maxWithdrawLoopRetry": 99999,
    "preWithdrawTaskTimes": 10,
    "preWithdrawSleep": 3,
    "task2599Sec": "AAF5JGhtIDwkc38kKip4fyQyIGI2Kn8=",
    "task2599ApiUrl": "https://welfare-user.palmestore.com/api/task/task/receive",
    "task2599SignPath": "/task/task/receive",
    "debugMode": false,
    "debugPrefix": "[DEBUG]"
  },
  DEFAULT_CONFIG = {
    "X_SIG_Sec_Withdraw": "AAF6I2dmIzsreHwjJSF7eCs5I2U5IXw=",
    "itemId": "12010000",
    "sub_task_id": "20000000"
  },
  RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOI6oQWnY2P0q1\nKA3Vs4JbdOzpuuugLNFKD4E/ts7+tjZZWomFXZpbn/GNnZTCCnECf7y+ljZRFyi4\nUqw2eQISChrd4p4cY/ngD3Ph6Hea9E10YS5i7V4T1PI1VTpmMgKq1+FGXEnvka2f\nbPAOSpZNk/q9O8IQHs+0uK+S4bkJHTz39m7ArPciZQXTDOxLeeD+Wsb6vqda0wC6\n+kgBF2dyXZhmL1zUoJEfQ4KkVb6eLZGauseDwjshz2T9//yWAvrq6Y9BF1VbQOKE\nG4BCPNfawQosod1tMhSSQZtu9LZI6CfI4HhpeTxXT6IbqrjajrJ9osODiU/tSx9q\nVzdagUiLAgMBAAECggEBAMwWqUg5l/ILZbbHqjLa4AQWVnzuEFzsImW1xhxDrNqn\nolWC+sasrqdqSmgQDPi0B8EWoNL8u1g7mpgrWc8wrSkZEhJ+TFYFcZ4xDmUqmEg0\n+f5wPNG6+rqdyROehwwpFVT6GVJlCtqCm6hM3br4g6jZCpWR9YeqSbA+ba35hw4K\nOA6juNPFELD5IIq3L6tYiYMujWFwiVV08AR8++T3ZETBYRHmCxgREXYws6tdIojs\nPA00CnW0ta1UcrUKDxK8YZnY1h/GQ+1y5pKGkVvwUodOM3b1SBIz6kA6CvOpTGhK\nhsnhH1x6SvbGC/HhotElsUObXucvhul1yyJbljMPlFECgYEA/9mN6sYFbFn0ggwE\nBd8YXeFKMFpgVsh2PMVXNTW4pX2EyJV77FcIgFnb9Qp4E//bJZCf3RvGY82zf3BO\ndi/m1lsN64OXxVX5YZjE8RW94w3adQxiMJTSR+ZJMzVeSbUhZlN3rMZkrYEmr/Hg\n2Ap0ufUH7IqUtMwmy59Xwl/5w7MCgYEAzkKj33TJOfrsEncKwMAMEPgUePDjJ5sx\n9J70pNfRH4y0VTmuSWUQhpGz6eyTMFNG0IxBy5zuUIxTu4FHL99H0kxvwGnNVhhC\n8k9ChFJkpW1uEufxv6a2hsMMzep7AcmfwTNY4/NO68+GDzrGfoJVtAUTu+SJQAd9\nY64/oJrSW8kCgYBgjB1k2gMT50JAjP47pPuR+cFAS+qM9SrBNgr5tmMOeDZSZy6T\neihoHwDFEIVNrsBpBZF+I8wSv34b+ipxqRPoEgZHuKneOtpXvQmcnILCmui0QM8Q\n3CgaH8nBvELvd525+odvuJInc1RBEvqxLAjuX4v09Dq3m06Min3YiNU8xwKBgQCt\nwkIfO1lR+OrrW1G5s4/2s6c7g2M5uGpLM6XRQOaxd21r5p3Gwtc7Jn+0b1JIAb/E\nbIP5Lgkt3imj6nK4B5ePuEjkhb0v7FxpmQ/mPSsAmcGDN9bWp3FY8fRVfFWH2f01\nWzZlQlGYIklDhzY02UOt1iEbxplBUY32bZK4j/Tq0QKBgCZjm5nSTYbWuz+v4TiI\nocTs0KP3nVRKYP7hGh7/U6gWCUPPgXhCtsxrzaWuih+tT4LUoHM3g/kE+M2Xfn2+\nG68Xm9iTwmzzzrMP8wyIY3IYJ7xgR5Nl1rMFjPqCLVXKtJgFmMX3RA07vCkRKX88q\ndLE0BrSXIgIr2vdpdsgGcfr\n-----END PRIVATE KEY-----";
function debugLog(..._0x1c8b69) {
  if (TASK_SETTINGS.debugMode) {
    console.log("" + TASK_SETTINGS.debugPrefix, ..._0x1c8b69);
  }
}
function debugError(..._0x2fe2ef) {
  if (TASK_SETTINGS.debugMode) {
    console.error("" + TASK_SETTINGS.debugPrefix, ..._0x2fe2ef);
  }
}
function loadAndValidateAccounts() {
  const _0x57e0ef = process.env.SKCS || "",
    _0x368737 = [],
    _0x543a92 = _0x57e0ef.split("\n").map(_0x173bdb => _0x173bdb.trim()).filter(_0x3f414b => _0x3f414b);
  for (let _0xe19e94 = 0; _0xe19e94 < _0x543a92.length; _0xe19e94++) {
    const _0x4bfa40 = _0x543a92[_0xe19e94].trim();
    if (!_0x4bfa40) continue;
    const _0x3ed5db = _0x4bfa40.split("+++").map(_0x5ad1f4 => _0x5ad1f4.trim());
    if (_0x3ed5db.length < 8) {
      console.error("❌ 账号" + (_0xe19e94 + 1) + "（备注：" + (_0x3ed5db[0] || "未知") + "）配置错误：核心参数不足！");
      console.error("   格式要求（微信）：备注+++p1+++原始usr+++zyeid+++zysid+++p35+++wx+++wechatId+++userAgent+++sigSec+++p16+++p22+++p31+++p9+++p7+++usr_1440");
      console.error("   格式要求（支付宝）：备注+++p1+++原始usr+++zyeid+++zysid+++p35+++zfb+++userAgent+++sigSec+++p16+++p22+++p31+++p9+++p7+++usr_1440");
      process.exit(1);
    }
    const _0x1e3bc5 = {
      "name": _0x3ed5db[0],
      "p1": _0x3ed5db[1],
      "usr": _0x3ed5db[2],
      "zyeid": _0x3ed5db[3],
      "zysid": _0x3ed5db[4],
      "p35": _0x3ed5db[5],
      "withdrawChannel": _0x3ed5db[6].toLowerCase(),
      "usr_1440": "",
      "externalTaskParams": {
        "ecpm": randomEcpm(),
        "watch_video_al_dp": Math.random() > 0.8 ? "true" : "false"
      },
      "task1440Config": {
        "userAgent": "",
        "sigSec": "",
        "p16": "",
        "p22": "",
        "p31": "",
        "p9": "",
        "p7": "",
        "sub_task_id": generateDynamicSubTaskId()
      },
      "withdrawConfig": {
        "itemId": "12010000",
        "X_SIG_Sec_Withdraw": "AAF6I2dmIzsreHwjJSF7eCs5I2U5IXw="
      }
    };
    if (_0x1e3bc5.withdrawChannel === "wx") (_0x3ed5db.length < 8 || !_0x3ed5db[7]) && (console.error("❌ 账号" + (_0xe19e94 + 1) + "（备注：" + _0x1e3bc5.name + "）配置错误：缺少必填参数 wechatId！"), process.exit(1)), (_0x3ed5db.length < 16 || !_0x3ed5db[15]) && (console.error("❌ 账号" + (_0xe19e94 + 1) + "（备注：" + _0x1e3bc5.name + "）配置错误：缺少必填参数 usr_1440！"), process.exit(1)), _0x1e3bc5.withdrawConfig.wechatId = _0x3ed5db[7], _0x1e3bc5.task1440Config.userAgent = _0x3ed5db.length >= 9 ? _0x3ed5db[8] : "", _0x1e3bc5.task1440Config.sigSec = _0x3ed5db.length >= 10 ? _0x3ed5db[9] : "", _0x1e3bc5.task1440Config.p16 = _0x3ed5db.length >= 11 ? _0x3ed5db[10] : "", _0x1e3bc5.task1440Config.p22 = _0x3ed5db.length >= 12 ? _0x3ed5db[11] : "", _0x1e3bc5.task1440Config.p31 = _0x3ed5db.length >= 13 ? _0x3ed5db[12] : "", _0x1e3bc5.task1440Config.p9 = _0x3ed5db.length >= 14 ? _0x3ed5db[13] : "", _0x1e3bc5.task1440Config.p7 = _0x3ed5db.length >= 15 ? _0x3ed5db[14] : "", _0x1e3bc5.usr_1440 = _0x3ed5db[15], console.log("✅ 账号" + (_0xe19e94 + 1) + "（备注：" + _0x1e3bc5.name + "，微信提现）配置校验通过 | usr_1440：" + _0x1e3bc5.usr_1440);else _0x1e3bc5.withdrawChannel === "zfb" ? ((_0x3ed5db.length < 15 || !_0x3ed5db[14]) && (console.error("❌ 账号" + (_0xe19e94 + 1) + "（备注：" + _0x1e3bc5.name + "）配置错误：缺少必填参数 usr_1440！"), process.exit(1)), _0x1e3bc5.task1440Config.userAgent = _0x3ed5db.length >= 8 ? _0x3ed5db[7] : "", _0x1e3bc5.task1440Config.sigSec = _0x3ed5db.length >= 9 ? _0x3ed5db[8] : "", _0x1e3bc5.task1440Config.p16 = _0x3ed5db.length >= 10 ? _0x3ed5db[9] : "", _0x1e3bc5.task1440Config.p22 = _0x3ed5db.length >= 11 ? _0x3ed5db[10] : "", _0x1e3bc5.task1440Config.p31 = _0x3ed5db.length >= 12 ? _0x3ed5db[11] : "", _0x1e3bc5.task1440Config.p9 = _0x3ed5db.length >= 13 ? _0x3ed5db[12] : "", _0x1e3bc5.task1440Config.p7 = _0x3ed5db.length >= 14 ? _0x3ed5db[13] : "", _0x1e3bc5.usr_1440 = _0x3ed5db[14], console.log("✅ 账号" + (_0xe19e94 + 1) + "（备注：" + _0x1e3bc5.name + "，支付宝提现）配置校验通过 | usr_1440：" + _0x1e3bc5.usr_1440)) : (console.error("❌ 账号" + (_0xe19e94 + 1) + "（备注：" + _0x1e3bc5.name + "）配置错误：提现渠道只能是 wx 或 zfb，当前值：" + _0x3ed5db[6]), process.exit(1));
    if (!_0x1e3bc5.task1440Config.userAgent || !_0x1e3bc5.task1440Config.sigSec) {
      console.error("❌ 账号" + (_0xe19e94 + 1) + "（备注：" + _0x1e3bc5.name + "）配置错误：缺少 userAgent 或 sigSec 参数！");
      process.exit(1);
    }
    debugLog("账号" + (_0xe19e94 + 1) + "完整配置：", JSON.stringify(_0x1e3bc5, null, 2));
    _0x368737.push(_0x1e3bc5);
  }
  _0x368737.length === 0 && (console.error("❌ 未配置任何有效账号！"), process.exit(1));
  return _0x368737;
}
const ACCOUNTS = loadAndValidateAccounts(),
  TASK_1440_CONFIG = {
    "apiUrl": "https://theater.bjyikan.cn/welfare_api/client/task/app/task/draw_gift",
    "fixedParams": {
      "p2": "475678",
      "p21": "3",
      "p24": "0",
      "p25": "30560",
      "p29": "zy8b0c8f",
      "p3": "103056009",
      "p33": "com.zhangyue.app.shortplay.yikanbj",
      "p34": "navigationbar_is_min",
      "p4": "501609",
      "p5": "16",
      "pc": "10",
      "reward_type": Math.random() > 0.7 ? "first" : "normal",
      "task_id": "1440"
    },
    "signConfig": {
      "sigAlg": "RSA-SHA256",
      "path": "/welfare_api/client/task/app/task/draw_gift"
    }
  },
  WITHDRAW_CONFIG = {
    "apiUrl": "https://welfare-user.palmestore.com/api/user/cashWithdraw",
    "signConfig": {
      "sigAlg": "RSA-SHA256",
      "path": "/user/cashWithdraw"
    },
    "fixedHeaders": {
      "X-AppId": "zy8b0c8f",
      "X-SIG-Ver": "v1.1",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json, text/plain, */*",
      "X-Requested-With": "com.zhangyue.app.shortplay.yikanbj",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Referer": "https://welfare-user.palmestore.com/sukan-playlet/sukan/withdraw/index.html?hideNav=true",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "Connection": "keep-alive"
    }
  };
function getTimestamp() {
  return Date.now().toString();
}
function randomEcpm() {
  const _0x3960c4 = 20000,
    _0x54c9c1 = 28000;
  return Math.floor(Math.random() * (_0x54c9c1 - _0x3960c4 + 1)) + _0x3960c4;
}
function generateDynamicAdId() {
  const _0x4dedf1 = 142000,
    _0x28cb30 = 142999;
  return Math.floor(Math.random() * (_0x28cb30 - _0x4dedf1 + 1)) + _0x4dedf1;
}
function generateDynamicActId() {
  const _0x305059 = 1400,
    _0x10bf88 = 1499;
  return Math.floor(Math.random() * (_0x10bf88 - _0x305059 + 1)) + _0x305059;
}
function generateDynamicSubTaskId() {
  const _0x5a946e = 20000000,
    _0x52cf7f = 20099999;
  return Math.floor(Math.random() * (_0x52cf7f - _0x5a946e + 1)) + _0x5a946e;
}
function randomDelay(_0x3aa87c) {
  const _0x171a0d = Math.floor(Math.random() * 5000);
  return _0x3aa87c + _0x171a0d;
}
function randomWait() {
  const _0x1e7edc = 20000 + Math.random() * 5000;
  console.log("⏳ 等待 " + (_0x1e7edc / 1000).toFixed(1) + " 秒后执行下一次2599任务...");
  return new Promise(_0x5d943c => setTimeout(_0x5d943c, _0x1e7edc));
}
function generate1440Signature(_0x5c0471, _0x234dac, _0x41a422) {
  try {
    {
      const _0x44509e = _0x41a422.task1440Config.sigSec,
        _0x3ccce5 = TASK_1440_CONFIG.signConfig.path,
        _0x2a35b0 = _0x5c0471 + "&&" + _0x3ccce5 + "&" + _0x234dac + "&" + _0x44509e;
      debugLog("\n🔍 [1440任务签名] 原始内容（脱敏）：");
      debugLog("- paramsStr: " + _0x5c0471.substring(0, 50) + "...");
      debugLog("- path: " + _0x3ccce5);
      debugLog("- timestamp: " + _0x234dac);
      debugLog("- sigSec: " + _0x44509e.substring(0, 8) + "****");
      debugLog("- 完整签名原始内容: " + _0x2a35b0);
      const _0x1d3db7 = forge.pki.privateKeyFromPem(RSA_PRIVATE_KEY),
        _0x54c27a = forge.md.sha256.create();
      _0x54c27a.update(_0x2a35b0, "utf8");
      const _0x4de437 = forge.util.encode64(_0x1d3db7.sign(_0x54c27a));
      debugLog("- 签名结果: " + _0x4de437.substring(0, 20) + "...");
      debugLog("- 完整签名结果: " + _0x4de437);
      return _0x4de437;
    }
  } catch (_0x2ac07e) {
    debugError("❌ 1440任务签名生成失败：" + _0x2ac07e.message);
    debugError("错误堆栈:", _0x2ac07e.stack);
    throw _0x2ac07e;
  }
}
function generatePreTaskSignature(_0x175c83, _0x1c7082, _0xb4a8f3) {
  return generate1440Signature(_0x175c83, _0x1c7082, _0xb4a8f3);
}
function generateWithdrawSignature(_0x40e90f, _0x4f5e77, _0x43f9b8) {
  try {
    const _0x200a9a = getTimestamp(),
      _0x4f3e5f = Object.entries(_0x40e90f).sort((_0x43d828, _0x943804) => _0x43d828[0].localeCompare(_0x943804[0])),
      _0x41b561 = _0x4f3e5f.map(([_0x5832ab, _0x138171]) => _0x5832ab + "=" + _0x138171).join("&"),
      _0x53116b = _0x4f5e77 + "&" + _0x200a9a + "&" + _0x43f9b8 + "&&" + _0x41b561;
    debugLog("\n🔍 [提现任务签名] 原始内容（脱敏）：");
    debugLog("- apiPath: " + _0x4f5e77);
    debugLog("- timestamp: " + _0x200a9a);
    debugLog("- sec: " + _0x43f9b8.substring(0, 8) + "****");
    debugLog("- formStr: " + _0x41b561.substring(0, 50) + "...");
    debugLog("- 完整签名原始内容: " + _0x53116b);
    debugLog("- 提现参数完整列表:", _0x40e90f);
    const _0x225abf = crypto.createSign("RSA-SHA256");
    _0x225abf.update(Buffer.from(_0x53116b, "utf-8"));
    const _0x167003 = _0x225abf.sign(RSA_PRIVATE_KEY, "base64");
    debugLog("- 签名结果: " + _0x167003.substring(0, 20) + "...");
    debugLog("- 完整签名结果: " + _0x167003);
    return {
      "sign": _0x167003,
      "timestamp": _0x200a9a,
      "formStr": _0x41b561
    };
  } catch (_0x20fa3a) {
    debugError("❌ 提现任务签名生成失败：" + _0x20fa3a.message);
    debugError("错误堆栈:", _0x20fa3a.stack);
    throw _0x20fa3a;
  }
}
function generate2599TaskSignature(_0x3e179d, _0xfa3fd0, _0x3f1af8) {
  try {
    {
      const _0x24765f = Date.now().toString().padStart(13, "0").slice(0, 13),
        _0x6144da = Object.entries(_0x3e179d).sort((_0x1edb08, _0x960b8) => _0x1edb08[0].localeCompare(_0x960b8[0])),
        _0x5bc005 = _0x6144da.map(([_0x304f26, _0x31a8d9]) => _0x304f26 + "=" + _0x31a8d9).join("&"),
        _0x43d889 = _0xfa3fd0 + "&" + _0x24765f + "&" + _0x3f1af8 + "&&" + _0x5bc005;
      debugLog("\n🔍 [2599任务签名] 原始内容（脱敏）：");
      debugLog("- apiPath: " + _0xfa3fd0);
      debugLog("- timestamp: " + _0x24765f);
      debugLog("- sec: " + _0x3f1af8.substring(0, 8) + "****");
      debugLog("- formStr: " + _0x5bc005.substring(0, 50) + "...");
      debugLog("- 完整签名原始内容: " + _0x43d889);
      debugLog("- 2599参数完整列表:", _0x3e179d);
      const _0x34b993 = crypto.createSign("RSA-SHA256");
      _0x34b993.update(Buffer.from(_0x43d889, "utf-8"));
      const _0x1d5708 = _0x34b993.sign(RSA_PRIVATE_KEY, "base64"),
        _0x303e98 = _0x1d5708.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      debugLog("- 签名结果: " + _0x303e98.substring(0, 20) + "...");
      debugLog("- 完整签名结果: " + _0x303e98);
      return {
        "sign": _0x303e98,
        "timestamp": _0x24765f,
        "formStr": _0x5bc005
      };
    }
  } catch (_0x182c23) {
    debugError("❌ 2599任务签名生成失败：" + _0x182c23.message);
    debugError("错误堆栈:", _0x182c23.stack);
    throw _0x182c23;
  }
}
function parseReward(_0x8aa41b) {
  let _0x3f01c9 = 0;
  try {
    debugLog("原始响应数据：" + JSON.stringify(_0x8aa41b, null, 2));
    if (_0x8aa41b?.["body"]?.["gift_info"]?.["length"] > 0) _0x3f01c9 = Number(_0x8aa41b.body.gift_info[0].amount || 0);else {
      if (_0x8aa41b?.["data"]?.["gift_info"]?.["length"] > 0) _0x3f01c9 = Number(_0x8aa41b.data.gift_info[0].amount || 0);else {
        if (_0x8aa41b?.["gift_info"]?.["length"] > 0) _0x3f01c9 = Number(_0x8aa41b.gift_info[0].amount || 0);else {
          if (_0x8aa41b?.["body"]?.["amount"]) _0x3f01c9 = Number(_0x8aa41b.body.amount || 0);else {
            if (_0x8aa41b?.["data"]?.["amount"]) _0x3f01c9 = Number(_0x8aa41b.data.amount || 0);else _0x8aa41b?.["amount"] && (_0x3f01c9 = Number(_0x8aa41b.amount || 0));
          }
        }
      }
    }
    if (_0x3f01c9 === 0 && typeof _0x8aa41b === "object") {
      {
        const _0x575ae3 = _0x18fed9 => {
          for (const _0x2d094e in _0x18fed9) {
            if (typeof _0x18fed9[_0x2d094e] === "object" && _0x18fed9[_0x2d094e] !== null) {
              const _0x33ce5a = _0x575ae3(_0x18fed9[_0x2d094e]);
              if (_0x33ce5a > 0) return _0x33ce5a;
            } else {
              if (_0x2d094e === "amount" && !isNaN(Number(_0x18fed9[_0x2d094e])) && Number(_0x18fed9[_0x2d094e]) > 0) return Number(_0x18fed9[_0x2d094e]);
            }
          }
          return 0;
        };
        _0x3f01c9 = _0x575ae3(_0x8aa41b);
      }
    }
    debugLog("解析到的奖励金额：" + _0x3f01c9);
  } catch (_0x210999) {
    debugError("奖励解析失败：" + _0x210999.message);
    debugError("错误堆栈:", _0x210999.stack);
    _0x3f01c9 = 0;
  }
  return _0x3f01c9;
}
async function delay(_0x5ae1cc) {
  return new Promise(_0x48fe8d => setTimeout(_0x48fe8d, _0x5ae1cc));
}
async function retryRequest(_0x2e207a, _0x1636db = 3, _0xc4c41b = 1000) {
  let _0x1bfcfc = 0;
  while (_0x1bfcfc < _0x1636db) {
    try {
      return await _0x2e207a();
    } catch (_0x10601d) {
      {
        _0x1bfcfc++;
        if (_0x1bfcfc >= _0x1636db) throw _0x10601d;
        const _0xaec1db = _0xc4c41b * Math.pow(2, _0x1bfcfc);
        console.log("请求失败，" + _0xaec1db + "ms后重试（剩余" + (_0x1636db - _0x1bfcfc) + "次）");
        debugError("请求失败详情:", _0x10601d);
        await delay(_0xaec1db);
      }
    }
  }
}
async function run2599Task(_0x500db1, _0x2ee26e) {
  console.log("\n===== [" + _0x500db1.name + "] 开始执行2599任务接口（共" + _0x2ee26e + "次）=====");
  let _0x275646 = true;
  const _0x44b7c0 = {
    "task_id": "2599",
    "receive_type": "2",
    "usr": _0x500db1.usr,
    "zyeid": _0x500db1.zyeid,
    "zysid": _0x500db1.zysid,
    "p1": _0x500db1.p1,
    "p16": _0x500db1.task1440Config.p16,
    "p2": TASK_1440_CONFIG.fixedParams.p2,
    "p21": TASK_1440_CONFIG.fixedParams.p21,
    "p22": _0x500db1.task1440Config.p22,
    "p24": TASK_1440_CONFIG.fixedParams.p24,
    "p25": TASK_1440_CONFIG.fixedParams.p25,
    "p28": "c580ea58b3faf98b",
    "p29": TASK_1440_CONFIG.fixedParams.p29,
    "p3": TASK_1440_CONFIG.fixedParams.p3,
    "p31": _0x500db1.task1440Config.p31,
    "p33": TASK_1440_CONFIG.fixedParams.p33,
    "p34": TASK_1440_CONFIG.fixedParams.p34,
    "p35": _0x500db1.p35,
    "p4": TASK_1440_CONFIG.fixedParams.p4,
    "p5": TASK_1440_CONFIG.fixedParams.p5,
    "p7": _0x500db1.task1440Config.p7,
    "p9": _0x500db1.task1440Config.p9,
    "pc": TASK_1440_CONFIG.fixedParams.pc
  };
  debugLog("[" + _0x500db1.name + "] 2599任务基础参数:", _0x44b7c0);
  for (let _0x179dd3 = 1; _0x179dd3 <= _0x2ee26e; _0x179dd3++) {
    {
      console.log("\n📌 [" + _0x500db1.name + "] 执行第 " + _0x179dd3 + "/" + _0x2ee26e + " 次2599任务接口");
      try {
        const {
            sign: _0x145ece,
            timestamp: _0x54fe45,
            formStr: _0x57d6df
          } = generate2599TaskSignature(_0x44b7c0, TASK_SETTINGS.task2599SignPath, TASK_SETTINGS.task2599Sec),
          _0x5b31ab = {
            "Host": new URL(TASK_SETTINGS.task2599ApiUrl).hostname,
            "Connection": "keep-alive",
            "Content-Length": Buffer.byteLength(_0x57d6df, "utf-8").toString(),
            "X-SIG-Sign": _0x145ece,
            "X-SIG-Alg": "RSA-SHA256",
            "User-Agent": _0x500db1.task1440Config.userAgent || "Mozilla/5.0 (Linux; Android 12; BVL-AN16 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Safari/537.36 zyHybridVer/2.3.1 zyApp/sukan zyVersion/3.1.5 zyChannel/475678 zyAppid/zy8b0c8f",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json, text/plain, */*",
            "X-SIG-Sec": TASK_SETTINGS.task2599Sec,
            "X-SIG-Timestamp": _0x54fe45,
            "X-SIG-Ver": "v1.1",
            "X-AppId": "zy8b0c8f",
            "Origin": "https://welfare-user.palmestore.com",
            "X-Requested-With": "com.zhangyue.app.shortplay.yikanbj",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://welfare-user.palmestore.com/sukan-playlet/sukan/withdraw/index.html?hideNav=true",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
          };
        debugLog("[" + _0x500db1.name + "] 第" + _0x179dd3 + "次2599任务请求头:", _0x5b31ab);
        const _0x5ba690 = await axios.post(TASK_SETTINGS.task2599ApiUrl, _0x57d6df, {
          "headers": _0x5b31ab,
          "responseType": "arraybuffer",
          "timeout": 20000,
          "httpsAgent": new https.Agent({
            "rejectUnauthorized": false
          }),
          "validateStatus": _0x2f5932 => _0x2f5932 >= 200 && _0x2f5932 < 500
        });
        debugLog("[" + _0x500db1.name + "] 第" + _0x179dd3 + "次2599任务响应状态: " + _0x5ba690.status);
        debugLog("[" + _0x500db1.name + "] 第" + _0x179dd3 + "次2599任务响应头:", _0x5ba690.headers);
        const _0x348575 = _0x5ba690.headers["content-encoding"] === "gzip" ? await gunzip(_0x5ba690.data) : _0x5ba690.data,
          _0x39fef2 = JSON.parse(_0x348575.toString());
        console.log("[" + _0x500db1.name + "] 第 " + _0x179dd3 + " 次2599任务响应:", _0x39fef2);
        debugLog("[" + _0x500db1.name + "] 第" + _0x179dd3 + "次2599任务完整响应:", _0x39fef2);
        _0x39fef2.code !== 0 && (console.log("⚠️  [" + _0x500db1.name + "] 第 " + _0x179dd3 + " 次2599任务返回异常:", _0x39fef2.msg), _0x275646 = false);
      } catch (_0x1cadb6) {
        console.log("❌ [" + _0x500db1.name + "] 第 " + _0x179dd3 + " 次2599任务请求失败:", _0x1cadb6.message);
        debugError("[" + _0x500db1.name + "] 第" + _0x179dd3 + "次2599任务请求失败详情:", _0x1cadb6);
        if (_0x1cadb6.response) {
          {
            let _0x4a81d2 = _0x1cadb6.response.headers["content-encoding"] === "gzip" ? await gunzip(_0x1cadb6.response.data) : _0x1cadb6.response.data;
            _0x4a81d2 = JSON.parse(_0x4a81d2.toString());
            console.log("[" + _0x500db1.name + "] 第 " + _0x179dd3 + " 次2599任务错误详情:", _0x4a81d2);
            debugLog("[" + _0x500db1.name + "] 第" + _0x179dd3 + "次2599任务错误响应完整内容:", _0x4a81d2);
          }
        }
        _0x275646 = false;
      }
      _0x179dd3 < _0x2ee26e && (await randomWait());
    }
  }
  console.log("\n===== [" + _0x500db1.name + "] " + _0x2ee26e + "次2599任务执行完成 =====");
  return _0x275646;
}
async function runSingle1440Task(_0x1ca4b6, _0xa73d5f, _0x462753) {
  try {
    return await retryRequest(async () => {
      const _0x3c98d6 = generateDynamicAdId(),
        _0x1c4e0f = generateDynamicActId(),
        _0x105f14 = generateDynamicSubTaskId(),
        _0x1bf356 = TASK_1440_CONFIG,
        _0x67a92b = _0x1ca4b6.task1440Config,
        _0x28c89f = {
          ..._0x1bf356.fixedParams,
          "p1": _0x1ca4b6.p1,
          "p35": _0x1ca4b6.p35,
          "smboxid": _0x1ca4b6.p35,
          "ecpm": randomEcpm(),
          "usr": _0x1ca4b6.usr_1440,
          "watch_video_al_dp": Math.random() > 0.8 ? "true" : "false",
          "zyeid": _0x1ca4b6.zyeid,
          "zysid": _0x1ca4b6.zysid,
          "p16": _0x67a92b.p16,
          "p22": _0x67a92b.p22,
          "p31": _0x67a92b.p31,
          "p9": _0x67a92b.p9,
          "p7": _0x67a92b.p7,
          "sid": _0x3c98d6.toString(),
          "act_id": _0x1c4e0f.toString(),
          "sub_task_id": _0x105f14.toString(),
          "random": Math.random().toString(16).substring(2, 10),
          "ts": Date.now().toString().substring(0, 10)
        };
      debugLog("[轮次" + _0xa73d5f + "] [" + _0x1ca4b6.name + "] 使用usr_1440：" + _0x1ca4b6.usr_1440 + " | 动态参数：sid=" + _0x3c98d6 + " | act_id=" + _0x1c4e0f + " | ecpm=" + _0x28c89f.ecpm);
      debugLog("[轮次" + _0xa73d5f + "] [" + _0x1ca4b6.name + "] 1440任务完整参数:", _0x28c89f);
      const _0x39d9c7 = Object.keys(_0x28c89f).sort().reduce((_0x489a25, _0x6db4c1) => {
          _0x489a25[_0x6db4c1] = _0x28c89f[_0x6db4c1];
          return _0x489a25;
        }, {}),
        _0x386a63 = new URLSearchParams(_0x39d9c7).toString(),
        _0x308470 = getTimestamp(),
        _0x6ae5fb = generate1440Signature(_0x386a63, _0x308470, _0x1ca4b6),
        _0x489c31 = {
          "User-Agent": _0x67a92b.userAgent,
          "X-AppId": "zy8b0c8f",
          "X-SIG-Alg": _0x1bf356.signConfig.sigAlg,
          "X-SIG-Ver": "v1.1",
          "X-SIG-Sec": _0x67a92b.sigSec,
          "X-SIG-Timestamp": _0x308470,
          "X-SIG-Sign": _0x6ae5fb,
          "Content-Type": "application/x-www-form-urlencoded",
          "Host": new URL(_0x1bf356.apiUrl).hostname,
          "Connection": "Keep-Alive",
          "Accept-Encoding": "gzip",
          "Accept": "application/json, text/plain, */*",
          "Content-Length": Buffer.byteLength(_0x386a63, "utf8").toString()
        };
      debugLog("[轮次" + _0xa73d5f + "] [" + _0x1ca4b6.name + "] 1440任务请求头:", _0x489c31);
      const _0x1daa08 = await axios.post(_0x1bf356.apiUrl, _0x386a63, {
        "headers": _0x489c31,
        "timeout": 20000,
        "httpsAgent": new https.Agent({
          "rejectUnauthorized": false
        }),
        "validateStatus": _0x5f4e0e => _0x5f4e0e >= 200 && _0x5f4e0e < 500
      });
      debugLog("[轮次" + _0xa73d5f + "] [" + _0x1ca4b6.name + "] 1440任务响应状态: " + _0x1daa08.status);
      debugLog("[轮次" + _0xa73d5f + "] [" + _0x1ca4b6.name + "] 1440任务响应头:", _0x1daa08.headers);
      const _0x52f0f3 = parseReward(_0x1daa08.data),
        _0x35b57f = _0x462753 + _0x52f0f3;
      console.log("[轮次" + _0xa73d5f + "] [" + _0x1ca4b6.name + "] 单轮奖励：" + _0x52f0f3 + " | 累计奖励：" + _0x35b57f + " / " + TASK_SETTINGS.targetGold);
      return {
        "success": true,
        "reward": _0x52f0f3,
        "currentTotal": _0x35b57f
      };
    });
  } catch (_0x126d3c) {
    console.log("[轮次" + _0xa73d5f + "] [" + _0x1ca4b6.name + "] 任务执行失败：" + _0x126d3c.message + " | 累计奖励：" + _0x462753 + " / " + TASK_SETTINGS.targetGold);
    debugError("[轮次" + _0xa73d5f + "] [" + _0x1ca4b6.name + "] 1440任务执行失败详情:", _0x126d3c);
    return {
      "success": false,
      "reward": 0,
      "currentTotal": _0x462753
    };
  }
}
async function run1440TaskLoop(_0x3be156) {
  console.log("\n========== 开始执行 [" + _0x3be156.name + "] 刷币任务 ==========");
  console.log("目标金币：" + TASK_SETTINGS.targetGold + " | 基础任务间隔：" + TASK_SETTINGS.loopTaskDelay + "ms | 刷币专用usr：" + _0x3be156.usr_1440);
  let _0x39d6af = 0,
    _0x277169 = 0;
  while (_0x39d6af < TASK_SETTINGS.targetGold) {
    {
      _0x277169++;
      const _0x40c9ba = await runSingle1440Task(_0x3be156, _0x277169, _0x39d6af);
      _0x39d6af = _0x40c9ba.currentTotal;
      if (_0x39d6af < TASK_SETTINGS.targetGold) {
        const _0x38200e = randomDelay(TASK_SETTINGS.loopTaskDelay);
        console.log("等待" + _0x38200e + "ms后执行下一轮...");
        await delay(_0x38200e);
      }
    }
  }
  console.log("\n✅ [" + _0x3be156.name + "] 刷币任务完成！");
  console.log("实际累计奖励：" + _0x39d6af + " | 目标奖励：" + TASK_SETTINGS.targetGold);
  return _0x39d6af;
}
async function runWithdrawTask(_0xb217d1) {
  console.log("\n========== [" + _0xb217d1.name + "] 进入提现环节 ==========");
  console.log("提现通道：" + (_0xb217d1.withdrawChannel === "wx" ? "微信" : "支付宝") + " | 提现金额：" + TASK_SETTINGS.withdrawAmount + " | 提现使用原始usr：" + _0xb217d1.usr);
  console.log("提现策略：提现失败（任务不可领取）时执行" + TASK_SETTINGS.preWithdrawTaskTimes + "次2599任务后重试，最多循环" + TASK_SETTINGS.maxWithdrawLoopRetry + "次");
  let _0x268a3e = 0,
    _0x233885 = false;
  await run2599Task(_0xb217d1, TASK_SETTINGS.preWithdrawTaskTimes);
  console.log("\n⏳ [" + _0xb217d1.name + "] 等待" + TASK_SETTINGS.preWithdrawSleep + "秒后开始提现...");
  await delay(TASK_SETTINGS.preWithdrawSleep * 1000);
  while (!_0x233885 && _0x268a3e < TASK_SETTINGS.maxWithdrawLoopRetry) {
    _0x268a3e++;
    console.log("\n---------- [" + _0xb217d1.name + "] 提现尝试 [第" + _0x268a3e + "/" + TASK_SETTINGS.maxWithdrawLoopRetry + "次] ----------");
    const _0x5034e1 = _0xb217d1.withdrawConfig,
      _0xf93494 = _0xb217d1.withdrawChannel === "wx" ? "2" : "1",
      _0x41eb49 = {
        "type": "cash_wallet",
        "coin": "",
        "price": TASK_SETTINGS.withdrawAmount,
        "product_id": "0",
        "item_id": _0x5034e1.itemId,
        "method": _0xf93494,
        "extract_type": "2",
        "discount": "false",
        "sign": "",
        "reward_type": "",
        "usr": _0xb217d1.usr,
        "zyeid": _0xb217d1.zyeid,
        "zysid": _0xb217d1.zysid,
        "p1": _0xb217d1.p1,
        "p16": _0xb217d1.task1440Config.p16,
        "p2": TASK_1440_CONFIG.fixedParams.p2,
        "p21": TASK_1440_CONFIG.fixedParams.p21,
        "p22": _0xb217d1.task1440Config.p22,
        "p24": TASK_1440_CONFIG.fixedParams.p24,
        "p25": TASK_1440_CONFIG.fixedParams.p25,
        "p29": TASK_1440_CONFIG.fixedParams.p29,
        "p3": TASK_1440_CONFIG.fixedParams.p3,
        "p31": _0xb217d1.task1440Config.p31,
        "p33": TASK_1440_CONFIG.fixedParams.p33,
        "p34": TASK_1440_CONFIG.fixedParams.p34,
        "p35": _0xb217d1.p35,
        "p4": TASK_1440_CONFIG.fixedParams.p4,
        "p5": TASK_1440_CONFIG.fixedParams.p5,
        "p7": _0xb217d1.task1440Config.p7,
        "p9": _0xb217d1.task1440Config.p9,
        "pc": TASK_1440_CONFIG.fixedParams.pc
      };
    if (_0xb217d1.withdrawChannel === "wx" && _0x5034e1.wechatId) {
      _0x41eb49.wechat_id = _0x5034e1.wechatId;
    }
    debugLog("[" + _0xb217d1.name + "] 第" + _0x268a3e + "次提现参数:", _0x41eb49);
    try {
      const _0x4ad9bb = await retryRequest(async () => {
        {
          const {
              sign: _0x1a4d6e,
              timestamp: _0x334206,
              formStr: _0x1176e6
            } = generateWithdrawSignature(_0x41eb49, WITHDRAW_CONFIG.signConfig.path, _0x5034e1.X_SIG_Sec_Withdraw),
            _0x13517d = {
              ...WITHDRAW_CONFIG.fixedHeaders,
              "Host": new URL(WITHDRAW_CONFIG.apiUrl).hostname,
              "X-SIG-Alg": WITHDRAW_CONFIG.signConfig.sigAlg,
              "X-SIG-Sec": _0x5034e1.X_SIG_Sec_Withdraw,
              "X-SIG-Timestamp": _0x334206,
              "X-SIG-Sign": _0x1a4d6e,
              "Content-Length": Buffer.byteLength(_0x1176e6, "utf8").toString(),
              "User-Agent": _0xb217d1.task1440Config.userAgent
            };
          debugLog("[" + _0xb217d1.name + "] 第" + _0x268a3e + "次提现请求头:", _0x13517d);
          const _0x459c31 = await axios.post(WITHDRAW_CONFIG.apiUrl, _0x1176e6, {
            "headers": _0x13517d,
            "timeout": 20000,
            "httpsAgent": new https.Agent({
              "rejectUnauthorized": false
            }),
            "responseType": "arraybuffer",
            "validateStatus": _0x8412a5 => _0x8412a5 >= 200 && _0x8412a5 < 500
          });
          debugLog("[" + _0xb217d1.name + "] 第" + _0x268a3e + "次提现响应状态: " + _0x459c31.status);
          debugLog("[" + _0xb217d1.name + "] 第" + _0x268a3e + "次提现响应头:", _0x459c31.headers);
          const _0xb1e19d = _0x459c31.headers["content-encoding"] === "gzip" ? await gunzip(_0x459c31.data) : _0x459c31.data,
            _0x59d5ae = JSON.parse(_0xb1e19d.toString());
          debugLog("[" + _0xb217d1.name + "] 第" + _0x268a3e + "次提现完整响应:", _0x59d5ae);
          if (_0x59d5ae.code === 0) {
            console.log("✅ [" + _0xb217d1.name + "] 第" + _0x268a3e + "次提现尝试成功！");
            console.log("提现响应：", _0x59d5ae);
            return {
              "success": true,
              "data": _0x59d5ae
            };
          } else throw new Error("提现返回业务异常：错误码" + _0x59d5ae.code + "，信息" + (_0x59d5ae.msg || "无"));
        }
      }, TASK_SETTINGS.maxWithdrawRetry);
      if (_0x4ad9bb.success) return _0x233885 = true, {
        "success": true,
        "data": _0x4ad9bb.data,
        "retryCount": _0x268a3e
      };
    } catch (_0x1d81f1) {
      console.log("❌ [" + _0xb217d1.name + "] 第" + _0x268a3e + "次提现尝试失败：" + _0x1d81f1.message);
      debugError("[" + _0xb217d1.name + "] 第" + _0x268a3e + "次提现失败详情:", _0x1d81f1);
      if (_0x1d81f1.message.includes("任务不可领取") && _0x268a3e < TASK_SETTINGS.maxWithdrawLoopRetry) console.log("\n🔄 [" + _0xb217d1.name + "] 检测到\"任务不可领取\"，执行" + TASK_SETTINGS.preWithdrawTaskTimes + "次2599任务后重试..."), await run2599Task(_0xb217d1, TASK_SETTINGS.preWithdrawTaskTimes), console.log("\n⏳ [" + _0xb217d1.name + "] 等待" + TASK_SETTINGS.preWithdrawSleep + "秒后继续提现..."), await delay(TASK_SETTINGS.preWithdrawSleep * 1000);else {
        if (_0x268a3e < TASK_SETTINGS.maxWithdrawLoopRetry) {
          const _0x4b95a0 = Math.floor(Math.random() * 2000) + 1000;
          console.log("🔄 [" + _0xb217d1.name + "] 等待" + _0x4b95a0 + "ms后，进行下一次提现尝试...");
          await delay(_0x4b95a0);
        }
      }
    }
  }
  if (!_0x233885) return console.log("\n❌ [" + _0xb217d1.name + "] 提现失败！已达到最大尝试次数（" + TASK_SETTINGS.maxWithdrawLoopRetry + "次），终止提现"), {
    "success": false,
    "error": "达到最大提现循环次数" + TASK_SETTINGS.maxWithdrawLoopRetry + "次",
    "retryCount": _0x268a3e
  };
  return {
    "success": _0x233885
  };
}
async function runAccountJob(_0x1524e5) {
  try {
    debugLog("开始执行账号[" + _0x1524e5.name + "]的完整流程");
    await run1440TaskLoop(_0x1524e5);
    const _0x409a45 = await runWithdrawTask(_0x1524e5);
    debugLog("账号[" + _0x1524e5.name + "]执行结果:", _0x409a45);
    return {
      "accountName": _0x1524e5.name,
      "withdrawSuccess": _0x409a45.success,
      "withdrawResult": _0x409a45
    };
  } catch (_0x257084) {
    console.log("❌ [" + _0x1524e5.name + "] 任务流程执行失败：" + _0x257084.message);
    debugError("账号[" + _0x1524e5.name + "]流程执行失败详情:", _0x257084);
    return {
      "accountName": _0x1524e5.name,
      "withdrawSuccess": false,
      "error": _0x257084.message
    };
  }
}
async function main() {
  console.log("===== 任务脚本启动 " + new Date().toLocaleString() + " =====");
  console.log("配置：目标金币=" + TASK_SETTINGS.targetGold + " | 并发=" + TASK_SETTINGS.concurrent + " | 提现金额=" + TASK_SETTINGS.withdrawAmount);
  console.log("调试模式：" + (TASK_SETTINGS.debugMode ? "✅ 开启" : "❌ 关闭"));
  console.log("提现策略：刷币完成后，提现失败（任务不可领取）时执行" + TASK_SETTINGS.preWithdrawTaskTimes + "次2599任务后重试，最多循环" + TASK_SETTINGS.maxWithdrawLoopRetry + "次");
  console.log("加载账号数量：" + ACCOUNTS.length + "个");
  debugLog("全局配置详情:", {
    "TASK_SETTINGS": TASK_SETTINGS,
    "DEFAULT_CONFIG": DEFAULT_CONFIG
  });
  let _0x490958 = [];
  if (TASK_SETTINGS.concurrent) _0x490958 = await Promise.all(ACCOUNTS.map(_0x2a6b3f => runAccountJob(_0x2a6b3f)));else for (const _0x39db95 of ACCOUNTS) {
    const _0x1f718d = await runAccountJob(_0x39db95);
    _0x490958.push(_0x1f718d);
  }
  console.log("\n==================== 全局执行汇总 ====================");
  let _0x52c289 = 0;
  _0x490958.forEach(_0x105f66 => {
    console.log("\n【" + _0x105f66.accountName + "】");
    console.log("提现状态：" + (_0x105f66.withdrawSuccess ? "✅ 成功" : "❌ 失败"));
    _0x105f66.withdrawSuccess && console.log("成功尝试次数：" + (_0x105f66.withdrawResult?.["retryCount"] || 1) + "次");
    if (!_0x105f66.withdrawSuccess) {
      console.log("失败原因：" + (_0x105f66.error || _0x105f66.withdrawResult?.["error"]));
    }
    if (_0x105f66.withdrawSuccess) _0x52c289++;
  });
  console.log("\n📊 执行统计：");
  console.log("总账号数：" + ACCOUNTS.length + " | 提现成功数：" + _0x52c289 + " | 失败数：" + (ACCOUNTS.length - _0x52c289));
  console.log("=====================================================");
  debugLog("全局执行结果详情:", _0x490958);
}
main().catch(_0xb7bd54 => {
  console.error("❌ 脚本执行异常：" + _0xb7bd54.message);
  debugError("脚本启动失败详情:", _0xb7bd54);
  process.exit(1);
});