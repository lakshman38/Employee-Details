import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const API_BASE = "/api/employees";
const emptyForm = {
  name: "",
  department: "",
  salary: ""
};

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function formatCurrency(value) {
  return rupeeFormatter.format(Number(value || 0));
}

function buildInsights(employees, departments) {
  const salaryValues = employees.map((employee) => Number(employee.salary || 0));
  const payroll = salaryValues.reduce((sum, value) => sum + value, 0);
  const averageSalary = salaryValues.length ? Math.round(payroll / salaryValues.length) : 0;

  const highestPaidEmployee = employees.reduce((bestEmployee, employee) => {
    if (!bestEmployee) {
      return employee;
    }

    return Number(employee.salary || 0) > Number(bestEmployee.salary || 0) ? employee : bestEmployee;
  }, null);

  const departmentLeaderboard = [...departments].sort(
    (left, right) => Number(right.totalEmployees || 0) - Number(left.totalEmployees || 0)
  );

  const topDepartment = departmentLeaderboard[0]?._id || "No department data yet";
  const fastGrowthDepartment =
    departments.find((department) => Number(department.totalEmployees || 0) >= 3)?._id || topDepartment;

  return {
    totalEmployees: employees.length,
    totalDepartments: departments.length,
    payroll,
    averageSalary,
    highestPaidEmployee,
    topDepartment,
    fastGrowthDepartment,
    departmentLeaderboard
  };
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const successTimeoutRef = useRef(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const insights = useMemo(() => buildInsights(employees, departments), [employees, departments]);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [employeesResponse, departmentResponse] = await Promise.all([
        fetch(API_BASE),
        fetch(`${API_BASE}/department-count`)
      ]);

      if (!employeesResponse.ok) {
        throw new Error("Failed to load employees");
      }

      if (!departmentResponse.ok) {
        throw new Error("Failed to load department counts");
      }

      const employeesData = await employeesResponse.json();
      const departmentData = await departmentResponse.json();

      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setDepartments(Array.isArray(departmentData) ? departmentData : []);
    } catch (fetchError) {
      setError(fetchError.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingEmployeeId(null);
  }

  function triggerSuccess(message) {
    setSuccess(message);

    if (successTimeoutRef.current) {
      window.clearTimeout(successTimeoutRef.current);
    }

    successTimeoutRef.current = window.setTimeout(() => {
      setSuccess("");
    }, 1800);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      department: form.department.trim(),
      salary: Number(form.salary)
    };

    try {
      const response = await fetch(editingEmployeeId ? `${API_BASE}/${editingEmployeeId}` : API_BASE, {
        method: editingEmployeeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Unable to save employee");
      }

      triggerSuccess(editingEmployeeId ? "Employee updated successfully." : "Employee created successfully.");
      resetForm();
      await loadDashboard();
    } catch (submitError) {
      setError(submitError.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(employee) {
    setEditingEmployeeId(employee.employeeId);
    setForm({
      name: employee.name || "",
      department: employee.department || "",
      salary: employee.salary?.toString() || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteEmployee(employeeId) {
    const confirmed = window.confirm("Delete this employee?");
    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_BASE}/${employeeId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Unable to delete employee");
      }

      triggerSuccess("Employee deleted successfully.");
      if (editingEmployeeId === employeeId) {
        resetForm();
      }
      await loadDashboard();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete employee");
    }
  }

  const departmentDistribution = insights.departmentLeaderboard.slice(0, 4);

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />
      <div className="grain" />

      <div className="dashboard">
        <header className="hero-card">
          <div className="hero-copy hero-copy-wide">
            <div className="hero-badge-row">
              <span className="eyebrow">Employee Intelligence Platform</span>
              <span className="status-pill">Live MongoDB connected</span>
            </div>

            <h1>Premium talent intelligence for modern teams.</h1>
            <p>
              Track employee records, analyze department health, and keep the experience clean,
              premium, and fast while preserving all MongoDB workflows.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button magnetic"
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Focus dashboard
              </button>
              <button className="secondary-button magnetic" type="button" onClick={loadDashboard}>
                Refresh data
              </button>
            </div>

            <div className="hero-metrics">
              <article className="metric-card reveal">
                <span>Total employees</span>
                <strong>{insights.totalEmployees}</strong>
                <small>Live from MongoDB</small>
              </article>
              <article className="metric-card reveal delay-1">
                <span>Departments</span>
                <strong>{insights.totalDepartments}</strong>
                <small>{insights.topDepartment}</small>
              </article>
              <article className="metric-card reveal delay-2">
                <span>Average salary</span>
                <strong>{formatCurrency(insights.averageSalary)}</strong>
                <small>Indian numbering format</small>
              </article>
            </div>
          </div>
        </header>

        <main className="content-grid">
          <section className="left-column">
            <section className="panel glass-panel form-panel reveal delay-1">
              <div className="panel-head">
                <div>
                  <span className="panel-kicker">Employee studio</span>
                  <h2>{editingEmployeeId ? "Edit employee" : "Add employee"}</h2>
                  <p>Clean record editing with real-time database sync and polished success states.</p>
                </div>
                {editingEmployeeId ? (
                  <button className="ghost-button" type="button" onClick={resetForm}>
                    Cancel edit
                  </button>
                ) : null}
              </div>

              <form className="employee-form" onSubmit={handleSubmit}>
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                  />
                </label>

                <label>
                  <span>Department</span>
                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Engineering"
                    required
                  />
                </label>

                <label>
                  <span>Salary</span>
                  <input
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="60000"
                    min="0"
                    step="1"
                    required
                  />
                </label>

                <div className="form-actions">
                  {editingEmployeeId ? (
                    <button className="ghost-button" type="button" onClick={resetForm}>
                      Cancel edit
                    </button>
                  ) : null}

                  <button className="primary-button magnetic" type="submit" disabled={saving}>
                    {saving ? "Saving..." : editingEmployeeId ? "Update employee" : "Create employee"}
                  </button>
                </div>
              </form>

              <div className="micro-insights">
                <div className="micro-insight-card">
                  <span>Fastest growing cluster</span>
                  <strong>{insights.fastGrowthDepartment}</strong>
                </div>
                <div className="micro-insight-card">
                  <span>Salary signal</span>
                  <strong>{formatCurrency(insights.averageSalary)}</strong>
                </div>
              </div>

              {error ? <div className="alert alert-error">{error}</div> : null}
              {success ? <div className="alert alert-success">{success}</div> : null}
            </section>

            <section className="panel glass-panel table-panel reveal delay-2">
              <div className="panel-head">
                <div>
                  <span className="panel-kicker">Command center</span>
                  <h2>Employee records</h2>
                  <p>Scroll-aware transitions, polished empty states, and high-clarity actions.</p>
                </div>
                <button className="ghost-button magnetic" type="button" onClick={loadDashboard}>
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="skeleton-stack" aria-label="Loading employees">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-row" />
                  <div className="skeleton skeleton-row" />
                  <div className="skeleton skeleton-row" />
                  <div className="skeleton skeleton-row" />
                </div>
              ) : employees.length ? (
                <div className="table-wrap premium-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={employee.employeeId} style={{ animationDelay: `${index * 60}ms` }}>
                          <td>
                            <span className="table-id">#{employee.employeeId}</span>
                          </td>
                          <td>
                            <div className="name-cell">
                              <span className="avatar-badge">
                                {employee.name?.charAt(0)?.toUpperCase() || "E"}
                              </span>
                              <div className="employee-cell">
                                <strong>{employee.name}</strong>
                                <span>
                                  Updated {new Date(employee.updatedAt || employee.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="chip">{employee.department}</span>
                          </td>
                          <td>
                            <strong className="salary-value">{formatCurrency(employee.salary)}</strong>
                          </td>
                          <td>
                            <div className="row-actions">
                              <button type="button" className="chip-action" onClick={() => startEdit(employee)}>
                                Edit
                              </button>
                              <button
                                type="button"
                                className="chip-action danger"
                                onClick={() => deleteEmployee(employee.employeeId)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon" />
                  <h3>No employees yet</h3>
                  <p>Create the first record to activate live analytics.</p>
                </div>
              )}

              <div className="department-strip">
                {departmentDistribution.length ? (
                  departmentDistribution.map((department, index) => (
                    <div
                      className="department-card"
                      key={department._id}
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <div>
                        <span>{department._id}</span>
                        <strong>{department.totalEmployees}</strong>
                      </div>
                      <div className="department-bars">
                        <span style={{ height: `${Math.max(22, department.totalEmployees * 18)}%` }} />
                        <span style={{ height: `${Math.max(34, department.totalEmployees * 24)}%` }} />
                        <span style={{ height: `${Math.max(16, department.totalEmployees * 14)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-inline">No department data yet.</div>
                )}
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
