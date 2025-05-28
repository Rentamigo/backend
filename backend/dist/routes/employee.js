"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employee_1 = __importDefault(require("../models/employee"));
const employeeRouter = express_1.default.Router();
// CREATE - Post a new employee
employeeRouter.post("/", async (req, res) => {
    try {
        const { firstname, lastname, email, role, phone, password } = req.body;
        // Validate required fields
        if (!firstname || !lastname || !email || !role || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: firstname, lastname, email, role, phone, and password.",
            });
        }
        const employee = new employee_1.default({ firstname, lastname, email, role, phone, password });
        const savedEmployee = await employee.save();
        res.status(201).json({ success: true, data: savedEmployee });
    }
    catch (error) {
        console.error("Error creating employee:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
// READ - Get all employees
employeeRouter.get("/", async (_req, res) => {
    try {
        const employees = await employee_1.default.find();
        res.status(200).json({ success: true, data: employees });
    }
    catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});
// READ - Get employee by ID
employeeRouter.get("/:id", async (req, res) => {
    try {
        const employee = await employee_1.default.findById(req.params.id);
        if (!employee) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }
        res.status(200).json({ success: true, data: employee });
    }
    catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});
// UPDATE - Update employee by ID
employeeRouter.put("/:id", async (req, res) => {
    try {
        const employee = await employee_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!employee) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }
        res.status(200).json({ success: true, data: employee });
    }
    catch (error) {
        console.error("Error updating employee:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
// DELETE - Delete employee by ID
employeeRouter.delete("/:id", async (req, res) => {
    try {
        const employee = await employee_1.default.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "Employee deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = employeeRouter;
