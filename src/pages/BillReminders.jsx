
import { useState } from "react";
import Field from "../components/Field.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useStore } from "../store/useStore.js";
import { formatMoney } from "../utils/helpers.js";

export default function BillReminders() {
  const toast = useToast();

  const bills = useStore((state) => state.bills);
  const addBill = useStore((state) => state.addBill);
  const markBillPaid = useStore((state) => state.markBillPaid);
  const deleteBill = useStore((state) => state.deleteBill);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !amount || Number(amount) <= 0 || !dueDate) {
      setError("Please enter all details correctly.");
      return;
    }

    addBill({
      name: name.trim(),
      amount: Number(amount),
      dueDate,
    });

    setName("");
    setAmount("");
    setDueDate("");
    setError("");

    toast("Bill reminder added!");
  }

  const today = new Date().toISOString().split("T")[0];

  const upcomingBills = bills.filter(
    (bill) => !bill.paid && bill.dueDate >= today
  );

  const overdueBills = bills.filter(
    (bill) => !bill.paid && bill.dueDate < today
  );

  const paidBills = bills.filter((bill) => bill.paid);

  function renderBill(bill) {
    return (
      <div className="budget-stats" key={bill.id}>
        <div>
          <strong>{bill.name}</strong>
          <span>Due: {bill.dueDate}</span>
        </div>

        <div>
          <strong>{formatMoney(bill.amount)}</strong>
        </div>

        <div>
          <button
            className="primary-btn"
            type="button"
            onClick={() => {
              markBillPaid(bill.id);
              toast("Bill status updated");
            }}
          >
            {bill.paid ? "Mark unpaid" : "Mark paid"}
          </button>

          <button
            className="icon-btn delete-btn"
            type="button"
            onClick={() => {
              deleteBill(bill.id);
              toast("Bill deleted");
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="content-card budget-page">
      <div className="section-heading">
        <div>
          <h2>Bill Reminders</h2>
          <p>Keep track of your upcoming bills and payments.</p>
        </div>
      </div>

      <form className="budget-form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Bill name"
          id="bill-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="e.g. Electricity bill"
        />

        <Field
          label="Amount (₹)"
          id="bill-amount"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
          placeholder="Enter amount"
        />

        <Field
          label="Due date"
          id="bill-date"
          type="date"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            setError("");
          }}
          min={today}
        />

        {error && <p className="expense-text">{error}</p>}

        <button className="primary-btn" type="submit">
          Add bill reminder
        </button>
      </form>

      <div className="section-heading">
        <div>
          <h2>Upcoming bills</h2>
          <p>Bills that are due today or later.</p>
        </div>
      </div>

      {upcomingBills.length === 0
        ? <p className="muted-text">No upcoming bills.</p>
        : upcomingBills.map(renderBill)}

      <div className="section-heading">
        <div>
          <h2>Overdue bills</h2>
          <p>These bills have passed their due date.</p>
        </div>
      </div>

      {overdueBills.length === 0
        ? <p className="muted-text">No overdue bills.</p>
        : overdueBills.map(renderBill)}

      <div className="section-heading">
        <div>
          <h2>Paid bills</h2>
          <p>Your completed payments.</p>
        </div>
      </div>

      {paidBills.length === 0
        ? <p className="muted-text">No paid bills yet.</p>
        : paidBills.map(renderBill)}
    </section>
  );
}
