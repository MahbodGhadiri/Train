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
