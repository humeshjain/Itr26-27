
const band = {
    bandName : "led Zepplin",
    famousSong : "Stairway to heaven",
    year : 1993,
    othersong: "abcdef",
};

 let{bandName ,famousSong ,...restprops}= band;

 console.log(bandName,famousSong,restprops);