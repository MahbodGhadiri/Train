const momentj = require("moment-jalaali");
const moment = require("moment")
export function dateToJalali(date){
    const m= momentj(date,"YYYY/M/D").format("jYYYY/jM/jD")
    return m
}

export function find_diff(finishDate){
  finishDate = new Date(finishDate).getTime()
  const now = new Date(moment()).getTime()
  return Math.floor((finishDate-now)/(24*60*60*1000))
}

export function findLastActivity(lastActivity){
  if(lastActivity){
    lastActivity= new Date(lastActivity).getTime();
    const now= new Date(moment()).getTime()
    const secondsAgo= Math.floor((now-lastActivity)/1000)
    if (secondsAgo<60){
      return ["ثانیه",secondsAgo];
    }
    else if(secondsAgo<(60*60)){
      return ["دقیقه",Math.round(secondsAgo/60)];
    }
    else if(secondsAgo<(60*60*24)){
      return ["ساعت",Math.round((secondsAgo/(60*60)))];
    }
    else if(secondsAgo<(60*60*24*30)){
      return ["روز",Math.round((secondsAgo)/(60*60*24))];
    }
    else{
      return ["روز","خیلی"];
    }
  }
  else{
    return undefined
  }
}