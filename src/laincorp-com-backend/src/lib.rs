use candid::{CandidType, Nat, Principal};
use ic_cdk::{init, query, update};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::cell::RefCell;

#[derive(Default, CandidType, Serialize, Deserialize)]
struct State {
    name: String,
    symbol: String,
    total_supply: Nat,
    balances: HashMap<Principal, Nat>,
    allowances: HashMap<(Principal, Principal), Nat>,
}

thread_local! {
    static STATE: RefCell<Option<State>> = RefCell::new(None);
}

fn with_state<R>(f: impl FnOnce(&State) -> R) -> R {
    STATE.with(|s| f(s.borrow().as_ref().expect("State not initialized")))
}

fn with_state_mut<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|s| f(s.borrow_mut().as_mut().expect("State not initialized")))
}

#[init]
fn init() {
    let caller = ic_cdk::api::caller();
    let total = Nat::from(100_000_000_000u128); // 100 Billion

    let mut balances = HashMap::new();
    balances.insert(caller, total.clone());

    let state = State {
        name: "LainCoin".to_string(),
        symbol: "LAIN".to_string(),
        total_supply: total,
        balances,
        allowances: HashMap::new(),
    };

    STATE.with(|s| {
        *s.borrow_mut() = Some(state);
    });
}

#[update]
fn transfer(to: Principal, amount: Nat) {
    let caller = ic_cdk::api::caller();

    with_state_mut(|state| {
        let sender_balance = state.balances.entry(caller).or_default();
        if *sender_balance < amount {
            ic_cdk::trap("Insufficient balance");
        }

        *sender_balance -= amount.clone();
        *state.balances.entry(to).or_default() += amount;
    });
}

#[update]
fn approve(spender: Principal, amount: Nat) {
    let caller = ic_cdk::api::caller();

    with_state_mut(|state| {
        state.allowances.insert((caller, spender), amount);
    });
}

#[update]
fn transfer_from(from: Principal, to: Principal, amount: Nat) {
    let caller = ic_cdk::api::caller();

    with_state_mut(|state| {
        let key = (from, caller);
        let allowance = state.allowances.get_mut(&key).unwrap_or_else(|| {
            ic_cdk::trap("No allowance");
        });

        if *allowance < amount {
            ic_cdk::trap("Insufficient allowance");
        }

        let from_balance = state.balances.get_mut(&from).unwrap_or_else(|| {
            ic_cdk::trap("Insufficient sender balance");
        });

        if *from_balance < amount {
            ic_cdk::trap("Insufficient balance");
        }

        *allowance -= amount.clone();
        *from_balance -= amount.clone();
        *state.balances.entry(to).or_default() += amount;
    });
}

#[query]
fn balance_of(owner: Principal) -> Nat {
    with_state(|state| state.balances.get(&owner).cloned().unwrap_or_default())
}

#[query]
fn allowance(owner: Principal, spender: Principal) -> Nat {
    with_state(|state| state.allowances.get(&(owner, spender)).cloned().unwrap_or_default())
}

#[query]
fn name() -> String {
    with_state(|state| state.name.clone())
}

#[query]
fn symbol() -> String {
    with_state(|state| state.symbol.clone())
}

#[query]
fn total_supply() -> Nat {
    with_state(|state| state.total_supply.clone())
}
