const mongoose = require("mongoose");
const Counter = require("./Counter");

const employeeSchema = new mongoose.Schema(
{
    employeeId: {
        type: Number,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
}
);

employeeSchema.pre("save", async function () {

    if (this.employeeId) {
        return;
    }

    const counter = await Counter.findByIdAndUpdate(
        "employeeId",
        {
            $inc: { seq: 1 }
        },
        {
            returnDocument: "after",
            upsert: true
        }
    );

    this.employeeId = counter.seq;
});

module.exports = mongoose.model("Employee", employeeSchema);