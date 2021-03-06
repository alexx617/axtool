export default {
    //UA库

    // 选择符合条件的一个,ua函数使用的
    filterItem(ua, ...args) {
        return args.filter(x => ua['is' + x])[0] || 'unknown';
    },

    //获取用户环境 浏览器数据,手机系统
    /*
    手机浏览器: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1",
    
    MacBook: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
     */
    // 使用:var getUA = require('ifun/ua');
    // var ua = getUA();
    // 或
    // var ua = getUA(req.headers['user-agent']);
    getUA(userAgent) {
        var ua = {};
        var _ua = ua.source = userAgent || navigator.userAgent;

        ua.isIphone = /iphone/i.test(_ua);
        ua.isIpad = /ipad/i.test(_ua);
        ua.isAndroid = /android/i.test(_ua);

        ua.isChrome = /chrome/i.test(_ua);
        ua.isSafari = /safari/i.test(_ua) && !ua.isChrome;
        ua.isFirefox = /firefox/i.test(_ua);
        ua.isIe = /msie/i.test(_ua);
        ua.isOpera = /opera/i.test(_ua);
        ua.isWechat = /MicroMessenger|MQQBrowser/i.test(_ua);

        ua.isCordova = typeof (window) == "object" && window.cordova ? true : false;

        ua.isBrowser = ua.isSafari || ua.isChrome || ua.isFirefox || ua.isIe || ua.isOpera;
        ua.isIos = ua.isIphone || ua.isIpad;
        ua.isMobile = ua.isIos || ua.isAndroid;

        ua.isNative = ua.isMobile && !ua.isBrowser && !ua.isWechat; //有问题

        ua.isWindow = /window/i.test(_ua);
        ua.isMac = /Macintosh/i.test(_ua);
        ua.isLinux = /Linux/i.test(_ua);

        ua.isPc = !ua.isMobile;
        ua.isPad = /pad/i.test(_ua);
        ua.isPhone = ua.isIphone || ua.isAndroid && !ua.isPad;

        ua.deviceType = this.filterItem(ua, 'Pc', 'Pad', 'Phone'); //设备
        ua.device = 'unknown'; //暂时不好判断
        ua.os = this.filterItem(ua, 'Ios', 'Android', 'Window', 'Mac', 'Linux'); //系统
        ua.browser = this.filterItem(ua, 'Wechat', 'Chrome', 'Safari', 'Firefox', 'Ie', 'Opera'); //浏览器

        return ua;
    },

    //返回当前浏览器是什么类型的浏览器
    userBrowser() {
        var browserName = navigator.userAgent.toLowerCase();
        if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
            return "IE"
        } else if (/firefox/i.test(browserName)) {
            return "Firefox"
        } else if (/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)) {
            return "Chrome"
        } else if (/opera/i.test(browserName)) {
            return "Opera"
        } else if (/webkit/i.test(browserName) && !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))) {
            return "Safari"
        } else {
            return "unknown"
        }
    },

    //手机类型判断
    browserInfo(type) {
        switch (type) {
            case 'android':
                return navigator.userAgent.toLowerCase().indexOf('android') !== -1
            case 'iphone':
                return navigator.userAgent.toLowerCase().indexOf('iphone') !== -1
            case 'ipad':
                return navigator.userAgent.toLowerCase().indexOf('ipad') !== -1
            case 'weixin':
                return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
            default:
                return navigator.userAgent.toLowerCase()
        }
    },

    //是否为PC端
    isPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"
        ];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },

    getPlatform(userAgent) {
        let platform = '';
        let ua = userAgent;
        if (/MicroMessenger/i.test(ua)) {
            platform = '微信浏览器'; // 这是微信平台下浏览器
        } else if (/android|adr/i.test(ua)) {
            // 根据不同产品线，分为GT-，SM-，SCH-开头的UA来判断是三星
            if (/GT-|SM-|SCH-/ig.test(ua)) {
                platform = '三星系列';
            } else if (/HM|RedMi|Mi/ig.test(ua)) { // 可能会有遗漏
                platform = '小米手机';
            } else if (/huawei|honor/ig.test(ua)) { // huawei的是华为，honor的是华为荣耀
                platform = '华为手机';
            } else if ('/vivo/ig'.test(ua)) {
                platform = 'vivo手机';
            } else if ('Letv'.test(ua)) {
                platform = '乐视';
            } else {
                platform = 'android';
            }
        } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
            platform = 'ios'; // 这是iOS平台下浏览器
        } else if (ua.match(/AppleWebKit.*Mobile.*/)) {
            platform = '移动终端'; // 移动终端
        } else if (ua.indexOf('AppleWebKit')) {
            platform = '苹果，谷歌内核';
        } else if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            platform = 'ios终端';
        } else {
            platform = 'other';
        }
        return platform;
    },

    //判断各个平台浏览器及操作系统平台
    checkPlatform() {
        if (/android/i.test(navigator.userAgent)) {
            return 'Android'//这是Android平台下浏览器
        }
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            return 'iOS'//这是iOS平台下浏览器
        }
        if (/Linux/i.test(navigator.userAgent)) {
            return 'Linux'//这是Linux平台下浏览器
        }
        if (/Linux/i.test(navigator.platform)) {
            return 'Linux system'//这是Linux操作系统平台
        }
        if (/MicroMessenger/i.test(navigator.userAgent)) {
            return 'Weixin'//这是微信平台下浏览器
        }
    },

    isIphoneX() {
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
    },

    /**
     *  判断版本号
     *  compareVersions('1.2.0', '==', '1.2'); // true
        compareVersions('00001', '==', '1.0.0'); // true
        compareVersions('1.2.0', '<=', '1.2'); // true
        compareVersions('2.2.0', '<=', '1.2'); // false
     */
    compareVersions(v1, comparator, v2) {
        var comparator = comparator == '=' ? '==' : comparator;
        if (['==', '===', '<', '<=', '>', '>=', '!=', '!=='].indexOf(comparator) == -1) {
            throw new Error('Invalid comparator. ' + comparator);
        }
        var v1parts = v1.split('.'), v2parts = v2.split('.');
        var maxLen = Math.max(v1parts.length, v2parts.length);
        var part1, part2;
        var cmp = 0;
        for (var i = 0; i < maxLen && !cmp; i++) {
            part1 = parseInt(v1parts[i], 10) || 0;
            part2 = parseInt(v2parts[i], 10) || 0;
            if (part1 < part2)
                cmp = 1;
            if (part1 > part2)
                cmp = -1;
        }
        return eval('0' + comparator + cmp);
    },

    /**
     *  判断版本号,然后比较两个版本号相差多少个版本
     *  compareVersions('1.2.0', '==', '1.2'); // true
        compareVersions('00001', '==', '1.0.0'); // true
        compareVersions('1.2.0', '<=', '1.2'); // true
        compareVersions('2.2.0', '<=', '1.2'); // false
    */
    compareVersionsPart(v1, comparator, v2) {
        if (!v1) { return true; }
        var comparator = comparator == '=' ? '==' : comparator;
        if (!['==', '===', '<', '<=', '>', '>=', '!=', '!=='].includes(comparator)) {
            throw new Error('Invalid comparator. ' + comparator);
        }
        var v1parts = v1.split('.'), v2parts = v2.split('.');
        var maxLen = Math.max(v1parts.length, v2parts.length);
        var part1, part2;
        var cmp = 0;
        for (var i = 0; i < maxLen && !cmp; i++) {
            part1 = parseInt(v1parts[i], 10) || 0;
            part2 = parseInt(v2parts[i], 10) || 0;
            if (part1 < part2)
                cmp = 1;
            if (part1 > part2)
                cmp = -1;
        }
        let part = 0;
        if (cmp) {
            part = part1 - part2;
        }
        return part;
    },

    /* example
    * 比较版本号
    * cmpVersion('1.1.8', '1.0.4'); // -> 1
    * cmpVersion('1.0.2', '1.0.2'); // -> 0
    * cmpVersion('2.0', '2.0.0'); // -> 0
    * cmpVersion('3.0.1', '3.0.0.2'); // -> 1
    * cmpVersion('1.1.1', '1.2.3'); // -> -1
    */
    cmpVersion(v1, v2) {
        v1 = v1.split('.');
        v2 = v2.split('.');

        var len = max(v1.length, v2.length);

        for (var i = 0; i < len; i++) {
            var num1 = toInt(v1[i]),
                num2 = toInt(v2[i]);

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }

        return 0;
    },
    // 判断是IOS还是Android
    checkAgent() {
        var u = navigator.userAgent,
            Agent = '';

        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            Agent = 'Android';
        } else if (isiOS) {
            Agent = 'IOS';
        }
        return Agent;
    }
}