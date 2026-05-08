const User = require('../models/userModel');
const Activity = require('../models/activityModel');
const Message = require('../models/messageModel');
const Circle = require('../models/circleModel');
const Feedback = require('../models/feedbackModel');

const Referral = require('../models/referralModel');

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'Active' });
        const totalGroups = await Circle.countDocuments();
        const totalReferrals = await Referral.countDocuments();
        const successfulReferrals = await Referral.countDocuments({ status: 'Successful' });
        
        const pendingReports = await Feedback.countDocuments({ category: 'report', status: 'pending' });

        // Build stats format
        const stats = [
            { id: 'total-users', label: 'Total Users', value: totalUsers, icon: 'Users', color: '#2563eb', trend: '+12%' },
            { id: 'active-users', label: 'Active Users', value: activeUsers, icon: 'Activity', color: '#059669', trend: '+5%' },
            { id: 'total-groups', label: 'Total Groups', value: totalGroups, icon: 'Grid', color: '#7c3aed', trend: '+8' },
            { id: 'total-referrals', label: 'Referrals', value: totalReferrals, icon: 'Send', color: '#ea580c', trend: '+15%' },
        ];

        // Recent Activity
        const recentActivities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name')
            .lean();

        const formattedActivities = recentActivities.map((act) => {
            let type = 'user';
            const actType = act.type || '';
            if (actType.includes('circle') || actType.includes('group')) type = 'group';
            if (actType.includes('referral')) type = 'referral';

            const timeDiff = Math.floor((new Date() - new Date(act.createdAt)) / 60000);
            let timeStr = `${timeDiff} mins ago`;
            if (timeDiff > 60) timeStr = `${Math.floor(timeDiff/60)} hours ago`;
            if (timeDiff > 1440) timeStr = `${Math.floor(timeDiff/1440)} days ago`;

            return {
                id: act._id,
                type,
                action: act.description || 'Action performed',
                target: act.userId?.name || 'System',
                time: timeStr
            };
        });

        // User & Referral Growth Data (Last 6 months)
        const growthData = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            
            const userCount = await User.countDocuments({
                createdAt: { $lt: nextMonth }
            });

            const referralCount = await Referral.countDocuments({
                createdAt: { $lt: nextMonth }
            });
            
            growthData.push({
                month: monthNames[d.getMonth()],
                users: userCount,
                referrals: referralCount
            });
        }

        // Weekly Engagement Data (Last 7 days)
        const engagementStats = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(d);
            nextDay.setDate(d.getDate() + 1);

            const activityCount = await Activity.countDocuments({
                createdAt: { $gte: d, $lt: nextDay }
            });

            engagementStats.push({
                name: days[d.getDay()],
                activity: activityCount
            });
        }

        // Industry Distribution
        const industries = await Circle.aggregate([
            { $group: { _id: "$domain", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } },
            { $limit: 5 }
        ]);

        const industryColors = ['#2563eb', '#059669', '#7c3aed', '#ea580c', '#ef4444'];
        const formattedIndustries = industries.map((ind, idx) => ({
            ...ind,
            color: industryColors[idx % industryColors.length]
        }));

        res.json({
            stats,
            recentActivity: formattedActivities,
            userGrowth: growthData,
            engagementStats,
            industryDistribution: formattedIndustries.length > 0 ? formattedIndustries : [
                { name: 'Technology', value: 40, color: '#2563eb' },
                { name: 'Finance', value: 30, color: '#059669' },
                { name: 'Services', value: 20, color: '#7c3aed' },
                { name: 'Others', value: 10, color: '#ea580c' }
            ],
            referralSuccessRate: totalReferrals > 0 ? Math.round((successfulReferrals / totalReferrals) * 100) : 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean();
        const formattedUsers = users.map(user => {
            const date = new Date(user.createdAt);
            const joined = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const role = user.role || 'user';
            
            return {
                id: user._id,
                name: user.name || 'Unknown User',
                email: user.email || 'No email',
                role: role.charAt(0).toUpperCase() + role.slice(1),
                status: user.status || 'Active',
                joined: joined
            };
        });
        res.json(formattedUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `User status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role: role.toLowerCase() }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `User role updated to ${role}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('userId', 'name')
            .lean();

        const formattedLogs = logs.map(act => {
            const date = new Date(act.createdAt);
            const time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            return {
                id: act._id,
                admin: act.userId?.name || 'System',
                action: act.type || 'unknown_action',
                target: act.description || 'No description',
                time: time
            };
        });

        res.json(formattedLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllReports = async (req, res) => {
    try {
        const reports = await Feedback.find({ category: 'report' })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .populate('reportedUser', 'name email')
            .lean();

        const formattedReports = reports.map(r => {
            const date = new Date(r.createdAt);
            const timeStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            
            return {
                id: r._id,
                type: r.reportedUser ? 'User' : 'Content',
                target: r.reportedUser?.name || r.reportedUrl || 'Unknown',
                reason: r.type || r.message,
                status: r.status === 'pending' ? 'Pending' : 'Resolved',
                reporter: r.userId?.name || 'Anonymous',
                time: timeStr
            };
        });

        res.json(formattedReports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const report = await Feedback.findByIdAndUpdate(req.params.id, { status: status.toLowerCase() }, { new: true });
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.json({ message: `Report status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .sort({ createdAt: -1 })
            .populate('sender', 'name email')
            .populate('group', 'name')
            .limit(100)
            .lean();

        const formattedMessages = messages.map(m => {
            const date = new Date(m.createdAt);
            const timeStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            
            return {
                id: m._id,
                author: m.sender?.name || 'Unknown',
                content: m.content || (m.fileUrl ? 'Shared a file' : 'No content'),
                date: timeStr,
                status: 'Active',
                flagged: false,
                groupName: m.group?.name || 'General'
            };
        });

        res.json(formattedMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAdminNotifications = async (req, res) => {
    try {
        const AdminNotification = require('../models/adminNotificationModel');
        const notifications = await AdminNotification.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        
        const unreadCount = await AdminNotification.countDocuments({ isRead: false });
        
        res.json({ notifications, unreadCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const markAdminNotificationRead = async (req, res) => {
    try {
        const AdminNotification = require('../models/adminNotificationModel');
        await AdminNotification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    getLogs,
    getAllReports,
    updateReportStatus,
    getAllMessages,
    deleteMessage,
    getAdminNotifications,
    markAdminNotificationRead
};
