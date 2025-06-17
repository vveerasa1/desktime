import React from 'react';
import { Grid, Box } from '@mui/material';
import styles from './index.module.css';
import AnalyticCards from '../../components/AnalyticCards'
import ProductivityBar from '../../components/ProductivityBar'
import AppCategoryPanel from '../../components/AppsCategories'
import ScreenshotGrid from '../../components/ScreenshotGrid'
import CategoryBar from '../../components/CategoryBar'
import DeskTimeHeader from '../../components/DeskTimeHeader'

const productiveApps = [
  { name: 'localhost', time: '1h 31m' },
  { name: 'Code', time: '1h 5m' },
  { name: 'Slack', time: '12m' },
  { name: 'Zoom', time: '12m' },
  { name: 'Windows Explorer', time: '10m' },
  { name: 'gemini.google.com', time: '9m' },
  { name: 'desktime.com', time: '9m' },
  { name: 'Google Chrome', time: '2m' },
  { name: 'SnippingTool', time: '2m' },
  { name: 'ShellExperienceHost', time: '2m' },
  { name: 'Settings', time: '52s' },
  { name: 'godaddy.com', time: '44s' },
  { name: 'accounts.google.com', time: '22s' },
  { name: 'mail.zoho.com', time: '18s' },
  { name: 'pentabay.com', time: '11s' },
  { name: 'npmjs.com', time: '10s' },
  { name: 'codepen.io', time: '8s' },
  { name: 'github.com', time: '5s' },
  { name: 'one.google.com', time: '4s' },
  { name: 'PickerHost', time: '2s' },
];

const Dashboard = () => {
  return (
    <Box className={styles.container}>
      <DeskTimeHeader/>
      <AnalyticCards />
      {/* <Grid container spacing={2}> */}
      <ProductivityBar data={{ productive: 60, neutral: 25, unproductive: 15 }} />
      <AppCategoryPanel
        title="Productive apps"
        totalTime="3h 41m"
        apps={productiveApps}
        headerColor="#4caf50" // green
      />
      <AppCategoryPanel
        title="Unproductive apps"
        totalTime="3h 41m"
        apps={productiveApps}
        headerColor="#f63" // green
      />
      <AppCategoryPanel
        title="Neutral apps"
        totalTime="3h 41m"
        apps={productiveApps}
        headerColor="gray" // green
      />
      {/* <Grid item xs={12}><ProductivityBar /></Grid>  */}
      {/* </Grid> */}
      <CategoryBar
        categories={[
          { name: 'Creative & Design', color: '#93278f' },
          { name: 'Training & Research', color: '#fcee21' },
          { name: 'E-mail', color: '#2e3192' },
          { name: 'Social Media', color: '#ed1e79' },
          { name: 'Office apps', color: '#00aeef' },
          { name: 'Entertainment', color: '#f7931e' },
          { name: 'News', color: '#662d91' },
          { name: 'Undefined', color: '#a6b1c2' },
        ]}
        barSegments={[
          { color: '#00aeef', percentage: 50 },
          { color: '#a6b1c2', percentage: 50 },
        ]}
      />
      <ScreenshotGrid
        screenshots={[
          {
            title: 'localhost',
            percentage: '64.66%',
            time: '16:31',
            imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.1cKHjV4shUO09LB9PZABSwHaEz&pid=Api&P=0&h=220',
            iconUrl: 'https://static.vecteezy.com/system/resources/previews/021/495/996/original/chatgpt-openai-logo-icon-free-png.png',
          },
          {
            title: 'chatgpt.com',
            percentage: '64.41%',
            time: '16:26',
            imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.1cKHjV4shUO09LB9PZABSwHaEz&pid=Api&P=0&h=220',
            iconUrl: 'https://static.vecteezy.com/system/resources/previews/021/495/996/original/chatgpt-openai-logo-icon-free-png.png',
          },
          // Add more...
        ]}
      />
    </Box>
  );
};

export default Dashboard;
