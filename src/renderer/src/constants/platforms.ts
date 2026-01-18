import { Platform } from "@common/constants";

import BiliIcon from "../assets/icons/bilibili.svg";
import WxIcon from "../assets/icons/wx.svg";
import DyIcon from "../assets/icons/dy.svg";
import KsIcon from "../assets/icons/ks.svg";
import TxwsIcon from "../assets/icons/txws.svg";
import TtIcon from "../assets/icons/tt.svg";
import XhsIcon from "../assets/icons/xhs.svg";

//

export const Icons: Record<Platform, string> = {
  [Platform.BILIBILI]: BiliIcon,
  [Platform.WX]: WxIcon,
  [Platform.DY]: DyIcon,
  [Platform.KS]: KsIcon,
  [Platform.TXWS]: TxwsIcon,
  [Platform.TT]: TtIcon,
  [Platform.XHS]: XhsIcon,
};
