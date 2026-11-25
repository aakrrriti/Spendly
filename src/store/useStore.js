
import { create } from "zustand";
import { SAMPLE_TRANSACTIONS, readJSON, writeJSON } from "../utils/helpers.js";

const txKey = (email) => `spendly-transactions:${email}`;
const budgetKey = (email) => `spendly-budget:${email}`;
const billKey = (email) => `spendly-bills:${email}`;

export const useStore = create((set, get) => {
  const commit = (transactions) => {
    set({ transactions });
    writeJSON(txKey(get().email), transactions);
  };

  return {
    email: null,
    transactions: [],
    budget: 20000,
    bills: [],

    loadUser: (email) =>
      set({
        email,
        transactions: readJSON(txKey(email), SAMPLE_TRANSACTIONS),
        budget: Number(readJSON(budgetKey(email), 20000)) || 0,
        bills: readJSON(billKey(email), []),
      }),

    addTransaction: (data) =>
      commit([{ id: Date.now(), ...data }, ...get().transactions]),

    updateTransaction: (id, data) =>
      commit(
        get().transactions.map((item) =>
          item.id === id ? { ...item, ...data } : item
        )
      ),

    deleteTransaction: (id) =>
      commit(get().transactions.filter((item) => item.id !== id)),

    clearTransactions: () => commit([]),

    setBudget: (amount) => {
      set({ budget: amount });
      writeJSON(budgetKey(get().email), amount);
    },

    addBill: (data) => {
      const bills = [
        { id: Date.now(), ...data, paid: false },
        ...get().bills,
      ];
      set({ bills });
      writeJSON(billKey(get().email), bills);
    },

    markBillPaid: (id) => {
      const bills = get().bills.map((bill) =>
        bill.id === id ? { ...bill, paid: !bill.paid } : bill
      );
      set({ bills });
      writeJSON(billKey(get().email), bills);
    },

    deleteBill: (id) => {
      const bills = get().bills.filter((bill) => bill.id !== id);
      set({ bills });
      writeJSON(billKey(get().email), bills);
    },
  };
});
