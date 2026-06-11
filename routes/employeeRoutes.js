const express = require("express");

const router = express.Router();

const {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    departmentCount
} = require("../controller/employeeController");

router.post("/", createEmployee);

router.get("/", getEmployees);

router.get("/department-count", departmentCount);

router.get("/:id", getEmployee);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);

module.exports = router;