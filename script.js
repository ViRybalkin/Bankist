'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-07-21T14:11:59.604Z',
    '2021-07-22T17:01:17.194Z',
    '2021-07-23T23:36:17.929Z',
    '2021-07-24T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementsDate = date => {
  const calcDaysPassed = (date2, date1) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yestarday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const curDate = new Date(date);
  const year = curDate.getFullYear();
  const month = `${curDate.getMonth() + 1}`.padStart(2, 0);
  const day = `${curDate.getDate()}`.padStart(2, 0);

  return ` ${day}/${month}/${year}`;
};

const creatMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((val, ind) => {
    const type = val < 0 ? 'withdrawal' : 'deposit';

    const date = new Date(acc.movementsDates[ind]);
    const displayDate = formatMovementsDate(date);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${ind + 1} 
    ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${val.toFixed(2)}€</div>
  </div>
  
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserName = accs => {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);

const displayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, curVal) => {
    return (acc += curVal);
  });
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const displayUI = acc => {
  creatMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
};

const displaySummary = account => {
  const sumIn = account.movements
    .filter(item => item > 0)
    .reduce((acc, curVal) => acc + curVal, 0);
  labelSumIn.textContent = `${sumIn.toFixed(2)}€`;

  const sumOut = account.movements
    .filter(item => item < 0)
    .reduce((acc, curVal) => acc + curVal, 0);
  labelSumOut.textContent = `${Math.abs(sumOut.toFixed(2))}€`;

  const sumInterest = account.movements
    .filter(item => item > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(dep => dep >= 0)
    .reduce((acc, curVal) => acc + curVal, 0);
  labelSumInterest.textContent = `${sumInterest.toFixed(2)}€`;
};

let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    inputLoginPin.value = inputLoginUsername.value = '';

    displayUI(currentAccount);

    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const date = `${now.getDate()}`.padStart(2, 0);
    const hours = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${date}/${month}/${year}/${hours}:${minutes}`;
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  let transferTo = inputTransferTo.value;
  let amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(acc => acc.userName === transferTo);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    inputTransferTo.value = inputTransferAmount.value = '';
    displayUI(currentAccount);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    inputLoanAmount.value = '';
    currentAccount.movementsDates.push(new Date().toISOString());
    displayUI(currentAccount);
  }
});

let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  creatMovements(currentAccount, !sorted);
  sorted = !sorted;
});
