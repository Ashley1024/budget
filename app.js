// Setup your objects using inheritance
const incomelistele = document.querySelector('.income__list');
const expenseslistele = document.querySelector('.expenses__list');
const addContainerele = document.querySelector('.add__container');
const addDescriptionele = document.querySelector('.add__description');
const addValuele = document.querySelector('.add__value');
const addbtn = document.querySelector('.ion-ios-checkmark-outline');
const titleMonthele = document.querySelector('.budget__title--month');
const budgetvaluele = document.querySelector('.budget__value');
const budgetincomele = document.querySelector('.budget__income--value');
const budgetincomepercentele = document.querySelector('.budget__income--percentage');
const budgetexpensesele = document.querySelector('.budget__expenses--value');
const budgetexpensespercentele = document.querySelector('.budget__expenses--percentage');

class TransactionList {
  constructor() {
    this.list = [];
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
    this.availableBudget = 0;
    this.redraw();
  }

  addNewTransaction(description, amount) {
    let transactioncopy = new Transaction(description, amount);
    transactioncopy.id = this.id++;
    // amount >0 means income,or expense add to different zone
    if (amount >= 0) {
      this.incomeList.push(transactioncopy);
      console.log(this.incomeList);
    } if (amount < 0) {
      this.expenseList.push(transactioncopy);
      console.log(this.expenseList);
    }

    this.redraw();
  }

  redraw() {
    incomelistele.innerHTML = "";
    expenseslistele.innerHTML = "";

    let income = 0;
    let expense = 0;

    this.incomeList.forEach(function (transaction) {
      income += Number(transaction.amount);

      incomelistele.insertAdjacentHTML('afterbegin', `
      <div class="item" data-transaction-id="${transaction.id}">
        <div class="item__description">${transaction.description}</div>            
        <div class="right">
          <div class="item__value">+ $${(transaction.amount)}</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
        <div class="item__date">${(transaction.date)}</div>
      </div>
      `)
    });

    this.expenseList.forEach(function (transaction) {
      expense += Number(transaction.amount);

      expenseslistele.insertAdjacentHTML('afterbegin', `
      <div class="item" data-transaction-id="${transaction.id}">
        <div class="item__description">${transaction.description}</div>            
        <div class="right">
          <div class="item__value"> -$${(-transaction.amount).toFixed(2)}</div>
          <div class="item__percentage">${(-transaction.amount * 100 / income).toFixed(0) + '%'} </div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
        <div class="item__date">${(transaction.date)}</div>
      </div>
      `)
    });

    //! if this part add inside of forEach will lead to last piece of income or expense no change
    budgetincomele.innerHTML = `+ $${income.toFixed(2)}`;
    budgetexpensesele.innerHTML = `- $${(-expense).toFixed(2)}`;

    //add month, year for the title
    //! js getMonth() ,result from 0 means January; but years,date not
    let temp = (new Date()).toDateString().split(" ");
    const titledate = [temp[1], temp[3]].join(" ");
    titleMonthele.innerHTML = titledate;

    //add available budget
    this.availableBudget = income + expense;
    this.availableBudget >= 0 ? budgetvaluele.innerHTML = `+ $${this.availableBudget.toFixed(2)}` : budgetvaluele.innerHTML = `- $${(-this.availableBudget).toFixed(2)}`

    //todo add expensePercent and start from 0 or it start from NAN
    if (expense === 0 && income === 0) {
      budgetexpensespercentele.innerHTML = 0 + '%';
    } else { budgetexpensespercentele.innerHTML = Math.round(-expense * 100 / income) + "%"; };

  }

  removeTransaction(id) {
    this.incomeList = this.incomeList.filter(transaction => transaction.id != id);
    this.expenseList = this.expenseList.filter(transaction => transaction.id != id);
    this.redraw();
  }
}
// be careful about the order

class Transaction {
  constructor(description, amount, id) {
    this.description = description;
    this.amount = Number(amount).toFixed(2);
    this.date = "";//Jun. 4th, 2020 or Jun. 4, 2020 
    this.id = id;
    this.datec();
  }
  datec() {
    // toDateString result : Thu Apr 23 2020
    let c = (new Date()).toDateString().split(" ");
    this.date = [c[1], ['.'], c[2], [','], c[3]].join("");
  }
}

const transaction = new Transaction();
const transactionlist = new TransactionList();

//todo listen what we input
addContainerele.addEventListener('click', function (e) {
  //todo exclude the condition when input nothing in two box
  if (addDescriptionele.value != "" && addValuele.value != "") {
    if (e.target.className == "ion-ios-checkmark-outline") {
      const description = addDescriptionele.value;
      const amount = addValuele.value;
      transactionlist.addNewTransaction(description, amount);
      addValuele.value = "";
      addDescriptionele.value = "";
    };
  };
  e.preventDefault();
});

//todo listener for delete
const containerele = document.querySelector('.container');
containerele.addEventListener('click', function (e) {
  if (e.target.nodeName === "I") {
    const item = e.target.closest('.right').parentNode;

    transactionlist.removeTransaction(item.dataset.transactionId);
  }
})

