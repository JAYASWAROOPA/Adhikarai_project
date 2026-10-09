import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardActionArea, CardContent, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import PolicyIcon from '@mui/icons-material/Policy';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';

export default function AdminDashboardPage(){
  const [data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');const navigate=useNavigate();
  const load=useCallback(async()=>{setLoading(true);setError('');try{setData(await adminService.getDashboard());}catch(e){setError(e.message);}finally{setLoading(false);}},[]);
  useEffect(()=>{load();},[load]);
  const stats=data?.stats||{};const cards=[['Registered users',stats.totalUsers,PeopleIcon,'/admin/users'],['Citizens',stats.totalCitizens,PeopleIcon,'/admin/users'],['Officers',stats.totalOfficers,SecurityIcon,'/admin/officers'],['Welfare schemes',stats.totalSchemes,PolicyIcon,'/admin/schemes'],['Applications',stats.totalApplications,AssignmentIcon,'/admin/analytics'],['Pending applications',stats.pendingApplications,AssignmentIcon,'/admin/analytics'],['Approved',stats.approvedApplications,AssignmentIcon,'/admin/analytics'],['Rejected',stats.rejectedApplications,AssignmentIcon,'/admin/analytics']];
  return <Box sx={{py:2}}><Stack direction={{xs:'column',sm:'row'}} justifyContent="space-between" gap={1} sx={{mb:3}}><Box><Typography variant="h4" fontWeight={700} color="primary.main">Admin Dashboard</Typography><Typography color="text.secondary">Live summary from the application database.</Typography></Box><Button startIcon={<RefreshIcon/>} onClick={load}>Refresh</Button></Stack>
    {error&&<Alert severity="error" action={<Button color="inherit" onClick={load}>Retry</Button>} sx={{mb:2}}>{error}</Alert>}
    {loading?<Box sx={{py:8,textAlign:'center'}}><CircularProgress/></Box>:<><Grid container spacing={2} sx={{mb:3}}>{cards.map(([label,value,Icon,path])=><Grid item xs={6} md={3} key={label}><Card variant="outlined"><CardActionArea onClick={()=>navigate(path)}><CardContent><Icon color="primary"/><Typography variant="h4" fontWeight={700}>{value ?? '—'}</Typography><Typography color="text.secondary">{label}</Typography></CardContent></CardActionArea></Card></Grid>)}</Grid>
      <Grid container spacing={2}><Grid item xs={12} md={6}><Paper sx={{p:2,height:'100%'}}><Typography variant="h6" fontWeight={700} sx={{mb:1}}>Recent registrations</Typography>{data?.recentUsers?.length?data.recentUsers.map(u=><Box key={u.id} sx={{py:1,borderBottom:'1px solid',borderColor:'divider'}}><Typography fontWeight={600}>{u.name}</Typography><Typography variant="body2" color="text.secondary">{u.email} · {u.role} · {new Date(u.created_at).toLocaleDateString()}</Typography></Box>):<Typography color="text.secondary">No recent registrations.</Typography>}</Paper></Grid><Grid item xs={12} md={6}><Paper sx={{p:2,height:'100%'}}><Typography variant="h6" fontWeight={700} sx={{mb:1}}>Recent system activity</Typography>{data?.recentActivities?.length?data.recentActivities.map(a=><Box key={a.id} sx={{py:1,borderBottom:'1px solid',borderColor:'divider'}}><Typography fontWeight={600}>{a.action}</Typography><Typography variant="body2" color="text.secondary">{a.username||'System'} · {new Date(a.timestamp).toLocaleString()}</Typography></Box>):<Typography color="text.secondary">No activity has been recorded yet.</Typography>}</Paper></Grid></Grid>
      <Typography variant="h6" fontWeight={700} sx={{mt:3,mb:1}}>Quick actions</Typography><Grid container spacing={1}>{[['Manage Users','/admin/users',PeopleIcon],['Manage Officers','/admin/officers',SecurityIcon],['Manage Schemes','/admin/schemes',PolicyIcon],['View Analytics','/admin/analytics',AnalyticsIcon],['Audit Logs','/admin/audit-logs',ReceiptLongIcon]].map(([label,path,Icon])=><Grid item xs={6} sm={4} md key={path}><Button fullWidth variant="outlined" startIcon={<Icon/>} onClick={()=>navigate(path)}>{label}</Button></Grid>)}</Grid>
    </>}</Box>;
}
