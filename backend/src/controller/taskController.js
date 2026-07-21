import Task from "../model/Task.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper function
export const findOwnedTask = async(taskId, userId, res) => {
    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error("Task Not Found");
    }

    if (task.user.toString() !== userId.toString()) {
        res.status(403);
        throw new Error("Not authorized to access this task");
    }

    return task;
};


export const createTask = asyncHandler(async(req, res) => {
    try {
        console.log("========== CREATE TASK ==========");
        console.log("BODY =", req.body);
        console.log("USER =", req.user);

        const {
            title,
            description,
            dueDate,
            priority,
            category,
            status,
        } = req.body;

        const taskCreated = await Task.create({
            title,
            description,
            dueDate,
            priority,
            category,
            status,
            user: req.user._id,
        });

        console.log("TASK CREATED =", taskCreated);

        return res.status(201).json({
            success: true,
            task: taskCreated,
        });

    } catch (err) {
        console.log("CREATE ERROR =", err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// Get All Tasks
export const getTasks = asyncHandler(async(req, res) => {
    const { status, priority, search, sort } = req.query;

    const query = {
        user: req.user._id,
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
        query.title = {
            $regex: search,
            $options: "i",
        };
    }

    let sortBy = "-createdAt";

    if (sort === "oldest") sortBy = "createdAt";
    if (sort === "dueDate") sortBy = "dueDate";
    if (sort === "priority") sortBy = "priority";

    const tasks = await Task.find(query).sort(sortBy);

    res.status(200).json({
        success: true,
        count: tasks.length,
        tasks,
    });
});

// Get Single Task
export const getTask = asyncHandler(async(req, res) => {
    const task = await findOwnedTask(
        req.params.id,
        req.user._id,
        res
    );

    res.status(200).json({
        success: true,
        task,
    });
});

// Update Task
export const updateTask = asyncHandler(async(req, res) => {
    await findOwnedTask(
        req.params.id,
        req.user._id,
        res
    );

    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body, {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Task Updated Successfully",
        task,
    });
});

// Delete Task
export const deleteTask = asyncHandler(async(req, res) => {
    const task = await findOwnedTask(
        req.params.id,
        req.user._id,
        res
    );

    await task.deleteOne();

    res.status(200).json({
        success: true,
        message: "Task Deleted Successfully",
    });
});

// Toggle Task
export const toggleTask = asyncHandler(async(req, res) => {
    const task = await findOwnedTask(req.params.id, req.user._id, res);

    switch (task.status) {
        case "To-Do":
            task.status = "In Progress";
            task.completed = false;
            break;

        case "In Progress":
            task.status = "Done";
            task.completed = true;
            break;

        default:
            task.status = "To-Do";
            task.completed = false;
    }

    await task.save();

    res.status(200).json({
        success: true,
        task,
    });
});

// Dashboard Stats
export const getStats = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const total = await Task.countDocuments({
        user: userId,
    });

    const completed = await Task.countDocuments({
        user: userId,
        status: "Done",
    });

    const pending = total - completed;

    const overdue = await Task.countDocuments({
        user: userId,
        status: { $ne: "Done" },
        dueDate: { $lt: new Date() },
    });

    res.status(200).json({
        success: true,
        total,
        completed,
        pending,
        overdue,
    });
});