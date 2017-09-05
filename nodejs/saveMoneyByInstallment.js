// 计算分期付款时，未支付的钱能给自己带来的利息数
exports.default = function (花费, 分期数, 每天利率) {
  let 节约钱数 = 0;
  const 每月需还 = 花费 / 分期数;
  for (let i = 0; i < 分期数; i++) {
    const 剩余月数 = 分期数 - i;
    const 剩余还款 = 剩余月数 * 每月需还;
    节约钱数 += (剩余还款 * 30 * 每天利率);
  }
  return 节约钱数;
};
