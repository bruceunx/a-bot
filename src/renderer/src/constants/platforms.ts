import BiliIcon from "../assets/icons/bilibili.svg";
import WxIcon from "../assets/icons/wx.svg";
import DyIcon from "../assets/icons/dy.svg";
import KsIcon from "../assets/icons/ks.svg";
import TxwsIcon from "../assets/icons/txws.svg";
import TtIcon from "../assets/icons/tt.svg";
import XgIcon from "../assets/icons/xg.svg";
import XhsIcon from "../assets/icons/xhs.svg";
import ZhIcon from "../assets/icons/zh.svg";

//
// 1. Define the Enum for keys
export enum Platform {
  BiliBili = "BiliBili",
  WX = "WX",
  DY = "DY",
  KS = "KS",
  TXWS = "TXWS",
  TT = "TT",
  XG = "XG",
  XHS = "XHS",
  ZH = "ZH",
}

// 2. Define the Interface for type safety
export interface PlatformMetadata {
  url: string;
  creator_url: string;
  cookie_url: string;
  prefix: string;
  script: string;
  title: string;
  icon: string;
  selector: string;
  // Optional fields
  publish_url_image?: string;
  publish_url_video?: string;
}

// 3. The converted data object
export const LOGIN_METADATA: Record<Platform, PlatformMetadata> = {
  [Platform.BiliBili]: {
    url: "https://passport.bilibili.com/login?gourl=https%3A%2F%2Faccount.bilibili.com%2Faccount%2Fhome",
    creator_url: "https://member.bilibili.com/platform/home",
    cookie_url: "https://member.bilibili.com",
    prefix: "bilibili",
    script: `
      (function() {
          var name_element = document.getElementsByClassName('home-top-msg-name')[0];
          var img_element = document.querySelector('div.home-head');
          var img = img_element ? img_element.querySelector('img') : null;
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "哔哩哔哩",
    icon: BiliIcon,
    publish_url_image: "https://t.bilibili.com",
    publish_url_video:
      "https://member.bilibili.com/platform/upload/video/frame?page_from=creative_home_top_upload",
    selector: "div.tips-calendar_wrap",
  },
  [Platform.WX]: {
    url: "https://mp.weixin.qq.com",
    creator_url: "https://mp.weixin.qq.com",
    cookie_url: "https://mp.weixin.qq.com/",
    prefix: "wx",
    script: `
      (function() {
          var divElement = document.querySelector('div.weui-desktop-person_info')
          var name_element = divElement ? divElement.querySelector('div.weui-desktop_name') : null;
          var img = divElement ? divElement.querySelector('img.weui-desktop-account__img') : null;
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "微信公众号",
    icon: WxIcon,
    publish_url_image: "https://mp.weixin.qq.com/",
    selector: "div.weui-desktop_name",
  },
  [Platform.DY]: {
    url: "https://creator.douyin.com",
    creator_url: "https://creator.douyin.com",
    cookie_url: "https://creator.douyin.com",
    prefix: "dy",
    script: `
      (function() {
          var name_element = document.querySelector('div.rNsML');
          var img = document.querySelector('img.f3hat');
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "抖音",
    icon: DyIcon,
    selector: "div.rNsML",
  },
  [Platform.KS]: {
    url: "https://passport.kuaishou.com/pc/account/login/?sid=kuaishou.web.cp.api&callback=https%3A%2F%2Fcp.kuaishou.com%2Frest%2Finfra%2Fsts%3FfollowUrl%3Dhttps%253A%252F%252Fcp.kuaishou.com%252Fprofile%26setRootDomain%3Dtrue",
    creator_url: "https://cp.kuaishou.com/profile",
    cookie_url: "https://cp.kuaishou.com",
    prefix: "ks",
    script: `
      (function() {
          var div_element = document.querySelector('div.header-info-card');
          var name_element = div_element ? div_element.querySelector('div.user-name') : null;
          var img = div_element ? div_element.querySelector('img') : null;
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "快手视频",
    icon: KsIcon,
    selector: "div.info-top-name",
  },
  [Platform.TXWS]: {
    url: "https://h5.weishi.qq.com/weishi/account/login?r_url=http%3A%2F%2Fmedia.weishi.qq.com%2F",
    creator_url: "https://media.weishi.qq.com",
    cookie_url: "https://media.weishi.qq.com",
    prefix: "txws",
    script: `
      (function() {
          var div_element = document.querySelector('div.container___R5xBA');
          var name_element = div_element ? div_element.querySelector('div.user-name___2QHja') : null;
          var img = div_element ? div_element.querySelector('img') : null;
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "腾讯微视",
    icon: TxwsIcon,
    selector: "div.icon.upload",
  },
  [Platform.TT]: {
    url: "https://mp.toutiao.com/auth/page/login",
    creator_url: "https://mp.toutiao.com/profile_v4/index",
    cookie_url: "https://mp.toutiao.com",
    prefix: "tt",
    script: `
      (function() {
          var name_element = document.querySelector('div.auth-avator-name');
          var img = document.querySelector('img.auth-avator-img');
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "头条",
    icon: TtIcon,
    selector: "img.auth-avator-img",
  },
  [Platform.XG]: {
    url: "https://studio.ixigua.com",
    creator_url: "https://studio.ixigua.com/",
    cookie_url: "https://studio.ixigua.com/",
    prefix: "xg",
    script: `
      (function() {
          var name_element = document.querySelector('div.user-info__username');
          var div_element = document.querySelector('div.img-wrapper');
          var img = div_element ? div_element.querySelector('img') : null;
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "西瓜视频",
    icon: XgIcon,
    publish_url_video: "https://studio.ixigua.com/upload?from=post_article",
    selector: "div.user-info__username",
  },
  [Platform.XHS]: {
    url: "https://creator.xiaohongshu.com",
    creator_url: "https://creator.xiaohongshu.com/new/home",
    cookie_url: "https://www.xiaohongshu.com",
    prefix: "xhs",
    script: `
      (function() {
          var name_element = document.getElementsByClassName('account-name')[0];
          var img_element = document.getElementsByClassName('avatar')[0];
          var img = img_element ? img_element.getElementsByTagName('img')[0] : null;
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "小红书",
    icon: XhsIcon,
    publish_url_image: "https://creator.xiaohongshu.com/publish/publish",
    publish_url_video: "https://creator.xiaohongshu.com/publish/publish",
    selector: "div.account-name",
  },
  [Platform.ZH]: {
    url: "https://www.zhihu.com/creator",
    creator_url: "https://www.zhihu.com/creator",
    cookie_url: "https://www.zhihu.com/creator",
    prefix: "zh",
    script: `
      (function() {
          var name_element = document.querySelector('div.LevelInfoV2-creatorInfo.css-sbvk4m');
          var img = document.querySelector('img.Avatar');
          return { name: name_element ? name_element.textContent : '', avatar: img ? img.src : '' };
      })();
    `,
    title: "知乎",
    icon: ZhIcon,
    publish_url_image: "https://zhuanlan.zhihu.com/write",
    publish_url_video: "https://www.zhihu.com/zvideo/upload-video",
    selector: "div.LevelInfoV2-creatorInfo.css-sbvk4m",
  },
};
