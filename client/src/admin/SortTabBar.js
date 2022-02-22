import React from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as ManageUser } from '../svg/manage-user.svg';
import { ReactComponent as ManagePost } from '../svg/manage-post.svg';
import CommentIcon from '@material-ui/icons/Comment';

import { 
  Paper, 
  Tabs, 
  Tab, 
  SvgIcon, 
  MenuItem, 
  Grid, 
  Typography, 
  FormControl, 
  Select, 
  useMediaQuery, 
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useSortTabStyles } from '../styles/muiStyles';

const SortTabBar = ({ sortBy, handleTabChange, handleSelectChange, subscribedTab, userdata, filterFlair }) => {
  const classes = useSortTabStyles();
  const { user } = useSelector((state) => state);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  console.log(sortBy);

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
                  <ManageUser />
                </SvgIcon>
              }
              label="User-Manage"
              value="User-Manage"
            />
            <Tab
              icon={
                <SvgIcon fontSize="small">
                  <ManagePost />
                </SvgIcon>
              }
              label="Post-Manage"
              value="Post-Manage"
            />
          </Tabs>
        </Grid>
        {sortBy === 'Post-Manage' && (
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
                <MenuItem value={10}>WAGTHRO AMA</MenuItem>
                <MenuItem value={11}>WAGTHRO Originals</MenuItem>                      
                <MenuItem value={12}>Traistarantino Productions</MenuItem>
              </Select>
            </FormControl>
          </Grid>        
        )}
        </Grid>
    </Paper>
  );
};

export default SortTabBar;
