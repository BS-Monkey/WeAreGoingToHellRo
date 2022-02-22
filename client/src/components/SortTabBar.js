import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as Best } from '../svg/best.svg';
import { ReactComponent as Hot } from '../svg/hot.svg';
import { ReactComponent as New } from '../svg/new.svg';
import { ReactComponent as Top } from '../svg/top.svg';
import { ReactComponent as Controversial } from '../svg/controversial.svg';
import { ReactComponent as Old } from '../svg/old.svg';
import { ReactComponent as Manager } from '../svg/manager.svg'
import { ReactComponent as Subscribed } from '../svg/subscribed.svg';

import { 
  Paper, 
  Tabs, 
  Tab, 
  SvgIcon, 
  FormControl, 
  Select, 
  MenuItem, 
  FormHelperText,
  Grid,
  Typography, 
  useMediaQuery, 
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useSortTabStyles } from '../styles/muiStyles';

const SortTabBar = ({ sortBy, handleTabChange, handleSelectChange, subscribedTab, userdata, filterFlair }) => {
  const classes = useSortTabStyles();
  const { user } = useSelector((state) => state);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Paper variant="outlined" className={classes.mainPaper}>
      <Grid container>
        <Grid item md={9} xs={12}>
          <Tabs
            value={sortBy}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={
                <SvgIcon fontSize="small">
                  <Hot />
                </SvgIcon>
              }
              label="Hot"
              value="hot"
            />
            <Tab
              icon={
                <SvgIcon fontSize="small">
                  <Best />
                </SvgIcon>
              }
              label="Best"
              value="best"
            />
            <Tab
              icon={
                <SvgIcon fontSize="small">
                  <New />
                </SvgIcon>
              }
              label="New"
              value="new"
            />
            <Tab
              icon={
                <SvgIcon fontSize="small">
                  <Top />
                </SvgIcon>
              }
              label="Top"
              value="top"
            />
            <Tab
              icon={
                <SvgIcon fontSize="small">
                  <Controversial />
                </SvgIcon>
              }
              label="Controversial"
              value="controversial"
            />
            <Tab
              icon={
                <SvgIcon fontSize="small">
                  <Old />
                </SvgIcon>
              }
              label="Old"
              value="old"
            />
          </Tabs>
        </Grid>
        <Grid item md={3} xs={12}>
          {!isMobile && (
            <Typography variant="h6">
              Filter By Flair
            </Typography>
          )}          
          <FormControl className={classes.formControl} style={{width: '90%', marginLeft: '1em'}}>
            <Select
              value={filterFlair}
              onChange={handleSelectChange}
              displayEmpty
              className={classes.selectEmpty}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>Cultura</MenuItem>
              <MenuItem value={2}>Tineret</MenuItem>
              <MenuItem value={3}>Bun-gust</MenuItem>
              <MenuItem value={4}>Jmekerie</MenuItem>
              <MenuItem value={5}>Gaozari</MenuItem>
              <MenuItem value={6}>Cioari d-ale noastre</MenuItem>
              <MenuItem value={7}>Ciori d-ale lor</MenuItem>
              <MenuItem value={8}>Tehnologie</MenuItem>
              <MenuItem value={9}>Original Content</MenuItem>
              <MenuItem value={10} style={{color: '#b90422'}}>WAGTHRO AMA</MenuItem>
              <MenuItem value={11} style={{color: '#d4582b'}}>WAGTHRO Originals</MenuItem>                      
              <MenuItem value={12} style={{color: '#005ba1'}}>Traistarantino Productions</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SortTabBar;
