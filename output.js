//Mon Jan 19 2026 15:32:35 GMT+0000 (Coordinated Universal Time)
//Base:<url id="cv1cref6o68qmpt26ol0" type="url" status="parsed" title="GitHub - echo094/decode-js: JS混淆代码的AST分析工具 AST analysis tool for obfuscated JS code" wc="2165">https://github.com/echo094/decode-js</url>
//Modify:<url id="cv1cref6o68qmpt26olg" type="url" status="parsed" title="GitHub - smallfawn/decode_action: 世界上本来不存在加密，加密的人多了，也便成就了解密" wc="741">https://github.com/smallfawn/decode_action</url>
;
const CryptoJS = require('\x63\x72\x79\x70\x74\x6F\x2D\x6A\x73');
const axios = require('\x61\x78\x69\x6F\x73');
const fs = require('\x66\x73');
const path = require('\x70\x61\x74\x68');
const STORAGE_FILE = path.join(__dirname, '\x78\x68\x71\x78\x2E\x74\x78\x74');
const config = {
  XHQX: process.env.XHQX,
  DEVICE_TYPE: process.env.XHQX_DEVICE_TYPE || '\x61\x6E\x64\x72\x6F\x69\x64',
  API_SERVER: process.env.XHQX_API_SERVER || '\x68\x74\x74\x70\x73\x3A\x2F\x2F\x71\x75\x77\x61\x6E\x2E\x78\x69\x61\x6E\x67\x68\x75\x61\x6E\x6B\x6A\x2E\x63\x6F\x6D',
  APP_KEY: process.env.XHQX_APP_KEY || '\x4D\x4D\x48\x43\x2D\x41\x73\x32\x34\x74\x72',
  REWARD_FROM: parseInt(process.env.XHQX_REWARD_FROM) || 3,
  SUB_FROM: process.env.XHQX_SUB_FROM || '\x34',
  AD_FROM: parseInt(process.env.XHQX_AD_FROM) || 2,
  MIN_DELAY: parseInt(process.env.XHQX_MIN_DELAY) || 15,
  MAX_DELAY: parseInt(process.env.XHQX_MAX_DELAY) || 30,
  AUTHOR_ID: parseInt(process.env.XHQX_AUTHOR_ID) || 6813
};
function parseXhqxConfig() {
  if (!config.XHQX) throw new Error('\u8bf7\u914d\u7f6e\x58\x48\x51\x58\u73af\u5883\u53d8\u91cf');
  const ac = config.XHQX.split('\x40');
  if (ac.length < 3) throw new Error('\x58\x48\x51\x58\u683c\u5f0f\u9519\u8bef\uff0c\u6b63\u786e\u683c\u5f0f\x3A\x20\u624b\u673a\u53f7\x40\u5bc6\u7801\x40\u8fd0\u884c\u6b21\u6570');
  const vd = ac[0].trim();
  const mP = ac[1].trim();
  const rr = parseInt(ac[2].trim()) || 1;
  if (!vd || !mP) throw new Error('\u624b\u673a\u53f7\u6216\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a');
  if (vd.length !== 11) throw new Error('\u624b\u673a\u53f7\u683c\u5f0f\u4e0d\u6b63\u786e');
  if (rr < 1) throw new Error('\u8fd0\u884c\u6b21\u6570\u5fc5\u987b\u5927\u4e8e\x30');
  return {
    phone: vd,
    password: mP,
    loopCount: rr
  };
}
class StorageManager {
  constructor() {
    this.data = this.loadData();
  }
  loadData() {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        return JSON.parse(fs.readFileSync(STORAGE_FILE, '\x75\x74\x66\x38'));
      }
    } catch (CK) {}
    return {};
  }
  saveData() {
    try {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.data, null, 2));
      return true;
    } catch (CK) {
      return false;
    }
  }
  get(qE) {
    return this.data[qE];
  }
  set(qE, EI) {
    this.data[qE] = EI;
    this.saveData();
  }
  saveDeviceInfo(GK, Pk, dC) {
    this.set('\x75\x75\x69\x64', GK);
    this.set('\x64\x65\x76\x69\x63\x65\x49\x64', Pk);
    this.set('\x75\x73\x65\x72\x41\x67\x65\x6E\x74', dC);
    this.set('\x64\x65\x76\x69\x63\x65\x4C\x61\x73\x74\x55\x70\x64\x61\x74\x65', Date.now());
  }
  saveSecretInfo(vK, Pd, G = 3600) {
    this.set('\x74\x6F\x6B\x65\x6E', vK);
    this.set('\x73\x65\x63\x72\x65\x74', Pd);
    this.set('\x73\x65\x63\x72\x65\x74\x45\x78\x70\x69\x72\x65', Date.now() + G * 1000);
  }
  clearLoginInfo() {
    delete this.data.token;
    delete this.data.secret;
    delete this.data.secretExpire;
    this.saveData();
  }
  isSecretValid() {
    const PL = this.get('\x73\x65\x63\x72\x65\x74\x45\x78\x70\x69\x72\x65');
    return PL && PL > Date.now();
  }
  isDeviceExpired() {
    const E = this.get('\x64\x65\x76\x69\x63\x65\x4C\x61\x73\x74\x55\x70\x64\x61\x74\x65');
    if (!E) return true;
    const P = 12 + Math.random();
    return Date.now() > E + P * 24 * 60 * 60 * 1000;
  }
  getDeviceInfo() {
    return {
      uuid: this.get('\x75\x75\x69\x64'),
      deviceId: this.get('\x64\x65\x76\x69\x63\x65\x49\x64'),
      userAgent: this.get('\x75\x73\x65\x72\x41\x67\x65\x6E\x74')
    };
  }
}
class Utils {
  static generateUUID() {
    return '\x78\x78\x78\x78\x78\x78\x78\x78\x2D\x78\x78\x78\x78\x2D\x78\x78\x78\x78\x2D\x78\x78\x78\x78\x2D\x78\x78\x78\x78\x78\x78\x78\x78\x78\x78\x78\x78'.replace(/x/g, q => {
      const Lc = Math.random() * 16 | 0;
      return (q === '\x78' ? Lc : Lc & 0x3 | 0x8).toString(16);
    });
  }
  static generateDeviceId() {
    const qC = '\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x41\x42\x43\x44\x45\x46';
    return Array(32).fill(0).map(() => qC.charAt(Math.floor(Math.random() * qC.length))).join('');
  }
  static generateUserAgent(LL) {
    if (LL === '\x61\x6E\x64\x72\x6F\x69\x64') {
      const mr = ['\x31\x31', '\x31\x32', '\x31\x33', '\x31\x34'];
      const rq = ['\x53\x4D\x2D\x47\x39\x39\x38\x42', '\x53\x4D\x2D\x53\x39\x30\x38\x30', '\x53\x4D\x2D\x4E\x39\x38\x36\x42', '\x52\x65\x64\x6D\x69\x20\x4E\x6F\x74\x65\x20\x31\x32'];
      const qL = mr[Math.floor(Math.random() * mr.length)];
      const qG = rq[Math.floor(Math.random() * rq.length)];
      return `\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x4C\x69\x6E\x75\x78\x3B\x20\x41\x6E\x64\x72\x6F\x69\x64\x20${qL}\x3B\x20${qG}\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x35\x33\x37\x2E\x33\x36\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x43\x68\x72\x6F\x6D\x65\x2F\x31\x31\x36\x2E\x30\x2E\x30\x2E\x30\x20\x4D\x6F\x62\x69\x6C\x65\x20\x53\x61\x66\x61\x72\x69\x2F\x35\x33\x37\x2E\x33\x36`;
    } else {
      const cd = ['\x31\x36\x2E\x34', '\x31\x36\x2E\x35', '\x31\x37\x2E\x30', '\x31\x37\x2E\x31'];
      const cC = cd[Math.floor(Math.random() * cd.length)];
      return `\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20${cC.replace('\x2E', '\x5F')}\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38`;
    }
  }
  static generateNonce(XP = 8) {
    const qC = '\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7A\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39';
    return Array(XP).fill(0).map(() => qC.charAt(Math.floor(Math.random() * qC.length))).join('');
  }
  static generateSignature(GC, kX, ad, m, Pd) {
    const kG = Object.keys(GC).sort();
    const rm = kG.map(qE => {
      const EI = GC[qE];
      let qI = typeof EI === '\x6F\x62\x6A\x65\x63\x74' ? JSON.stringify(EI) : String(EI || '');
      return `${qE}\x3D${encodeURIComponent(qI)}`;
    });
    const kr = `${kX}\x7C${ad}\x7C${m}\x7C${rm.join('\x26')}`;
    return CryptoJS.HmacSHA256(kr, Pd).toString(CryptoJS.enc.Hex);
  }
  static sleep(vm) {
    return new Promise(km => setTimeout(km, vm));
  }
  static randomDelay() {
    return Math.floor(config.MIN_DELAY + Math.random() * (config.MAX_DELAY - config.MIN_DELAY));
  }
}
class XHQXAPI {
  constructor(Xd, Xc) {
    this.storage = Xd;
    this.userConfig = Xc;
    this.token = Xd.get('\x74\x6F\x6B\x65\x6E') || '';
    this.secret = Xd.get('\x73\x65\x63\x72\x65\x74') || '';
  }
  generateHeaders(cc = {}) {
    const qq = this.storage.getDeviceInfo();
    const La = {
      '\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65': '\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E',
      '\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74': qq.userAgent || '',
      '\x78\x2D\x61\x70\x70\x2D\x63\x6C\x69\x65\x6E\x74': `\x61\x70\x70\x2F${config.DEVICE_TYPE}\x2F\x31\x2E\x31\x2E\x30\x2F${config.APP_KEY}\x2F${qq.uuid}\x2F${qq.deviceId}`
    };
    return {
      ...La,
      ...cc
    };
  }
  async request(rv, aK = {}, LX = {}, qm = '\x50\x4F\x53\x54') {
    try {
      const Ia = await axios({
        method: qm,
        url: `${config.API_SERVER}${rv}`,
        data: aK,
        headers: this.generateHeaders(LX),
        timeout: 10000
      });
      return Ia.data;
    } catch (vv) {
      const cq = vv.response ? `\x48\x54\x54\x50\x20${vv.response.status}\x3A\x20${JSON.stringify(vv.response.data)}` : vv.message;
      throw new Error(`\x41\x50\x49\u8bf7\u6c42\u5931\u8d25\x3A\x20${cq}`);
    }
  }
  async checkInvitation() {
    console.log('\ud83d\udd0d\x20\u68c0\u67e5\u9080\u8bf7\u4fe1\u606f\x2E\x2E\x2E');
    try {
      const Ia = await axios.post(`${config.API_SERVER}\x2F\x61\x70\x69\x2F\x75\x73\x65\x72\x2F\x6D\x79\x49\x6E\x76\x69\x74\x65\x50\x61\x72\x65\x6E\x74`, {}, {
        headers: this.generateHeaders({
          '\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E': `\x42\x65\x61\x72\x65\x72\x20${this.token}`,
          '\x41\x63\x63\x65\x70\x74\x2D\x45\x6E\x63\x6F\x64\x69\x6E\x67': '\x67\x7A\x69\x70',
          '\x43\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E': '\x4B\x65\x65\x70\x2D\x41\x6C\x69\x76\x65'
        }),
        timeout: 10000
      });
      if (Ia.data && Ia.data.code === 0 && Ia.data.data) {
        const dL = Ia.data.data.id;
        if (dL !== config.AUTHOR_ID) {
          throw new Error(`\u274c\x20\u60a8\u4e0d\u662f\u4f5c\u8005\u9080\u8bf7\u7684\u73a9\u5bb6\x0A\x20\x20\x20\u60a8\u7684\u4e0a\u7ea7\x49\x44\x3A\x20${dL}`);
        }
        console.log('\u2705\x20\u9a8c\u8bc1\u901a\u8fc7');
        return true;
      } else {
        throw new Error('\u65e0\u6cd5\u83b7\u53d6\u9080\u8bf7\u4fe1\u606f');
      }
    } catch (vv) {
      if (vv.message.includes('\u60a8\u7684\u4e0a\u7ea7\x49\x44\x3A')) {
        throw vv;
      }
      throw new Error(`\u68c0\u67e5\u9080\u8bf7\u4fe1\u606f\u5931\u8d25\x3A\x20${vv.message}`);
    }
  }
  async login(vd, mP) {
    const vG = await this.request('\x2F\x61\x70\x69\x2F\x6C\x6F\x67\x69\x6E\x2F\x61\x63\x63\x6F\x75\x6E\x74\x4C\x6F\x67\x69\x6E', {
      mobile: vd,
      password: mP,
      osName: config.DEVICE_TYPE
    }, {
      '\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E': '\x42\x65\x61\x72\x65\x72'
    });
    if (vG.code === 0 && vG.data) {
      this.token = vG.data;
      this.storage.set('\x74\x6F\x6B\x65\x6E', this.token);
      return true;
    }
    throw new Error(vG.msg || '\u767b\u5f55\u5931\u8d25');
  }
  async getSecret() {
    const vG = await this.request('\x2F\x61\x70\x69\x2F\x61\x70\x70\x73\x65\x63\x72\x65\x74\x2F\x67\x65\x74\x41\x70\x70\x53\x65\x63\x72\x65\x74', {}, {
      '\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E': `\x42\x65\x61\x72\x65\x72\x20${this.token}`,
      '\x78\x2D\x61\x70\x70\x2D\x6B\x65\x79': config.APP_KEY
    });
    if (vG.code === 0 && vG.data?.secret) {
      this.secret = vG.data.secret;
      const G = vG.data.expire_in || 3600;
      this.storage.saveSecretInfo(this.token, this.secret, G);
      return true;
    }
    throw new Error(vG.msg || '\u83b7\u53d6\u5bc6\u94a5\u5931\u8d25');
  }
  async refreshSecret() {
    try {
      const vG = await this.request('\x2F\x61\x70\x69\x2F\x61\x70\x70\x73\x65\x63\x72\x65\x74\x2F\x72\x65\x66\x72\x65\x73\x68\x53\x65\x63\x72\x65\x74', {
        old_secret: this.secret
      }, {
        '\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E': `\x42\x65\x61\x72\x65\x72\x20${this.token}`,
        '\x78\x2D\x61\x70\x70\x2D\x6B\x65\x79': config.APP_KEY
      });
      if (vG.code === 0 && vG.data?.secret) {
        this.secret = vG.data.secret;
        const G = vG.data.expire_in || 3600;
        this.storage.saveSecretInfo(this.token, this.secret, G);
        return true;
      }
      if (vG.msg && vG.msg.includes('\u65e7\u5bc6\u94a5\u9a8c\u8bc1\u5931\u8d25')) {
        throw new Error('\u65e7\u5bc6\u94a5\u9a8c\u8bc1\u5931\u8d25');
      }
      throw new Error(vG.msg || '\u5237\u65b0\u5bc6\u94a5\u5931\u8d25');
    } catch (vv) {
      if (vv.message.includes('\u65e7\u5bc6\u94a5\u9a8c\u8bc1\u5931\u8d25')) {
        throw vv;
      }
      throw new Error(`\u5237\u65b0\u5bc6\u94a5\u5931\u8d25\x3A\x20${vv.message}`);
    }
  }
  async submitTask() {
    const GC = {
      rewardFrom: config.REWARD_FROM,
      subFrom: config.SUB_FROM,
      adFrom: config.AD_FROM
    };
    const ad = Date.now().toString();
    const m = Utils.generateNonce();
    const ra = Utils.generateSignature(GC, config.APP_KEY, ad, m, this.secret);
    const vG = await this.request('\x2F\x61\x70\x69\x2F\x72\x65\x77\x61\x72\x64\x2F\x72\x65\x77\x61\x72\x64\x52\x65\x63\x6F\x72\x64', GC, {
      '\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E': `\x42\x65\x61\x72\x65\x72\x20${this.token}`,
      '\x78\x2D\x61\x70\x70\x2D\x6B\x65\x79': config.APP_KEY,
      '\x78\x2D\x6E\x6F\x6E\x63\x65': m,
      '\x78\x2D\x73\x69\x67\x6E\x61\x74\x75\x72\x65': ra,
      '\x78\x2D\x74\x69\x6D\x65\x73\x74\x61\x6D\x70': ad
    });
    if (vG.code === 0) {
      return vG.data || 0;
    }
    if (vG.code === 401 && vG.msg && vG.msg.includes('\u5bc6\u94a5\u4e0d\u5b58\u5728\u6216\u5df2\u8fc7\u671f')) {
      try {
        await this.refreshSecret();
        return await this.submitTask();
      } catch (cv) {
        if (cv.message.includes('\u65e7\u5bc6\u94a5\u9a8c\u8bc1\u5931\u8d25')) {
          throw cv;
        }
        throw new Error(`\u5237\u65b0\u5bc6\u94a5\u5931\u8d25\x3A\x20${cv.message}`);
      }
    }
    throw new Error(vG.msg || '\u4efb\u52a1\u63d0\u4ea4\u5931\u8d25');
  }
}
class XHQXApp {
  constructor() {
    this.storage = new StorageManager();
    this.userConfig = parseXhqxConfig();
    this.api = null;
    this.totalReward = 0;
  }
  initDeviceInfo() {
    if (this.storage.isDeviceExpired()) {
      const qq = {
        uuid: Utils.generateUUID(),
        deviceId: Utils.generateDeviceId(),
        userAgent: Utils.generateUserAgent(config.DEVICE_TYPE)
      };
      this.storage.saveDeviceInfo(qq.uuid, qq.deviceId, qq.userAgent);
      this.storage.clearLoginInfo();
      return qq;
    }
    return this.storage.getDeviceInfo();
  }
  async initAPI() {
    this.api = new XHQXAPI(this.storage, this.userConfig);
    return this.storage.get('\x74\x6F\x6B\x65\x6E') && this.storage.isSecretValid();
  }
  async login() {
    this.storage.clearLoginInfo();
    try {
      const LI = await this.api.login(this.userConfig.phone, this.userConfig.password);
      if (LI) {
        await this.api.getSecret();
        return true;
      }
      return false;
    } catch (vv) {
      throw new Error(`\u767b\u5f55\u5931\u8d25\x3A\x20${vv.message}`);
    }
  }
  async checkInvitation() {
    return await this.api.checkInvitation();
  }
  async submitSingleTask() {
    try {
      const mC = await this.api.submitTask();
      this.totalReward += mC;
      console.log(`\u2705\x20\u83b7\u5f97\u5956\u52b1\x3A\x20${mC}\u91d1\u5e01`);
      return {
        success: true,
        reward: mC
      };
    } catch (vv) {
      if (vv.message.includes('\u65e7\u5bc6\u94a5\u9a8c\u8bc1\u5931\u8d25')) {
        console.log('\ud83d\udd04\x20\u91cd\u65b0\u767b\u5f55\u4e2d\x2E\x2E\x2E');
        const KE = await this.login();
        if (KE) {
          return await this.submitSingleTask();
        }
      }
      console.error(`\u274c\x20\u4efb\u52a1\u5931\u8d25\x3A\x20${vv.message}`);
      return {
        success: false,
        error: vv.message
      };
    }
  }
  async runLoopTasks() {
    this.totalReward = 0;
    let Pq = 0;
    console.log(`\u5f00\u59cb\u5faa\u73af\u4efb\u52a1\x20\x28${this.userConfig.loopCount}\u6b21\x29`);
    for (let CG = 1; CG <= this.userConfig.loopCount; CG++) {
      console.log(`\u7b2c\x20${CG}\x2F${this.userConfig.loopCount}\x20\u6b21\u4efb\u52a1`);
      const vG = await this.submitSingleTask();
      if (vG.success) Pq++;
      if (CG < this.userConfig.loopCount) {
        const PE = Utils.randomDelay();
        await Utils.sleep(PE * 1000);
      }
    }
    console.log(`\u4efb\u52a1\u5b8c\u6210\x21\x20\u6210\u529f\x3A\x20${Pq}\x2F${this.userConfig.loopCount}`);
    console.log(`\u603b\u5956\u52b1\x3A\x20${this.totalReward}\u91d1\u5e01`);
    return Pq;
  }
  async run() {
    try {
      console.log('\u4eab\u6362\u8f7b\u9009\u52a9\u624b\u542f\u52a8');
      this.initDeviceInfo();
      const aI = await this.initAPI();
      if (!aI) {
        console.log('\u767b\u5f55\u4e2d\x2E\x2E\x2E');
        if (!(await this.login())) {
          console.error('\u767b\u5f55\u5931\u8d25\uff0c\u7a0b\u5e8f\u9000\u51fa');
          return;
        }
      }
      try {
        await this.checkInvitation();
      } catch (vv) {
        console.error(vv.message);
        console.log('\u274c\x20\u811a\u672c\u505c\u6b62\u8fd0\u884c');
        return;
      }
      if (this.userConfig.loopCount > 1) {
        await this.runLoopTasks();
      } else {
        await this.submitSingleTask();
      }
      console.log('\u6240\u6709\u4efb\u52a1\u6267\u884c\u5b8c\u6bd5\x21');
    } catch (vv) {
      console.error(`\u7a0b\u5e8f\u5f02\u5e38\x3A\x20${vv.message}`);
    }
  }
}
async function main() {
  const vI = new XHQXApp();
  await vI.run();
}
if (require.main === module) {
  main().catch(vv => {
    console.error('\u542f\u52a8\u5931\u8d25\x3A', vv);
    process.exit(1);
  });
}
module.exports = XHQXApp;