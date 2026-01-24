import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  FiDollarSign, FiShoppingCart, FiUsers, FiPackage, 
  FiTrendingUp, FiTrendingDown, FiStar, FiActivity 
} from 'react-icons/fi';
import { FaGamepad, FaSteam, FaPlaystation, FaXbox } from 'react-icons/fa';

// Sample data - replace with your actual data
const salesData = [
  { month: 'Jan', sales: 4000, revenue: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398 },
  { month: 'Mar', sales: 9800, revenue: 2000 },
  { month: 'Apr', sales: 3908, revenue: 2780 },
  { month: 'May', sales: 4800, revenue: 1890 },
  { month: 'Jun', sales: 3800, revenue: 2390 },
  { month: 'Jul', sales: 4300, revenue: 3490 },
];

const topProducts = [
  { name: 'Cyberpunk 2077', sales: 2400, revenue: 12000 },
  { name: 'Elden Ring', sales: 1890, revenue: 9450 },
  { name: 'God of War', sales: 1520, revenue: 7600 },
  { name: 'Call of Duty', sales: 1230, revenue: 6150 },
  { name: 'Minecraft', sales: 980, revenue: 4900 },
];

const categoryData = [
  { name: 'Action', value: 400, color: '#EF4444' },
  { name: 'RPG', value: 300, color: '#3B82F6' },
  { name: 'Sports', value: 300, color: '#10B981' },
  { name: 'Strategy', value: 200, color: '#F59E0B' },
  { name: 'Indie', value: 278, color: '#8B5CF6' },
];

const platformData = [
  { platform: 'Steam', games: 150, sales: 5000 },
  { platform: 'PlayStation', games: 80, sales: 3200 },
  { platform: 'Xbox', games: 75, sales: 2800 },
  { platform: 'Nintendo', games: 60, sales: 1800 },
  { platform: 'Epic', games: 45, sales: 1500 },
];

const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    growthRate: 0,
  });

  // Mock data loading
  useEffect(() => {
    // In real app, fetch from API
    setStats({
      totalRevenue: 125430,
      totalOrders: 245,
      totalUsers: 1245,
      totalProducts: 89,
      growthRate: 12.5,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: <FiDollarSign className="text-2xl" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+8.2%',
      icon: <FiShoppingCart className="text-2xl" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+15.3%',
      icon: <FiUsers className="text-2xl" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: '+5.1%',
      icon: <FiPackage className="text-2xl" />,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
    },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Purchased Cyberpunk 2077', time: '2 min ago', amount: '$59.99' },
    { user: 'Jane Smith', action: 'Created new account', time: '15 min ago', amount: '' },
    { user: 'Mike Johnson', action: 'Submitted support ticket', time: '30 min ago', amount: '' },
    { user: 'Sarah Wilson', action: 'Purchased Elden Ring', time: '1 hour ago', amount: '$49.99' },
    { user: 'Alex Brown', action: 'Left 5-star review', time: '2 hours ago', amount: '' },
  ];

  const topCustomers = [
    { name: 'John Doe', email: 'john@example.com', spent: 1250, orders: 8 },
    { name: 'Jane Smith', email: 'jane@example.com', spent: 980, orders: 6 },
    { name: 'Mike Johnson', email: 'mike@example.com', spent: 750, orders: 4 },
    { name: 'Sarah Wilson', email: 'sarah@example.com', spent: 620, orders: 3 },
    { name: 'Alex Brown', email: 'alex@example.com', spent: 580, orders: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Range Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-2 bg-gray-800/50 rounded-lg p-1">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-2">{stat.value}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-sm ${stat.change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 text-sm">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Sales & Revenue</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-400 text-sm">Sales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-400 text-sm">Revenue</span>
              </div>
            </div>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="2"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Top Selling Products</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value) => [`${value} units`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Categories Distribution</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value, name) => [`${value} games`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Platform Performance</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <RadarChart data={platformData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="platform" stroke="#9CA3AF" />
                <PolarRadiusAxis stroke="#9CA3AF" />
                <Radar
                  name="Games"
                  dataKey="games"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Sales"
                  dataKey="sales"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
                <Legend />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Activities</h3>
            <button className="text-red-400 hover:text-red-300 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                    <span className="font-bold text-white">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.user}</p>
                    <p className="text-gray-400 text-sm">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="text-green-400 font-medium">{activity.amount}</p>
                  )}
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Top Customers</h3>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-bold text-gray-400">#{index + 1}</div>
                  <div>
                    <p className="text-white font-medium">{customer.name}</p>
                    <p className="text-gray-400 text-sm">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${customer.spent.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">{customer.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-white mt-1">3.24%</h3>
            </div>
            <FiTrendingUp className="text-3xl text-green-400" />
          </div>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '32%' }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Order Value</p>
              <h3 className="text-2xl font-bold text-white mt-1">$89.42</h3>
            </div>
            <FiActivity className="text-3xl text-blue-400" />
          </div>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Customer Satisfaction</p>
              <h3 className="text-2xl font-bold text-white mt-1">4.8/5</h3>
            </div>
            <FiStar className="text-3xl text-yellow-400" />
          </div>
          <div className="mt-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${star <= 4 ? 'bg-yellow-500' : 'bg-gray-600'}`}
                  style={{ width: star === 5 ? '80%' : '100%' }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}