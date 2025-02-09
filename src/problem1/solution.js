// we have 2 cases for sum_to_n
// 1. positive n
// 2. negative n

var sum_to_n_a = function (n) {
  if (n === 0) return 0;
  const result = Array.from(
    { length: Math.abs(n) },
    (_, index) => index + 1
  ).reduce((result, number) => result + number, 0);

  return n > 0 ? result : -result;
};

var sum_to_n_b = function (n) {
  if (n === 0) return 0;
  const absN = Math.abs(n);
  const result = (absN * (absN + 1)) / 2;

  return n > 0 ? result : -result;
};

var sum_to_n_c = function (n) {
  if (n === 0) return 0;
  let result = 0;
  const absN = Math.abs(n);
  let i = 1;
  for (; i <= absN; i++) result += i;
  return n > 0 ? result : -result;
};
