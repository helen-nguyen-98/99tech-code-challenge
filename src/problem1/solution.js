// we have 2 cases for sum_to_n
// 1. positive n
// 2. negative n
// based on the example we can see that the sum of 1 to 5 is 15
// so I assume the requirement is to sum all the numbers from 1 to n
// we can use the formula (n * (n + 1)) / 2 to calculate the sum of numbers from 1 to n
// but n is integer so we need to consider the negative numbers as well
// if n is negative we need to sum all the numbers from -n to -1 
// we can use the same formula but we need to return the result as negative

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
