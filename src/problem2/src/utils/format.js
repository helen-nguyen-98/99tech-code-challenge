export function formatNumber(num, decimals) {
  let fixedNum = num.toFixed(decimals);
  return fixedNum.toLocaleString("en-US");
}
