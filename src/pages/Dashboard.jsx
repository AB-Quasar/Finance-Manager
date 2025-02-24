import { useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, CartesianGrid, Cell } from 'recharts';
import { useExpense } from '../context/ExpenseContext';
import RefreshIcon from '@mui/icons-material/Refresh';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const Dashboard = () => {
  const { 
    stats, 
    expenses: recentExpenses, 
    loading, 
    error,
    refreshData 
  } = useExpense();

  useEffect(() => {
    const loadData = async () => {
      try {
        await refreshData();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadData();
  }, [refreshData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={refreshData}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Expenses (This Month)
            </Typography>
            <Typography variant="h4" component="div">
              {formatCurrency(stats?.monthlyTotal || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Average Daily Expense
            </Typography>
            <Typography variant="h4" component="div">
              {formatCurrency(stats?.dailyAverage || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Highest Expense Category
            </Typography>
            <Typography variant="h4" component="div">
              {stats?.topCategory || 'N/A'}
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Expense Trend (Last 7 Days)
            </Typography>
            {stats?.trend && stats.trend.length > 0 ? (
              <LineChart
                data={stats.trend}
                width={600}
                height={300}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Daily Expenses"
                />
              </LineChart>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No expense data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            {stats?.distribution && stats.distribution.length > 0 ? (
              <Box sx={{ 
                width: '100%', 
                height: '320px',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                mt: 1
              }}>
                <PieChart width={300} height={200}>
                  <Pie
                    data={stats.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={false}
                  >
                    {stats.distribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px'
                    }}
                  />
                </PieChart>
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  mt: 2,
                  px: 2,
                  overflow: 'auto'
                }}>
                  {stats.distribution.map((entry, index) => (
                    <Box 
                      key={entry.name}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minHeight: '28px'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: COLORS[index % COLORS.length],
                            flexShrink: 0
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                          {entry.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 500,
                        color: 'text.primary',
                        ml: 2
                      }}>
                        {formatCurrency(entry.value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No category data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Expenses */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Expenses
            </Typography>
            <Box>
              {recentExpenses && recentExpenses.length > 0 ? (
                recentExpenses.slice(0, 5).map((expense) => (
                  <Box
                    key={expense._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #eee',
                      py: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {expense.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(expense.date).toLocaleDateString()} - {expense.category}
                      </Typography>
                    </Box>
                    <Typography variant="h6">{formatCurrency(expense.amount)}</Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary" align="center">No recent expenses</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
