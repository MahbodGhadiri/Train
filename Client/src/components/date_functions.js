const moment = require("moment-jalaali") 

export function dateToJalali(date){
    const m= moment(date,"YYYY/M/D").format("jYYYY/jM/jD")
    return m
}

export function find_diff(date1,date2){
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if(date1<date2)
    {
      [date1,date2]=[date2,date1]
    }    
    return Math.floor((date1-date2)/(24*60*60*1000))
}
