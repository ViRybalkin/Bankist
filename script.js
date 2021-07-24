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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const creatMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((val, ind) => {
    const type = val < 0 ? 'withdrawal' : 'deposit';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      ind + 1
    } deposit</div>
    <div class="movements__date"></div>
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
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  console.log('click');
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
  }
  displayUI(currentAccount);
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
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    displayUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  creatMovements(currentAccount, !sorted);
  sorted = !sorted;
});
