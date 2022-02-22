const backendUrl = 'http://10.10.10.153:3005';
export const frontendUrl = 'http://localhost:3000';
// const backendUrl = 'http://104.236.108.208:443';
// export const frontendUrl = 'http://104.236.108.208';
export default backendUrl;

export const max_img_size = 4*1024*1024;
export const max_video_size = 20*1024*1024;


export const blacklistWords = [
  'discord invite',
  'telegram invites', 
  'onlyfans', 
  'websites', 
];

export const flairKind = [
  {
    id: 0, 
    name: 'None', 
    role: 3, 
    background: '', 
  }, 
  {
    id: 1, 
    name: 'Cultura', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 2, 
    name: 'Tineret', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 3, 
    name: 'Bun-gust', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 4, 
    name: 'Jmekerie', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 5, 
    name: 'Gaozari', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 6, 
    name: 'Cioari d-ale noastre', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 7, 
    name: 'Ciori d-ale lor', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 8, 
    name: 'Tehnologie', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 9, 
    name: 'Original Content', 
    role: 3, 
    backgroud: '', 
  }, 
  {
    id: 10, 
    name: 'WAGTHRO AMA', 
    role: 2, 
    backgroud: '#d4582b', 
  }, 
  {
    id: 11, 
    name: 'WAGTHRO Originals', 
    role: 2, 
    backgroud: '#b90422', 
  }, 
  {
    id: 12, 
    name: 'Traistarantino Productions', 
    role: 2, 
    backgroud: '#005ba1', 
  }, 
];

export const awardKind = [
  {
    id: 0, 
    imgName: '', 
    awardName: 'None'
  }, 
  {
    id: 1, 
    imgName: '/emoji/1.png', 
    awardName: 'Award 1'
  }, 
  {
    id: 2, 
    imgName: '/emoji/2.png', 
    awardName: 'Award 2'
  }, 
  {
    id: 3, 
    imgName: '/emoji/3.png', 
    awardName: 'Award 3'
  }, 
  {
    id: 4, 
    imgName: '/emoji/4.jpg', 
    awardName: 'Award 4'
  }, 
  {
    id: 5, 
    imgName: '/emoji/5.png', 
    awardName: 'Award 5'
  }, 
  {
    id: 6, 
    imgName: '/emoji/6.png', 
    awardName: 'Award 6'
  }, 
  {
    id: 7, 
    imgName: '/emoji/7.png', 
    awardName: 'Award 7'
  }, 
  {
    id: 8, 
    imgName: '/emoji/8.png', 
    awardName: 'Award 8'
  }, 
  {
    id: 9, 
    imgName: '/emoji/9.png', 
    awardName: 'Award 1'
  }, 
  {
    id: 10, 
    imgName: '/emoji/10.png', 
    awardName: 'Award 2'
  }, 
  {
    id: 11, 
    imgName: '/emoji/11.png', 
    awardName: 'Award 3'
  }, 
  {
    id: 12, 
    imgName: '/emoji/12.png', 
    awardName: 'Award 4'
  }, 
  {
    id: 13, 
    imgName: '/emoji/13.png', 
    awardName: 'Award 5'
  }, 
  {
    id: 14, 
    imgName: '/emoji/14.png', 
    awardName: 'Award 6'
  }, 
  {
    id: 15, 
    imgName: '/emoji/15.png', 
    awardName: 'Award 7'
  }, 
  {
    id: 16, 
    imgName: '/emoji/16.png', 
    awardName: 'Award 8'
  }, 
  {
    id: 17, 
    imgName: '/emoji/17.png', 
    awardName: 'Award 1'
  }, 
  {
    id: 18, 
    imgName: '/emoji/18.png', 
    awardName: 'Award 2'
  }, 
  {
    id: 19, 
    imgName: '/emoji/19.png', 
    awardName: 'Award 3'
  }, 
  {
    id: 20, 
    imgName: '/emoji/20.png', 
    awardName: 'Award 4'
  }, 
  {
    id: 21, 
    imgName: '/emoji/21.png', 
    awardName: 'Award 5'
  }, 
  {
    id: 22, 
    imgName: '/emoji/22.png', 
    awardName: 'Award 6'
  }, 
  {
    id: 23, 
    imgName: '/emoji/23.png', 
    awardName: 'Award 7'
  }
];

export let cntAwards = [
  {
    id: 0, 
    awardImg: 'None', 
    awardCnt: 0
  }, 
  {
    id: 1, 
    awardImg: '/emoji/1.png', 
    awardCnt: 0
  }, 
  {
    id: 2, 
    awardImg: '/emoji/2.png', 
    awardCnt: 0
  }, 
  {
    id: 3, 
    awardImg: '/emoji/3.png', 
    awardCnt: 0
  }, 
  {
    id: 4, 
    awardImg: '/emoji/4.png', 
    awardCnt: 0
  }, 
  {
    id: 5, 
    awardImg: '/emoji/5.png', 
    awardCnt: 0
  }, 
  {
    id: 6, 
    awardImg: '/emoji/6.png', 
    awardCnt: 0
  }, 
  {
    id: 7, 
    awardImg: '/emoji/7.png', 
    awardCnt: 0
  }, 
  {
    id: 8, 
    awardImg: '/emoji/8.png', 
    awardCnt: 0
  }, 
  {
    id: 9, 
    awardImg: '/emoji/9.png', 
    awardCnt: 0
  }, 
  {
    id: 10, 
    awardImg: '/emoji/10.png', 
    awardCnt: 0
  }, 
  {
    id: 11, 
    awardImg: '/emoji/11.png', 
    awardCnt: 0
  }, 
  {
    id: 12, 
    awardImg: '/emoji/12.png', 
    awardCnt: 0
  }, 
  {
    id: 13, 
    awardImg: '/emoji/13.png', 
    awardCnt: 0
  }, 
  {
    id: 14, 
    awardImg: '/emoji/14.png', 
    awardCnt: 0
  }, 
  {
    id: 15, 
    awardImg: '/emoji/15.png', 
    awardCnt: 0
  }, 
  {
    id: 16, 
    awardImg: '/emoji/16.png', 
    awardCnt: 0
  }, {
    id: 17, 
    awardImg: '/emoji/17.png', 
    awardCnt: 0
  }, 
  {
    id: 18, 
    awardImg: '/emoji/18.png', 
    awardCnt: 0
  }, 
  {
    id: 19, 
    awardImg: '/emoji/19.png', 
    awardCnt: 0
  }, 
  {
    id: 20, 
    awardImg: '/emoji/20.png', 
    awardCnt: 0
  }, 
  {
    id: 21, 
    awardImg: '/emoji/21.png', 
    awardCnt: 0
  }, 
  {
    id: 22, 
    awardImg: '/emoji/22.png', 
    awardCnt: 0
  }, 
  {
    id: 23, 
    awardImg: '/emoji/23.png', 
    awardCnt: 0
  }
];