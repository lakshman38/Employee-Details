const Employee = require("../model/Employee");

const createEmployee = async (req, res) => {

    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({
            success: true,
            data: employee
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getEmployees = async (req, res) => {

    try {

        const employees = await Employee.find();

        res.status(200).json(employees);

    } catch(error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const getEmployee = async (req, res) => {

    try {

        const employee = await Employee.findOne({
            employeeId: req.params.id
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee Not Found"
            });
        }

        res.json(employee);

    } catch(error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const updateEmployee = async (req, res) => {

    try {

        const employee = await Employee.findOneAndUpdate(
            { employeeId: req.params.id },
            req.body,
            { new: true }
        );

        res.json(employee);

    } catch(error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const deleteEmployee = async (req, res) => {

    try {

        await Employee.findOneAndDelete({
            employeeId: req.params.id
        });

        res.json({
            success: true,
            message: "Employee Deleted Successfully"
        });

    } catch(error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const departmentCount = async (req, res) => {

    try {

        const result = await Employee.aggregate([
            {
                $group: {
                    _id: "$department",
                    totalEmployees: {
                        $sum: 1
                    }
                }
            }
        ]);

        res.json(result);

    } catch(error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    departmentCount
};